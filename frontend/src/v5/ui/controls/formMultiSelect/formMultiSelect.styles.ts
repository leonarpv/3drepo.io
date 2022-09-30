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
import styled from 'styled-components';
import { SearchInput as SearchInputBase } from '@controls/search/searchInput';
import { MenuItem } from '@mui/material';

export const SearchInput = styled(SearchInputBase)`
	margin: 0;
	padding: 12px;
`;

export const NoResults = styled.div`
	padding: 5px 12px 8px;
	color: ${({ theme }) => theme.palette.base.main};
	${({ theme }) => theme.typography.body1};
`;

export const RenderValueTriggerer = styled(MenuItem)`
	display: none;
	padding: 0;
`;
