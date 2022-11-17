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
import { Controller } from 'react-hook-form';
import { PropertyProps } from './properties.types';
import { TicketImage } from './basicTicketImage/ticketImage/ticketImage.component';

export const ImageProperty = ({
	property: { name: title, readOnly, required },
	name,
	defaultValue,
	onBlur,
	formError,
	...props
}: PropertyProps) => (
	<Controller
		name={name}
		defaultValue={defaultValue}
		render={({ field: { ref, ...field } }) => (
			<TicketImage
				{...field}
				title={title}
				disabled={readOnly}
				required={required}
				error={!!formError}
				helperText={formError?.message}
				{...props}
			/>
		)}
	/>
);
