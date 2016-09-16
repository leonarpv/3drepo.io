/**
 *	Copyright (C) 2016 3D Repo Ltd
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the issuesFooter of the GNU Affero General Public License as
 *	published by the Free Software Foundation, either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
	"use strict";

	angular.module("3drepo")
		.component(
			"issuesFooter",
			{
				controller: IssuesFooterCtrl,
				templateUrl: "issuesFooter.html",
				bindings: {
					sendEvent: "&",
					newIssue: "=",
					submitDisabled: "=",
					submit: "&",
					screenShotSave: "&"
				}
			}
		);

	IssuesFooterCtrl.$inject = ["$mdDialog"];

	function IssuesFooterCtrl ($mdDialog) {
		var self = this,
			highlightBackground = "#FF9800",
			currentActionIndex = null;

		this.actions = [
			{icon: "camera_alt", action: "screen_shot", label: "Screen shot", color: "", disabled: false},
			{icon: "place", action: "pin", label: "Pin", color: "", disabled: !this.newIssue},
			{icon: "view_comfy", action: "multi", label: "Multi", color: "", disabled: !this.newIssue}
		];

		this.doAction = function (index) {
			console.log(this.actions[index].action);
			if (currentActionIndex === null) {
				currentActionIndex = index;
				this.actions[currentActionIndex].color = highlightBackground;
			}
			else if (currentActionIndex === index) {
				this.actions[currentActionIndex].color = "";
				currentActionIndex = null;
			}
			else {
				this.actions[currentActionIndex].color = "";
				currentActionIndex = index;
				this.actions[currentActionIndex].color = highlightBackground;
			}

			switch (this.actions[currentActionIndex].action) {
				case "screen_shot":
					$mdDialog.show({
						controller: ScreenShotDialogController,
						controllerAs: "vm",
						templateUrl: "issueScreenShotDialog.html"
					});
					break;

				case "pin":
					break;

				case "multi":
					break;
			}
		};

		this.doSubmit = function () {
			this.submit();
		};

		function ScreenShotDialogController () {
			this.dialogCaller = self;

			/**
			 * Deselect the screen shot action button after close the screen shot dialog
			 */
			this.closeScreenShot = function () {
				self.actions[currentActionIndex].color = "";
				currentActionIndex = null;
			};
		}
	}
}());