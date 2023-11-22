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

import ShowIcon from '@assets/icons/outlined/eye-outlined.svg';
import DeleteIcon from '@assets/icons/outlined/delete-outlined.svg';
import { Group, GroupOverride } from '@/v5/store/tickets/tickets.types';
import { useContext, useEffect } from 'react';
import { DialogsActionsDispatchers } from '@/v5/services/actionsDispatchers';
import { formatMessage } from '@/v5/services/intl';
import { rgbaToHex } from '@/v4/helpers/colors';
import { FormattedMessage } from 'react-intl';
import { GroupIconComponent } from '@/v5/ui/routes/viewer/groups/groupItem/groupIcon/groupIcon.component';
import { ErrorTicketButton, PrimaryTicketButton } from '@/v5/ui/routes/viewer/tickets/ticketButton/ticketButton.styles';
import { ProjectsHooksSelectors } from '@/v5/services/selectorsHooks';
import { CircularProgress } from '@mui/material';
import { isString } from 'lodash';
import EditIcon from '@assets/icons/outlined/edit-outlined.svg';
import { convertToV4GroupNodes } from '@/v5/helpers/viewpoint.helpers';
import { TreeActions, selectGetNumNodesByMeshSharedIdsArray } from '@/v4/modules/tree';
import { toSharedIds } from '@/v4/helpers/viewpoints';
import { useDispatch, useSelector } from 'react-redux';
import {
	Buttons,
	NameContainer,
	Container,
	Headline,
	Name,
	GroupsCount,
} from './groupItem.styles';
import { GroupToggle } from '../../groupToggle/groupToggle.component';
import { TicketGroupsContext } from '../../ticketGroupsContext';

type GroupProps = { override: GroupOverride, index: number };
export const GroupItem = ({ override, index }: GroupProps) => {
	const dispatch = useDispatch();
	const {
		groupType,
		isHighlightedIndex,
		setHighlightedIndex,
		clearHighlightedIndex,
		getGroupIsChecked,
		setGroupIsChecked,
		deleteGroup,
		editGroup,
	} = useContext(TicketGroupsContext);
	const isAdmin = ProjectsHooksSelectors.selectIsProjectAdmin();
	const { group, color, opacity } = override;
	const checked = getGroupIsChecked(index);

	const sharedIds = toSharedIds(((group as Group).objects || []).flatMap(({ _ids }) => _ids));
	const objectsCount = useSelector(selectGetNumNodesByMeshSharedIdsArray(sharedIds));

	const preventPropagation = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDeleteGroup = (e) => {
		preventPropagation(e);
		DialogsActionsDispatchers.open('delete', {
			name: (group as Group).name,
			message: formatMessage({
				id: 'deleteModal.groups.message',
				defaultMessage: 'By deleting this group your data will be lost permanently and will not be recoverable.',
			}),
			onClickConfirm: () => deleteGroup(index),
			confirmLabel: formatMessage({ id: 'deleteModal.groups.confirmButton', defaultMessage: 'Delete Group' }),
		});
	};

	const handleClick = (e) => {
		preventPropagation(e);
		setHighlightedIndex(index);
	};

	const isolateGroup = (e) => {
		preventPropagation(e);
		const objects = convertToV4GroupNodes((group as Group).objects);
		dispatch(TreeActions.isolateNodesBySharedIds(objects));
	};

	const onEditGroup = () => editGroup(index);

	const handleToggleClick = (e) => {
		preventPropagation(e);
		setGroupIsChecked(index, !checked);
		if (groupType === 'hidden' && !checked && isHighlightedIndex(index)) {
			clearHighlightedIndex();
		}
	};

	const alphaColor = (color || [255, 255, 255]).concat(opacity);
	const alphaHexColor = rgbaToHex(alphaColor.join());

	useEffect(() => {
		if (!isHighlightedIndex(index)) return;
		const objects = convertToV4GroupNodes((group as Group).objects);
		dispatch(TreeActions.clearCurrentlySelected());
		dispatch(TreeActions.showNodesBySharedIds(objects));
		const selectionColor = groupType === 'hidden' ? [255, 255, 255] : color;
		dispatch(TreeActions.selectNodesBySharedIds(objects, selectionColor?.map((c) => c / 255)));
	}, [override, isHighlightedIndex]);

	if (isString(group)) return (<CircularProgress />);

	return (
		<Container onClick={handleClick} $highlighted={isHighlightedIndex(index)}>
			<Headline>
				<GroupIconComponent rules={group.rules} color={alphaHexColor} />
				<NameContainer>
					<Name>{group.name}</Name>
					<GroupsCount>
						<FormattedMessage
							id="groups.item.numberOfMeshes"
							defaultMessage="{count, plural, =0 {No objects} one {# object} other {# objects}}"
							values={{ count: objectsCount }}
						/>
					</GroupsCount>
				</NameContainer>
				<Buttons>
					{isAdmin && (
						<ErrorTicketButton onClick={handleDeleteGroup}>
							<DeleteIcon />
						</ErrorTicketButton>
					)}
					<PrimaryTicketButton onClick={isolateGroup}>
						<ShowIcon />
					</PrimaryTicketButton>
					<PrimaryTicketButton onClick={onEditGroup}>
						<EditIcon />
					</PrimaryTicketButton>
				</Buttons>
			</Headline>
			<GroupToggle
				checked={checked}
				onClick={handleToggleClick}
			/>
		</Container>
	);
};
