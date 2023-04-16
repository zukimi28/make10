import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/Header';
import HowToPlayDialog from './components/how_to_play_dialog/HowToPlayDialog';
import MakeTen from './components/make_ten/MakeTen';
import { StorageData } from './core/types';

/**
 * アプリケーションコンポーネント
 * @returns アプリケーションコンポーネント
 */
function App() {
  // 問題の数字配列[4]
	const [problemNumbers, setProblemNumbers] = useState<number[]>([0, 0, 0, 0]);

  // 遊び方ダイアログの表示フラグ
  const [isOpenHowToDialog, setIsOpenHowToDialog] = useState(false);

  // 遊び方ダイアログの初期表示フラグ
  const [isInitDisplay, setIsInitDisplay] = useState(true);

  /**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
    const today = getNowDate(); // 今日の日付を取得
    // 今日既にページを開いていた場合
    if (localStorage.getItem(StorageData.OpenPageDate) === today) {
      console.log('今日は既に開いてます。');
    }
    // 今日始めてページを開いた場合
    else {
      localStorage.setItem(StorageData.OpenPageDate, today); // ストレージに今日の日付を格納
      setIsInitDisplay(true); // 遊び方ダイアログ初期表示フラグON
      changeHowToPlayDialog(true); // 遊び方ダイアログを表示
    }
    createProblem(); // TODO: 問題の生成
	}, []);

  /**
   * 現在日付の取得(YYYYMMDD)
   * @returns {string} 現在の日付(YYYYMMDD)
   */
  const getNowDate = (): string => {
    const dateObj = new Date();
    const yearStr = dateObj.getFullYear().toString();
    const month = dateObj.getMonth() + 1;
    let monthStr = month.toString();
    if (monthStr.length === 1) {
      monthStr = '0' + monthStr;
    }
    const date = dateObj.getDate();
    let dateStr = date.toString();
    if (dateStr.length === 1) {
      dateStr = '0' + dateStr;
    }
    return yearStr + monthStr + dateStr;
  }

  /**
   * 問題の生成
   * TODO: 仮実装
   */
  const createProblem = (): void => {
    const newProblemNumbers = [...problemNumbers]; // 配列の値渡し
    newProblemNumbers[0] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
    newProblemNumbers[1] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
    newProblemNumbers[2] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成
    newProblemNumbers[3] = Math.floor(Math.random() * 8); // TODO: 0~9までの乱数生成

    // 問題の更新
    setProblemNumbers(newProblemNumbers);
  }

  /**
   * 遊び方ダイアログの表示/非表示の切り替え
   * @param {boolean} isOpen - ダイアログを表示させるか否か
   */
  const changeHowToPlayDialog = (isOpen: boolean): void => {
    console.log(isOpen? '遊び方ダイアログ表示' : '遊び方ダイアログ非表示');
    setIsOpenHowToDialog(isOpen); // 表示非表示を切り替える
  }

  return (
    <div id="app">
      <div id="app-container" className="app-container-center">
        <div id="app-core">
          <HowToPlayDialog
            isOpen={isOpenHowToDialog}
            isInitDisplay={isInitDisplay}
            closeHowToPlayDialog={() => changeHowToPlayDialog(false)} />
          <Header
            openHowToPlayDialog={() => {
              setIsInitDisplay(false);
              changeHowToPlayDialog(true);
            }}
          />
          <MakeTen problemNumbers={problemNumbers} />
        </div>
      </div>
    </div>
  );
}

export default App;
