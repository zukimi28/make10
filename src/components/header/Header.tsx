import React from 'react';
import './Header.css';

import { Divider, IconButton } from '@mui/material';

/**
 * Headerコンポーネント
 * @returns Headerコンポーネント
 */
const Header = (): JSX.Element => {
	return (
		<div id="app-header">
			<div id="header-core">
				<div id="app-title">Make10</div>
				<div id="header-buttons">
					<IconButton size="small" sx={{ color: '#469b98' }}>?</IconButton>
					<IconButton size="small" sx={{ color: '#469b98' }}>W</IconButton>
					<IconButton size="small" sx={{ color: '#469b98' }}>O</IconButton>
				</div>
			</div>
			<Divider sx={{ borderColor: '#469b98', marginTop: '8px' }} />
		</div>
	);
}

export default Header;