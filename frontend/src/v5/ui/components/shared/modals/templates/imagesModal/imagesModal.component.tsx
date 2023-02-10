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

import { useState } from 'react';
import { Container, Image, NextButton, PreviousButton } from './imagesModal.styles';

type ImagesModalProps = {
	srcs: string[];
};
export const ImagesModal = ({ srcs }: ImagesModalProps) => {
	const [imageIndex, setImageIndex] = useState(0);
	const imagesLength = srcs.length;

	if (imagesLength === 1) return (<Image src={srcs[imageIndex]} />);

	const changeImageIndex = (delta) => setImageIndex((imageIndex + delta + imagesLength) % imagesLength);

	return (
		<Container>
			<PreviousButton onClick={() => changeImageIndex(1)} />
			<Image src={srcs[imageIndex]} />
			<NextButton onClick={() => changeImageIndex(-1)} />
		</Container>
	);
};
