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

import { MouseEventHandler, ReactNode } from 'react';
import { FixedOrGrowContainer } from '@controls/fixedOrGrowContainer';
import { TextOverflow } from '@controls/textOverflow';
import { Text } from './revisionsListItemCode.styles';

type IRevisionsListItemCode = {
	children: ReactNode;
	width?: number;
	tabletWidth?: number;
	mobileWidth?: number;
	className?: string;
	onClick?: MouseEventHandler<HTMLSpanElement>;
};

export const RevisionsListItemCode = ({
	children,
	width,
	tabletWidth,
	mobileWidth,
	className,
	onClick,
}: IRevisionsListItemCode): JSX.Element => (
	<FixedOrGrowContainer width={width} tabletWidth={tabletWidth} mobileWidth={mobileWidth} className={className}>
		<TextOverflow tooltipText="Launch in Viewer">
			<Text onClick={onClick}>
				{children}
			</Text>
		</TextOverflow>
	</FixedOrGrowContainer>
);
