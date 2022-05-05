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

import { css } from 'styled-components';
import { FieldsRow } from '@/v4/routes/viewerGui/components/risks/components/riskDetails/riskDetails.styles';
import { ResourcesContainer } from '@/v4/routes/components/resources/resources.styles';
import { Form } from '@controls/modal/formModal/formDialog.styles';
import { DialogTabs, VisualSettingsButtonsContainer } from '@/v4/routes/components/topMenu/components/visualSettingsDialog/visualSettingsDialog.styles';
import { AddLinkContainer, ResourcesListContainer, ResourcesListScroller } from '@/v4/routes/components/resources/attachResourcesDialog/attachResourcesDialog.styles';
import { LabelButton } from '@/v4/routes/viewerGui/components/labelButton/labelButton.styles';
import { labelButtonPrimaryStyles } from '@controls/button/button.styles';

export const AttachResourcesFile = css`
`;

export const AttachResourcesLink = css`
	${ResourcesListScroller} {
		margin-top: 0px;
		overflow-y: overlay;
		max-height: 207px;

		${ResourcesListContainer} {
			width: 100%;
			box-sizing: border-box;
			padding: 0 28px;

			${FieldsRow} {
				&:first-of-type {
					margin-top: 20px;
				}

				button {
					margin: 0 0 8px 8px;
				}
			}
		}
	}

	${AddLinkContainer} {
		padding: 28px 0;
		margin: 0 28px;
		// TODO - fix after new palette is released
		border-top: solid 1px #e0e5f0;

		${LabelButton} {
			${labelButtonPrimaryStyles}
			text-decoration: none !important;
			padding: 4px 19px;
			margin: 0;
			border-radius: 5px;
		}
	}
`;

// used in the attach resources modal styling file
export const AttachResourcesModalStyling = css`
	padding: 0;

	.MuiDialogContent-root {
		padding: 0px;
		overflow-x: hidden;
	}

	${DialogTabs} {
		padding-left: 10px;
		box-shadow: 0px 1px 10px rgba(23, 43, 77, 0.15);
	}

	${VisualSettingsButtonsContainer} {
		display: flex;
		justify-content: flex-end;
		position: unset;
		box-shadow: 0px 6px 10px rgb(0 0 0 / 14%),
					0px 1px 18px rgb(0 0 0 / 12%),
					0px 3px 5px rgb(0 0 0 / 20%);
		padding: 8px;
		box-sizing: border-box;
	}

	${Form}${Form} {
		padding-bottom: 0;
		height: fit-content;
	}
`;

export default css`
	${ResourcesContainer} {
		${FieldsRow} {
			justify-content: flex-start;
		}
	}
`;
