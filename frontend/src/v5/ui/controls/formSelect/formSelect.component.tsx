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
import { FormSearchSelect, FormSearchSelectProps } from '@controls/formSelect/formSearchSelect/formSearchSelect.component';
import { isEqual } from 'lodash';
import { Children, useState } from 'react';

export type FormSelectProps = FormSearchSelectProps & {
	children: any,
};

export const FormSelect = ({
	defaultValue: inputDefaultValue,
	renderValue,
	...props
}: FormSearchSelectProps) => {
	const [selectedItem, setSelectedItem] = useState<any>();

	const formatRenderValue = () => {
		const childrenToRender = selectedItem?.children;
		return renderValue?.(childrenToRender) || childrenToRender;
	};

	const itemIsSelected = (value) => selectedItem && isEqual(selectedItem.value, value);

	const initialiseSelectedItem = (defaultValue, children) => {
		if (defaultValue === '') return;
		const itemContainer: any = Children.toArray(children)
			.find(({ props: { value } }: any) => isEqual(defaultValue, value));
		setSelectedItem(itemContainer?.props);
	};

	return (
		<FormSearchSelect
			defaultValue={inputDefaultValue ?? ''}
			value={selectedItem?.value}
			renderValue={formatRenderValue}
			onItemClick={setSelectedItem}
			itemIsSelected={itemIsSelected}
			intialiseSelectedItem={initialiseSelectedItem}
			{...props}
		/>
	);
};
