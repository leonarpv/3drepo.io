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

const config = require('../../../utils/config');

const AadConstants = {};

const createRedirectUri = (redirectEndpoint) => `${config.sso.aad.redirectDomain || config.api_server.url}
    /v5/sso/aad${redirectEndpoint}`;

AadConstants.authenticateRedirectEndpoint = '/authenticate-post';
AadConstants.authenticateRedirectUri = createRedirectUri(AadConstants.authenticateRedirectEndpoint);
AadConstants.signupRedirectEndpoint = '/signup-post';
AadConstants.signupRedirectUri = createRedirectUri(AadConstants.signupRedirectEndpoint);
AadConstants.msGraphUserDetailsUri = 'https://graph.microsoft.com/v1.0/me';

module.exports = AadConstants;
