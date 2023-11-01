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

import { hexToGLColor } from '@/v4/helpers/colors';
import { selectCurrentModel } from '@/v4/modules/model';
import { IPin } from '@/v4/services/viewer/viewer';
import { SequencingProperties, TicketsCardViews } from '@/v5/ui/routes/viewer/tickets/tickets.constants';
import { theme } from '@/v5/ui/themes/theme';
import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { selectSelectedDate } from '@/v4/modules/sequences';
import { ITicketsCardState } from './ticketsCard.redux';
import { selectTemplateById, selectTicketById, selectTickets } from '../tickets.selectors';
import { ITicket } from '../tickets.types';

const selectTicketsCardDomain = (state): ITicketsCardState => state.ticketsCard || {};

export const selectCurrentTickets = createSelector(
	(state) => state,
	selectCurrentModel,
	selectTickets,
);

const ticketToPin = (ticket: ITicket, selectedId): IPin => ({
	id: ticket._id,
	position: ticket.properties.Pin,
	isSelected: ticket._id === selectedId,
	type: 'issue',
	colour: hexToGLColor(theme.palette.secondary.main),
});

export const selectView = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.view,
);

export const selectReadOnly = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.readOnly,
);

export const selectSelectedTicketId = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.selectedTicketId,
);

export const selectSelectedTemplateId = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.selectedTemplateId,
);

export const selectTicketOverridesDict = createSelector(
	selectTicketsCardDomain,
	(ticketCardState) => ticketCardState.overrides || { overrides: {}, transparencies: {} },
);

export const selectTicketOverrides = createSelector(
	selectTicketOverridesDict,
	(overridesDicts) => overridesDicts.overrides,
);

export const selectTicketTransparencies = createSelector(
	selectTicketOverridesDict,
	(overridesDicts) => overridesDicts.transparencies,
);

export const selectTicketHasOverrides = createSelector(
	selectTicketOverrides,
	selectTicketTransparencies,
	(overrides, transparencies) => !isEmpty(overrides) || !isEmpty(transparencies),
);

export const selectSelectedTicket = createSelector(
	(state) => state,
	selectCurrentModel,
	selectSelectedTicketId,
	selectTicketById,
);

export const selectSelectedTemplate = createSelector(
	(state) => state,
	selectCurrentModel,
	selectSelectedTemplateId,
	selectTemplateById,
);

export const selectTicketPins = createSelector(
	selectCurrentTickets,
	selectView,
	selectSelectedTicket,
	selectSelectedDate,
	(tickets, view, selectedTicket, selectedSequenceDate): IPin[] => {
		if (view !== TicketsCardViews.List) return [];

		return tickets.reduce(
			(accum, ticket) => {
				const pin = ticket.properties?.Pin;
				if (!pin) return accum;
				const { sequencing } = ticket.modules;
				
				if (sequencing && selectedSequenceDate) {
					const startDate = sequencing[SequencingProperties.START_TIME];
					const endDate = sequencing[SequencingProperties.END_TIME];
					if (
						startDate && new Date(startDate) > new Date(selectedSequenceDate) ||
						endDate && new Date(endDate) < new Date(selectedSequenceDate)
					) return accum;
				}
				return [...accum, ticketToPin(ticket, selectedTicket._id)];
			},
			[],
		);
	},
);
