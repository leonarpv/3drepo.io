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

import { BaseProperties, IssueProperties, SafetibaseProperties } from '@/v5/ui/routes/viewer/tickets/tickets.constants';
import { formatMessage } from '@/v5/services/intl';
import _ from 'lodash';
import { PriorityLevels, RiskLevels, TicketStatuses, TreatmentStatuses } from '@controls/chip/chip.types';
import { ITicket } from '@/v5/store/tickets/tickets.types';

export const NONE_OPTION = 'none';
export const NoneOptionMessage = formatMessage({ id: 'tickets.selectOption.none', defaultMessage: 'None' });

const UNSET = formatMessage({ id: 'tickets.selectOption.property.unset', defaultMessage: 'Unset' });
const NO_DUE_DATE = formatMessage({ id: 'groupBy.dueDate.unset', defaultMessage: 'No due date' });
const OVERDUE = formatMessage({ id: 'groupBy.dueDate.overdue', defaultMessage: 'Overdue' });

const getOptionsForGroupsWithDueDate = () => [
	OVERDUE,
	formatMessage({ id: 'groupBy.dueDate.inOneWeek', defaultMessage: 'in 1 week' }),
	formatMessage({ id: 'groupBy.dueDate.inTwoWeeks', defaultMessage: 'in 2 weeks' }),
	formatMessage({ id: 'groupBy.dueDate.inThreeWeeks', defaultMessage: 'in 3 weeks' }),
	formatMessage({ id: 'groupBy.dueDate.inFourWeeks', defaultMessage: 'in 4 weeks' }),
	formatMessage({ id: 'groupBy.dueDate.inFiveWeeks', defaultMessage: 'in 5 weeks' }),
	formatMessage({ id: 'groupBy.dueDate.inSixPlusWeeks', defaultMessage: 'in 6+ weeks' }),
];

export const groupByDate = (tickets: ITicket[]) => {
	const groups = {};
	// eslint-disable-next-line prefer-const
	let [ticketsWithUnsetDueDate, remainingTickets] = _.partition(tickets, ({ properties }) => !properties[IssueProperties.DUE_DATE]);
	groups[NO_DUE_DATE] = ticketsWithUnsetDueDate;

	const dueDateOptions = getOptionsForGroupsWithDueDate();
	const endOfCurrentWeek = new Date();

	const ticketDueDateIsPassed = (ticket: ITicket) => ticket.properties[IssueProperties.DUE_DATE] < endOfCurrentWeek.getTime();

	let currentWeekTickets;
	while (dueDateOptions.length) {
		[currentWeekTickets, remainingTickets] = _.partition(remainingTickets, ticketDueDateIsPassed);
		groups[dueDateOptions.shift()] = currentWeekTickets;
		endOfCurrentWeek.setDate(endOfCurrentWeek.getDate() + 7);
	}
	return groups;
};

export const groupByList = (tickets: ITicket[], groupType: string, groupValues: string[]) => {
	const groups = {};
	let remainingTickets = tickets;
	let currentTickets = [];
	groupValues.forEach((groupValue) => {
		[currentTickets, remainingTickets] = _.partition(remainingTickets, ({ properties, modules }) => (
			{ ...modules?.safetibase, ...properties }?.[groupType] === groupValue
		));
		groups[groupValue] = currentTickets;
	});
	groups[UNSET] = remainingTickets;
	return groups;
};

export const GROUP_BY_OPTIONS = {
	[NONE_OPTION]: NoneOptionMessage,
	[BaseProperties.OWNER]: formatMessage({ id: 'groupBy.owner', defaultMessage: 'Owner' }),
	[IssueProperties.DUE_DATE]: formatMessage({ id: 'groupBy.dueDate', defaultMessage: 'Due date' }),
	[IssueProperties.PRIORITY]: formatMessage({ id: 'groupBy.priority', defaultMessage: 'Priority' }),
	[IssueProperties.STATUS]: formatMessage({ id: 'groupBy.status', defaultMessage: 'Status' }),
	[SafetibaseProperties.LEVEL_OF_RISK]: formatMessage({ id: 'groupBy.levelOfRisk', defaultMessage: 'Level of risk' }),
	[SafetibaseProperties.TREATMENT_STATUS]: formatMessage({ id: 'groupBy.treatmentStatus', defaultMessage: 'Treatment status' }),
};

const GROUP_NAMES_BY_TYPE = {
	[IssueProperties.PRIORITY]: PriorityLevels,
	[IssueProperties.STATUS]: TicketStatuses,
	[SafetibaseProperties.LEVEL_OF_RISK]: RiskLevels,
	[SafetibaseProperties.TREATMENT_STATUS]: TreatmentStatuses,
};

export const getGroupByOptions = (groupBy: string) => {
	const optionsAsEnum = _.mapKeys(GROUP_NAMES_BY_TYPE, (v, key) => _.startCase(key))[groupBy];
	return _.values(optionsAsEnum);
};
