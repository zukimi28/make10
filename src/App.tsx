import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/Header';
import HowToPlayDialog from './components/how_to_play_dialog/HowToPlayDialog';
import MakeTen from './components/make_ten/MakeTen';
import { ButtonType } from './core/types';

/**
 * アプリケーションコンポーネント
 * @returns アプリケーションコンポーネント
 */
function App() {
  // 問題の数字配列[4]
	const [problemNumbers, setProblemNumbers] = useState<number[]>([0, 0, 0, 0]);

  // 遊び方ダイアログの表示フラグ
  const [isOpen, setIsOpen] = React.useState(false);

  /**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
    changeHowToPlayDialog(true);
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

  /**
   * 遊び方ダイアログの表示/非表示の切り替え
   * @param {boolean} isOpen - ダイアログを表示させるか否か
   */
  const changeHowToPlayDialog = (isOpen: boolean): void => {
    console.log(isOpen? '遊び方ダイアログ表示' : '遊び方ダイアログ非表示');
    setIsOpen(isOpen); // 表示非表示を切り替える
  }

  return (
    <div id="app">
      <div id="app-container">
        <div id="app-core">
          <HowToPlayDialog isOpen={isOpen} closeHowToPlayDialog={() => changeHowToPlayDialog(false)} />
          <Header openHowToPlayDialog={() => changeHowToPlayDialog(true)} />
          <MakeTen problemNumbers={problemNumbers} />
        </div>
      </div>
    </div>
  );
}

export default App;
