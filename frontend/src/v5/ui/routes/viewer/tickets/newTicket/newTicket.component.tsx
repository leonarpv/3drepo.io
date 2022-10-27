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

import { FormattedMessage } from 'react-intl';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import TicketsIcon from '@mui/icons-material/FormatListBulleted';
import { CardContainer, CardHeader } from '@/v5/ui/components/viewer/cards/card.styles';
import { CardContent } from '@/v5/ui/components/viewer/cards/cardContent.component';
import { CardContext } from '@components/viewer/cards/cardContext.component';
import { Button } from '@controls/button';
import { TicketsHooksSelectors } from '@/v5/services/selectorsHooks/ticketsSelectors.hooks';
import { NewTicket } from '@/v5/store/tickets/tickets.types';
import { TicketsActionsDispatchers } from '@/v5/services/actionsDispatchers/ticketsActions.dispatchers';
import { yupResolver } from '@hookform/resolvers/yup';
import { modelIsFederation, getValidators, filterEmptyTicketValues, getDefaultTicket } from '@/v5/store/tickets/tickets.helpers';
import { BottomArea, Form, SaveButton } from './newTicket.styles';
import { TicketForm } from '../ticketsForm/ticketsForm.component';
import { TicketsCardViews } from '../tickets.constants';
import { ViewerParams } from '../../../routes.constants';

export const NewTicketCard = () => {
	const contextValue = useContext(CardContext);
	const templateId = contextValue.props.template._id;
	const { teamspace, project, containerOrFederation } = useParams<ViewerParams>();
	const isFederation = modelIsFederation(containerOrFederation);
	const template = TicketsHooksSelectors.selectTemplateById(containerOrFederation, templateId);
	const isLoading = !('config' in template);

	const getEditableProperties = () => {
		const NON_EDITABLE_PROPERTIES = ['Owner', 'Created at', 'Updated at'];
		return template.properties?.filter(({ name }) => !NON_EDITABLE_PROPERTIES.includes(name));
	};

	const editableTemplate = {
		...template,
		properties: getEditableProperties(),
	};

	const formData = useForm({
		resolver: yupResolver(getValidators(editableTemplate)),
		mode: 'onChange',
	});

	const goBack = () => {
		contextValue.setCardView(TicketsCardViews.List);
	};

	const goToTicketDetails = (ticketId) => {
		contextValue.setCardView(TicketsCardViews.Details, { ticketId });
	};

	const changeTemplate = () => {
		contextValue.setCardView(TicketsCardViews.Templates);
	};

	const onSubmit = ({ title, properties, ...modules }) => {
		const ticket = {
			type: template._id,
			title,
			properties,
			modules,
		};
		const parsedTicket = filterEmptyTicketValues(ticket) as NewTicket;
		TicketsActionsDispatchers.createTicket(
			teamspace,
			project,
			containerOrFederation,
			parsedTicket,
			isFederation,
			goToTicketDetails,
		);
	};

	useEffect(() => {
		TicketsActionsDispatchers.fetchTemplate(
			teamspace,
			project,
			containerOrFederation,
			templateId,
			isFederation,
		);
	}, []);

	return (
		<CardContainer>
			<CardHeader>
				<TicketsIcon fontSize="small" />
				<FormattedMessage
					id="viewer.cards.newTicketTitle"
					defaultMessage="New {template} ticket"
					values={{ template: template.name }}
				/>
				<Button onClick={goBack}>back</Button>
				<Button onClick={changeTemplate}>change template</Button>
			</CardHeader>
			{isLoading ? (
				<CardContent>
					<CircularProgress />
				</CardContent>
			) : (
				<FormProvider {...formData}>
					<Form onSubmit={formData.handleSubmit(onSubmit)}>
						<TicketForm
							template={getEditableProperties(template)}
							ticket={getDefaultTicket(template)}
						/>
						<BottomArea>
							<SaveButton disabled={!formData.formState.isValid}>
								<FormattedMessage id="customTicket.button.saveTicket" defaultMessage="Save ticket" />
							</SaveButton>
						</BottomArea>
					</Form>
				</FormProvider>
			)}
		</CardContainer>
	);
};
