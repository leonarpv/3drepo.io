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
import { until, By } from 'selenium-webdriver';
import { initializeSeleniumDriver } from '../../src/helpers/selenium.helpers';
import { getLogin, logout } from '../../src/helpers/api.helpers';
import { domain } from '../../config.json';
import { getUrl, navigateTo } from '../../src/helpers/routing.helpers';

let driver;
BeforeAll(async () => {
	driver = await initializeSeleniumDriver('chrome');
});

Given('Im not logged in', async () => {
	await driver.get(domain);
	await driver.wait(until.elementLocated(By.css('body')), 100000);

	const res = await getLogin(driver);
	if (res.status === 200) {
		await logout(driver);
	}
});

When('I navigate to {string}', async (page) => {
	await navigateTo(driver, page);
});

Then('I should be redirected to the {string} page', async (page) => {
	await driver.wait(until.urlIs(getUrl(page)));
	expect(true).to.equals(true);
});

AfterAll(async () => {
	await driver.quit();
});
