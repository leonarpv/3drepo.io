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

import { forwardRef, ComponentProps } from 'react';
import { Checkbox } from './checkbox/checkbox.component';
import { DatePicker } from './datePicker/datePicker.component';
import { DateTimePicker } from './datePicker/dateTimePicker.component';
import { InputController, InputControllerProps } from './inputController.component';
import { MultiSelect } from './multiSelect/multiSelect.component';
import { NumberField } from './numberField/numberField.component';
import { PasswordField } from './passwordField/passwordField.component';
import { Select } from './select/select.component';
import { SelectView } from './selectView/selectView.component';
import { TextArea } from './textArea/textArea.component';
import { TextAreaFixedSize } from './textArea/textAreaFixedSize.component';
import { TextField } from './textField/textField.component';
import { Toggle } from './toggle/toggle.component';

// @ts-ignore
type FormType<T> = Omit<InputControllerProps<ComponentProps<T>>, 'Input'>;

// text inputs
export const FormNumberField = (props: FormType<typeof NumberField>) => (<InputController Input={NumberField} {...props} />);
export const FormPasswordField = (props: FormType<typeof PasswordField>) => (<InputController Input={PasswordField} {...props} />);
export const FormTextField = (props: FormType<typeof TextField>) => (<InputController Input={TextField} {...props} />);
export const FormTextArea = (props: FormType<typeof TextArea>) => (<InputController Input={TextArea} {...props} />);
export const FormTextAreaFixedSize = (props: FormType<typeof TextAreaFixedSize>) => (<InputController Input={TextAreaFixedSize} {...props} />);

// calendar inputs
export const FormDatePicker = (props: FormType<typeof DatePicker>) => (<InputController Input={DatePicker} {...props} />);
export const FormDateTimePicker = (props: FormType<typeof DateTimePicker>) => (<InputController Input={DateTimePicker} {...props} />);

// select inputs
export const FormMultiSelect = (props: FormType<typeof MultiSelect>) => (<InputController Input={MultiSelect} {...props} />);
export const FormSelectView = (props: FormType<typeof SelectView>) => (<InputController Input={SelectView} {...props} />);
export const FormSelect = (props: FormType<typeof Select>) => (<InputController Input={Select} {...props} />);

// control inputs
export const FormCheckbox = (props: FormType<typeof Checkbox>) => (<InputController Input={Checkbox} {...props} />);
export const FormToggle = (props: FormType<typeof Toggle>) => (<InputController Input={Toggle} {...props} />);
