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
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { FormDatePicker } from '@controls/formDatePicker/formDatePicker.component';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormContainer } from './FormInput.styles';

export default {
	title: 'Inputs/FormDatePicker',
	argTypes: {
		disablePast: {
			type: 'boolean',
		},
		disabled: {
			type: 'boolean',
		},
		formError: {
			type: 'string',
		},
	},
	component: FormDatePicker,
	parameters: { controls: { exclude: ['control', 'name'] } },
} as ComponentMeta<typeof FormDatePicker>;

const Controlled: ComponentStory<typeof FormDatePicker> = ({ formError, ...args }: any) => {
	const { control } = useForm({ mode: 'onChange' });

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<FormContainer>
				<FormDatePicker
					name="date-picker"
					control={control}
					{...args}
					formError={formError ? { message: formError } : null}
				/>
			</FormContainer>
		</LocalizationProvider>
	);
};

export const ControlledFormDatePicker = Controlled.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
ControlledFormDatePicker.args = {
	label: 'Controlled Date Picker input',
};
