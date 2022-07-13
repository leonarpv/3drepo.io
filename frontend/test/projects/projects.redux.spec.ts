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

import { INITIAL_STATE, projectsReducer, ProjectsActions, IProjectsState } from '@/v5/store/projects/projects.redux';
import faker from 'faker';

describe('Projects: redux', () => {
	const defaultState: IProjectsState = {
		...INITIAL_STATE,
	};
	const teamspaceName = 'teamspaceName';
	const projects = [{
		_id: '123',
		name: 'teamspace 1',
		isAdmin: true,
	}, {
		_id: '1234',
		name: 'teamspace 2',
		isAdmin: true,
	}, {
		_id: '1235',
		name: 'teamspace 3',
		isAdmin: false,
	}];

	describe('on fetchSuccess action', () => {
		it('should set teamspaces', () => {
			const resultState: IProjectsState = {
				...defaultState,
				projectsByTeamspace: {
					[teamspaceName]: projects,
				},
			};

			expect(projectsReducer(defaultState, ProjectsActions.fetchSuccess(teamspaceName, projects))).toEqual(resultState);
		});
	});
	describe('on deleteProjectSuccess action', () => {
		it('should remove deleted project from list', () => {
			const defaultStateWithProjects: IProjectsState = {
				...defaultState,
				projectsByTeamspace: {
					[teamspaceName]: projects,
				},
			};
			const idToDelete = faker.random.arrayElement(projects)._id;
			const resultState: IProjectsState = {
				...INITIAL_STATE,
				projectsByTeamspace: {
					[teamspaceName]: projects.filter((proj) => proj._id !== idToDelete),
				},
			};
			expect(
				projectsReducer(
					defaultStateWithProjects,
					ProjectsActions.deleteProjectSuccess(teamspaceName, idToDelete),
				),
			).toEqual(resultState);
		});
	});
});
