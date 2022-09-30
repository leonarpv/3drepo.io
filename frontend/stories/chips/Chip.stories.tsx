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

import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Chip } from '@controls/chip';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	title: 'Chips/Chip',
	component: Chip,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		variant: {
			description: 'Variant of the chip',
			options: ['filled', 'outlined', 'noBorder'],
			control: { type: 'select' },
		},
		colour: {
			description: 'The primary colour of the chip',
			control: { type: 'color' },
		},
		label: {
			description: 'The text that appears inside the chip',
			control: { type: 'text' },
			defaultValue: 'Treatment',
		},
	},
	parameters: { controls: { exclude: ['color'] } },
} as ComponentMeta<typeof Chip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args}>Material ui chip</Chip>;

export const Filled = Template.bind({});
Filled.args = {
	variant: 'filled',
	colour: '#00C1D4',
};

export const NoBorder = Template.bind({});
NoBorder.args = {
	variant: 'noBorder',
	colour: '#172B4D',
};

export const Outlined = Template.bind({});
Outlined.args = {
	variant: 'outlined',
	colour: 'hotpink',
};
