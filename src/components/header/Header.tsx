import React from 'react';
import './Header.css';

import { Divider, IconButton } from '@mui/material';

/**
 * Headerコンポーネントのprops
 * @property {Function} openHowToPlayDialog - 遊び方ダイアログの表示
 */
type Props = {
	openHowToPlayDialog: () => void;
}

/**
 * Headerコンポーネント
 * @param {Function} openHowToPlayDialog - 遊び方ダイアログの表示
 * @returns Headerコンポーネント
 */
const Header = ({ openHowToPlayDialog }: Props): JSX.Element => {
	/**
	 * 遊び方ボタンクリックイベント
	 */
	const handleClickOpenHowToPlayDialogButton = () => {
		openHowToPlayDialog(); // 遊び方ダイアログを表示
	}


	return (
		<div id="app-header">
			<div id="header-core">
				<div id="app-title">Make10</div>
				<div id="header-buttons">
					<IconButton
						size="small"
						sx={{ color: '#469b98' }}
						onClick={handleClickOpenHowToPlayDialogButton}
					>?</IconButton>
					<IconButton size="small" sx={{ color: '#469b98' }}>W</IconButton>
					<IconButton size="small" sx={{ color: '#469b98' }}>O</IconButton>
				</div>
			</div>
			<Divider sx={{ borderColor: '#469b98', marginTop: '8px' }} />
		</div>
	);
}

export default Header;