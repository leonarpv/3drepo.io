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

import * as faker from 'faker';
import { IContainer } from '@/v5/store/containers/containers.types';

export const containerMockFactory = (): IContainer => ({
	_id: faker.datatype.uuid(),
	latestRevision: faker.datatype.number({ min: 10, max: 1200 }),
	title: faker.random.words(3),
	revisionsCount: faker.datatype.number({ min: 10, max: 1200 }),
	category: faker.random.word(),
	code: faker.datatype.uuid(),
	date: faker.date.past(2),
	isFavourited: faker.datatype.boolean(),
});
