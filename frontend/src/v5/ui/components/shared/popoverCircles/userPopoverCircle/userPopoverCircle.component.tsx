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

import { HoverPopover } from '@controls/hoverPopover/hoverPopover.component';
import { TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { IPopoverCircle } from '../popoverCircle.styles';
import { UserPopover } from './userPopover/userPopover.component';
import { UserCircle } from './userCircle.component';

type UserPopoverCircleProps = IPopoverCircle & {
	username: string;
	className?: string;
};
export const UserPopoverCircle = ({ username, ...props }: UserPopoverCircleProps) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const user = UsersHooksSelectors.selectUser(teamspace, username);
	if (!user) return null;
	return (
		<HoverPopover
			anchor={() => (
				<UserCircle user={user} {...props} />
			)}
		>
			<UserPopover user={user} />
		</HoverPopover>
	);
};
