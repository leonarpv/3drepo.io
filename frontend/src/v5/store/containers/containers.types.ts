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

import { AllReturnTypes, ExtendedAction } from '@/v5/store/store.types';

export interface IContainersState {
	containers: Record<string, IContainer[]>;
	filterQuery: string;
	isListPending: boolean;
	areStatsPending: boolean;
}

export enum ContainerStatuses {
	OK = 'ok',
	FAILED = 'failed',
	UPLOADING = 'uploading',
	UPLOADED = 'uploaded',
	QUEUED = 'queued',
	PROCESSING = 'processing',
}

export interface IContainer {
	_id: string;
	name: string;
	latestRevision: string;
	revisionsCount: number;
	lastUpdated: Date;
	type: string;
	code: string;
	status: ContainerStatuses;
	isFavourite: boolean;
	role: string;
}

export type FavouritePayload = FetchContainersPayload & {
	containerId: IContainer['_id'];
};

export interface IContainersActionCreators {
	setFilterQuery: (query: string) => ExtendedAction<{ query: string }, 'setFilterQuery'>
	addFavourite: (teamspace: string, projectId: string, containerId: string) => ExtendedAction<FavouritePayload, 'addFavourite'>
	removeFavourite: (teamspace: string, projectId: string, containerId: string) => ExtendedAction<FavouritePayload, 'removeFavourite'>
	toggleFavouriteSuccess: (projectId: string, containerId: string) => ExtendedAction<{ projectId: string, containerId: string }, 'toggleFavouriteSuccess'>
	fetchContainers: (teamspace: string, projectId: string) => ExtendedAction<FetchContainersPayload, 'fetchContainers'>
	fetchContainersSuccess: (projectId: string, containers: IContainer[]) => ExtendedAction<{ projectId: string, containers: IContainer[] }, 'fetchContainersSuccess'>
	setIsListPending: (isPending: boolean) => ExtendedAction<{ isPending: boolean }, 'setIsListPending'>
	setAreStatsPending: (isPending: boolean) => ExtendedAction<{ isPending: boolean }, 'setAreStatsPending'>
}

export type IContainersActions = AllReturnTypes<IContainersActionCreators>;

export type FetchContainersPayload = {
	teamspace: string;
	projectId: string;
};

export type FetchContainersResponse = {
	containers: Array<Pick<IContainer, '_id' | 'name' | 'role' | 'isFavourite'>>
};

export type FetchContainerStatsPayload = FetchContainersPayload & {
	containerId: IContainer['_id'];
};

export type FetchContainerStatsResponse = {
	revisions: {
		total: number;
		lastUpdated: number;
		latestRevision: string;
	};
	type: IContainer['type'];
	status: IContainer['status'];
	units: string;
	code: IContainer['code']
};
