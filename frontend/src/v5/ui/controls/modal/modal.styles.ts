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

import styled, { css } from 'styled-components';
import { IconButton } from '@mui/material';
import DialogBase from '@mui/material/Dialog';
import { ModalType } from '@/v5/store/dialogs/dialogs.redux';

export const CloseButton = styled(IconButton)`
	&& {
		position: absolute;
		top: 11px;
		right: 11px;
	}
`;

export const Dialog = styled(DialogBase)<{ type?: ModalType }>`
	${({ type }) => type === 'images' && css`
		.MuiPaper-root {
			border-radius: 0;
		}

		${CloseButton} {
			top: 35px;
			right: 50px;
			position: fixed;
			color: ${({ theme }) => theme.palette.primary.contrast};
		}
	`}
`;
