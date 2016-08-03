/**
 *  Copyright (C) 2014 3D Repo Ltd
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


var nodemailer = require('nodemailer');
var config = require('../config');

var transporter;

function sendEmail(template, to, data, attachments){
	'use strict';


	if(!config.mail || !config.mail.smtpConfig){
		return Promise.reject({ message: 'config.mail.smtpConfig is not set'});
	}

	if(!config.mail || !config.mail.smtpConfig){
		return Promise.reject({ message: 'config.mail.sender is not set'});
	}

	let mailOptions = {
		from: config.mail.sender,
		to: to,
		subject: typeof template.subject === 'function' ? template.subject(data) : template.subject,
		html: template.html(data)
	};

	if(attachments){
		mailOptions.attachments = attachments;
	}

	transporter = transporter || nodemailer.createTransport(config.mail.smtpConfig);

	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
}

function rejectNoUrl(name){
	return Promise.reject({ message: `config.mails.urls[${name}] is not defined`})
}

function getBaseURL(){
	'use strict';

	let apiServerConfig = config.servers.find(server => server.service === 'api');
	let port = '';
	if(config.using_ssl && apiServerConfig.public_port !== 443 || !config.using_ssl && apiServerConfig.public_port !== 80){
		port = ':' + apiServerConfig.public_port;
	}

	let baseUrl = (config.using_ssl ? 'https://' : 'http://') + config.host + port;

	return baseUrl;
}

function getURL(urlName, params){
	'use strict';

	if(!config.mail || !config.mail.urls || !config.mail.urls[urlName]){
		return null;
	}

	return getBaseURL() + config.mail.urls[urlName](params);
}

function sendVerifyUserEmail(to, data){
	'use strict';

	data.url = getURL('verify', {token: data.token, username: data.username, pay: data.pay});

	if(!data.url){
		return rejectNoUrl('verify');
	}

	let template = require('./templates/verifyUser');
	return sendEmail(template, to, data);
}


function sendResetPasswordEmail(to, data){
	'use strict';

	data.url = getURL('forgotPassword', {token: data.token, username: data.username});

	if(!data.url){
		return rejectNoUrl('forgotPassword');
	}

	let template = require('./templates/forgotPassword');
	return sendEmail(template, to, data);
}

function sendPaymentReceivedEmail(to, data, attachments){
	'use strict';

	let template = require('./templates/paymentReceived');


	return sendEmail(template, to, data, attachments);
}

function sendPaymentReceivedEmailToSales(data, attachments){
	'use strict';

	let template = require('./templates/paymentReceived');
	
	let salesTemplate = {
		html: template.html,
		subject: function(data){
			return `[Invoice ${data.invoiceNo}] ${data.email}`;
		}
	};

	if(config.contact && config.contact.sales){
		//console.log(config.contact.sales);
		return sendEmail(salesTemplate, config.contact.sales, data, attachments);
	} else {
		return Promise.resolve();
	}

	
}


function sendContactEmail(data){
	'use strict';

	let template = require('./templates/contact');
	
	if(!config.contact || !config.contact.email){
		return Promise.reject({ messsage: 'config.contact.email is undefined in config file'});
	}

	return sendEmail(template, config.contact.email, data);
}



function sendPaymentFailedEmail(to, data){
	'use strict';

	let template = require('./templates/paymentFailed');
	return sendEmail(template, to, data);

}

function sendSubscriptionSuspendedEmail(to, data){
	'use strict';

	let template = require('./templates/paymentSuspended');
	data.url = getBaseURL() + `/${data.billingUser}/?page=billing`;

	return sendEmail(template, to, data);

}

function sendPaymentErrorEmail(data){
	'use strict';

	let template = require('./templates/paymentError');
	return sendEmail(template, config.contact.email, data);
}

function sendProjectInvitation(to, data){
	'use strict';

	data.url = getURL('project', { account: data.account, project: data.project });

	if(!data.url){
		return rejectNoUrl('project');
	}

	let template = require('./templates/invitedToProject');
	return sendEmail(template, to, data);
}


module.exports = {
	sendVerifyUserEmail,
	sendResetPasswordEmail,
	sendPaymentReceivedEmail,
	sendContactEmail,
	sendPaymentFailedEmail,
	sendPaymentErrorEmail,
	sendProjectInvitation,
	sendSubscriptionSuspendedEmail,
	sendPaymentReceivedEmailToSales
}
