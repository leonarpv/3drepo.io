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
/* eslint-disable implicit-arrow-linebreak */

import { IComment } from '@/v5/store/tickets/tickets.types';
import { subscribeToRoomEvent } from './realtime.service';
import { TicketsActionsDispatchers } from '../actionsDispatchers';

// Container
export const enableRealtimeContainerUpdateTicketComment = (
	teamspace: string,
	project: string,
	containerId: string,
	ticketId: string,
) => (
	subscribeToRoomEvent(
		{ teamspace, project, model: containerId },
		'containerUpdateTicketComment',
		(comment: Partial<IComment>) => (
			TicketsActionsDispatchers.upsertTicketCommentSuccess(containerId, ticketId, comment)
		),
	)
);

export const enableRealtimeContainerNewTicketComment = (
	teamspace: string,
	project: string,
	containerId: string,
	ticketId: string,
) => (
	subscribeToRoomEvent(
		{ teamspace, project, model: containerId },
		'containerNewTicketComment',
		(comment: IComment) => TicketsActionsDispatchers.upsertTicketCommentSuccess(containerId, ticketId, comment),
	)
);

// Federation
export const enableRealtimeFederationUpdateTicketComment = (
	teamspace: string,
	project: string,
	federationId: string,
	ticketId: string,
) => (
	subscribeToRoomEvent(
		{ teamspace, project, model: federationId },
		'federationUpdateTicketComment',
		(comment: Partial<IComment>) => (
			TicketsActionsDispatchers.upsertTicketCommentSuccess(federationId, ticketId, comment)
		),
	)
);

export const enableRealtimeFederationNewTicketComment = (
	teamspace: string,
	project: string,
	federationId: string,
	ticketId: string,
) => (
	subscribeToRoomEvent(
		{ teamspace, project, model: federationId },
		'federationNewTicketComment',
		(comment: IComment) => TicketsActionsDispatchers.upsertTicketCommentSuccess(federationId, ticketId, comment),
	)
);
