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
import { CommentMessage } from '../basicCommentWithImages/basicCommentWithImages.styles';

export const CommentReplyContainer = styled.div<{ variant?: 'primary' | 'secondary', shortMessage?: boolean }>`
	border: solid 0 ${({ theme }) => theme.palette.primary.main};
	border-left-width: 4px;
	border-radius: 5px;
	padding: 6px 10px 6px 9px;
	margin-bottom: 5px;
	overflow-x: hidden;
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
	
	${({ shortMessage }) => shortMessage && css`
		${CommentMessage} {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			@supports (-webkit-line-clamp: 3) {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: initial;
				/* stylelint-disable-next-line */
				display: -webkit-box;
				-webkit-line-clamp: 3;
				/* stylelint-disable-next-line */
				-webkit-box-orient: vertical;
			}
		}
	`}
`;
