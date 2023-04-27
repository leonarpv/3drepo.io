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

export const AssigneesListContainer = styled.div`
	position: relative;
	width: fit-content;
	user-select: none;
	color: ${({ theme }) => theme.palette.base.main};
	font-size: 10px;
	height: 28px;
	line-height: 28px;

	.MuiButtonBase-root {
		z-index: 11;
		&:hover {
			z-index: 12; /* avatar appears on top when hovered */
		}

		::before {
			content: "";
			margin: 0;
			background-color: ${({ theme }) => theme.palette.primary.contrast};
			position: absolute;
			opacity: 0;
			width: 100%;
			height: 100%;
			box-sizing: border-box;
			border-radius: 50%;
			z-index: 10;
		}
	}
	span:last-child .MuiButtonBase-root {
		margin: 0;
	}

	&:hover .MuiButtonBase-root {
		&::before {
			opacity: 0.3;
		}
		&:hover::before {
			opacity: 0;
		}
	}
`;