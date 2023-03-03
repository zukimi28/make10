import React, { useState } from 'react';
import './App.css';
import { DiceMinValue, DiceDefaultMaxValue, DiceValueHistoryNumber } from './constants/diceSetting';
import DiceHistory from './components/dice_history/DiceHistory';
import DiceMaxValueSetting from './components/dice_max_value_setting/DiceMaxValueSetting';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

/**
 * アプリケーションコンポーネント
 * @returns アプリケーションコンポーネント
 */
function App() {
  // 表示するサイコロの目
  const [diceValue, setDiceValue] = useState<number>(DiceDefaultMaxValue);

  // 表示したサイコロの目の履歴
  const [diceValueHistory, setDiceValueHistory] = useState<number[]>([]);

  // サイコロの最大値
  const [diceMaxValue, setDiceMaxValue] = useState<number>(DiceDefaultMaxValue);

  /**
   * STARTボタン押下イベント
   */
  const handleCreateRandomNumber = (): void => {
    // サイコロの目の履歴をコピー
    const newDiceValueHistory = [...diceValueHistory];

    // 前回のサイコロの目を履歴に追加(先頭に追加)
    newDiceValueHistory.unshift(diceValue);

    // 履歴の数が表示させる個数を超えていた場合
    if (newDiceValueHistory.length > DiceValueHistoryNumber) {
      // 6回前のサイコロの目を履歴から削除(配列の最後を削除)
      newDiceValueHistory.pop();
    }

    // 乱数生成
    const newRandomNumber = createRandomNumber(DiceMinValue, diceMaxValue);

    // 反映
    setDiceValue(newRandomNumber);
    setDiceValueHistory(newDiceValueHistory);
  }

  /**
   * 乱数生成する
   * @param {number} min - 最小値
   * @param {number} max - 最大値
   * @returns ランダムに生成した整数
   */
  const createRandomNumber = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * サイコロの最大値を変更する
   * @param {boolean} isIncrement - true: +1, false: -1
   */
  const changeDiceMaxValue = (isIncrement: boolean): void => {
    // 最小値判定
    if (diceMaxValue === DiceMinValue && !isIncrement) {
      return;
    }

    const newDiceMaxValue = isIncrement? diceMaxValue + 1: diceMaxValue - 1;
    
    // 反映
    setDiceMaxValue(newDiceMaxValue);
  }

  return (
    <div id="app-container">
      <Card sx={{ maxWidth: 500 }} id="app-card">
        <CardContent>
          <div id="app-components">
            <DiceMaxValueSetting diceMaxValue={diceMaxValue} changeDiceMaxValue={changeDiceMaxValue}></DiceMaxValueSetting>
            <DiceHistory diceValueHistory={diceValueHistory}></DiceHistory>
            <div id="dice-value">
              {diceValue}
            </div>
            <Button variant="contained" onClick={handleCreateRandomNumber}>START</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
