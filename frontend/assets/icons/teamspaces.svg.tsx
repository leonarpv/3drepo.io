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

import React from 'react';

type IProps = {
	className?: any;
};

export default ({ className }: IProps) => (
	<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
		<path d="M7.07295 0.625V5.625C7.073 5.70709 7.05714 5.78839 7.0263 5.86424C6.99545 5.94009 6.95022 6.00901 6.89318 6.06706C6.83615 6.1251 6.76842 6.17114 6.69389 6.20253C6.61936 6.23392 6.53948 6.25005 6.45881 6.25H1.54577C1.46511 6.25005 1.38523 6.23392 1.31069 6.20253C1.23616 6.17114 1.16844 6.1251 1.1114 6.06706C1.05437 6.00901 1.00913 5.94009 0.978286 5.86424C0.947441 5.78839 0.93159 5.70709 0.931641 5.625V0.625C0.93159 0.54291 0.947441 0.461614 0.978286 0.385762C1.00913 0.309911 1.05437 0.240991 1.1114 0.182944C1.16844 0.124897 1.23616 0.0788618 1.31069 0.0474707C1.38523 0.0160798 1.46511 -5.12326e-05 1.54577 1.22235e-07H6.45881C6.53948 -5.12326e-05 6.61936 0.0160798 6.69389 0.0474707C6.76842 0.0788618 6.83615 0.124897 6.89318 0.182944C6.95022 0.240991 6.99545 0.309911 7.0263 0.385762C7.05714 0.461614 7.073 0.54291 7.07295 0.625ZM13.8284 1.22235e-07H8.91534C8.83467 -5.12326e-05 8.75479 0.0160798 8.68026 0.0474707C8.60573 0.0788618 8.538 0.124897 8.48097 0.182944C8.42393 0.240991 8.3787 0.309911 8.34785 0.385762C8.31701 0.461614 8.30116 0.54291 8.30121 0.625V5.625C8.30116 5.70709 8.31701 5.78839 8.34785 5.86424C8.3787 5.94009 8.42393 6.00901 8.48097 6.06706C8.538 6.1251 8.60573 6.17114 8.68026 6.20253C8.75479 6.23392 8.83467 6.25005 8.91534 6.25H13.8284C13.909 6.25005 13.9889 6.23392 14.0635 6.20253C14.138 6.17114 14.2057 6.1251 14.2627 6.06706C14.3198 6.00901 14.365 5.94009 14.3959 5.86424C14.4267 5.78839 14.4426 5.70709 14.4425 5.625V0.625C14.4426 0.54291 14.4267 0.461614 14.3959 0.385762C14.365 0.309911 14.3198 0.240991 14.2627 0.182944C14.2057 0.124897 14.138 0.0788618 14.0635 0.0474707C13.9889 0.0160798 13.909 -5.12326e-05 13.8284 1.22235e-07ZM6.45881 7.5H1.54577C1.46511 7.49995 1.38523 7.51608 1.31069 7.54747C1.23616 7.57886 1.16844 7.6249 1.1114 7.68294C1.05437 7.74099 1.00913 7.80991 0.978286 7.88576C0.947441 7.96161 0.93159 8.04291 0.931641 8.125V13.125C0.93159 13.2071 0.947441 13.2884 0.978286 13.3642C1.00913 13.4401 1.05437 13.509 1.1114 13.5671C1.16844 13.6251 1.23616 13.6711 1.31069 13.7025C1.38523 13.7339 1.46511 13.7501 1.54577 13.75H6.45881C6.53948 13.7501 6.61936 13.7339 6.69389 13.7025C6.76842 13.6711 6.83615 13.6251 6.89318 13.5671C6.95022 13.509 6.99545 13.4401 7.0263 13.3642C7.05714 13.2884 7.073 13.2071 7.07295 13.125V8.125C7.073 8.04291 7.05714 7.96161 7.0263 7.88576C6.99545 7.80991 6.95022 7.74099 6.89318 7.68294C6.83615 7.6249 6.76842 7.57886 6.69389 7.54747C6.61936 7.51608 6.53948 7.49995 6.45881 7.5ZM13.8284 7.5H8.91534C8.83467 7.49995 8.75479 7.51608 8.68026 7.54747C8.60573 7.57886 8.538 7.6249 8.48097 7.68294C8.42393 7.74099 8.3787 7.80991 8.34785 7.88576C8.31701 7.96161 8.30116 8.04291 8.30121 8.125V13.125C8.30116 13.2071 8.31701 13.2884 8.34785 13.3642C8.3787 13.4401 8.42393 13.509 8.48097 13.5671C8.538 13.6251 8.60573 13.6711 8.68026 13.7025C8.75479 13.7339 8.83467 13.7501 8.91534 13.75H13.8284C13.909 13.7501 13.9889 13.7339 14.0635 13.7025C14.138 13.6711 14.2057 13.6251 14.2627 13.5671C14.3198 13.509 14.365 13.4401 14.3959 13.3642C14.4267 13.2884 14.4426 13.2071 14.4425 13.125V8.125C14.4426 8.04291 14.4267 7.96161 14.3959 7.88576C14.365 7.80991 14.3198 7.74099 14.2627 7.68294C14.2057 7.6249 14.138 7.57886 14.0635 7.54747C13.9889 7.51608 13.909 7.49995 13.8284 7.5Z" fill="#6B778C" />
	</svg>
);
