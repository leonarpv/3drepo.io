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

import { BodyWrapper as CustomTableBody, Cell, Head, Row } from '@/v4/routes/components/customTable/customTable.styles';
import styled, { css } from 'styled-components';
import { Name as UserNameCell } from '@/v4/routes/components/userItem/userItem.styles';
import { SortLabel } from '@/v4/routes/components/customTable/components/tableHeading/tableHeading.styles';
import { PermissionsCellContainer } from '@/v4/routes/components/permissionsTable/permissionsTable.styles';
import { RadioContainer as TableHeadingRadioContainer } from '@/v4/routes/components/customTable/components/tableHeadingRadio/tableHeadingRadio.styles';
import { SearchField } from '@/v4/routes/components/customTable/components/cellUserSearch/cellUserSearch.styles';

// all the .simplebar-... stuff is to disable simplebar
const customTableStyling = css`
	${CustomTableBody} {
		position: relative;
		height: auto;
	}

	${CustomTableBody} div {
		position: relative;
		height: auto;
	}

	${CustomTableBody} .simplebar-content {
		border: 1px solid ${({ theme }) => theme.palette.base.lightest};
		border-radius: 5px;
		background-color: ${({ theme }) => theme.palette.primary.contrast};
	}

	${CustomTableBody} .simplebar-content-wrapper {
		height: auto !important;
		max-height: initial;
	}

	${CustomTableBody} .simplebar-placeholder {
		display: none;
	}

	${Head} {
		border: 0;

		${Cell} {
			padding-top: 22px;
		}
	}

	${UserNameCell} {
		${({ theme }) => theme.typography.h5};
		color: ${({ theme }) => theme.palette.secondary.main};
	}

	${Row} {
		min-height: 80px;
	}

	${SortLabel} {
		margin: 0;
		padding-left: 10px;
		${({ theme }) => theme.typography.kicker};
		flex-direction: row;
		svg {
			fill: transparent;
			width: 10px;
			margin-left: 2px;
		}
	}

	${SortLabel}.MuiTableSortLabel-active {
		svg {
			fill: ${({ theme }) => theme.palette.base.main};
		}
	}

	/* stylelint-disable */
	${SortLabel}::before {
		background: transparent;
	}
	/* stylelint-enable */

	${PermissionsCellContainer} {
		justify-content: flex-start;
	}

	${TableHeadingRadioContainer} {
		justify-content: flex-start;
		align-items: baseline;
		margin-top: -22px;
	}

	${SearchField} {
		label, input {
			${({ theme }) => theme.typography.kicker};
		}

		.search-field__label {
			margin-top: 3px;
			transform: translate(13px,41px) scale(1);

			&[data-shrink='true'] {
				transform: translate(13px, 20px) scale(1) !important;
			}
		}
	}
`;

export const V4OverridesContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;

	${customTableStyling}
`;
