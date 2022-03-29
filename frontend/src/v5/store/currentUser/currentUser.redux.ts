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

import { Constants } from '@/v5/helpers/actions.helper';
import { Action } from 'redux';
import { createActions, createReducer } from 'reduxsauce';
import { ICurrentUser } from './currentUser.types';

export const { Types: CurrentUserTypes, Creators: CurrentUserActions } = createActions({
	fetchUser: [],
	getProfileSuccess: ['userData'],
}, { prefix: 'CURRENT_USER2/' }) as { Types: Constants<ICurrentUserActionCreators>; Creators: ICurrentUserActionCreators };

export const INITIAL_STATE: ICurrentUserState = {
	currentTeamspace: '',
	currentUser: { username: '' },
	isAvatarPending: true,
};

export const getProfileSuccess = (state = INITIAL_STATE, { userData }): ICurrentUserState => ({
	...state,
	currentTeamspace: userData.username,
	currentUser: userData,
	isAvatarPending: false,
});

export const currentUserReducer = createReducer(INITIAL_STATE, {
	[CurrentUserTypes.GET_PROFILE_SUCCESS]: getProfileSuccess,
});

/**
 * Types
*/

interface ICurrentUserState {
	currentTeamspace: string;
	currentUser: ICurrentUser; // TODO make this interface
	isAvatarPending: boolean;
}

export type GetProfileSuccessAction = Action<'GET_PROFILE_SUCCESS'> & { userData: any };

export interface ICurrentUserActionCreators {
	fetchUser: () => Action<'GET_PROFILE'>;
	getProfileSuccess: (userData: Object) => GetProfileSuccessAction;
}
