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
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

interface IProps {
	content?: string;
	message: string;
	status: string;
	handleResolve: () => void;
}

export const RedirectToTeamspaceDialog = ({ content, message, status, handleResolve }: IProps) => {
	return (
		<>
			<DialogContent>
				{content}
				<br /><br />
				<strong>{message}</strong>
				<br />
				{status && (<code>(Status Code: {status})</code>)}
				<br /><br />
				If this is unexpected please message support@3drepo.com.
			</DialogContent>

			<DialogActions>
				<Button onClick={handleResolve} variant="contained" color="secondary">Back to teamspace</Button>
			</DialogActions>
		</>
	);
};
