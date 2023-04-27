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
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DragAndDrop } from '@controls/dragAndDrop/dragAndDrop.component';
import { FileInputField } from '@controls/fileInputField/fileInputField.component';
import { Button } from '@controls/button';

export default {
	title: 'Containers/DragAndDrop',
	component: DragAndDrop,
	parameters: { controls: { exclude: ['className', 'onDrop'] } },
} as ComponentMeta<typeof DragAndDrop>;

// eslint-disable-next-line
const handleDropFiles = () => alert('Valid files have been dropped');

const Template: ComponentStory<typeof DragAndDrop> = ({ children, ...args }) => (
	<DragAndDrop onDrop={handleDropFiles} {...args}>{children}</DragAndDrop>
);

export const WithText = Template.bind({});
WithText.args = {
	children: 'Drop your files here',
};

export const WithButton = Template.bind({});
WithButton.args = {
	children: (
		<div>
			Drop your <i>.png</i> files here or
			<FileInputField
				accept=".png"
				onChange={handleDropFiles}
			>
				<Button size="medium" variant="contained" color="primary" component="span">
					Navigate
				</Button>
			</FileInputField>
		</div>
	),
};