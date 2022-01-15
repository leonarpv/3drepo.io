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

const { createResponseCode, templates } = require('../../utils/responseCodes');
const FileType = require('file-type');
const Multer = require('multer');
const config = require('../../utils/config');
const { respond } = require('../../utils/responder');
const { validateMany } = require('../common');

const MulterHelper = {};

const singleFileMulterPromise = (req, fileName, fileFilter, maxSize, storeInMemory) => new Promise((resolve, reject) => {
	const options = {
		limits: { fileSize: maxSize },
		fileFilter,
	};

	if (storeInMemory) {
		options.storage = Multer.memoryStorage();
	} else {
		options.dest = config.cn_queue.upload_dir;
	}

	Multer(options).single(fileName)(req, null, (err) => {
		if (err) {
			reject(err);
		} else {
			resolve();
		}
	});
});

const acceptedImageFormats = ['png', 'jpg', 'gif'];
const maxAvatarSize = 1048576;

const imageFilter = async (req, file, cb) => {
	const format = file.originalname.split('.').splice(-1)[0];

	if (!acceptedImageFormats.includes(format)) {
		const err = createResponseCode(templates.unsupportedFileFormat, `${format} is not a supported image format`);
		cb(err, false);
		return;
	}

	cb(null, true);
};

const ensureFileIsImage = async (req, res, next) => {
	const fileBuffer = req.file?.buffer;
	if (fileBuffer) {
		const type = await FileType.fromBuffer(fileBuffer);

		if (!acceptedImageFormats.includes(type?.ext)) {
			respond(req, res, templates.unsupportedFileFormat);
			return;
		}
	}

	next();
};

MulterHelper.singleFileUpload = (fileName = 'file', fileFilter, maxSize = config.uploadSizeLimit
	, storeInMemory = false) => async (req, res, next) => {
		try {
			await singleFileMulterPromise(req, fileName, fileFilter, maxSize, storeInMemory);
			await next();
		} catch (err) {
			let response = err;

			if (err.code === 'LIMIT_FILE_SIZE') {
				response = createResponseCode(templates.maxSizeExceeded, `File cannot be bigger than ${config.uploadSizeLimit} bytes.`);
			} else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
				response = createResponseCode(templates.invalidArguments, `${fileName} is a required field`);
			}

			respond(req, res, response);
		}
	};

MulterHelper.singleImageUpload = (fileName) => validateMany(
	[MulterHelper.singleFileUpload(fileName, imageFilter, maxAvatarSize, true), ensureFileIsImage]);

module.exports = MulterHelper;
