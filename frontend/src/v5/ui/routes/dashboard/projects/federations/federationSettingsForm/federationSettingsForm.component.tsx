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

import React, { useEffect } from 'react';
import { formatMessage } from '@/v5/services/intl';
import { FormattedMessage } from 'react-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Select } from '@controls/select';
import { FormModal } from '@/v5/ui/controls/modal/formModal/formDialog.component';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router';
import { FederationsActionsDispatchers } from '@/v5/services/actionsDispatchers/federationsActions.dispatchers';
import { IFederation, EMPTY_VIEW, RawFederationSettings } from '@/v5/store/federations/federations.types';
import { ShareTextField } from '@controls/shareTextField';
import { FlexContainer, SectionTitle, Thumbnail, ThumbnailPlaceholder, SelectView, ViewLabel, MenuItemView, UnitTextField } from './federationSettingsForm.styles';

const UNITS = {
	mm: 'Millimetres',
	cm: 'Centimetres',
	dm: 'Decimetres',
	m: 'Metres',
	ft: 'Feet and inches',
};

interface IFormInput {
	name: string;
	unit: string;
	desc?: string;
	code?: string;
	defaultView: string;
	latitude: number;
	longitude: number;
	angleFromNorth: number;
	x: number;
	y: number;
	z: number;
}

const getDefaultValues = (federation: IFederation) => {
	const { unit = 'mm', angleFromNorth = 0 } = federation.settings || {};
	const {
		latLong,
		position,
	} = federation.settings?.surveyPoint || {};
	const [x, y, z] = position || [0, 0, 0];
	const [latitude, longitude] = latLong || [0, 0];
	const { code, name, description: desc } = federation;
	const defaultView = federation?.settings?.defaultView || EMPTY_VIEW._id;
	return {
		name,
		desc,
		code,
		unit,
		defaultView,
		latitude,
		longitude,
		angleFromNorth,
		x,
		y,
		z,
	};
};

const FederationSchema = Yup.object().shape({
	name: Yup.string()
		.min(2,
			formatMessage({
				id: 'federations.settings.name.error.min',
				defaultMessage: 'Federation Name must be at least 2 characters',
			}))
		.max(120,
			formatMessage({
				id: 'federations.settings.name.error.max',
				defaultMessage: 'Federation Name is limited to 120 characters',
			}))
		.required(
			formatMessage({
				id: 'federations.settings.name.error.required',
				defaultMessage: 'Federation Name is a required field',
			}),
		),
	desc: Yup.lazy((value) => (
		value === ''
			? Yup.string().strip()
			: Yup.string()
				.min(1,
					formatMessage({
						id: 'federations.settings.description.error.min',
						defaultMessage: 'Federation Description must be at least 1 character',
					}))
				.max(600,
					formatMessage({
						id: 'federations.settings.description.error.max',
						defaultMessage: 'Federation Description is limited to 600 characters',
					}))
	)),
	unit: Yup.string().required().default('mm'),
	code: Yup.lazy((value) => (
		value === ''
			? Yup.string().strip()
			: Yup.string()
				.min(1,
					formatMessage({
						id: 'federations.settings.code.error.min',
						defaultMessage: 'Code must be at least 1 character',
					}))
				.max(50,
					formatMessage({
						id: 'federations.settings.code.error.max',
						defaultMessage: 'Code is limited to 50 characters',
					}))
				.matches(/^[\w|_|-]*$/,
					formatMessage({
						id: 'federations.settings.code.error.characters',
						defaultMessage: 'Code can only consist of letters and numbers',
					}))
	)),
	defaultView: Yup.string()
		.nullable()
		.transform((value) => (value === EMPTY_VIEW._id ? null : value)),
	latitude: Yup.number().required(),
	longitude: Yup.number().required(),
	angleFromNorth: Yup.number()
		.min(0,
			formatMessage({
				id: 'federations.settings.angle.error.min',
				defaultMessage: 'Angle cannot be smaller than 0',
			}))
		.max(360,
			formatMessage({
				id: 'federations.settings.angle.error.max',
				defaultMessage: 'Angle cannot be greater than 360',
			}))
		.transform((value) => value ?? 0),
	x: Yup.number().required(),
	y: Yup.number().required(),
	z: Yup.number().required(),
});

const getThumbnailBasicPath = (teamspace: string, projectId: string, federationId: string) => (
	(viewId: string) => `teamspaces/${teamspace}/projects/${projectId}/federations/${federationId}/views/${viewId}/thumbnail`
);

type IFederationSettingsForm = {
	open: boolean;
	federation: IFederation;
	onClose: () => void;
};

