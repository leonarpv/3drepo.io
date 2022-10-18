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

import { FormTextArea } from '@controls/formTextArea/formTextArea.component';
import styled from 'styled-components';

export const PanelsContainer = styled.div`
	display: contents;

	.MuiAccordion-root {
		&:first-of-type {
			border-radius: 6px 6px 0 0;
		}

		&:not(:first-of-type) {
			border-top: 0;
		}

		&:last-of-type {
			border-radius: 0 0 6px 6px;
		}

		.MuiAccordionDetails-root > :not(:first-child) {
			margin-top: 10px;
		}
	}
`;

export const FormTitle = styled(FormTextArea).attrs({
	minRows: 1,
	inputProps: { maxLength: 120 },
})`
	box-shadow: 0px 6px 10px rgb(0 0 0 / 4%);
    position: relative;
    z-index: 1;

	& > .MuiInputBase-root {
		padding: 15px 18px;
		border-radius: 0;

		textarea {
			${({ theme }) => theme.typography.h3}
		}

		&, &:hover, &.Mui-focused:not(.Mui-disabled) {
			fieldset {
				box-shadow: none;
				border: none;
				border-radius: 0;
			}
		}
	}
`;
