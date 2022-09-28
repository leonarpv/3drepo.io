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
const { UUIDToString, stringToUUID } = require('../../../utils/helper/uuids');
const { createModelMessage, createProjectMessage } = require('../../chat');
const { newRevisionProcessed, updateModelStatus } = require('../../../models/modelSettings');
const { addTicketLog } = require('../../../models/tickets.logs');
const { EVENTS: chatEvents } = require('../../chat/chat.constants');
const { events } = require('../../eventsManager/eventsManager.constants');
const { findProjectByModelId } = require('../../../models/projectSettings');
const { getRevisionByIdOrTag } = require('../../../models/revisions');
const { logger } = require('../../../utils/logger');
const { subscribe } = require('../../eventsManager/eventsManager');

const queueStatusUpdate = async ({ teamspace, model, corId, status }) => {
	try {
		const { _id: projectId } = await findProjectByModelId(teamspace, model, { _id: 1 });
		await updateModelStatus(teamspace, UUIDToString(projectId), model, status, corId);
	} catch (err) {
		// do nothing - the model may have been deleted before the task came back.
	}
};

const queueTasksCompleted = async ({ teamspace, model, value, corId, user, containers }) => {
	try {
		const { _id: projectId } = await findProjectByModelId(teamspace, model, { _id: 1 });
		await newRevisionProcessed(teamspace, UUIDToString(projectId), model, corId, value, user, containers);
	} catch (err) {
		// do nothing - the model may have been deleted before the task came back.
	}
};

const modelSettingsUpdated = async ({ teamspace, project, model, data, sender, isFederation }) => {
	const event = isFederation ? chatEvents.FEDERATION_SETTINGS_UPDATE : chatEvents.CONTAINER_SETTINGS_UPDATE;
	await createModelMessage(event, data, teamspace, project, model, sender);
};

const revisionUpdated = async ({ teamspace, project, model, data, sender }) => {
	await createModelMessage(chatEvents.CONTAINER_REVISION_UPDATE, { ...data, _id: UUIDToString(data._id) },
		teamspace, project, model, sender);
};

const revisionAdded = async ({ teamspace, project, model, revision, isFederation }) => {
	try {
		const { tag, author, timestamp } = await getRevisionByIdOrTag(teamspace, model, stringToUUID(revision),
			{ _id: 0, tag: 1, author: 1, timestamp: 1 });
		const event = isFederation ? chatEvents.FEDERATION_NEW_REVISION : chatEvents.CONTAINER_NEW_REVISION;

		await createModelMessage(event, { _id: revision, tag, author, timestamp: timestamp.getTime() },
			teamspace, project, model);
	} catch (err) {
		logger.logError(`Failed to send a model message to queue: ${err?.message}`);
	}
};

const modelAdded = async ({ teamspace, project, model, data, sender, isFederation }) => {
	const event = isFederation ? chatEvents.NEW_FEDERATION : chatEvents.NEW_CONTAINER;
	await createProjectMessage(event, { ...data, _id: model }, teamspace, project, sender);
};

const modelDeleted = async ({ teamspace, project, model, sender, isFederation }) => {
	const event = isFederation ? chatEvents.FEDERATION_REMOVED : chatEvents.CONTAINER_REMOVED;
	await createModelMessage(event, {}, teamspace, project, model, sender);
};

const modelTicketUpdate = ({ teamspace, project, model, ticket, author, changes, date }) => addTicketLog(teamspace,
	project, model, ticket, { author, changes, date });

const ModelEventsListener = {};

ModelEventsListener.init = () => {
	subscribe(events.QUEUED_TASK_UPDATE, queueStatusUpdate);
	subscribe(events.QUEUED_TASK_COMPLETED, queueTasksCompleted);

	subscribe(events.MODEL_SETTINGS_UPDATE, modelSettingsUpdated);
	subscribe(events.NEW_REVISION, revisionAdded);
	subscribe(events.REVISION_UPDATED, revisionUpdated);
	subscribe(events.NEW_MODEL, modelAdded);
	subscribe(events.DELETE_MODEL, modelDeleted);
	subscribe(events.MODEL_TICKET_UPDATE, modelTicketUpdate);
};

module.exports = ModelEventsListener;
