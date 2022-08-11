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

import { put, takeLatest } from 'redux-saga/effects';

import * as API from '@/v5/services/api';
import { DialogsActions } from '@/v5/store/dialogs/dialogs.redux';
import { formatMessage } from '@/v5/services/intl';
import { TeamspacesActions, TeamspacesTypes, ITeamspace } from './teamspaces.redux';

export function* fetch() {
	try {
		const { data: { teamspaces } } = yield API.Teamspaces.fetchTeamspaces();
		yield put(TeamspacesActions.fetchSuccess(teamspaces as ITeamspace[]));
	} catch (error) {
		yield put(DialogsActions.open('alert', {
			currentActions: formatMessage({
				id: 'teamspaces.fetch.error.action',
				defaultMessage: 'loading your Teamspaces',
			}),
			error,
			details: formatMessage({
				id: 'teamspaces.fetch.error.details',
				defaultMessage: 'If reloading the page doesn\'t work please contact support',
			}),
		}));
	}
}

export function* fetchQuota({ teamspace }) {
	try {
		const { data: { quota } } = yield API.Teamspaces.fetchTeamspaces();
		yield put(TeamspacesActions.fetchQuotaSuccess(teamspace, quota));
	} catch (error) {
		yield put(DialogsActions.open('alert', {
			currentActions: formatMessage({
				id: 'teamspaces.fetch.error.action',
				defaultMessage: 'fetching the quoata',
			}),
			error,
			details: formatMessage({
				id: 'teamspaces.fetch.error.details',
				defaultMessage: 'If reloading the page doesn\'t work please contact support',
			}),
		}));
	}
}

export default function* TeamspacesSaga() {
	yield takeLatest(TeamspacesTypes.FETCH as any, fetch);
	yield takeLatest(TeamspacesTypes.FETCH_QUOTA as any, fetchQuota);
}
