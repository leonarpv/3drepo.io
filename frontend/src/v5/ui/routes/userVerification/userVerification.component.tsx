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
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyUser } from '@/v5/services/api/signup';
import { FormattedMessage } from 'react-intl';
import { formatMessage } from '@/v5/services/intl';
import { AuthTemplate, Title, Message, BackToLogin, BackToLoginContainer } from './userVerification.styles';

export const UserVerification = () => {
	const [message, setMessage] = useState('');
	const { search } = useLocation();
	const searchQuery = new URLSearchParams(search);

	useEffect(() => {
		const token = searchQuery.get('token');
		const username = searchQuery.get('username');

		if (!token || !username) {
			setMessage(formatMessage({
				id: 'userVerification.missingParameter',
				defaultMessage: 'Can\'t verify: Token and/or Username not provided.',
			}));
			return;
		}
		
		verifyUser(token, username)
			.then(() => {
				setMessage(formatMessage({
					id: 'userVerification.success',
					defaultMessage: 'Your account has been verified. You can now login.',
				}));
			})
			.catch((e) => {
				const errorMessage = e.response?.data?.message; 
				if (errorMessage === 'Already verified') {
					setMessage(formatMessage({
						id: 'userVerification.alreadyVerified',
						defaultMessage: 'Account already verified.',
					}));
				} else if (errorMessage === 'Token is invalid or expired') {
					setMessage(formatMessage({
						id: 'userVerification.tokenInvalid',
						defaultMessage: 'Token is invalid or expired.',
					}));
				}
			});
	}, []);

	return (
		<AuthTemplate>
			<Title>
				<FormattedMessage
					id="userVerification.title"
					defaultMessage="Registration complete"
				/>
			</Title>
			<Message>
				{message}
			</Message>
			<BackToLoginContainer>
				<BackToLogin>
					<FormattedMessage
						id="userVerification.backToLogin"
						defaultMessage="Back to login"
					/>
				</BackToLogin>
			</BackToLoginContainer>
		</AuthTemplate>
	);
};
