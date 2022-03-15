/**
 *  Copyright (C) 2017 3D Repo Ltd
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
import { ComponentType, PureComponent } from 'react';
import { DatePickerProps } from '@mui/lab/DatePicker';
import { DateTimePickerProps } from '@mui/lab/DateTimePicker';
import { TextField } from '@mui/material';
import { Container, StyledDatePicker, StyledDateTimePicker } from './dateField.styles';

interface IProps {
	value?: any;
	defaultValue?: any;
	initialFocusedDate?: any;
	name: string;
	disabled?: boolean;
	inputFormat?: string;
	placeholder?: string;
	className?: string;
	dateTime?: boolean;
	onChange?: (event) => void;
	onBlur?: (event) => void;
	shouldDisableDate?: (day: any) => boolean;
}

interface IState {
	value: any;
}

export class DateField extends PureComponent<IProps, IState> {
	public state = {
		value: new Date().valueOf()
	};

	public componentDidMount() {
		this.setState({
			value: this.props.value ? this.props.value : null
		});
	}

	public componentDidUpdate(prevProps) {
		if (prevProps.value !== this.props.value) {
			this.setState({
				value: this.props.value
			});
		}
	}

	public handleChange = (newDate) => {
		if (this.props.onChange) {
			this.props.onChange({
				target: {
					value: newDate.valueOf(),
					name: this.props.name,
				}
			});
		}
		this.setState({
			value: newDate.valueOf()
		});
	}

	public render() {
		const { value } = this.state;
		const { onBlur, name, placeholder, inputFormat, disabled, className, dateTime, defaultValue } = this.props;

		const Picker: ComponentType<DatePickerProps | DateTimePickerProps> = dateTime ? StyledDateTimePicker : StyledDatePicker;

		return (
			<Container className={className}>
				<Picker
					disabled={disabled}
					value={value}
					onChange={this.handleChange}
					inputFormat={inputFormat}
					shouldDisableDate={this.props.shouldDisableDate}
					renderInput={(params) => (
						<TextField
							placeholder={placeholder}
							defaultValue={defaultValue}
							name={name}
							onBlur={onBlur}
							{...params}
						/>
					)}
				/>
			</Container>
		);
	}
}
