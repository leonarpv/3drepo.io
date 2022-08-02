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

const {
	defaultProperties,
	fieldTypes,
	fieldTypesToValidator,
	getApplicableDefaultProperties,
	presetEnumValues,
	presetModules,
	presetModulesProperties } = require('./templates.constants');
const { types, utils: { stripWhen } } = require('../../utils/helper/yup');
const Yup = require('yup');
const { cloneDeep } = require('../../utils/helper/objects');
const { isString } = require('../../utils/helper/typeCheck');

const defaultFalse = stripWhen(Yup.boolean().default(false), (v) => !v);

const fieldSchema = Yup.object().shape({
	name: types.strings.title.required().min(1),
	type: Yup.string().oneOf(Object.values(fieldTypes)).required(),
	deprecated: defaultFalse,
	required: defaultFalse,
	values: Yup.mixed().when(['type'], (val, schema) => {
		if (val === fieldTypes.MANY_OF || val === fieldTypes.ONE_OF) {
			return schema.test('Values check', 'Property values must of be an array of values or the name of a preset', (value) => {
				if (value === undefined) return false;
				let typeToCheck;
				if (isString(value)) {
					typeToCheck = Yup.string().oneOf(Object.values(presetEnumValues)).required();
				} else {
					typeToCheck = Yup.array().of(fieldTypesToValidator[fieldTypes.ONE_OF]).min(1).required()
						.strict(true);
				}

				try {
					typeToCheck.validateSync(value);
					return true;
				} catch (err) {
					return false;
				}
			});
		}
		return schema.strip();
	}),

	default: Yup.mixed().when(['type', 'values'], (type, values) => {
		const res = fieldTypesToValidator[type];
		if (type === fieldTypes.MANY_OF) {
			return res.test('Default values check', 'provided values cannot be duplicated and must be one of the values provided', (defaultValues) => {
				if (defaultValues?.length) {
					const seenValues = new Set();
					return defaultValues.every((val) => {
						const validVal = values.includes(val) && !seenValues.has(val);
						seenValues.add(val);
						return validVal;
					});
				}
				return true;
			});
		} if (type === fieldTypes.ANY_OF) return res.oneOf(values);

		return res;
	}),

});

const propertyArray = Yup.array().of(fieldSchema).default([]).test('Property names', 'Property names must be unique inside the same context', (arr) => {
	const fieldNames = new Set();
	let res = true;
	arr.forEach(({ name }) => {
		const id = name.toUpperCase();
		if (fieldNames.has(id)) {
			res = false;
		} else {
			fieldNames.add(id);
		}
	});

	return res;
});

const moduleSchema = Yup.object().shape({
	name: types.strings.title.notOneOf(Object.values(presetModules)),
	type: Yup.string().oneOf(Object.values(presetModules)),
	deprecated: defaultFalse,
	properties: propertyArray.when('type', (type, schema) => {
		if (type) {
			const propertiesToCheck = presetModulesProperties[type];
			return schema.test('No name clash', 'Properties cannot have the same name as a default property',
				(val) => val.every(({ name }) => !propertiesToCheck.includes(name)));
		}

		return schema;
	}),
}).test('Name and type', 'Only provide a name or a type for a module, not both',
	({ name, type }) => (name && !type) || (!name && type));

const configSchema = Yup.object().shape({
	comments: defaultFalse,
	issueProperties: defaultFalse,
	attachments: defaultFalse,
	defaultView: defaultFalse,
	defaultImage: Yup.boolean().when('defaultView', (defaultView, schema) => (defaultView ? schema.strip() : defaultFalse)),
	pin: defaultFalse,
}).default({});

const defaultPropertyNames = defaultProperties.map(({ name }) => name);
const schema = Yup.object().shape({
	name: types.strings.title.required(),
	code: Yup.string().length(3).required(),
	config: configSchema,
	deprecated: defaultFalse,
	properties: propertyArray.test('No name clash', 'Cannot have the same name as a default property',
		(val) => val.every(({ name }) => !defaultPropertyNames.includes(name))),
	modules: Yup.array().default([]).of(moduleSchema).test('Module names', 'Module names must be unique', (arr) => {
		const modNames = new Set();
		let res = true;
		arr.forEach(({ name, type }) => {
			const id = (name || type).toUpperCase();
			if (modNames.has(id)) {
				res = false;
			} else {
				modNames.add(id);
			}
		});

		return res;
	}),

}).noUnknown();

const TemplateSchema = {};

TemplateSchema.validate = (template) => schema.validateSync(template, { stripUnknown: true });

TemplateSchema.generateFullSchema = (template) => {
	const result = cloneDeep(template);
	result.properties = [...getApplicableDefaultProperties(template.config), ...result.properties];
	result.modules.forEach((module) => {
		if (module.type && presetModulesProperties[module.type]) {
			// eslint-disable-next-line no-param-reassign
			module.properties = [...presetModulesProperties[module.type], ...module.properties];
		}
	});

	return result;
};

module.exports = TemplateSchema;
