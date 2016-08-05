/**
 *  Copyright (C) 2016 3D Repo Ltd
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
var mongoose = require('mongoose');
var ModelFactory = require('./factory/modelFactory');
var addressMeta = require('./addressMeta');
var moment = require('moment');
var fs = require('fs');
var jade = require('jade');
var phantom = require('phantom');
var utils = require("../utils");
var config = require('../config');

var schema = mongoose.Schema({
	invoiceNo: String,
	billingAgreementId: String,
	gateway: String,
	raw: {},
	createdAt: Date,
	currency: String,
	amount: String,
	items: [{
		name: String,
		description:  String, 
		currency: String,
		amount: Number,
		taxAmount: Number
	}],
	periodStart: Date,
	periodEnd: Date,
	nextPaymentDate: Date,
	nextPaymentAmount: String,
	transactionId: String,
	taxAmount: String,
	info: {
		"vat": String,
		"line1": String,
		"line2": String,
		"line3": String,
		"state": String,
		"firstName": String,
		"lastName": String,
		"company": String,
		"city": String,
		"postalCode": String,
		"countryCode": String
	},
	pending: Boolean,
	pdf: Object
});

schema.statics.findByAccount = function(account){
	return this.find({account}, {}, {raw: 0, pdf: 0}, {sort: {periodStart: -1}});
};

schema.statics.findByInvoiceNo = function(account, invoiceNo){
	return this.findOne({account}, { invoiceNo});
};

schema.statics.findByTransactionId = function(account, transactionId){
	return this.findOne({account}, { transactionId }, {raw: 0, pdf: 0});
};

schema.statics.hasPendingBill = function(account, billingAgreementId){
	return this.count({account}, {billingAgreementId: billingAgreementId, pending: true}).then( count => {
		console.log('count', count);
		return Promise.resolve(count > 0);
	});
};

schema.statics.findAndRemovePendingBill = function(account, billingAgreementId){
	return this.findOne({account}, {billingAgreementId: billingAgreementId, pending: true}).then(billing => {
		if(billing){
			return billing.remove().then(() => {
				return billing;
			});
		}
	}); 
};

schema.methods.clean = function(options) {
	'use strict';

	let euCountryCodes = [
		"BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "HR", "IT", "CY", "LV", "LT",
		"LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE"
	];


	options = options || {};
	let billing = this.toObject();
	billing.info.country = addressMeta.countries.find(c => c.code === billing.info.countryCode).name;
	billing.taxAmount = parseFloat(billing.taxAmount).toFixed(2);
	billing.amount  = parseFloat(billing.amount).toFixed(2);
	billing.netAmount  = (Math.round((parseFloat(billing.amount) - parseFloat(billing.taxAmount)) * 100) / 100).toFixed(2);
	billing.taxPercentage = (Math.round(parseFloat(billing.taxAmount) / parseFloat(billing.netAmount) * 100) / 100 * 100);
	
	if(!options.skipDate) {
		billing.createdAt = moment(billing.createdAt).utc().format('DD-MM-YYYY HH:mm');
		billing.periodStart = moment(billing.periodStart).utc().format('YYYY-MM-DD');
		billing.periodEnd = moment(billing.periodEnd).utc().format('YYYY-MM-DD');
	}

	billing.B2B_EU = (euCountryCodes.indexOf(billing.info.countryCode) !== -1) && (billing.info.hasOwnProperty("vat"));
	return billing;
};

schema.methods.generatePDF = function(){
	'use strict';

	let cleaned = this.clean();

	let ph;
	let page;

	if(!config.invoice_dir){
		return Promise.reject({ message: 'invoice dir is not set in config file'});
	}

	return new Promise((resolve, reject) => {
		
		jade.renderFile('./jade/invoice.jade', {billing : cleaned, baseURL: utils.getBaseURL()}, function(err, html){
			if(err){
				reject(err);
			} else {
				resolve(html);
			}
		});

	}).then(html => {

		return new Promise((resolve, reject) => {
			fs.writeFile(`${config.invoice_dir}/${this.id}.html`, html, { flag: 'a+'}, err => {
				if(err){
					reject(err);
				} else {
					resolve();
				}
			});
		});

	}).then(() => {
		return phantom.create();

	}).then(_ph => {

		ph = _ph;
		return ph.createPage();
		
	}).then(_page => {

		page = _page;
		page.property('viewportSize', { width: 1700 , height: 2200 });
		return page.open(`file://${config.invoice_dir}/${this.id}.html`);

	}).then(() => {

		return page.render(`${config.invoice_dir}/${this.id}.pdf`);
		
	}).then(() => {

		ph && ph.exit();
		return Promise.resolve(`${config.invoice_dir}/${this.id}.pdf`);

	}).catch( err => {

		ph && ph.exit();
		return Promise.reject(err);
	});

};

schema.methods.getPDF = function(options){
	'use strict';

	options = options || {};

	if(options.regenerate || !this.pdf){

		return this.generatePDF().then(pdfPath => {

			let pdfRS = fs.createReadStream(pdfPath);
			let bufs = [];

			return new Promise((resolve, reject) => {

				pdfRS.on('data', function(d){ bufs.push(d); });
				pdfRS.on('end', function(){
					resolve(Buffer.concat(bufs));
				});
				pdfRS.on('err', err => {
					reject(err);
				});
			});
		});

	} else {
		//console.log('from cache')
		return Promise.resolve(this.pdf.buffer);
	}
};

var Billing = ModelFactory.createClass(
	'Billing',
	schema,
	() => {
		return 'billings';
	}
);


module.exports = Billing;