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

import { formatMessage } from '@/v5/services/intl';
import { FederationsHooksSelectors, TicketsCardHooksSelectors } from '@/v5/services/selectorsHooks';
import { camelCase, isEmpty, isEqual, mapKeys } from 'lodash';
import { getUrl } from '@/v5/services/api/default';
import SequencingIcon from '@assets/icons/outlined/sequence-outlined.svg';
import SafetibaseIcon from '@assets/icons/outlined/safetibase-outlined.svg';
import ShapesIcon from '@assets/icons/outlined/shapes-outlined.svg';
import CustomModuleIcon from '@assets/icons/outlined/circle-outlined.svg';
import { addBase64Prefix } from '@controls/fileUploader/imageFile.helper';
import { useParams } from 'react-router-dom';
import { EditableTicket, Group, GroupOverride, ITemplate, ITicket, Viewpoint } from './tickets.types';

export const modelIsFederation = (modelId: string) => (
	!!FederationsHooksSelectors.selectContainersByFederationId(modelId).length
);

export const getEditableProperties = (template) => {
	const propertyIsEditable = ({ readOnly }) => !readOnly;

	return {
		properties: (template.properties || []).filter(propertyIsEditable),
		modules: (template.modules || []).map((module) => ({
			...module,
			properties: module.properties.filter(propertyIsEditable),
		})),
	};
};

const templatePropertiesToTicketProperties = (properties = []) => (
	properties.reduce(
		(ticketProperties, prop) => ({
			...ticketProperties,
			[prop.name]: prop.default,
		}),
		{},
	)
);

export const getDefaultTicket = (template: ITemplate): EditableTicket => {
	const properties = templatePropertiesToTicketProperties(template.properties);
	const modules = (template.modules || []).reduce(
		(ticketModules, { name, type, properties: moduleProperties }) => ({
			...ticketModules,
			[name || type]: templatePropertiesToTicketProperties(moduleProperties),
		}),
		{},
	);
	return ({
		title: '',
		type: template._id,
		// props at root level other than title and type are skipped as they are not required
		properties,
		modules,
	});
};

const filterEmptyModuleValues = (module) => {
	const parsedModule = {};
	const NULLISH_VALUES = [null, undefined, ''];
	Object.entries(module)
		// skip nullish values that are not 0s or false
		.filter((entry) => !NULLISH_VALUES.includes(entry[1] as any))
		.forEach(([key, value]) => {
			if (Array.isArray(value)) {
				if (value.length === 0) return;
				// If value is an empty coords property ([undefined x 3]), it shall be removed
				if (value.length === 3 && !value.some((v) => !NULLISH_VALUES.includes(v))) return;
				// A this point, we are either dealing with a coords property that has
				// at least 1 value that is not undefined, or with a manyOf property.
				// Since the manyOf (array of) values should not hold falsy values,
				// we map all those values to 0s. So, if the property was indeed
				// a manyOf, nothing happens, but if the property was a coords,
				// we map all the non-numeric values to 0.
				parsedModule[key] = value.map((v) => v || 0);
			} else {
				parsedModule[key] = value;
			}
		});
	return parsedModule;
};

export const filterEmptyTicketValues = (ticket) => {
	const parsedTicket = {};
	Object.entries(ticket).forEach(([key, value]) => {
		switch (key) {
			case 'properties':
				parsedTicket[key] = filterEmptyModuleValues(value);
				break;
			case 'modules':
				parsedTicket[key] = {};
				Object.entries(value).forEach(([module, moduleValue]) => {
					const parsedModule = filterEmptyModuleValues(moduleValue);
					if (!isEmpty(parsedModule)) {
						parsedTicket[key][module] = parsedModule;
					}
				});
				break;
			default:
				parsedTicket[key] = value;
		}
	});
	return parsedTicket;
};

const moduleTypeProperties = {
	safetibase: { title: formatMessage({ id: 'customTicket.panel.safetibase', defaultMessage: 'Safetibase' }), Icon: SafetibaseIcon },
	sequencing: { title: formatMessage({ id: 'customTicket.panel.sequencing', defaultMessage: 'Sequencing' }), Icon: SequencingIcon },
	shapes: { title: formatMessage({ id: 'customTicket.panel.shapes', defaultMessage: 'Shapes' }), Icon: ShapesIcon },
};

export const getModulePanelProps = (module) => {
	if (module.name) return { title: module.name, Icon: CustomModuleIcon };
	return moduleTypeProperties[module.type];
};

export const getTicketResourceUrl = (
	teamspace,
	project,
	containerOrFederation,
	ticketId,
	resource,
	isFederation,
) => {
	const modelType = isFederation ? 'federations' : 'containers';
	return getUrl(
		`teamspaces/${teamspace}/projects/${project}/${modelType}/${containerOrFederation}/tickets/${ticketId}/resources/${resource}`,
	);
};

export const isResourceId = (str) => {
	const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
	return regexExp.test(str);
};

