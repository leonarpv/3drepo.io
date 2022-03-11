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

import { createActions, createReducer } from 'reduxsauce';
import { Constants } from '@/v5/helpers/actions.helper';
import { prepareSingleContainerData } from '@/v5/store/containers/containers.helpers';
import {
	IContainersActionCreators,
	SetFavouriteSuccessAction,
	FetchContainersSuccessAction,
	FetchContainerStatsSuccessAction,
	CreateContainerSuccessAction,
	DeleteContainerSuccessAction,
	IContainer,
} from './containers.types';

export const { Types: ContainersTypes, Creators: ContainersActions } = createActions({
	addFavourite: ['teamspace', 'projectId', 'containerId'],
	removeFavourite: ['teamspace', 'projectId', 'containerId'],
	setFavouriteSuccess: ['projectId', 'containerId', 'isFavourite'],
	fetchContainers: ['teamspace', 'projectId'],
	fetchContainersSuccess: ['projectId', 'containers'],
	fetchContainerStats: ['teamspace', 'projectId', 'containerId'],
	fetchContainerStatsSuccess: ['projectId', 'containerId', 'containerStats'],
	createContainer: ['teamspace', 'projectId', 'newContainer'],
	createContainerSuccess: ['projectId', 'container'],
	deleteContainer: ['teamspace', 'projectId', 'containerId'],
	deleteContainerSuccess: ['projectId', 'containerId'],
}, { prefix: 'CONTAINERS/' }) as { Types: Constants<IContainersActionCreators>; Creators: IContainersActionCreators };

export interface IContainersState {
	containersByProject: Record<string, IContainer[]>;
}

export const INITIAL_STATE: IContainersState = {
	containersByProject: {},
};

export const setFavourite = (state = INITIAL_STATE, {
	projectId,
	containerId,
	isFavourite,
}: SetFavouriteSuccessAction):IContainersState => ({
	...state,
	containersByProject: {
		...state.containersByProject,
		[projectId]: state.containersByProject[projectId].map((container) => ({
			...container,
			isFavourite: container._id === containerId ? isFavourite : container.isFavourite,
		})),
	},
});

export const fetchContainersSuccess = (state = INITIAL_STATE, {
	projectId,
	containers,
}: FetchContainersSuccessAction): IContainersState => ({
	...state,
	containersByProject: {
		...state.containersByProject,
		[projectId]: containers,
	},
});

export const fetchStatsSuccess = (state = INITIAL_STATE, {
	projectId,
	containerId,
	containerStats,
}: FetchContainerStatsSuccessAction): IContainersState => ({
	...state,
	containersByProject: {
		...state.containersByProject,
		[projectId]: state.containersByProject[projectId].map((container) => {
			if (containerId !== container._id) return container;
			return prepareSingleContainerData(container, containerStats);
		}),
	},
});

export const createContainerSuccess = (state = INITIAL_STATE, {
	projectId,
	container,
}: CreateContainerSuccessAction): IContainersState => ({
	...state,
	containersByProject: {
		...state.containersByProject,
		[projectId]: [
			...state.containersByProject[projectId],
			{
				...container,
				revisionsCount: 0,
			},
		],
	},
});

export const deleteContainerSuccess = (state = INITIAL_STATE, {
	projectId,
	containerId,
}: DeleteContainerSuccessAction): IContainersState => ({
	...state,
	containersByProject: {
		...state.containersByProject,
		[projectId]: state.containersByProject[projectId].filter((container) => containerId !== container._id),
	},
});

export const reducer = createReducer<IContainersState>(INITIAL_STATE, {
	[ContainersTypes.FETCH_CONTAINERS_SUCCESS]: fetchContainersSuccess,
	[ContainersTypes.SET_FAVOURITE_SUCCESS]: setFavourite,
	[ContainersTypes.FETCH_CONTAINER_STATS_SUCCESS]: fetchStatsSuccess,
	[ContainersTypes.CREATE_CONTAINER_SUCCESS]: createContainerSuccess,
	[ContainersTypes.DELETE_CONTAINER_SUCCESS]: deleteContainerSuccess,
}) as (state: IContainersState, action:any) => IContainersState;
