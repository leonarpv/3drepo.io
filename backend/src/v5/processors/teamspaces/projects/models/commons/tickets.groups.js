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

const { UUIDToString, stringToUUID } = require('../../../../../utils/helper/uuids');
const { addGroups, getGroupById, updateGroup } = require('../../../../../models/tickets.groups');
const { getIdToMeshesMapping, getMeshesWithParentIds } = require('./scene');
const { getMetadataByQuery, getMetadataByRules, getMetadataWithMatchingData } = require('../../../../../models/metadata');
const { getNodesByIds, getNodesBySharedIds } = require('../../../../../models/scenes');
const { getCommonElements } = require('../../../../../utils/helper/arrays');
const { getLatestRevision } = require('../../../../../models/revisions');
const { idTypesToKeys } = require('../../../../../models/metadata.constants');

const TicketGroups = {};

const getExteralIdNameFromMetadata = (metadata) => {
	let externalIdName;
	Object.keys(idTypesToKeys).forEach((name) => {
		if (idTypesToKeys[name].some((m) => m === metadata[0].metadata[0].key)) {
			externalIdName = name;
		}
	});

	return externalIdName;
};

const getObjectArrayFromRules = async (teamspace, project, model, revId, rules, returnMeshIds) => {
	let revision = revId;
	if (!revision) {
		try {
			const rev = await getLatestRevision(teamspace, model, { _id: 1 });
			revision = rev._id;
		} catch (err) {
			return { container: model, _ids: [] };
		}
	}

	const externalKeys = Object.values(idTypesToKeys).flat().map((n) => ({ key: n }));
	const projection = { parents: 1, ...(returnMeshIds ? {} : { metadata: { $elemMatch: { $or: externalKeys } } }) };

	const { matched, unwanted } = await getMetadataByRules(teamspace, project, model, revision, rules, projection);

	if (!returnMeshIds && matched.some((m) => m.metadata)) {
		const wantedIds = [...new Set(matched.map(({ metadata }) => metadata[0].value))];
		const unwantedIds = [...new Set(unwanted.map(({ metadata }) => metadata[0].value))];

		unwantedIds.filter((id) => (wantedIds.includes(id))).forEach((id) => delete wantedIds[id]);

		const externalIdName = getExteralIdNameFromMetadata(matched);
		return { container: model, [externalIdName]: wantedIds };
	}

	const idToMeshes = await getIdToMeshesMapping(teamspace, model, revision);
	const [
		matchedNodes,
		unwantedNodes,
	] = await Promise.all([
		matched.length ? getNodesBySharedIds(teamspace, project, model, revision,
			matched.flatMap(({ parents }) => parents), { _id: 1 }) : Promise.resolve([]),
		unwanted.length ? getNodesBySharedIds(teamspace, project, model, revision,
			unwanted.flatMap(({ parents }) => parents), { _id: 1 }) : Promise.resolve([]),
	]);

	const matchedMeshes = {};

	matchedNodes.forEach(({ _id }) => {
		const idStr = UUIDToString(_id);
		if (idToMeshes[idStr]) {
			idToMeshes[idStr].forEach((id) => {
				matchedMeshes[id] = stringToUUID(id);
			});
		}
	});

	unwantedNodes.forEach(({ _id }) => {
		const idStr = UUIDToString(_id);
		if (idToMeshes[idStr]) {
			idToMeshes[idStr].forEach((id) => delete matchedMeshes[id]);
		}
	});

	return { container: model, _ids: Object.values(matchedMeshes) };
};

const convertToExternalIds = async (teamspace, project, objects) => {
	const convertedObjects = await Promise.all(objects.map(async (obj) => {
		// eslint-disable-next-line no-underscore-dangle
		if (!obj._ids) {
			return obj;
		}

		const convertedObject = { ...obj };

		// eslint-disable-next-line no-underscore-dangle
		const shared_ids = await getNodesByIds(teamspace, project, obj.container, obj._ids,
			{ _id: 0, shared_id: 1 });

		const externalIdKeys = Object.values(idTypesToKeys).flat();
		const query = { parents: { $in: shared_ids.map((s) => s.shared_id) }, 'metadata.key': { $in: externalIdKeys } };
		const projection = { metadata: { $elemMatch: { $or: externalIdKeys.map((n) => ({ key: n })) } } };
		const metadata = await getMetadataByQuery(teamspace, obj.container, query, projection);

		if (metadata?.length) {
			// eslint-disable-next-line no-underscore-dangle
			delete convertedObject._ids;
			const externalIdName = getExteralIdNameFromMetadata(metadata);
			convertedObject[externalIdName] = [...new Set(metadata.map((m) => m.metadata[0].value))];
		}

		return convertedObject;
	}));

	return convertedObjects;
};

const convertToMeshIds = async (teamspace, project, revId, containerEntry) => {
	// eslint-disable-next-line no-underscore-dangle
	if (containerEntry._ids) {
		return containerEntry;
	}

	const { container } = containerEntry;

	let revision = revId;
	if (!revision) {
		try {
			const rev = await getLatestRevision(teamspace, container, { _id: 1 });
			revision = rev._id;
		} catch (err) {
			return undefined;
		}
	}

	const formattedEntry = { ...containerEntry };

	const idType = getCommonElements(Object.keys(formattedEntry), Object.keys(idTypesToKeys))[0];
	const metadata = await getMetadataWithMatchingData(teamspace, container, revision,
		idTypesToKeys[idType], formattedEntry[idType], { parents: 1 });
	const meshIds = await getMeshesWithParentIds(teamspace, project, container, revision,
		metadata.flatMap(({ parents }) => parents));

	delete formattedEntry[idType];
	return { ...formattedEntry, _ids: meshIds };
};

TicketGroups.addGroups = async (teamspace, project, model, ticket, groups) => {
	const convertedGroups = await Promise.all(groups.map(
		async (group) => {
			if (group.objects) {
				const objects = await convertToExternalIds(teamspace, project, group.objects);
				return { ...group, objects };
			}

			return group;
		}));

	await addGroups(teamspace, project, model, ticket, convertedGroups);
};

TicketGroups.updateTicketGroup = async (teamspace, project, model, ticket, groupId, data, author) => {
	const convertedData = { ...data };

	if (data.objects) {
		convertedData.objects = await convertToExternalIds(teamspace, project, data.objects);
	}

	await updateGroup(teamspace, project, model, ticket, groupId, convertedData, author);
};

TicketGroups.getTicketGroupById = async (teamspace, project, model, revId, ticket, groupId, returnMeshIds,
	containers) => {
	const group = await getGroupById(teamspace, project, model, ticket, groupId);

	const rev = containers ? undefined : revId;
	const modelsToQuery = containers || [model];

	if (group.rules) {
		group.objects = (await Promise.all(
			modelsToQuery.map(async (con) => {
				const objs = await getObjectArrayFromRules(teamspace, project, con, rev, group.rules, returnMeshIds);
				// eslint-disable-next-line no-underscore-dangle
				return objs._ids?.length || objs.revit_ids?.length || objs.ifc_guids?.length ? objs : [];
			}),
		)).flat();
	} else if (returnMeshIds) {
		group.objects = (await Promise.all(
			group.objects.map((obj) => (modelsToQuery.includes(obj.container)
				? convertToMeshIds(teamspace, project, rev, obj)
				: undefined))))
			.filter((ids) => ids);
	}

	return group;
};

module.exports = TicketGroups;
