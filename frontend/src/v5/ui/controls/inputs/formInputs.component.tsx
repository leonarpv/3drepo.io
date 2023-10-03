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

import { ChipSelect, ChipSelectProps } from '@controls/chip/chipSelect/chipSelect.component';
import { DueDateWithIcon, DueDateWithIconProps } from '@controls/dueDate/dueDateWithIcon/dueDateWithIcon.component';
import { forwardRef } from 'react';
import { AssigneesSelect, AssigneesSelectProps } from '@controls/assigneesSelect/assigneesSelect.component';
import { Checkbox, CheckboxProps } from './checkbox/checkbox.component';
import { InputController, InputControllerProps } from './inputController.component';
import { NumberField } from './numberField/numberField.component';
import { PasswordField } from './passwordField/passwordField.component';
import { Select, SelectProps } from './select/select.component';
import { SelectView, SelectViewProps } from './selectView/selectView.component';
import { TextArea, TextAreaProps } from './textArea/textArea.component';
import { TextAreaFixedSize, TextAreaFixedSizeProps } from './textArea/textAreaFixedSize.component';
import { TextField, TextFieldProps } from './textField/textField.component';

// text inputs
export const FormNumberField = (props: InputControllerProps<TextFieldProps>) => (<InputController Input={NumberField} {...props} />);
export const FormPasswordField = (props: InputControllerProps<TextFieldProps>) => (<InputController Input={PasswordField} {...props} />);
export const FormTextField = (props: InputControllerProps<TextFieldProps>) => (<InputController Input={TextField} {...props} />);
export const FormTextArea = (props: InputControllerProps<TextAreaProps>) => (<InputController Input={TextArea} {...props} />);
export const FormTextAreaFixedSize = forwardRef((props: InputControllerProps<TextAreaFixedSizeProps>, ref) => (<InputController Input={TextAreaFixedSize} {...props} ref={ref} />));

// calendar inputs
export const FormDueDateWithIcon = (props: InputControllerProps<DueDateWithIconProps>) => (<InputController Input={DueDateWithIcon} {...props} />);

// select inputs
export const FormSelectView = (props: InputControllerProps<SelectViewProps>) => (<InputController Input={SelectView} {...props} />);
export const FormSelect = (props: InputControllerProps<SelectProps>) => (<InputController Input={Select} {...props} />);
export const FormChipSelect = (props: InputControllerProps<ChipSelectProps>) => (<InputController Input={ChipSelect} {...props} />);
export const FormAssigneesSelect = (props: InputControllerProps<AssigneesSelectProps>) => (<InputController Input={AssigneesSelect} {...props} />);

// control inputs
export const FormCheckbox = (props: InputControllerProps<CheckboxProps>) => (<InputController Input={Checkbox} {...props} />);
