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

import { selectJobs } from '@/v4/modules/jobs';
import { formatMessage } from '@/v5/services/intl';
import { TeamspacesHooksSelectors, UsersHooksSelectors } from '@/v5/services/selectorsHooks';
import { Select } from '@controls/inputs/select/select.component';
import { SearchContext, SearchContextComponent, SearchContextType } from '@controls/search/searchContext';
import { SearchInput } from '@controls/search/searchInput';
import { NoResults, SearchInputContainer } from '@controls/searchSelect/searchSelect.styles';
import { MenuItem } from '@mui/material';
import { partition } from 'lodash';
import { onlyText } from 'react-children-utilities';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

export const AssigneesSelectMenu = ({
	open,
	value,
	values,
	onClose,
	onOpen,
	...props
}) => {
	const teamspace = TeamspacesHooksSelectors.selectCurrentTeamspace();
	const jobs = useSelector(selectJobs);
	const users = UsersHooksSelectors.selectUsersByTeamspace(teamspace);
	const filterItems = (items, query: string) => items
		.filter((node) => onlyText(node).toLowerCase()
			.includes(query.toLowerCase()));

	const jobsArray = jobs.map(({ _id, color }) => (
		<div data-type="job">{_id} {color}</div>
	));
	const usersArray = users.map(({ user, job }) => (
		<div data-type="user">{user} {job}</div>
	));

	const isJob = ({ props: { 'data-type': dataType } }) => dataType === 'job';

	const preventPropagation = (e) => {
		if (e.key !== 'Escape') {
			e.stopPropagation();
		}
	};
	return (
		<SearchContextComponent filteringFunction={filterItems} items={[...jobsArray, ...usersArray]}>
			<SearchContext.Consumer>
				{ ({ filteredItems }: SearchContextType<typeof MenuItem>) => {
					const [jobsBlah, usersBlah] = partition(filteredItems, isJob);
					return (
						<Select
							{...props}
							MenuProps={{
								disableAutoFocusItem: true,
								PaperProps: {
									style: { maxHeight: 231 },
								},
							}}
						>
							<SearchInputContainer>
								<SearchInput
									placeholder={formatMessage({ id: 'searchSelect.searchInput.placeholder', defaultMessage: 'Search...' })}
									onClick={preventPropagation}
									onKeyDown={preventPropagation}
								/>
							</SearchInputContainer>
							{jobsBlah.length > 0 && jobsBlah}
							{!jobsBlah.length && (
								<NoResults>
									<FormattedMessage
										id="form.searchSelect.menuContent.emptyList"
										defaultMessage="No results"
									/>
								</NoResults>
							)}
							<div>--- SEPARATOR ---</div>
							{usersBlah.length > 0 && usersBlah}
							{!usersBlah.length && (
								<NoResults>
									<FormattedMessage
										id="form.searchSelect.menuContent.emptyList"
										defaultMessage="No results"
									/>
								</NoResults>
							)}
						</Select>
					);
				}}
			</SearchContext.Consumer>
		</SearchContextComponent>
	);
};
