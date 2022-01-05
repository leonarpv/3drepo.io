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
import React from 'react';
import { FixedOrGrowContainer } from '@controls/fixedOrGrowContainer';
import { IFixedOrGrowContainer } from '@controls/fixedOrGrowContainer/fixedOrGrowContainer.component';
import { Text } from './dashboardListItemText.styles';

interface IDashboardListItemText extends IFixedOrGrowContainer{
	selected?: boolean;
}

export const DashboardListItemText = ({
	selected = false,
	children,
	...containerProps
}: IDashboardListItemText): JSX.Element => (
	<FixedOrGrowContainer
		{...containerProps}
	>
		<Text selected={selected}>
			{children}
		</Text>
	</FixedOrGrowContainer>
);
