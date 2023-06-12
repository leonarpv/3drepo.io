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

import * as Yup from 'yup';
import { formatMessage } from '@/v5/services/intl';

const requiredTrimmedString = Yup.string().trim().required(
	formatMessage({
		id: 'validation.ticket.groupFilters.error.required',
		defaultMessage: 'This is a required field',
	}),
);

const valueType = Yup.object({ value: requiredTrimmedString });

export const GroupRulesSchema = Yup.object().shape({
	field: requiredTrimmedString,
	operation: requiredTrimmedString,
	values: Yup.array().of(valueType),
});

export const GroupSettingsSchema = Yup.object().shape({
	name: requiredTrimmedString,
	description: Yup.string().max(1200, formatMessage({
		id: 'validation.model.name.error.max',
		defaultMessage: 'Description is limited to 1200 characters',
	})),
});
