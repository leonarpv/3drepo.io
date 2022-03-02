/**
 *  Copyright (C) 2021 3D Repo Ltd
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

import { Select } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Field, Form, Formik } from 'formik';
import { isEqual } from 'lodash';
import { PureComponent } from 'react';
import * as Yup from 'yup';

import { GROUPS_TYPES, GROUPS_TYPES_LIST } from '../../../../../../constants/groups';
import { formatDateTime } from '../../../../../../services/formatting/formatDate';
import { VALIDATIONS_MESSAGES } from '../../../../../../services/validation';
import { Description, FieldsRow, LongLabel, StyledFormControl, StyledTextField } from './groupDetails.styles';

const GroupSchema = Yup.object().shape({
	desc: Yup.string().max(220, VALIDATIONS_MESSAGES.TOO_LONG_STRING)
});

interface IGroup {
	_id: string;
	updatedAt: number;
	type: string;
	desc: string;
	name: string;
	color: string;
	rules: any[];
	totalSavedMeshes: number;
	objects: object[];
}

interface IProps {
	group: IGroup;
	currentUser: any;
	totalMeshes: number;
	canUpdate: boolean;
	fieldNames: any[];
	selectedNodes: any[];
	handleChange: (event) => void;
}

export class GroupDetailsForm extends PureComponent<IProps, any> {
	get isNewGroup() {
		return !this.props.group._id;
	}

	public handleFieldChange = (onChange, form) => (event) => {
		event.persist();
		onChange(event);
		this.props.handleChange(event);
	}

	public renderTypeSelectItems = () => {
		return GROUPS_TYPES_LIST.map(({ label, type }) => (
			<MenuItem key={type} value={type}>{label}</MenuItem>
		));
	}

	public render() {
		const {
			group: { updatedAt, type, desc, name, color, rules, totalSavedMeshes }
		} = this.props;
		const initialValues = { type, desc , name, color, rules };

		return (
			<Formik
				initialValues={initialValues}
				validateOnBlur={false}
				validateOnChange={false}
				validationSchema={GroupSchema}
				onSubmit={() => null}
				enableReinitialize
			>
				<Form>
					<FieldsRow>
						<StyledTextField
							label={<LongLabel>Number of objects</LongLabel>}
							value={totalSavedMeshes || 0}
							disabled
						/>
						<StyledTextField
							label="Last updated"
							value={formatDateTime(updatedAt)}
							disabled
						/>
						<StyledFormControl>
							<InputLabel>Group type</InputLabel>
							<Field name="type" render={({ field, form }) => (
								<Select
									{...field}
									disabled={!this.props.canUpdate}
									onChange={this.handleFieldChange(field.onChange, form)}
								>
									{this.renderTypeSelectItems()}
								</Select>
							)} />
						</StyledFormControl>
					</FieldsRow>
					<Field name="desc" render={({ field, form }) => (
						<Description
							{...field}
							onChange={this.handleFieldChange(field.onChange, form)}
							validationSchema={GroupSchema}
							fullWidth
							multiline
							label="Description"
							error={Boolean(form.errors.desc)}
							helperText={form.errors.desc}
							disabled={!this.props.canUpdate}
							mutable={!this.isNewGroup}
							placeholder="(No description)"
						/>
					)} />
				</Form>
			</Formik>
		);
	}
}