export const FederationSettingsForm = ({ open, federation, onClose }: IFederationSettingsForm) => {
	let defaultValues = getDefaultValues(federation) as any;
	const {
		register,
		handleSubmit,
		reset,
		watch,
		control,
		formState,
		formState: { errors },
	} = useForm<IFormInput>({
		mode: 'onChange',
		resolver: yupResolver(FederationSchema),
		defaultValues,
	});

	const currentUnit = watch('unit');

	const { teamspace, project } = useParams() as { teamspace: string, project: string };
	const getThumbnail = getThumbnailBasicPath(teamspace, project, federation._id);

	useEffect(() => {
		defaultValues = getDefaultValues(federation) as any;
		reset(defaultValues);
		FederationsActionsDispatchers.fetchFederationSettings(teamspace, project, federation._id);
		FederationsActionsDispatchers.fetchFederationViews(teamspace, project, federation._id);
	}, [open]);

	const onSubmit: SubmitHandler<IFormInput> = ({
		latitude, longitude,
		x, y, z,
		...otherSettings
	}) => {
		const payload: RawFederationSettings = {
			surveyPoints: [{
				latLong: [latitude, longitude],
				position: [x, y, z],
			}],
			...otherSettings,
		};
		FederationsActionsDispatchers.updateFederationSettings(teamspace, project, federation._id, payload);
		onClose();
	};

	return (
		<FormModal
			title={formatMessage({ id: 'federations.settings.title', defaultMessage: 'Federation settings' })}
			open={open}
			onClickClose={onClose}
			onSubmit={handleSubmit(onSubmit)}
			confirmLabel={formatMessage({ id: 'federations.settings.ok', defaultMessage: 'Save Changes' })}
			isValid={formState.isValid}
		>
			<SectionTitle>Federation information</SectionTitle>
			<ShareTextField
				label="ID"
				value={federation._id}
				lightLabel
			/>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label={formatMessage({ id: 'federations.settings.form.name', defaultMessage: 'Name' })}
						required
						error={!!errors.name}
						helperText={errors.name?.message}
					/>
				)}
			/>
			<Controller
				name="desc"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						label={formatMessage({ id: 'federations.settings.form.description', defaultMessage: 'Description' })}
						error={!!errors.desc}
						helperText={errors.desc?.message}
					/>
				)}
			/>
			<FlexContainer>
				<FormControl>
					<InputLabel id="unit-label" required>
						<FormattedMessage id="federations.settings.form.unit" defaultMessage="Units" />
					</InputLabel>
					<Select
						labelId="unit-label"
						defaultValue={defaultValues.unit}
						{...register('unit')}
					>
						{Object.keys(UNITS).map((unit) => (
							<MenuItem key={unit} value={unit}>
								<FormattedMessage id={`federations.settings.form.unit.${unit}`} defaultMessage={UNITS[unit]} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Controller
					name="code"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label={formatMessage({ id: 'federation.settings.form.code', defaultMessage: 'Code' })}
							error={!!errors.code}
							helperText={errors.code?.message}
						/>
					)}
				/>
			</FlexContainer>
			<FormControl>
				<InputLabel id="default-view-label">
					<FormattedMessage id="federations.settings.form.view" defaultMessage="Default View" />
				</InputLabel>
				<SelectView
					labelId="default-view-label"
					defaultValue={defaultValues.defaultView}
					{...register('defaultView')}
				>
					{[EMPTY_VIEW].concat(federation.views || []).map((view) => (
						<MenuItemView
							key={view._id}
							value={view._id}
						>
							{view.hasThumbnail ? (
								<Thumbnail
									src={getThumbnail(view._id)}
									alt={view.name}
								/>
							) : (
								<ThumbnailPlaceholder />
							)}
							<ViewLabel>
								{view.name}
							</ViewLabel>
						</MenuItemView>
					))}
				</SelectView>
			</FormControl>
			<SectionTitle>GIS servey point</SectionTitle>
			<FlexContainer>
				<Controller
					name="latitude"
					control={control}
					render={({ field }) => (
						<UnitTextField
							{...field}
							labelname={formatMessage({ id: 'federations.settings.form.lat', defaultMessage: 'LATITUDE' })}
							labelunit={formatMessage({ id: 'federations.settings.form.lat.unit', defaultMessage: 'decimal' })}
							type="number"
							error={!!errors.latitude}
							helperText={errors.latitude?.message}
							required
						/>
					)}
				/>
				<Controller
					name="longitude"
					control={control}
					render={({ field }) => (
						<UnitTextField
							{...field}
							labelname={formatMessage({ id: 'federations.settings.form.long', defaultMessage: 'LONGITUDE' })}
							labelunit={formatMessage({ id: 'federations.settings.form.long.unit', defaultMessage: 'decimal' })}
							type="number"
							error={!!errors.longitude}
							helperText={errors.longitude?.message}
							required
						/>
					)}
				/>
			</FlexContainer>
			<Controller
				name="angleFromNorth"
				control={control}
				render={({ field }) => (
					<UnitTextField
						{...field}
						labelname={formatMessage({ id: 'federations.settings.form.angleFromNorth', defaultMessage: 'ANGLE FROM NORTH' })}
						labelunit={formatMessage({ id: 'federations.settings.form.angleFromNorth.unit', defaultMessage: 'clockwise degrees' })}
						error={!!errors.angleFromNorth}
						helperText={errors.angleFromNorth?.message}
						type="number"
					/>
				)}
			/>
			<FlexContainer>
				<Controller
					name="x"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="X"
							labelunit={currentUnit}
							type="number"
							error={!!errors.x}
							helperText={errors.x?.message}
							required
							{...field}
						/>
					)}
				/>
				<Controller
					name="y"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="Y"
							labelunit={currentUnit}
							type="number"
							error={!!errors.y}
							helperText={errors.y?.message}
							required
							{...field}
						/>
					)}
				/>
				<Controller
					name="z"
					control={control}
					render={({ field }) => (
						<UnitTextField
							labelname="Z"
							labelunit={currentUnit}
							type="number"
							error={!!errors.z}
							helperText={errors.z?.message}
							required
							{...field}
						/>
					)}
				/>
			</FlexContainer>
		</FormModal>
	);
};
