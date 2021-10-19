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

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { TeamspacesActions } from '@/v5/store/teamspaces/teamspaces.redux';
import * as TeamspacesSaga from '@/v5/store/teamspaces/teamspaces.sagas';

describe('Teamspaces: sagas', () => {
	describe('fetch', () => {
		it('should fetch teamspaces data and dispatch FETCH_SUCCESS', () => {
			jest.mock('@/v5/services/api', () => ({
				fetchTeamspaces: () => Promise.resolve([]),
			}));

			expectSaga(TeamspacesSaga.default)
				.dispatch(TeamspacesActions.fetch())
				.put(TeamspacesActions.fetchSuccess([]))
				.silentRun();
		});

		it('should handle teamspaces api error and dispatch FETCH_FAILURE', () => {
			jest.mock('@/v5/services/api', () => ({
				fetchProjects: () => throwError(new Error('error')),
			}));

			expectSaga(TeamspacesSaga.default)
				.dispatch(TeamspacesActions.fetch())
				.put(TeamspacesActions.fetchFailure())
				.silentRun();
		});
	});
});