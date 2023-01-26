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

import { CurrentUserHooksSelectors } from '@/v5/services/selectorsHooks';
import { MinimumComment } from '@/v5/store/tickets/tickets.types';
import { useEffect, useState } from 'react';
import { getRelativeTime } from './comment.helpers';
import { extractComment, extractMetadata } from './commentMarkDown/commentMarkDown.helpers';
import { CurrentUserComment } from './currentUserComment/currentUserComment.component';
import { OtherUserComment } from './otherUserComment/otherUserComment.component';

export type CommentProps = MinimumComment & {
	onDelete?: (commentId) => void;
	onReply: (commentId) => void;
	// TODO - check newComment type
	onEdit?: (commentId, newComment: string) => void;
};

export const Comment = ({ createdAt, author, comment: commentWithMetdata, ...props }: CommentProps) => {
	const [commentAge, setCommentAge] = useState(getRelativeTime(createdAt));

	const isCurrentUser = CurrentUserHooksSelectors.selectUsername() === author;
	const metadata = extractMetadata(commentWithMetdata);
	const comment = extractComment(commentWithMetdata);

	const UserComment = isCurrentUser ? CurrentUserComment : OtherUserComment;

	useEffect(() => {
		const intervalId = window.setInterval(() => setCommentAge(getRelativeTime(createdAt)), 10_000);
		return () => clearInterval(intervalId);
	}, []);

	return (<UserComment {...props} author={author} commentAge={commentAge} metadata={metadata} comment={comment} />);
};
