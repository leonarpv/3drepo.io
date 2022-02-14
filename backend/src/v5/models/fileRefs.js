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

const { templates } = require('../utils/responseCodes');
const FileRefs = {};
const ExternalServices = require('../handler/externalServices');
const db = require('../handler/db');

const collectionName = (collection) => (collection.endsWith('.ref') ? collection : `${collection}.ref`);

const getRefEntry = (account, collection, fileName) => {
	return db.getCollection(account, collection).then((col) => {
		return col ? col.findOne({_id: fileName}) : Promise.reject(templates.noFileFound);
	});
}

const getOriginalFile = (account, model, fileName) => {
	const collection = model + ".history.ref";
	return fetchFileStream(account, model, collection, fileName, false);
};

const fetchFileStream = (account, model, collection, fileName, useLegacyNameOnFallback = false) => {
	return getRefEntry(account, collection, fileName).then((entry) => {
		if(!entry) {
			return templates.noFileFound;
		}
		return ExternalServices.getFileStream(account, collection, entry.type, entry.link).then((stream) => {
			return {readStream: stream, size: entry.size };
		}).catch ((err) => {
			// systemLogger.logError(`Failed to fetch file from ${entry.type}. Trying GridFS....`);
			// Mailer.sendFileMissingError({
			// 	account, model, collection,
			// 	refId: entry._id,
			// 	link: entry.link
			// });

			// Temporary fall back - read from gridfs
			const fullName = useLegacyNameOnFallback ?
				`/${account}/${model}/${fileName.split("/").length > 1 ? "revision/" : ""}${fileName}` :
				fileName;
			return ExternalServices.getFileStream(account, collection, "gridfs", fullName).then((stream) => {
				return {readStream: stream, size: entry.size };
			});
		});
	});
}

const removeAllFiles = async (teamspace, collection) => {
	const pipeline = [
		{ $match: { noDelete: { $exists: false }, type: { $ne: 'http' } } },
		{ $group: { _id: '$type', links: { $addToSet: '$link' } } },
	];
	const results = await db.aggregate(teamspace, collection, pipeline);

	const deletePromises = results.map(
		({ _id, links }) => {
			if (_id && links?.length) {
				return ExternalServices.removeFiles(teamspace, collection, _id, links);
			}
			return Promise.resolve();
		},
	);

	return Promise.all(deletePromises);
};

FileRefs.findRevision = async (teamspace, model, query, projection, sort) => {
	const revision = await db.findOne(teamspace, `${model}.history`, {}, projection, sort);

	if(!revision){
		throw templates.revisionNotFound;
	}

	return revision;
};

FileRefs.getTotalSize = async (teamspace, collection) => {
	const pipelines = [
		{ $match: {} },
		{ $group: { _id: null, total: { $sum: '$size' } } },
	];

	const res = await db.aggregate(teamspace, collectionName(collection), pipelines);

	return res.length > 0 ? res[0].total : 0;
};

FileRefs.removeAllFilesFromModel = async (teamspace, model) => {
	const collList = await db.listCollections(teamspace);
	const refCols = collList.filter(({ name }) => {
		// eslint-disable-next-line security/detect-non-literal-regexp
		const res = name.match(new RegExp(`^${model}.*\\.ref$`));
		return !!res?.length;
	});
	return Promise.all(refCols.map(({ name }) => removeAllFiles(teamspace, name)));
};

FileRefs.downloadRevisionFiles = async (teamspace, model, revision) => {
	if(!revision || !revision.rFile || !revision.rFile.length) {
		throw templates.noFileFound;
	}

	// We currently only support single file fetches
	const fileName = revision.rFile[0];
	const fileNameArr = fileName.split("_");
	const ext = fileNameArr.length > 1 ? "." + fileNameArr.pop() : "";
	const fileNameFormatted = fileNameArr.join("_").substr(36) + ext;
	const filePromise = getOriginalFile(teamspace, model, fileName);

	return filePromise.then((file) => {
		file.fileName = fileNameFormatted;
		return file;
	});
};

module.exports = FileRefs;
