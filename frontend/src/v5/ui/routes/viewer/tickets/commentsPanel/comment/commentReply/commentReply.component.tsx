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

import { CurrentUserHooksSelectors, TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { CommentReplyMetadata } from '@/v5/store/tickets/tickets.types';
import { CommentAuthor } from '../comment.styles';
import { CommentMarkDown } from '../commentMarkDown/commentMarkDown';
import { CommentReplyContainer } from './commentReply.styles';

type CommentReplyProps = CommentReplyMetadata & {
	variant?: 'primary' | 'secondary',
	isCurrentUserComment?: boolean,
	shortMessage?: boolean,
};
export const CommentReply = ({ message, author, variant = 'primary', isCurrentUserComment = true, ...props }: CommentReplyProps) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const user = UsersHooksSelectors.selectUser(teamspace, author);
	const currentUser = CurrentUserHooksSelectors.selectUsername();

	const authorDisplayName = (isCurrentUserComment && author === currentUser) ? '' : `${user.firstName} ${user.lastName}`;

	return (
		<CommentReplyContainer variant={variant} {...props}>
			<CommentAuthor>{authorDisplayName}</CommentAuthor>
			<CommentMarkDown>{message}</CommentMarkDown>
		</CommentReplyContainer>
	);
};
