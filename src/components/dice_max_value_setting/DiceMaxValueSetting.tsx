import React from 'react';
import './DiceMaxValueSetting.css';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * DiceMaxValueSettingコンポーネントのprops
 * @property {number} diceMaxValue - サイコロの目の最大値
 * @property {Function} changeDiceMaxValue - サイコロの最大値変更関数
 */
type Props = {
	diceMaxValue: number;
	changeDiceMaxValue: (isIncrement: boolean) => void;
};

/**
 * DiceMaxValueSettingコンポーネント
 * @param {number} diceMaxValue - サイコロの目の最大値
 * @property {Function} changeDiceMaxValue - サイコロの最大値変更関数
 * @returns DiceMaxValueSettingコンポーネント
 */
const DiceMaxValueSetting = ({ diceMaxValue, changeDiceMaxValue }: Props): JSX.Element => {
	return (
		<div id="dice-max-value-setting-component">
			<Fab size="small" color="primary" aria-label="add" onClick={() => changeDiceMaxValue(false)}>
				<RemoveIcon />
			</Fab>
			<div id="dice-max-value">
				{diceMaxValue}
			</div>
			<Fab size="small" color="primary" aria-label="add" onClick={() => changeDiceMaxValue(true)}>
				<AddIcon />
			</Fab>
		</div>
		);
}

export default DiceMaxValueSetting;