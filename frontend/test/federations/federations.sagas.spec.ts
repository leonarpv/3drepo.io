/**
 *  Copyright (C) 2021 3D Repo Ltd
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

import * as FederationsSaga from '@/v5/store/federations/federations.sagas';
import { expectSaga } from 'redux-saga-test-plan';
import { FederationsActions } from '@/v5/store/federations/federations.redux';
import { mockServer } from '../../internals/testing/mockServer';
import { pick, times } from 'lodash';
import { federationMockFactory } from './federations.fixtures';
import { prepareFederationsData } from '@/v5/store/federations/federations.helpers';
import { 
	FetchFederationStatsResponse, 
	IFederation, 
	FederationSettingsPayload, 
	EMPTY_VIEW 
} from '@/v5/store/federations/federations.types';

// TODO: review this
// There is something weird as how the tests are setup
// the ALWAYS timeout, with a lower value these run faster
// but if the value is too low it wont actually finish the saga so it will fail
expectSaga.DEFAULT_TIMEOUT = 100;

describe('Federations: sagas', () => {
	const teamspace = 'teamspace';
	const projectId = 'projectId';
	const federationId = 'federationId';

	describe('addFavourite', () => {
		it('should call addFavourite endpoint', async () => {
			mockServer
			.patch(`/teamspaces/${teamspace}/projects/${projectId}/federations/favourites`)
			.reply(200)

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.addFavourite(teamspace, projectId, federationId))
			.put(FederationsActions.setFavouriteSuccess(projectId, federationId, true))
			.silentRun();
		})
	})

	describe('removeFavourite', () => {
		it('should call removeFavourite endpoint', async () => {
			mockServer
			.delete(`/teamspaces/${teamspace}/projects/${projectId}/federations/favourites`)
			.reply(200)

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.removeFavourite(teamspace, projectId, federationId))
			.put(FederationsActions.setFavouriteSuccess(projectId, federationId, false))
			.silentRun();
		})
	})

	describe('fetchFederations', () => {
		const mockFederations = times(2, () => federationMockFactory());
		const mockFederationsBaseResponse = mockFederations.map((federation) => pick(federation, ['_id', 'name', 'role', 'isFavourite', 'subModels']));
		const mockFederationsWithoutStats = prepareFederationsData(mockFederations);

		// it('should fetch federations data', async () => {
		// 	mockServer
		// 	.get(`/teamspaces/${teamspace}/projects/${projectId}/federations`)
		// 	.reply(200, {
		// 		federations: mockFederationsBaseResponse
		// 	});

		// 	await expectSaga(FederationsSaga.default)
		// 	.dispatch(FederationsActions.fetchFederations(teamspace, projectId))
		// 	.put(FederationsActions.setIsListPending(true))
		// 	.put(FederationsActions.fetchFederationsSuccess(projectId, mockFederationsWithoutStats))
		// 	.put(FederationsActions.setIsListPending(false))
		// 	.silentRun();
		// })

		it('should fetch stats', async () => {
			const prepareMockStatsReply = (federation: IFederation): FetchFederationStatsResponse => ({
				subModels: federation.subModels,
				tickets: {
					issues: federation.issues,
					risks: federation.risks,
				},
				lastUpdated: federation.lastUpdated.valueOf(),
				category: federation.category,
				status: federation.status,
				code: federation.code,
			})

			mockFederations.forEach((federation) => {
				mockServer
				.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${federation._id}/stats`)
				.reply(200, prepareMockStatsReply(federation));
			})

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.fetchFederationStats(teamspace, projectId, mockFederations[0]._id))
			.dispatch(FederationsActions.fetchFederationStats(teamspace, projectId, mockFederations[1]._id))
			.put(FederationsActions.fetchFederationStatsSuccess(projectId, mockFederations[0]._id, prepareMockStatsReply(mockFederations[0])))
			.put(FederationsActions.fetchFederationStatsSuccess(projectId, mockFederations[1]._id, prepareMockStatsReply(mockFederations[1])))
			.silentRun();
		})

		it('should call federations endpoint with 404', async () => {
			mockServer
			.get(`/teamspaces/${teamspace}/projects/${projectId}/federations`)
			.reply(404);

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.fetchFederations(teamspace, projectId))
			.put(FederationsActions.setIsListPending(true))
			.silentRun();
		})
	})
	
	describe('fetchFederationViews', () => {
		const mockFederations = federationMockFactory();
		const mockFederationsBaseResponse = { views: mockFederations.views };

		it('should call fetchFederationViews endpoint', async () => {
			mockServer
			.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/views`)
			.reply(200, mockFederationsBaseResponse);

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.fetchFederationViews(teamspace, projectId, federationId))
			.put(FederationsActions.fetchFederationViewsSuccess(projectId, federationId, mockFederationsBaseResponse))
			.silentRun();
		})
	})
	
	// describe('fetchFederationSettings', () => {
	// 	const mockFederations = federationMockFactory();
	// 	const mockFederationsBaseResponse = mockFederations.settings;
	// 	it('should call fetchFederationSettings endpoint', async () => {
	// 		mockServer
	// 		.get(`/teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}`)
	// 		.reply(200, mockFederationsBaseResponse);

	// 		await expectSaga(FederationsSaga.default)
	// 		.dispatch(FederationsActions.fetchFederationSettings(teamspace, projectId, federationId))
	// 		.put(FederationsActions.fetchFederationSettingsSuccess(projectId, federationId))
	// 		.silentRun();
	// 	})
	// })

	describe('updateFederationSettings', () => {
		const newSettings = { 
			name: 'new name',
			description: 'new description',
			code: 'new code',
			angleFromNorth: 90,
			defaultView: EMPTY_VIEW,
			surveyPoint: {
				latLong: [0, 0],
				position: [0, 0, 0],
			},
			unit: "mm",
		}

		// Successful call
		// it('should call updateFederationSettings endpoint', async () => {
		// 	mockServer
		// 	.patch(`/teamspaces/${teamspace}/projects/${projectId}/federations`, newSettings)
		// 	.reply(200, {});
		// 	const federation = { ...newSettings }

		// 	await expectSaga(FederationsSaga.default)
		// 	.dispatch(FederationsActions.updateFederationSettings(
		// 		teamspace, 
		// 		projectId, 
		// 		federationId, 
		// 		newSettings as FederationSettingsPayload
		// 	))
		// 	.silentRun();
		// })
		
		// // Unsuccessful call
		// it('should call updateFederationSettings endpoint with 400', async () => {
		// 	mockServer
		// 	.post(`/teamspaces/${teamspace}/projects/${projectId}/federations`)
		// 	.reply(400);

		// 	await expectSaga(FederationsSaga.default)
		// 	.dispatch(FederationsActions.updateFederationSettings(
		// 		teamspace, 
		// 		projectId, 
		// 		federationId, 
		// 		newSettings as FederationSettingsPayload
		// 	))
		// 	.silentRun();
		// })
	})
	
	describe('deleteFederation', () => {
		it('should call deleteFederation endpoint', async () => {
			mockServer
			.delete(`/teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}`)
			.reply(200);

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.deleteFederation(teamspace, projectId, federationId))
			.put(FederationsActions.deleteFederationSuccess(projectId, federationId))
			.silentRun();
		})

		it('should call deleteFederation endpoint with 404 and open alert modal', async () => {
			mockServer
			.delete(`/teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}`)
			.reply(404);

			await expectSaga(FederationsSaga.default)
			.dispatch(FederationsActions.deleteFederation(teamspace, projectId, federationId))
			.silentRun();
		})
	})
})
