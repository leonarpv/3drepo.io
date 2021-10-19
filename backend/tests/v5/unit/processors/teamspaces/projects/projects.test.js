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

const { src } = require('../../../../helper/path');

jest.mock('../../../../../../src/v5/models/projects');
const ProjectsModel = require(`${src}/models/projects`);
const Projects = require(`${src}/processors/teamspaces/projects/projects`);
const { PROJECT_ADMIN } = require(`${src}/utils/permissions/permissions.constants`);

const projectList = [
	{ _id: '1', name: 'project1', permissions: [{ user: 'projAdmin', permissions: [PROJECT_ADMIN] }], models: ['modelA'] },
	{ _id: '2', name: 'project2', permissions: [{ user: 'projAdmin', permissions: [PROJECT_ADMIN] }], models: ['modelB'] },
	{ _id: '3', name: 'project3', permissions: [{ user: 'mixedUser', permissions: [PROJECT_ADMIN] }], models: [] },
	{ _id: '4', name: 'project4', permissions: [], models: [] },
];

const modelReadPermissions = {
	modelA: ['modelUser', 'mixedUser'],
	modelB: ['mixedUser'],
};

ProjectsModel.getProjectList.mockImplementation(() => projectList);

// Permissions mock
jest.mock('../../../../../../src/v5/utils/permissions/permissions', () => ({
	...jest.requireActual('../../../../../../src/v5/utils/permissions/permissions'),
	isTeamspaceAdmin: jest.fn().mockImplementation((teamspace, user) => user === 'tsAdmin'),
	hasReadAccessToModel: jest.fn()
		.mockImplementation((teamspace, model, user) => (modelReadPermissions[model] || []).includes(user)),
}));

const determineProjectListResult = (username) => projectList.flatMap(({ permissions, _id, name, models }) => {
	const isAdmin = permissions.some((permEntry) => permEntry.user === username
		&& permEntry.permissions.includes(PROJECT_ADMIN));
	const hasModelAccess = models.some((model) => (modelReadPermissions[model] || []).includes(username));
	return isAdmin || hasModelAccess ? { _id, name, isAdmin } : [];
});

const testGetProjectList = () => {
	describe('Get project list by user', () => {
		test('should return the whole list if the user is a teamspace admin', async () => {
			const res = await Projects.getProjectList('teamspace', 'tsAdmin');
			const expectedRes = projectList.map(({ _id, name }) => ({ _id, name, isAdmin: true }));
			expect(res).toEqual(expectedRes);
		});
		test('should return a partial list if the user is a project admin in some projects', async () => {
			const res = await Projects.getProjectList('teamspace', 'projAdmin');
			expect(res).toEqual(determineProjectListResult('projAdmin'));
		});
		test('should return a partial list if the user has model access in some projects', async () => {
			const res = await Projects.getProjectList('teamspace', 'modelUser');
			expect(res).toEqual(determineProjectListResult('modelUser'));
		});
		test('should return a partial list if the user has model access in some projects and admin access in others', async () => {
			const res = await Projects.getProjectList('teamspace', 'mixedUser');
			expect(res).toEqual(determineProjectListResult('mixedUser'));
		});
		test('should return empty array if the user has no access', async () => {
			const res = await Projects.getProjectList('teamspace', 'nobody');
			expect(res).toEqual([]);
		});
	});
};

describe('processors/teamspaces/projects', () => {
	testGetProjectList();
});