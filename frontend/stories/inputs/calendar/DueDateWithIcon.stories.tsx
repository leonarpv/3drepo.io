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
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DatePicker } from '@controls/inputs/datePicker/datePicker.component';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DueDateWithIcon } from '@controls/dueDate/dueDateWithIcon/dueDateWithIcon.component';
import { useState } from 'react';
import { FormContainer } from '../FormInput.styles';

export default {
	title: 'Inputs/Calendar/DueDateWithIcon',
	argTypes: {
		disablePast: {
			type: 'boolean',
		},
		disabled: {
			type: 'boolean',
		},
		tooltip: {
			type: 'string',
			defaultValue: 'Set date',
		},
	},
	component: DueDateWithIcon,
	parameters: { controls: { exclude: [
		'onBlur',
		'error',
		'name',
		'label',
		'helperText',
		'onChange',
		'className',
		'inputRef',
		'PickerComponent',
	] } },
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DueDateWithIcon> = ({ value: initialValue, ...args }) => {
	const [value, setValue] = useState(initialValue);
	const onBlur = (newValue) => {
		setValue(newValue);
	};
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<FormContainer>
				<DueDateWithIcon {...args} onBlur={onBlur} value={value} />
			</FormContainer>
		</LocalizationProvider>
	);
};

export const UnsetValue = Template.bind({});

export const PresetValue = Template.bind({});
PresetValue.args = {
	value: new Date(),
	tooltip: 'this is a custom tooltip',
};