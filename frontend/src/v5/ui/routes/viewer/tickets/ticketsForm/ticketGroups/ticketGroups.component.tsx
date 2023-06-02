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

import { formatMessage } from '@/v5/services/intl';
import { Viewpoint, ViewpointState } from '@/v5/store/tickets/tickets.types';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { Container } from './ticketGroups.styles';
import { GroupsAccordion } from './groupsAccordion/groupsAccordion.component';
import { TicketGroupsContext } from './ticketGroupsContext';

interface TicketGroupsProps {
	value: Viewpoint;
	onChange?: (newvalue) => void;
	onBlur?: () => void;
}

export const TicketGroups = ({ value, onChange, onBlur }: TicketGroupsProps) => {
	const groups: Partial<ViewpointState> = value.state || {};

	const changeState = () => {
		if (value.state.colored.length) {
			const newVal = cloneDeep(value);
			newVal.state.colored.pop();

			onChange?.(newVal);
		}
	};

	useEffect(() => { setTimeout(() => { onBlur?.(); }, 200); }, [value]);
	return (
		<Container>
			<TicketGroupsContext.Provider value={{ groupType: 'colored' }}>
				<GroupsAccordion
					title={formatMessage({ id: 'ticketCard.groups.coloured', defaultMessage: 'Coloured Groups' })}
					groups={groups.colored || []}
				/>
			</TicketGroupsContext.Provider>
			<TicketGroupsContext.Provider value={{ groupType: 'hidden' }}>
				<GroupsAccordion
					title={formatMessage({ id: 'ticketCard.groups.hidden', defaultMessage: 'Hidden Groups' })}
					groups={groups.hidden || []}
				/>
			</TicketGroupsContext.Provider>

			<button onClick={changeState} type="button">Change Stuff</button>
		</Container>
	);
};
