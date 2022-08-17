/**
 *  Copyright (C) 2022 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const SuperTest = require('supertest');
const ServiceHelper = require('../../../../helper/services');
const { src } = require('../../../../helper/path');
const { generateRandomString } = require('../../../../helper/services');
const { authenticateRedirectUri, signupRedirectUri } = require('../../../../../../src/v5/services/sso/aad/aad.constants');

jest.mock('../../../../../../src/v5/services/sso/aad', () => ({
	...jest.requireActual('../../../../../../src/v5/services/sso/aad'),
	getUserDetails: jest.fn(),
}));
const Aad = require('../../../../../../src/v5/services/sso/aad');
const { providers, errorCodes } = require('../../../../../../src/v5/services/sso/sso.constants');
const { getUserByUsername } = require('../../../../../../src/v5/models/users');

const { templates } = require(`${src}/utils/responseCodes`);

let server;
let agent;

const userEmail = `${generateRandomString()}@email.com`;
const testUser = ServiceHelper.generateUserCredentials();
const userEmailSso = `${generateRandomString()}@email.com`;
const testUserSso = ServiceHelper.generateUserCredentials();
const newUserEmail = `${generateRandomString()}@email.com`;

const setupData = async () => {
	await ServiceHelper.db.createUser(testUser, [], { email: userEmail });
	await ServiceHelper.db.createUser(testUserSso, [], { email: userEmailSso,
		sso: { type: providers.AAD, id: generateRandomString() } });
};

const testAuthenticate = () => {
	describe('Authenticate', () => {
		test('should fail if redirectUri is not provided', async () => {
			await agent.get('/v5/sso/aad/authenticate').expect(templates.invalidArguments.status);
		});

		test('should redirect the user to Microsoft authentication page', async () => {
			const redirectUri = generateRandomString();
			const res = await agent.get(`/v5/sso/aad/authenticate?redirectUri=${redirectUri}`)
				.expect(302);
			const resUri = new URL(res.headers.location);
			expect(resUri.hostname).toEqual('login.microsoftonline.com');
			expect(resUri.pathname).toEqual('/common/oauth2/v2.0/authorize');
			expect(resUri.searchParams.get('redirect_uri')).toEqual(authenticateRedirectUri);
			expect(resUri.searchParams.has('client_id')).toEqual(true);
			expect(resUri.searchParams.has('code_challenge')).toEqual(true);
			expect(resUri.searchParams.get('code_challenge_method')).toEqual('S256');
			const state = JSON.parse(resUri.searchParams.get('state'));
			expect(state).toEqual({ redirectUri });
		});
	});
};

const testAuthenticatePost = () => {
	describe('Authenticate Post', () => {
		test('should redirect the user to the redirectUri provided', async () => {
			const state = { redirectUri: generateRandomString() };
			const res = await agent.get(`/v5/sso/aad/authenticate-post?state=${encodeURIComponent(JSON.stringify(state))}`)
				.expect(302);
			expect(res.headers.location).toEqual(state.redirectUri);
		});
	});
};

const signup = () => {
	describe('Sign Up', () => {
		const newUserData = {
			username: generateRandomString(),
			countryCode: 'GB',
			company: generateRandomString(),
			mailListAgreed: true,
		};

		test('should fail if redirectUri is not provided', async () => {
			const res = await agent.post('/v5/sso/aad/signup')
				.send(newUserData)
				.expect(templates.invalidArguments.status);
			expect(res.body.code).toEqual(templates.invalidArguments.code);
		});

		test('should fail if the username already exists', async () => {
			const res = await agent.post(`/v5/sso/aad/signup?redirectUri=${generateRandomString()}`)
				.send({ ...newUserData, username: testUser.user })
				.expect(templates.invalidArguments.status);
			expect(res.body.code).toEqual(templates.invalidArguments.code);
		});

		test('should fail if there are missing body params', async () => {
			const res = await agent.post(`/v5/sso/aad/signup?redirectUri=${generateRandomString()}`)
				.send({ ...newUserData, username: undefined })
				.expect(templates.invalidArguments.status);
			expect(res.body.code).toEqual(templates.invalidArguments.code);
		});

		test('should validate signup data and redirect the user to Microsoft authentication page', async () => {
			const redirectUri = generateRandomString();

			const res = await agent.post(`/v5/sso/aad/signup?redirectUri=${redirectUri}`)
				.send(newUserData)
				.expect(302);

			const resUri = new URL(res.headers.location);
			expect(resUri.hostname).toEqual('login.microsoftonline.com');
			expect(resUri.pathname).toEqual('/common/oauth2/v2.0/authorize');
			expect(resUri.searchParams.get('redirect_uri')).toEqual(signupRedirectUri);
			expect(resUri.searchParams.has('client_id')).toEqual(true);
			expect(resUri.searchParams.has('code_challenge')).toEqual(true);
			expect(resUri.searchParams.get('code_challenge_method')).toEqual('S256');
			const state = JSON.parse(resUri.searchParams.get('state'));
			expect(state).toEqual({ redirectUri, ...newUserData });
		});
	});
};

const signupPost = () => {
	describe('Sign Up Post', () => {
		const redirectUri = 'http://www.example.com';

		const newUserData = {
			redirectUri,
			username: generateRandomString(),
			countryCode: 'GB',
			company: generateRandomString(),
			mailListAgreed: true,
		};

		const newUserDataFromAad = {
			mail: newUserEmail,
			givenName: generateRandomString(),
			surname: generateRandomString(),
			id: generateRandomString(),
		};

		test('should redirect and add error to the query email already exists', async () => {
			const state = { ...newUserData };
			Aad.getUserDetails.mockResolvedValueOnce({ data: { ...newUserDataFromAad, mail: userEmail } });
			const res = await agent.get(`/v5/sso/aad/signup-post?state=${encodeURIComponent(JSON.stringify(state))}`)
				.expect(302);
			const resUri = new URL(res.headers.location);
			expect(resUri.origin).toEqual(redirectUri);
			expect(resUri.searchParams.get('error')).toEqual(errorCodes.emailExists.toString());
		});

		test('should redirect and add error to the query email already exists (SSO user)', async () => {
			const state = { ...newUserData };
			Aad.getUserDetails.mockResolvedValueOnce({ data: { ...newUserDataFromAad, mail: userEmailSso } });
			const res = await agent.get(`/v5/sso/aad/signup-post?state=${encodeURIComponent(JSON.stringify(state))}`)
				.expect(302);
			const resUri = new URL(res.headers.location);
			expect(resUri.origin).toEqual(redirectUri);
			expect(resUri.searchParams.get('error')).toEqual(errorCodes.emailExistsWithSSO.toString());
		});

		test('should fail if state is not provided', async () => {
			Aad.getUserDetails.mockResolvedValueOnce({ data: newUserDataFromAad });
			const res = await agent.get('/v5/sso/aad/signup-post')
				.expect(templates.unknown.status);
			expect(res.body.code).toEqual(templates.unknown.code);
		});

		test('should sign a new user up', async () => {
			const state = { ...newUserData };
			Aad.getUserDetails.mockResolvedValueOnce({ data: newUserDataFromAad });
			await agent.get(`/v5/sso/aad/signup-post?state=${encodeURIComponent(JSON.stringify(state))}`)
				.expect(302);

			// ensure user is created
			await getUserByUsername(newUserData.username, { _id: 1 });
		});
	});
};

const app = ServiceHelper.app();

describe('E2E routes/sso/aad', () => {
	beforeAll(async () => {
		server = app;
		agent = await SuperTest(server);
		await setupData();
	});

	afterAll(() => ServiceHelper.closeApp(server));

	testAuthenticate();
	testAuthenticatePost();
	signup();
	signupPost();
});