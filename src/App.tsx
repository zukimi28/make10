import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header/Header';
import HowToPlayDialog from './components/how_to_play_dialog/HowToPlayDialog';
import MakeTen from './components/make_ten/MakeTen';
import { ProblemInfo, StorageData } from './core/types';
import { problemList } from './assets/problem/problemList';
import Chance from 'chance';

/**
 * アプリケーションコンポーネント
 * @returns アプリケーションコンポーネント
 */
function App() {
  const problemCount: number = 5; // 出題する問題数

  // 問題情報リスト
  const [problemInfoList, setProblemInfoList] = useState<ProblemInfo[]>([]);

  // 問題の数字配列[4]
	const [problemNumbers, setProblemNumbers] = useState<number[]>([0, 0, 0, 0]);

  // 遊び方ダイアログの表示フラグ
  const [isOpenHowToDialog, setIsOpenHowToDialog] = useState(false);

  // 遊び方ダイアログの初期表示フラグ
  const [isInitDisplay, setIsInitDisplay] = useState(true);

  // 正解数
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  /**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
    const today = getNowDate(); // 今日の日付を取得
    // 今日始めてページを表示した場合
    if (localStorage.getItem(StorageData.OpenPageDate) !== today) {
      localStorage.setItem(StorageData.OpenPageDate, today); // ストレージに今日の日付を格納
      setIsInitDisplay(true); // 遊び方ダイアログ初期表示フラグON
      changeHowToPlayDialog(true); // 遊び方ダイアログを表示
    }
    const problemInfos = createProblem(today);

    // 出題する問題情報リストに格納
    setProblemInfoList(problemInfos);

    const newProblemNumbers = [...problemNumbers]; // 配列の値渡し
    newProblemNumbers[0] = problemInfos[correctAnswerCount].problem[0];
    newProblemNumbers[1] = problemInfos[correctAnswerCount].problem[1];
    newProblemNumbers[2] = problemInfos[correctAnswerCount].problem[2];
    newProblemNumbers[3] = problemInfos[correctAnswerCount].problem[3];

    // 問題の更新
    setProblemNumbers(newProblemNumbers);
	}, []);

  /**
   * 問題正解イベント
   */
  const handleCorrectAnswer = (): void => {
    // 最終問題に正解した場合
    if (correctAnswerCount >= problemCount - 1) {
      // TODO: リザルト画面の表示
      return; // 後続処理をスキップする 
    }

    // 正解数を加算
    const newCorrectAnswerCount = correctAnswerCount + 1;
    setCorrectAnswerCount(newCorrectAnswerCount);

    // 新しい問題を設定
    const newProblemNumbers = [...problemNumbers]; // 配列の値渡し
    newProblemNumbers[0] = problemInfoList[newCorrectAnswerCount].problem[0];
    newProblemNumbers[1] = problemInfoList[newCorrectAnswerCount].problem[1];
    newProblemNumbers[2] = problemInfoList[newCorrectAnswerCount].problem[2];
    newProblemNumbers[3] = problemInfoList[newCorrectAnswerCount].problem[3];

    // 問題の更新
    setProblemNumbers(newProblemNumbers);
  }

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
   * @param {string} today - 今日の日付(YYYMMDD)
   * @returns {ProblemInfo[]} 問題情報配列
   */
  const createProblem = (today: string): ProblemInfo[] => {
    // 今日の日付をシード値として乱数生成用インスタンを生成
    const chance = new Chance(today);
    const problemListIndexs: number[] = []; // 乱数で生成する問題のindexリスト
    const problemOrderList: number[][] = []; // 4つの数字の出題順リスト

    // 出題する問題数分乱数を生成
    for (let i = 0; i < problemCount; i++) {
      // 問題インデックス配列に格納
      problemListIndexs.push(chance.integer({ min: 0, max: problemList.length - 1 }));

      // 出題順を生成
      const problemOrder: number[] = [];
      while (problemOrder.length < 4) {
        const order = chance.integer({ min: 0, max: 3 });
        // 重複していない場合
        if (!problemOrder.includes(order)) {
          problemOrder.push(order);
        }
      }
      problemOrderList.push(problemOrder); // リストに格納
    }
    console.log(problemListIndexs.join(',')); // TODO: 動作確認のため追加

    const problemInfos: ProblemInfo[] = []; // 問題情報配列
    // 問題情報配列に情報を設定
    problemListIndexs.forEach((index, i) => {
      // 問題を取得
      const problem = problemList[index].problem;
      problemInfos.push({
        problem: [
          problem[problemOrderList[i][0]],
          problem[problemOrderList[i][1]],
          problem[problemOrderList[i][2]],
          problem[problemOrderList[i][3]],
        ],
        answer: problemList[index].answer,
      })
    });
    console.log(problemInfos);
    return problemInfos;
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
          <MakeTen
            problemNumbers={problemNumbers}
            correctAnswer={handleCorrectAnswer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
