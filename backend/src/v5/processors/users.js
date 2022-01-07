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
const User = require('../models/users');
const { authenticate, canLogIn, getUserByUsername, updateProfile } = require('../models/users');

const Users = {};

Users.login = async (username, password) => {
	await canLogIn(username);
	return authenticate(username, password);
};


Users.getProfileByUsername = async (username) => {
	const user = await getUserByUsername(username, {
		user: 1,
		"customData.firstName" : 1,
		"customData.lastName" : 1,
		"customData.email" : 1,
		"customData.avatar" : 1,
		"customData.apiKey" : 1
	});

	const customData =  user.customData;

	return 	{
		username: user.user,
		firstName: customData.firstName,
		lastName: customData.lastName,
		email: customData.email,
		hasAvatar: !!customData.avatar,
		apiKey: customData.apiKey
	};
};

User.updateProfile = async (username, updatedProfile) => {
	await User.updateProfile(username, updateProfile);
}

Users.getUserByUsername = getUserByUsername;

module.exports = Users;
