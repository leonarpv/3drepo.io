import { omit, get } from 'lodash';
import { getAPIUrl } from '../services/api';
import { RISK_LEVELS_COLOURS, RISK_LEVELS_ICONS, RISK_LEVELS, LEVELS } from '../constants/risks';
import { isAdmin, hasPermissions, PERMISSIONS } from './permissions';

export const prepareRisk = (risk, jobs = []) => {
	const thumbnail = getAPIUrl(risk.thumbnail);
	const descriptionThumbnail = risk.viewpoint && risk.viewpoint.screenshot
		? getAPIUrl(risk.viewpoint.screenshot)
		: (risk.descriptionThumbnail || '');

	const levelOfRisk = risk.level_of_risk || calculateLevelOfRisk(risk.likelihood, risk.consequence);
	const { Icon, color } = getRiskStatus(levelOfRisk, risk.mitigation_status);
	const roleColor = get(jobs.find((job) => job.name === get(risk.assigned_roles, '[0]')), 'color');

	return {
		...risk,
		defaultHidden: risk.mitigation_status === RISK_LEVELS.AGREED_FULLY,
		description: risk.desc,
		author: risk.owner,
		createdDate: risk.created,
		thumbnail,
		descriptionThumbnail,
		StatusIconComponent: Icon,
		statusColor: color,
		roleColor,
		level_of_risk: levelOfRisk
	};
};

export const calculateLevelOfRisk = (likelihood: string, consequence: string): number => {
	let levelOfRisk = 0;

	if (likelihood && consequence) {
		const score: number = parseInt(likelihood, 10) + parseInt(consequence, 10);

		if (6 < score) {
			levelOfRisk = LEVELS.VERY_HIGH;
		} else if (5 < score) {
			levelOfRisk = LEVELS.HIGH;
		} else if (2 < score) {
			levelOfRisk = LEVELS.MODERATE;
		} else if (1 < score) {
			levelOfRisk = LEVELS.LOW;
		} else {
			levelOfRisk = LEVELS.VERY_LOW;
		}
	}

	return levelOfRisk;
};

export const getRiskStatus = (levelOfRisk: number, mitigationStatus: string) => {
	const statusIcon = {
		Icon: RISK_LEVELS_ICONS[mitigationStatus] || null,
		color: RISK_LEVELS_COLOURS[levelOfRisk].color
	};

	return statusIcon;
};

export const getRiskPinColor = (levelOfRisk: number, selected: boolean = false) => {
	return (selected)
		? RISK_LEVELS_COLOURS[levelOfRisk].selectedColor
		: RISK_LEVELS_COLOURS[levelOfRisk].pinColor;
};

export const mergeRiskData = (source, data = source) => {
	const hasUnassignedRole = !data.assigned_roles;

	return {
		...source,
		...omit(data, ['assigned_roles', 'description', 'descriptionThumbnail']),
		assigned_roles: hasUnassignedRole ? [] : [data.assigned_roles],
		desc: data.description
	};
};

export const getSortedRisks = (data = []) => {
	return [...data].sort((first, second) => {
		return second.created - first.created;
	});
};

const userJobMatchesCreator = (userJob, riskData) => {
	return (userJob._id && riskData.creator_role && userJob._id === riskData.creator_role);
};

const isViewer = (permissions) => {
	return permissions && !hasPermissions(PERMISSIONS.COMMENT_ISSUE, permissions);
};

const isAssignedJob = (riskData, userJob, permissions) => {
	return riskData && userJob &&
		(userJob._id &&
			riskData.assigned_roles[0] &&
			userJob._id === riskData.assigned_roles[0]) &&
			!isViewer(permissions);
};

const isJobOwner = (riskData, userJob, permissions, currentUser) => {
	return riskData && userJob &&
		(riskData.owner === currentUser ||
		userJobMatchesCreator(userJob, riskData)) &&
		!isViewer(permissions);
};

const canChangeStatusToClosed = (riskData, userJob, permissions, currentUser) => {
	return isAdmin(permissions) || isJobOwner(riskData, userJob, permissions, currentUser);
};

export const canUpdateRisk = (riskData, userJob, permissions, currentUser) => {
	return canChangeStatusToClosed(riskData, userJob, permissions, currentUser) ||
		isAssignedJob(riskData, userJob, permissions);
};