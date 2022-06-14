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

const { addDefaultJobs, assignUserToJob, getJobsToUsers } = require('../../models/jobs');
const { createTeamspaceRole, grantTeamspaceRoleToUser, revokeTeamspaceRoleFromUser } = require('../../models/roles');
const { createTeamspaceSettings, getMembersInfo, removeUserFromAdminPrivilege } = require('../../models/teamspaces');
const { getAccessibleTeamspaces, getAvatar, grantAdminToUser } = require('../../models/users');
const { DEFAULT_OWNER_JOB } = require('../../models/jobs.constants');
const { isTeamspaceAdmin } = require('../../utils/permissions/permissions');
const { logger } = require('../../utils/logger');

const { removeUserFromAllModels } = require('../../models/modelSettings');
const { removeUserFromAllProjects } = require('../../models/projectSettings');

const Teamspaces = {};

Teamspaces.getAvatar = getAvatar;

Teamspaces.initTeamspace = async (username) => {
	try {
		await Promise.all([
			createTeamspaceRole(username),
			addDefaultJobs(username),
		]);
		await Promise.all([
			grantTeamspaceRoleToUser(username, username),
			createTeamspaceSettings(username),
			grantAdminToUser(username, username),
			assignUserToJob(username, DEFAULT_OWNER_JOB, username),
		]);
	} catch (err) {
		logger.logError(`Failed to initialize teamspace for ${username}`);
	}
};

Teamspaces.removeTeamspaceMember = async (teamspace, user) => {
	// Clean up all possible permissions
	await Promise.all([
		removeUserFromAllModels(teamspace, user),
		removeUserFromAllProjects(teamspace, user),
		removeUserFromAdminPrivilege(teamspace, user),
	]);
	await revokeTeamspaceRoleFromUser(teamspace, user);
};

Teamspaces.getTeamspaceListByUser = async (user) => {
	const tsList = await getAccessibleTeamspaces(user);
	return Promise.all(tsList.map(async (ts) => ({ name: ts, isAdmin: await isTeamspaceAdmin(ts, user) })));
};

Teamspaces.getTeamspaceMembersInfo = async (teamspace) => {
	const [membersList, jobsList] = await Promise.all([
		getMembersInfo(teamspace),
		getJobsToUsers(teamspace),
	]);

	const usersToJob = {};
	jobsList.forEach(({ _id, users }) => {
		users.forEach((user) => {
			usersToJob[user] = _id;
		});
	});

	return membersList.map(
		(member) => (usersToJob[member.user] ? { ...member, job: usersToJob[member.user] } : member),
	);
};

module.exports = Teamspaces;
