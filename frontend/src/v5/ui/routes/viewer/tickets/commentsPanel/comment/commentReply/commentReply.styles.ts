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

import styled, { css } from 'styled-components';
import { CommentBody } from '../comment.styles';

export const CommentReplyContainer = styled.div<{ variant?: 'primary' | 'secondary' }>`
	border: solid 0 ${({ theme }) => theme.palette.primary.main};
	border-left-width: 4px;
	border-radius: 5px;
	padding: 6px 10px 6px 6px;
    margin-bottom: 4px;
	${({ theme, variant }) => {
		if (variant === 'primary') {
			return css`
				background-color: ${theme.palette.tertiary.lightest};
				color: ${theme.palette.secondary.main};
			`;
		}
		return css`
			background-color: ${theme.palette.secondary.mid};
			color: ${theme.palette.primary.contrast};
		`;
	}}
	
	${CommentBody} {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

		@supports (-webkit-line-clamp: 3) {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: initial;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
	}
`;
