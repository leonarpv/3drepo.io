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
import { TicketsCardActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { createContext, useState } from 'react';

export enum TicketDetailsView {
	Form,
	Groups,
}

export interface TicketContextType {
	isViewer?: boolean;
	view: TicketDetailsView;
	viewProps?: any;
	setDetailViewAndProps: (view: TicketDetailsView, props?: any) => void;
}

const defaultValue: TicketContextType = {
	isViewer: false,
	view: TicketDetailsView.Form,
	setDetailViewAndProps: () => {},
};
export const TicketContext = createContext(defaultValue);
TicketContext.displayName = 'TicketContext';

export const TicketContextComponent = ({ children, isViewer }) => {
	const [view, setView] = useState(TicketDetailsView.Form);
	const [viewProps, setViewProps] = useState();

	const setDetailViewAndProps = (viewParam: TicketDetailsView, props) => {
		if (props) {
			setViewProps(props);
		}
		setView(viewParam);
	};

	return (
		<TicketContext.Provider value={{ isViewer, view, viewProps, setDetailViewAndProps }}>
			{children}
		</TicketContext.Provider>
	);
};
