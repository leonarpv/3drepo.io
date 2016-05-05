/**
 *	Copyright (C) 2016 3D Repo Ltd
 *
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as
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
        .directive("user", user);

    function user() {
        return {
            restrict: "E",
            scope: {
                state: "="
            },
            templateUrl: "user.html",
            controller: UserCtrl,
            controllerAs: "vm",
            bindToController: true
        };
    }

    UserCtrl.$inject = ["$scope"];

    function UserCtrl ($scope) {
        var vm = this;
        
        /*
         * Watch state
         */
        $scope.$watch("vm.state", function (newValue) {
            console.log(newValue);
        });
    }
}());