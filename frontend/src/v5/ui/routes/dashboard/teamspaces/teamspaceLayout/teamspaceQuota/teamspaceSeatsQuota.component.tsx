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

import { isQuotaCapped, isQuotaUnlimited } from '@/v5/store/teamspaces/teamspaces.helpers';
import { QuotaInfoType } from '@/v5/store/teamspaces/teamspaces.redux';
import { FormattedMessage } from 'react-intl';
import SeatsIcon from '@assets/icons/seats.svg';
import { WarningIcon, QuotaValuesContainer } from './teamspaceQuota.styles';
import { StorageQuotaText } from './teamspaceStorageQuota.component';

type SeatsInfoProps = {
	seats: QuotaInfoType;
};

export const SeatsQuotaText = ({ seats }: SeatsInfoProps) => {
	if (isQuotaUnlimited(seats)) {
		return (
			<FormattedMessage
				id="teamspace.quota.unlimitedSeats"
				defaultMessage="Unlimited seats"
			/>
		);
	}

	return (
		<FormattedMessage
			id="teamspace.quota.seats"
			defaultMessage="{used} of {available} seats assigned"
			values={seats}
		/>
	);
};

export const SeatsQuota = ({ seats }: SeatsInfoProps) => {
	const Icon = isQuotaCapped(seats) ? WarningIcon : SeatsIcon;
	return (
		<QuotaValuesContainer $disabled={isQuotaUnlimited(seats)} $error={isQuotaCapped(seats)}>
			<Icon /><StorageQuotaText storage={seats} />
		</QuotaValuesContainer>
	);
};
