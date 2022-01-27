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

import React, { ReactNode } from 'react';
import { FixedOrGrowContainer } from '@controls/fixedOrGrowContainer';
import { TextOverflow } from '@controls/textOverflow';
import { Display } from '@/v5/ui/themes/media';
import { Text } from './revisionsListItemText.styles';

type IDashboardListItemText = {
	children: ReactNode;
	width?: number;
	tabletWidth?: number;
	mobileWidth?: number;
	className?: string;
	active?: boolean;
	hideWhenSmallerThan?: Display;
};

export const RevisionsListItemText = ({
	children,
	width,
	tabletWidth,
	mobileWidth,
	className,
	active = false,
	hideWhenSmallerThan,
}: IDashboardListItemText): JSX.Element => (
	<FixedOrGrowContainer
		width={width}
		tabletWidth={tabletWidth}
		mobileWidth={mobileWidth}
		hideWhenSmallerThan={hideWhenSmallerThan}
		className={className}
	>
		<TextOverflow>
			<Text $active={active}>
				{children}
			</Text>
		</TextOverflow>
	</FixedOrGrowContainer>
);