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

import { InputsContainer, Buttons } from '@/v5/ui/routes/viewer/tickets/ticketsForm/ticketGroups/groups/groupRulesForm/groupRulesForm.styles';
import styled from 'styled-components';

export const Container = styled.div`
	${InputsContainer} {
		padding: 0;
		overflow: unset;
		max-height: unset;
		display: flex;
		flex-direction: column;

		.MuiFormControl-root.MuiTextField-root {
			width: 285px;
		}
	}

	${Buttons} {
		& > :first-child {
			display: none;
		}
		
		& > :last-child {
			margin: 14px -13px 0 0;
		}
	}
`;
