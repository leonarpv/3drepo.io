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
import { ProjectsHooksSelectors } from '@/v5/services/selectorsHooks/projectsSelectors.hooks';
import { useContext, useEffect } from 'react';
import { isUndefined } from 'lodash';
import { Action } from './ticketImageAction.styles';
import { TicketImageActionContext } from './ticketImageActionContext';

type TicketImageActionProps = {
	onImageChange?: any;
	onClick?: any;
	children: any;
	disabled?: boolean;
};
export const TicketImageAction = ({
	onImageChange,
	onClick,
	disabled:
	disabledInput,
	...props
}: TicketImageActionProps) => {
	const context = useContext(TicketImageActionContext);
	const { isAdmin } = ProjectsHooksSelectors.selectCurrentProjectDetails();
	const disabled = !isUndefined(disabledInput) ? disabledInput : !isAdmin;

	const handleClick = (e) => {
		if (!disabled) {
			onClick?.(context);
		} else {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	useEffect(() => {
		if (isAdmin) (onImageChange?.(context));
	}, [context.imgSrc]);

	return (<Action onClick={handleClick} disabled={disabled} {...props} />);
};
