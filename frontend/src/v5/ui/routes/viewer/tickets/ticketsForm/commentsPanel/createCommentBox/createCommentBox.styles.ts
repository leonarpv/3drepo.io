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

import styled, { css } from 'styled-components';
import { Typography } from '@controls/typography';
import { FormTextAreaFixedSize } from '@controls/inputs/formInputs.component';
import { Container as TextAreaContainer } from '@controls/inputs/textArea/textAreaFixedSize.styles';
import { SubmitButton } from '@controls/submitButton';
import { ImageWithSkeleton } from '@controls/imageWithSkeleton/imageWithSkeleton.component';

export const Container = styled.section`
	display: flex;
	flex-direction: column;
	border: solid 0 ${({ theme }) => theme.palette.secondary.lightest};
	border-top-width: 1px;
	padding: 0 0 11px 15px;
	overflow-x: hidden;
`;

export const CommentReplyContainer = styled.div`
	position: relative;
	margin-top: 11px;
	margin-right: 15px;
`;

export const DeleteButton = styled.div<{ error?: boolean }>`
	position: absolute;
	z-index: 3;
	top: -7px;
	right: -7px;
	height: 24px;
	width: 24px;

	display: flex;
	align-items: center;
	justify-content: center;

	background: ${({ theme }) => theme.palette.primary.contrast};
	border-radius: 100%;
	box-shadow: 0 3px 8px 3px rgba(0, 0, 0, 0.15);
	cursor: pointer;

	svg {
		width: 10px;
	}
	
	${({ error, theme }) => error && css`
		background-color: ${theme.palette.error.lightest};
		color: ${theme.palette.error.main};
	`}
`;

export const Images = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 10px;
	width: 315px;

	&:not(:empty) {
		min-height: 54px;
	}
`;

export const ImageContainer = styled.div`
	position: relative;
	width: 44px;
	height: 44px;
`;

export const Image = styled(ImageWithSkeleton)<{ $error?: boolean }>`
	object-fit: cover;
	box-sizing: border-box;
	border-radius: 5px;
	overflow: hidden;
	width: 100%;
	height: 100%;

	&:is(img) {
		cursor: pointer;
	}

	${({ $error, theme }) => $error && css`
		border: solid 1px ${theme.palette.error.main};
	`}
`;

export const ErroredImageMessage = styled.div`
	color: ${({ theme }) => theme.palette.error.main};
`;

export const MessageInput = styled(FormTextAreaFixedSize)`
	.MuiInputBase-multiline {
		padding: 8px 15px 6px 0;
		line-height: 16px;
	}

	${TextAreaContainer} {
		border: none;
		box-shadow: none;
		padding: 0 3px 0 0;
	}
`;

export const Controls = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding-top: 6px;
	box-sizing: border-box;
	box-shadow: 0 0 9px 7px ${({ theme }) => theme.palette.primary.contrast};
	position: relative;
`;

export const CharsCounter = styled(Typography).attrs({
	variant: 'body1',
})<{ $error?: boolean }>`
	margin: 1px 0 0 11px;
	font-weight: 500;
	color: ${({ theme: { palette }, $error }) => ($error ? palette.error.main : palette.base.lighter)};
`;

export const FileIconInput = styled.div`
	cursor: pointer;
	display: flex;
	padding: 4px;
	color: ${({ theme }) => theme.palette.secondary.main};
`;

export const SendButton = styled(SubmitButton).attrs({
	color: 'primary',
	variant: 'contained',
})`
	margin: 0 15px 0 auto;
	border-radius: 50%;
	padding: 0;
	min-width: unset;
	width: 34px;
	height: 34px;
`;
