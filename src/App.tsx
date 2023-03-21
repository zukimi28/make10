import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/Header';
import MakeTen from './components/make_ten/MakeTen';
import { ButtonType } from './core/types';

/**
 * アプリケーションコンポーネント
 * @returns アプリケーションコンポーネント
 */
function App() {
  // 問題の数字配列[4]
	const [problemNumbers, setProblemNumbers] = useState<number[]>([0, 0, 0, 0]);

  /**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
		createProblem(); // 問題の生成
	}, []);

  /**
   * 問題の生成
   * TODO: 仮実装
   */
    const createProblem = (): void => {
      const newProblemNumbers = [...problemNumbers]; // 配列の値渡し
      newProblemNumbers[ButtonType.FirstNumber] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
      newProblemNumbers[ButtonType.SecondNumber] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
      newProblemNumbers[ButtonType.ThirdNumber] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
      newProblemNumbers[ButtonType.FourthNumber] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
  
      // 問題の更新
      setProblemNumbers(newProblemNumbers);
    }

  // // 表示するサイコロの目
  // const [diceValue, setDiceValue] = useState<number>(DiceDefaultMaxValue);

  // // 表示したサイコロの目の履歴
  // const [diceValueHistory, setDiceValueHistory] = useState<number[]>([]);

  // // サイコロの最大値
  // const [diceMaxValue, setDiceMaxValue] = useState<number>(DiceDefaultMaxValue);

  // /**
  //  * STARTボタン押下イベント
  //  */
  // const handleCreateRandomNumber = (): void => {
  //   // サイコロの目の履歴をコピー
  //   const newDiceValueHistory = [...diceValueHistory];

  //   // 前回のサイコロの目を履歴に追加(先頭に追加)
  //   newDiceValueHistory.unshift(diceValue);

  //   // 履歴の数が表示させる個数を超えていた場合
  //   if (newDiceValueHistory.length > DiceValueHistoryNumber) {
  //     // 6回前のサイコロの目を履歴から削除(配列の最後を削除)
  //     newDiceValueHistory.pop();
  //   }

  //   // 乱数生成
  //   const newRandomNumber = createRandomNumber(DiceMinValue, diceMaxValue);

  //   // 反映
  //   setDiceValue(newRandomNumber);
  //   setDiceValueHistory(newDiceValueHistory);
  // }

  // /**
  //  * 乱数生成する
  //  * @param {number} min - 最小値
  //  * @param {number} max - 最大値
  //  * @returns ランダムに生成した整数
  //  */
  // const createRandomNumber = (min: number, max: number): number => {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // }

  // /**
  //  * サイコロの最大値を変更する
  //  * @param {boolean} isIncrement - true: +1, false: -1
  //  */
  // const changeDiceMaxValue = (isIncrement: boolean): void => {
  //   // 最小値判定
  //   if (diceMaxValue === DiceMinValue && !isIncrement) {
  //     return;
  //   }

  //   const newDiceMaxValue = isIncrement? diceMaxValue + 1: diceMaxValue - 1;
    
  //   // 反映
  //   setDiceMaxValue(newDiceMaxValue);
  // }

  return (
    <div id="app">
      <div id="app-container">
        <div id="app-core">
          <Header />
          <MakeTen problemNumbers={problemNumbers} />
        </div>
      </div>
    </div>
  );
}

export default App;
