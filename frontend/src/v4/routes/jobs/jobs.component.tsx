/**
 *  Copyright (C) 2020 3D Repo Ltd
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

import RemoveCircle from '@material-ui/icons/RemoveCircle';
import ReactDOM from 'react-dom';

import { ColorPicker } from '../components/colorPicker/colorPicker.component';
import { CellUserSearch } from '../components/customTable/components/cellUserSearch/cellUserSearch.component';
import { CustomTable, CELL_TYPES, TableButton } from '../components/customTable/customTable.component';
import { FloatingActionPanel } from '../components/floatingActionPanel/floatingActionPanel.component';
import { Loader } from '../components/loader/loader.component';
import { NewJobForm } from '../components/newJobForm/newJobForm.component';
import { UserManagementTab } from '../components/userManagementTab/userManagementTab.component';
import { LoaderContainer } from '../userManagement/userManagement.styles';
import { Container } from './jobs.styles';

const JOBS_TABLE_CELLS = [{
	name: 'Job name',
	type: CELL_TYPES.NAME,
	searchBy: ['name'],
	HeadingComponent: CellUserSearch
}, {
	name: 'Colour',
	type: CELL_TYPES.COLOR,
	HeadingProps: {
		component: {
			hideSortIcon: true
		}
	},
	CellComponent: ColorPicker
}, {
	type: CELL_TYPES.EMPTY
}, {
	type: CELL_TYPES.ICON_BUTTON,
	CellComponent: TableButton
}];

interface IProps {
	currentTeamspace: string;
	jobs: any[];
	colors: any[];
	create: (teamspace, job) => void;
	remove: (teamspace, jobId) => void;
	updateColor: (teamspace, job) => void;
	fetchJobsAndColors: () => void;
	isPending: boolean;
}

interface IState {
	rows: any[];
	containerElement: Node;
	panelKey: number;
}

export class Jobs extends React.PureComponent<IProps, IState> {
	public static getDerivedStateFromProps(nextProps: IProps, prevState) {
		return {
			panelKey: nextProps.jobs.length !== prevState.rows.length ? Math.random() : prevState.panelKey
		};
	}

	public state = {
		rows: [],
		containerElement: null,
		panelKey: Math.random()
	};

	public handleColorChange = (jobId) => (color) => {
		this.props.updateColor(this.props.currentTeamspace, {_id: jobId, color});
	}

	public onRemove = (jobId) => {
		this.props.remove(this.props.currentTeamspace, jobId);
	}

	public onSave = ({name, color}) => {
		this.props.create(this.props.currentTeamspace, { _id: name, color });
	}

	public getJobsTableRows = (jobs = [], colors = []): any[] => {
		return jobs.map((job) => {
			const data = [
				{
					value: job._id
				},
				{
					value: job.color,
					predefinedColors: colors,
					disableUnderline: true,
					onChange: this.handleColorChange(job._id)
				},
				{},
				{
					Icon: RemoveCircle,
					onClick: this.onRemove.bind(null, job._id)
				}
			];
			return { ...job, name: job._id, data };
		});
	}

	public componentDidMount() {
		const containerElement = (ReactDOM.findDOMNode(this) as HTMLElement).parentNode;
		this.setState({ containerElement });
		this.props.fetchJobsAndColors();
	}

	public componentDidUpdate(prevProps: Readonly<IProps>) {
		if (prevProps.currentTeamspace !== this.props.currentTeamspace) {
			this.props.fetchJobsAndColors();
		}
	}

	public renderNewJobFormPanel = ({ closePanel }) => {
		const formProps = {
			title: 'Add new job',
			colors: this.props.colors,
			onSave: this.onSave
		};
		return <NewJobForm {...formProps} onCancel={closePanel} />;
	}

	public renderNewJobForm = (container) => (
		<FloatingActionPanel
			container={container}
			key={this.state.panelKey}
			render={this.renderNewJobFormPanel}
		/>
	)

	public render() {
		const { jobs, colors, isPending, currentTeamspace } =  this.props;
		const { containerElement } = this.state;

		if (isPending) {
			const content = `Loading "${currentTeamspace}" jobs data...`;
			return (
				<LoaderContainer>
					<Loader content={content} />
				</LoaderContainer>
			);
		}

		return (
			<Container>
				<UserManagementTab footerLabel="Manage jobs">
					<CustomTable
						cells={JOBS_TABLE_CELLS}
						rows={this.getJobsTableRows(jobs, colors)}
					/>
				</UserManagementTab>
				{containerElement && this.renderNewJobForm(containerElement)}
			</Container>
		);
	}
}
