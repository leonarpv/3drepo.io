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

export const USE_BETA_VIEWER = 'useBetaViewer';
export const setUseBetaViewer = (useBetaViewer = true) => localStorage.setItem(USE_BETA_VIEWER, JSON.stringify(useBetaViewer));
export const getUseBetaViewer = () => {
	const value = JSON.parse(localStorage.getItem(USE_BETA_VIEWER));
	return value !== null ? value : true;
};
