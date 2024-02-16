/**
 *  Copyright (C) 2024 3D Repo Ltd
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

import { ITicketComment, TicketCommentReplyMetadata } from '@/v5/store/tickets/comments/ticketComments.types';
import { CommentImages } from '../commentImages/commentImages.component';
import { CommentAuthor } from './commentNonMessageContent.styles';
import { CommentReply } from '../commentReply/commentReply.component';
import { useState } from 'react';
import { ImagesModal } from '@components/shared/modalsDispatcher/templates/imagesModal/imagesModal.component';
import { getImgSrc } from '@/v5/store/tickets/tickets.helpers';

export type CommentNonMessageContentProps = Partial<Omit<ITicketComment, 'history' | '_id'>> & {
	metadata?: TicketCommentReplyMetadata;
	isCurrentUserComment?: boolean;
	onUploadImages?: () => void;
	onDeleteImage?: (index) => void;
};
export const CommentNonMessageContent = ({
	author,
	images = [],
	metadata,
	isCurrentUserComment = true,
	onUploadImages,
	onDeleteImage,
}: CommentNonMessageContentProps) => {
	const [displayImageIndex, setDisplayImageIndex] = useState(-1);
	const modalIsOpen = displayImageIndex !== -1;

	return (
		<>
			{images.length === 1 && (
				<CommentImages images={images} onImageClick={setDisplayImageIndex} />
			)}
			{author && (<CommentAuthor>{author}</CommentAuthor>)}
			{metadata && (
				<CommentReply
					variant={isCurrentUserComment ? 'secondary' : 'primary'}
					{...metadata}
				/>
			)}
			{images.length > 1 && (
				<CommentImages images={images} onImageClick={setDisplayImageIndex} />
			)}
			{modalIsOpen && (
				<ImagesModal
					open
					images={images.map(getImgSrc)}
					onClickClose={() => setDisplayImageIndex(-1)}
					displayImageIndex={displayImageIndex}
					onUpload={onUploadImages}
					onDelete={onDeleteImage}
				/>
			)}
		</>
	);
};
