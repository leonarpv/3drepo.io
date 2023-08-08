/**
 *  Copyright (C) 2023 3D Repo Ltd
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

import { MultiSelectMenuItem } from '@controls/inputs/multiSelect/multiSelectMenuItem/multiSelectMenuItem.component';
import { FormattedMessage } from 'react-intl';
import { formatMessage } from '@/v5/services/intl';
import { ContainersHooksSelectors, FederationsHooksSelectors } from '@/v5/services/selectorsHooks';
import { FormSearchSelect } from '@controls/inputs/formInputs.component';
import _ from 'lodash';
import { ListSubheader } from '../tickets.styles';

export const ContainersAndFederationsFormSelect = (props) => {
	const containers = ContainersHooksSelectors.selectContainers();
	const federations = FederationsHooksSelectors.selectFederations();

	const getRenderText = (ids: any[] | null = []) => {
		const itemsLength = ids.length;
		if (itemsLength === 1) {
			const [id] = ids;
			return (containers.find(({ _id }) => _id === id) || federations.find(({ _id }) => _id === id)).name;
		}

		return formatMessage({
			id: 'ticketTable.modelSelection.selected',
			defaultMessage: '{itemsLength} selected',
		}, { itemsLength });
	};

	const sortByName = (models) => _.sortBy(models, ({ name }) => name.toLowerCase());

	return (
		<FormSearchSelect
			multiple
			{...props}
			label={formatMessage({ id: 'ticketTable.modelSelection.placeholder', defaultMessage: 'Select Federation / Container' })}
			renderValue={(ids: any[] | null = []) => (<b>{getRenderText(ids)}</b>)}
		>
			<ListSubheader>
				<FormattedMessage id="ticketTable.modelSelection.federations" defaultMessage="Federations" />
			</ListSubheader>
			{...sortByName(federations).map(({ name, _id }) => (
				<MultiSelectMenuItem key={_id} value={_id}>{name}</MultiSelectMenuItem>
			))}
			<ListSubheader>
				<FormattedMessage id="ticketTable.modelSelection.containers" defaultMessage="Containers" />
			</ListSubheader>
			{...sortByName(containers).map(({ name, _id }) => (
				<MultiSelectMenuItem key={_id} value={_id}>{name}</MultiSelectMenuItem>
			))}
		</FormSearchSelect>
	);
};
