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

const {
	hasCommenterAccessToContainer, hasCommenterAccessToFederation, hasReadAccessToContainer,
	hasReadAccessToFederation, hasWriteAccessToContainer, hasWriteAccessToFederation,
} = require('./components/models');
const { convertAllUUIDs } = require('../dataConverter/pathParams');
const { isTeamspaceMember } = require('./components/teamspaces');
const { validSession } = require('../auth');
const { validateMany } = require('../common');

const Permissions = {};

Permissions.hasAccessToTeamspace = validateMany([convertAllUUIDs, validSession, isTeamspaceMember]);
Permissions.hasReadAccessToContainer = validateMany([Permissions.hasAccessToTeamspace, hasReadAccessToContainer]);
Permissions.hasCommenterAccessToContainer = validateMany([
	Permissions.hasAccessToTeamspace, hasCommenterAccessToContainer]);
Permissions.hasWriteAccessToContainer = validateMany([Permissions.hasAccessToTeamspace, hasWriteAccessToContainer]);
Permissions.hasReadAccessToFederation = validateMany([Permissions.hasAccessToTeamspace, hasReadAccessToFederation]);

Permissions.hasCommenterAccessToFederation = validateMany([
	Permissions.hasAccessToTeamspace, hasCommenterAccessToFederation]);
Permissions.hasWriteAccessToFederation = validateMany([Permissions.hasAccessToTeamspace, hasWriteAccessToFederation]);

module.exports = Permissions;