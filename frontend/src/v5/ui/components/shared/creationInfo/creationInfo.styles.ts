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

import styled from 'styled-components';

export const CreationInfoContainer = styled.div`
    display: flex;
	${({ theme }) => theme.typography.caption};
	color: ${({ theme }) => theme.palette.base.main};
	padding: 0 10px;
	gap: 2px;
`;

export const TruncateName = styled.div`
	display: inline-block;
	text-decoration: underline;
	max-width: 90px;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	vertical-align: bottom;
`;
