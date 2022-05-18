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

import styled from 'styled-components';

export const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

export const Content = styled.section`
	background-color: ${({ theme }) => theme.palette.tertiary.lightest};
	overflow-y: auto;
	flex-grow: 1;
	/* using inset box-shadow because ScrollArea gives an absolute position to the component */
	box-shadow: inset 0 6px 16px -16px;
`;
