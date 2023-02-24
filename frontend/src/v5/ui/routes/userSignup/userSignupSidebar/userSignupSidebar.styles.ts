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

import { Button } from '@controls/button';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FONT_WEIGHT } from '@/v5/ui/themes/theme';

export const Container = styled.div`
	margin: auto;
	box-sizing: border-box;
	display: block;
	width: 412px;
`;

export const MainTitle = styled.div`
	${({ theme }) => theme.typography.h1};
	font-size: 40px;
	font-weight: ${FONT_WEIGHT.BOLDER};
	line-height: 42px;
`;

export const SSOButton = styled(Button).attrs({
	component: Link,
	variant: 'contained',
	color: 'primary',
})`
	width: fit-content;
	font-weight: 300;
	margin: 28px 0 0;
	padding: 10px 20px 10px 28px;
	border-radius: 0;
	background-color: #2F2F2F;

	&:hover {
		backgroundColor: #2F2F2F,
	},

	&:active{
		backgroundColor: #2F2F2F,
	}
`;