export const getImgSrc = (imgData) => {
	const { teamspace, project, containerOrFederation } = useParams();
	const isFederation = modelIsFederation(containerOrFederation);
	const ticketId = TicketsCardHooksSelectors.selectSelectedTicketId();

	if (!imgData) return '';
	if (isResourceId(imgData)) {
		return getTicketResourceUrl(teamspace, project, containerOrFederation, ticketId, imgData, isFederation);
	}
	return addBase64Prefix(imgData);
};

const overrideHasEditedGroup = (override: GroupOverride, oldOverrides: GroupOverride[]) => {
	const overrideId = (override.group as Group)._id;
	if (!overrideId) return false;

	const oldGroup = oldOverrides.find(({ group }) => (group as Group)._id === overrideId).group;
	return !isEqual(oldGroup, override.group);
};

const findOverrideWithEditedGroup = (values, oldValues, propertiesDefinitions) => {
	let overrideWithEditedGroup;
	Object.keys(values).forEach((key) => {
		const definition = propertiesDefinitions.find((def) => def.name === key);
		if (definition?.type === 'view') {
			const viewValue: Viewpoint | undefined = values[key];
			const oldValue: Viewpoint | undefined = oldValues?.[key];

			overrideWithEditedGroup ||= viewValue?.state?.colored?.find((o) => overrideHasEditedGroup(o, oldValue?.state?.colored || []))
				|| viewValue?.state?.hidden?.find((o) => overrideHasEditedGroup(o, oldValue?.state?.hidden || []));
		}
	});

	return overrideWithEditedGroup;
};

const getSanitizedSmartGroup = (group: Group) => {
	if (group?.rules && group?.objects) {
		const { objects, ...rest } = group;
		return rest;
	}
	return group;
};

export const findEditedGroup = (values: Partial<ITicket>, ticket: ITicket, template) => {
	let overrideWithEditedGroup;
	if (values.properties) {
		overrideWithEditedGroup = findOverrideWithEditedGroup(values.properties, ticket.properties, template.properties);
	}

	if (values.modules) {
		template?.modules?.forEach(({ name, properties }) => {
			overrideWithEditedGroup ||= findOverrideWithEditedGroup(values.modules[name], ticket.modules[name], properties);
		});
	}

	return getSanitizedSmartGroup(overrideWithEditedGroup?.group as Group);
};

const getSanitizedOverride = ({ group, ...rest }: GroupOverride) => ({ ...rest, group: (group as Group)?._id || group });

const sanitizeViewValues = (values, oldValues, propertiesDefinitions) => {
	if (!values) return;

	Object.keys(values).forEach((key) => {
		const definition = propertiesDefinitions.find((def) => def.name === key);
		if (definition?.type === 'view') {
			const viewValue:Viewpoint | undefined = values[key];
			const oldValue:Viewpoint | undefined = oldValues?.[key];

			if (isResourceId(viewValue?.screenshot)) {
				delete viewValue.screenshot;
			}

			if (viewValue && !viewValue.camera && oldValue?.camera) {
				viewValue.camera = null;
				viewValue.clippingPlanes = null;
			}

			if (viewValue && !viewValue.state && oldValue?.state) {
				viewValue.state = null;
			}

			if (viewValue.state?.colored) {
				viewValue.state.colored = viewValue.state.colored.map(getSanitizedOverride);
			}

			if (viewValue.state?.hidden) {
				viewValue.state.hidden = viewValue.state.hidden.map(getSanitizedOverride);
			}
		}
	});
};

export const sanitizeViewVals = (values:Partial<ITicket>, ticket:ITicket, template) => {
	if (values.properties) {
		sanitizeViewValues(values.properties, ticket.properties, template.properties);
	}

	if (values.modules) {
		template.modules.forEach(((module) => {
			sanitizeViewValues(values.modules[module.name], ticket.modules[module.name], module.properties);
		}));
	}
};

const fillEmptyOverrides = (values: Partial<ITicket>, propertiesDefinitions) => {
	Object.keys(values).forEach((key) => {
		const definition = propertiesDefinitions.find((def) => def.name === key);
		if (definition?.type === 'view') {
			const viewValue:Viewpoint | undefined = values[key];

			viewValue.state ||= {} as any;
			viewValue.state.colored ||= [];
			viewValue.state.hidden ||= [];
		}
	});
};

export const fillOverridesIfEmpty = (values: Partial<ITicket>, template) => {
	if (values.properties) {
		fillEmptyOverrides(values.properties, template.properties);
	}

	if (values.modules) {
		template.modules.forEach(((module) => {
			fillEmptyOverrides(values.modules[module.name], module.properties);
		}));
	}
};

export const templateAlreadyFetched = (template: ITemplate) => {
	const fetchedProperties = ['modules', 'properties', 'config'];
	return fetchedProperties.some((prop) => Object.keys(template).includes(prop));
};

export const getPropertiesInCamelCase = (properties) => mapKeys(properties, (_, key) => camelCase(key));
