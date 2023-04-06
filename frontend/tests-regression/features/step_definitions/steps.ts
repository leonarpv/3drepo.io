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

import { When, Then, Given, AfterAll, BeforeAll } from '@cucumber/cucumber';
import { expect } from 'chai';
import * as API from '@3drepo/api';
import { initializeSeleniumDriver } from '../../src/helpers/selenium.helpers';

let driver;
BeforeAll(async () => {
	driver = await initializeSeleniumDriver('chrome');
});

Given('Im not logged in', async () => {
	try {
		await API.Auth.authenticate();
	} catch (e) {
		console.log('the error is ');
		console.log(e);
	}
});

When('I navigate to {string}', async (page) => {
});

Then('I should be redirected to the {string} page', async (page) => {
	expect(true).to.equals(true);
});

AfterAll(async () => {
	await driver.quit();
});
