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
import { MOCK_DATA } from '@/v5/store/tickets/groups/ticketGroups.helpers';
import { Container } from './ticketGroups.styles';
import { GroupsAccordion } from './groupsAccordion/groupsAccordion.component';

export const TicketGroups = () => {
	const groups = MOCK_DATA;

	return (
		<Container>
			<GroupsAccordion
				title={formatMessage({ id: 'ticketCard.groups.coloured', defaultMessage: 'Coloured Groups' })}
				groups={groups.colored}
				colored
			/>
			<GroupsAccordion
				title={formatMessage({ id: 'ticketCard.groups.hidden', defaultMessage: 'Hidden Groups' })}
				groups={groups.hidden}
			/>
		</Container>
	);
};
