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
import { Form as FormBase } from '@controls/modal/formModal/formDialog.styles';
import { V5ModalContainer } from './../dialog.styles';
import {
	AttachResourcesModalStyling,
	AttachResourcesFile,
	AttachResourcesLink,
} from '../../overrides/issues/attachments.overrides';

export const Form = styled(FormBase).attrs({
	as: 'div',
})``;

export const Container = styled(V5ModalContainer)`
	${AttachResourcesModalStyling}
	${AttachResourcesFile}
	${AttachResourcesLink}
`;