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

import * as Yup from 'yup';
import { formatMessage } from '../../services/intl';

export const CreateProjectSchema = Yup.object().shape({
	teamspace: Yup.string()
		.required(
			formatMessage({
				id: 'createProject.teamspace.error.required',
				defaultMessage: 'Teamspace is required',
			}),
		),
	projectName: Yup.string()
		.transform((value) => value.trim())
		.max(120, formatMessage({
			id: 'createProject.teamspace.error.max',
			defaultMessage: 'Project name is limited to 120 characters',
		}))
		.required(
			formatMessage({
				id: 'createProject.name.error.required',
				defaultMessage: 'Project name is required',
			}),
		)
		.matches(
			/^[^/?=#+]{0,119}[^/?=#+ ]{1}$/,
			formatMessage({
				id: 'createProject.teamspace.error.illegalCharacters',
				defaultMessage: 'Project name cannot contains the following characters: / ? = # +',
			}),
		)
		.test(
			'alreadyExistingProject',
			formatMessage({
				id: 'createProject.name.error.alreadyExisting',
				defaultMessage: 'This name is already taken',
			}),
			(projectName, { options, parent }) => (
				!(options.context.alreadyExistingProjectsByTeamspace[parent.teamspace] || []).includes(projectName)
			),
		),
});
