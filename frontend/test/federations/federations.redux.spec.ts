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

import { INITIAL_STATE, reducer as federationsReducer, FederationsActions } from '@/v5/store/federations/federations.redux';
import { times } from 'lodash';
import { federationMockFactory, prepareMockExtraSettingsReply, prepareMockSettingsReply } from './federations.fixtures';
import { EMPTY_VIEW, RawFederationSettings } from '@/v5/store/federations/federations.types';
import { prepareFederationSettingsForFrontend } from '@/v5/store/federations/federations.helpers';

describe('Federations: redux', () => {
	const projectId = 'projectId';
	const mockFederations = times(5, () => federationMockFactory({ isFavourite: false }));
	const defaultState = {
		...INITIAL_STATE,
		federations: {
			[projectId]: mockFederations
		}
	};

	it('should add federation to favourites', () => {
		const resultState = federationsReducer(
			defaultState,
			FederationsActions.setFavouriteSuccess(projectId, mockFederations[0]._id, true)
		);
		const result = resultState.federations[projectId];

		expect(result[0].isFavourite).toEqual(true);
		expect(result.slice(1).every(federation => federation.isFavourite)).toEqual(false);
	});

	it('should remove federation from favourites', () => {
		const mockAllFavouritesFederations = times(5, () => federationMockFactory({ isFavourite: true }))
		const defaultStateWithAllFavourites = {
			...INITIAL_STATE,
			federations: {
				[projectId]: mockAllFavouritesFederations
			}
		}
		const resultState = federationsReducer(
			defaultStateWithAllFavourites,
			FederationsActions.setFavouriteSuccess(projectId, mockAllFavouritesFederations[0]._id, false)
		);
		const result = resultState.federations[projectId];

		expect(result[0].isFavourite).toEqual(false);
		expect(result.slice(1).every(federation => federation.isFavourite)).toEqual(true);
	});

	it('should load fetched views', () => {
		const mockFederation = federationMockFactory({ views: [] });
		const defaultStateWithNoViews = {
			...INITIAL_STATE,
			federations: {
				[projectId]: [mockFederation]
			}
		}
		const resultState = federationsReducer(
			defaultStateWithNoViews,
			FederationsActions.fetchFederationViewsSuccess(projectId, mockFederation._id, [EMPTY_VIEW]),
		);
		const result = resultState.federations[projectId];

		expect(result[0].views).toEqual([EMPTY_VIEW]);
	});

	it('should load fetched settings', () => {
		const mockFederation = federationMockFactory({ settings: null });
		const defaultStateWithNoSettings = {
			...INITIAL_STATE,
			federations: {
				[projectId]: [mockFederation]
			}
		}
		const mockSettings = prepareMockSettingsReply(federationMockFactory());

		const resultState = federationsReducer(
			defaultStateWithNoSettings,
			FederationsActions.fetchFederationSettingsSuccess(projectId, mockFederation._id, mockSettings),
		);
		const result = resultState.federations[projectId];

		expect(result[0].settings).toEqual(mockSettings);
	});

	it('should update settings changed from form', () => {
		const mockFederation = federationMockFactory({ settings: null });
		const defaultStateWithNoSettings = {
			...INITIAL_STATE,
			federations: {
				[projectId]: [mockFederation]
			}
		}

		const mockFederationForReply = federationMockFactory();
		const mockSettings = prepareMockSettingsReply(mockFederationForReply);
		const mockExtraSettings = prepareMockExtraSettingsReply(mockFederationForReply);

		const resultState = federationsReducer(
			defaultStateWithNoSettings,
			FederationsActions.updateFederationSettingsSuccess(projectId, mockFederation._id, mockSettings, mockExtraSettings),
		);
		const result = resultState.federations[projectId];

		expect(result[0].settings).toEqual(mockSettings);
		expect(result[0].name).toEqual(mockFederationForReply.name);
		expect(result[0].description).toEqual(mockFederationForReply.description);
		expect(result[0].code).toEqual(mockFederationForReply.code);
	});
})
