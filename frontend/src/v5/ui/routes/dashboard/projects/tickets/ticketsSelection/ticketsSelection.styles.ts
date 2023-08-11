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

import { Typography } from '@controls/typography';
import styled from 'styled-components';

export const Form = styled.form`
	width: 398px;
	height: 402px;
	display: flex;
	flex-direction: column;
	background-color: ${({ theme }) => theme.palette.primary.contrast};
	border-radius: 20px;
	padding: 16px;
	margin: 136px auto 0;
`;

export const Title = styled(Typography).attrs({
	variant: 'h2',
})`
	margin-bottom: 11px;
	text-align: center;
	color: ${({ theme }) => theme.palette.secondary.main};
`;

export const Image = styled.img`
	width: 406px;
	margin-top: -62px;
`;
