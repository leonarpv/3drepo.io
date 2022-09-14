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
const Yup = require('yup');

const { propTypes } = require('./templates.constants');
const { types } = require('../../utils/helper/yup');

const Validators = {};

const CameraType = {
	ORTHOGRAPHIC: 'orthographic',
	PERSPECTIVE: 'perspective',
};

const groupIdOrData = types.id; // FIXME
Validators.propTypesToValidator = {
	[propTypes.TEXT]: types.strings.title,
	[propTypes.LONG_TEXT]: types.strings.longDescription,
	[propTypes.BOOLEAN]: Yup.boolean(),
	[propTypes.DATE]: types.date,
	[propTypes.NUMBER]: Yup.number(),
	[propTypes.ONE_OF]: types.strings.title,
	[propTypes.MANY_OF]: Yup.array().of(types.strings.title),
	[propTypes.IMAGE]: types.embeddedImage,
	[propTypes.VIEW]: Yup.object().shape({
		screenshot: types.embeddedImage,
		state: Yup.object({
			showHiddenObjects: Yup.boolean().default(false),
			highlightedGroups: Yup.array().of(groupIdOrData),
			colorOverrideGroups: Yup.array().of(groupIdOrData),
			hiddenGroups: Yup.array().of(groupIdOrData),
			shownGroups: Yup.array().of(groupIdOrData),
			transformGroups: Yup.array().of(groupIdOrData),
		}).default(undefined),
		camera: Yup.object({
			type: Yup.string().oneOf([CameraType.PERSPECTIVE, CameraType.ORTHOGRAPHIC])
				.default(CameraType.PERSPECTIVE),
			position: types.position.required(),
			forward: types.position.required(),
			up: types.position.required(),
			size: Yup.number().when('type', (type, schema) => (type === CameraType.ORTHOGRAPHIC ? schema.required() : schema.strip())),
		}).default(undefined),
	}).default(undefined),
	[propTypes.MEASUREMENTS]: Yup.array().of(
		Yup.object().shape({
			positions: Yup.array().of(types.position).min(2).required(),
			value: Yup.number().required(),
			color: types.colorArr.required(),
			type: Yup.number().min(0).max(1).required(),
			name: types.strings.title.required(),
		}),
	),
	[propTypes.COORDS]: types.position,
};

module.exports = Validators;