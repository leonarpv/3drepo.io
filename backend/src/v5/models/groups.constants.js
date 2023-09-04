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

const GroupsConstants = {};

const COMMON_OPERATORS = {
	IS: { name: 'IS', minValues: 1 },
	CONTAINS: { name: 'CONTAINS', minValues: 1 },
	REGEX: { name: 'REGEX', minValues: 1, maxValues: 1 },
};

GroupsConstants.FIELD_NAME_OPERATORS = {
	...COMMON_OPERATORS,
	STARTS_WITH: { name: 'STARTS_WITH', minValues: 1 },
	ENDS_WITH: { name: 'ENDS_WITH', minValues: 1 },
};

GroupsConstants.FIELD_VALUE_OPERATORS = {
	...COMMON_OPERATORS,
	IS_NOT: { name: 'IS_NOT', minValues: 1 },
	NOT_CONTAINS: { name: 'NOT_CONTAINS', minValues: 1 },
	IS_EMPTY: { name: 'IS_EMPTY', minValues: 0, maxValues: 0 },
	IS_NOT_EMPTY: { name: 'IS_NOT_EMPTY', minValues: 0, maxValues: 0 },
	EQUALS: { name: 'EQUALS', minValues: 1, isNumber: true },
	NOT_EQUALS: { name: 'NOT_EQUALS', minValues: 1, isNumber: true },
	GT: { name: 'GT', minValues: 1, isNumber: true },
	GTE: { name: 'GTE', minValues: 1, isNumber: true },
	LT: { name: 'LT', minValues: 1, isNumber: true },
	LTE: { name: 'LTE', minValues: 1, isNumber: true },
	IN_RANGE: { name: 'IN_RANGE', minValues: 2, isNumber: true, isRange: true },
	NOT_IN_RANGE: { name: 'NOT_IN_RANGE', minValues: 2, isNumber: true, isRange: true },
};

GroupsConstants.OPERATORS = {
	...GroupsConstants.FIELD_VALUE_OPERATORS,
	...GroupsConstants.FIELD_NAME_OPERATORS,
};

module.exports = GroupsConstants;
