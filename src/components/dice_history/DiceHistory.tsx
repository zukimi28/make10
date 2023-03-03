import React from 'react';
import './DiceHistory.css';

/**
 * DiceHistoryコンポーネントのprops
 * @property {number[]} diceValueHistory - サイコロの目の履歴
 */
type Props = {
	diceValueHistory: number[];
};

/**
 * DiceHistoryコンポーネント
 * @param {number[]} diceValueHistory - サイコロの目の履歴
 * @returns DiceHistoryコンポーネント
 */
const DiceHistory = ({ diceValueHistory }: Props): JSX.Element => {
	return (
		<div id="dice-value-history-component">
			{diceValueHistory.map((value: number, index: number) => 
				<div key={index} className="dice-history-one" style={{fontSize: (16 - index * 2) + 'px'}}>
					{value}
				</div>
			)}
		</div>
		);
}

export default DiceHistory;