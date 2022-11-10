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

import { formatDate } from '@/v5/services/intl';
import { FormattedMessage } from 'react-intl';
import { DateContainer, EmptyDateContainer } from './dueDate.styles';

type IDueDate = {
	value: number;
	onClick?: (event) => void;
};

export const DueDate = ({ value, onClick }: IDueDate) => {
	if (!value) {
		return (
			<EmptyDateContainer onClick={onClick}>
				<FormattedMessage id="dueDate.emptyText" defaultMessage="Set Due Date" />
			</EmptyDateContainer>
		);
	}
	const isOverdue = value < Date.now();
	const formattedDate = formatDate(value);
	return (
		<DateContainer isOverdue={isOverdue} onClick={onClick}>
			{isOverdue ? (
				<FormattedMessage id="dueDate.overdue" defaultMessage="Overdue {date}" values={{ date: formattedDate }} />
			) : (
				<FormattedMessage id="dueDate.due" defaultMessage="Due {date}" values={{ date: formattedDate }} />
			)}
		</DateContainer>
	);
};
