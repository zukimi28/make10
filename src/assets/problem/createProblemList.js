// 重複なしの4つの数字の組み合わせを生成
const noDuplicationNumbers = [[0, 0, 0, 0]];

// 1つ目の数字
for (let firstNumber = 0; firstNumber < 10; firstNumber++) {
  // 2つ目の数字
  for (let secondNumber = 0; secondNumber < 10; secondNumber++) {
    // 3つ目の数字
    for (let thirdNumber = 0; thirdNumber < 10; thirdNumber++) {
      // 4つ目の数字
      for (let fourthNumber = 0; fourthNumber < 10; fourthNumber++) {
        // 重複していないか判定
        if (checkNoDuplication(firstNumber, secondNumber, thirdNumber, fourthNumber, noDuplicationNumbers)) {
          noDuplicationNumbers.push([
            firstNumber,
            secondNumber,
            thirdNumber,
            fourthNumber,
          ]);
        }
      }
    }
  }
}
console.log('数字の組み合わせ数:', noDuplicationNumbers.length);

// 問題配列
const problemList = [];

noDuplicationNumbers.forEach((numbers) => {
  // 10が生成できるか判定
  const process = createTen(numbers);

  // 10が生成できた場合
  if (process != null) {
    // 問題配列に追加
    problemList.push({
      problem: numbers,
      answer: process,
    });
  }
});

console.log('問題数:', problemList.length);

const problemListHeader = 'export const problemList = [\n';
const problemListFooter = '];'
let problemListString = '';
problemList.forEach(value => {
  problemListString += '  { problem: [' + value.problem.join(',') + '], answer: \'' + value.answer + '\' },\n';
});

const fs = require('fs');
fs.writeFileSync('src/assets/problem/problemList.tsx', problemListHeader + problemListString + problemListFooter);
console.log('出力完了');



/**
 * 重複判定
 * @param {number} first - 1つ目の数字
 * @param {number} second - 2つ目の数字
 * @param {number} third - 3つ目の数字
 * @param {number} fourth - 4つ目の数字
 * @param {[number[]]} numberList - 4つの数字配列
 * @returns {boolean} true:重複なし, false:重複あり
 */
function checkNoDuplication(first, second, third, fourth, numberList) {
  // 空判定
  if (numberList.length === 0) {
    return true;
  }

  // 探索対象の数列
  const targetNumbers = [
    first,
    second,
    third,
    fourth
  ];

  // 配列内を探索
  numberListLoop: for (let i = 0; i < numberList.length; i++) {
    const numbers = [...numberList[i]];
    for (let j = 0; j < targetNumbers.length; j++) {
      const index = numbers.indexOf(targetNumbers[j]);
      // 数字が含まれない場合
      if (index === -1) {
        continue numberListLoop;
      }
      // 全重複か判定
      if (numbers.length === 1) {
        return false; // 重複あり
      }
      numbers.splice(index, 1); // 配列内の該当の数字を削除
    }
  }

  return true; // 重複なし
}

/**
 * 4つの数字で10を生成する
 * @param {number[]} numbers - 4つの数字
 * @returns {string | null} 10を作るための式（生成不可の場合はnullを返す）
 */
function createTen(numbers) {
  // 1つ目の数字選定
  for (let firstIndex = 0; firstIndex < numbers.length; firstIndex++) {
    // 計算に使用していない残りの数字配列
    const firstNumbers = [...numbers];
    // 最初の計算に使用する1つ目の数字（と余りの数列）
    const firstNumber = firstNumbers.splice(firstIndex, 1)[0];

    // 2つ目の数字選定
    for (let secondIndex = 0; secondIndex < firstNumbers.length; secondIndex++) {
      // 計算に使用していない残りの数字配列
      const secondNumbers = [...firstNumbers];
      // 最初の計算に使用する2つ目の数字（と余りの数列）
      const secondNumber = secondNumbers.splice(secondIndex, 1)[0];
      
      // 1回目の演算
      for (let i = 0; i < 4; i++) {
        const firstResultNumber = doCalc(firstNumber, secondNumber, i);
        secondNumbers.push(firstResultNumber); // 3つ目の数字候補として配列に追加

        // 第一式生成
        const firstProcess = firstNumber + getCalc(i) + secondNumber;

        // 3つ目の数字選定
        for (let thirdIndex = 0; thirdIndex < secondNumbers.length; thirdIndex++) {
          // 計算に使用していない残りの数字配列
          const thirdNumbers = [...secondNumbers];
          // 2回目の計算に使用する1つ目の数字（と余りの数列）
          const thirdNumber = thirdNumbers.splice(thirdIndex, 1)[0];

          // 4つ目の数字選定
          for (let fourthIndex = 0; fourthIndex < thirdNumbers.length; fourthIndex++) {
            // 計算に使用していない残りの数字配列
            const fourthNumbers = [...thirdNumbers];
            // 2回目の計算に使用する2つ目の数字（と余りの数列）
            const fourthNumber = fourthNumbers.splice(fourthIndex, 1)[0];
            
            // 2回目の演算
            for (let j = 0; j < 4; j++) {
              const secondResultNumber = doCalc(thirdNumber, fourthNumber, j);
              fourthNumbers.push(secondResultNumber); // 配列に追加

              let secondProcess = '';
              // 3つ目の数字として1回目の演算で算出した値を使用した場合
              if (thirdIndex === secondNumbers.length - 1) {
                // 1回目の演算で足し算か引き算、かつ2回目の演算で掛け算か割り算を行う場合
                if ((i === 0 || i === 1) && (j === 2 || j === 3)) {
                  secondProcess = '(' + firstProcess + ')' + getCalc(j) + fourthNumber;
                }
                else {
                  secondProcess = firstProcess + getCalc(j) + fourthNumber;
                }
              }
              // 4つ目の数字として1回目の演算で算出した値を使用した場合
              else if (fourthIndex === thirdNumbers.length - 1) {
                // 1回目の演算で足し算か引き算、かつ2回目の演算で掛け算か割り算を行う場合
                if ((i === 0 || i === 1) && (j === 2 || j === 3)) {
                  secondProcess = thirdNumber + getCalc(j) + '(' + firstProcess + ')';
                }
                else {
                  // 2回目の演算が引き算かつ1回目の先頭が0の場合
                  if (j === 1 && firstNumber === 0) {
                    secondProcess = thirdNumber + getCalc(j) + '(' + firstProcess + ')';
                  }
                  else {
                    secondProcess = thirdNumber + getCalc(j) + firstProcess;
                  }
                }
              }
              else {
                secondProcess = thirdNumber + getCalc(j) + fourthNumber;
              }

              // 最終演算
              for (let k = 0; k < 4; k++) {
                const answer = doCalc(fourthNumbers[0], fourthNumbers[1], k);
                // 引き算、割り算用に順番が逆の場合も計算
                const _answer = doCalc(fourthNumbers[1], fourthNumbers[0], k);
                // 10の計算に成功した場合
                if (answer === 10) {
                  let process = '';
                  // 2回目の演算で1回目の計算結果が使用されなかった場合
                  if (thirdIndex < secondNumbers.length - 1 && fourthIndex < thirdNumbers.length - 1) {
                    // 最終演算が掛け算か割り算の場合
                    if (k === 2 || k === 3) {
                      // 1回目2回目ともに足し算か引き算の場合
                      if ((i === 0 || i === 1) && (j === 0 || j === 1)) {
                        process = '(' + firstProcess + ')' + getCalc(k) + '(' + secondProcess + ')';
                      }
                      // 1回目のみ足し算か引き算の場合
                      else if (i === 0 || i === 1) {
                        process = '(' + firstProcess + ')' + getCalc(k) + secondProcess;
                      }
                      // 2回目のみ足し算か引き算の場合
                      else if (j === 0 || j === 1) {
                        process = firstProcess + getCalc(k) + '(' + secondProcess + ')';
                      }
                      else {
                        process = firstProcess + getCalc(k) + secondProcess;
                      }
                    }
                    else {
                      process = firstProcess + getCalc(k) + secondProcess;
                    }
                  }
                  // 括弧で囲む必要がある場合
                  else if ((j === 0 || j === 1) && (k === 2 || k === 3)) {
                    process = fourthNumbers[0] + getCalc(k) + '(' + secondProcess + ')';
                  }
                  else {
                    process = fourthNumbers[0] + getCalc(k) + secondProcess;
                  }
                  return process;
                  // 順番を逆の時に計算が成功した場合
                } else if (_answer === 10) {
                  let process = '';
                  // 2回目の演算で1回目の計算結果が使用されなかった場合
                  if (thirdIndex < secondNumbers.length - 1 && fourthIndex < thirdNumbers.length - 1) {
                    // 最終演算が掛け算か割り算の場合
                    if (k === 2 || k === 3) {
                      // 1回目2回目ともに足し算か引き算の場合
                      if ((i === 0 || i === 1) && (j === 0 || j === 1)) {
                        process = '(' + secondProcess + ')' + getCalc(k) + '(' + firstProcess + ')';
                      }
                      // 1回目のみ足し算か引き算の場合
                      else if (i === 0 || i === 1) {
                        process = '(' + secondProcess + ')' + getCalc(k) + firstProcess;
                      }
                      // 2回目のみ足し算か引き算の場合
                      else if (j === 0 || j === 1) {
                        process = secondProcess + getCalc(k) + '(' + firstProcess + ')';
                      }
                      else {
                        process = secondProcess + getCalc(k) + firstProcess;
                      }
                    }
                    else {
                      process = secondProcess + getCalc(k) + firstProcess;
                    }
                  }
                  // 括弧で囲む必要がある場合
                  else if ((j === 0 || j === 1) && (k === 2 || k === 3)) {
                    process = '(' + secondProcess + ')' + getCalc(k) + fourthNumbers[0];
                  }
                  else {
                    process = secondProcess + getCalc(k) + fourthNumbers[0];
                  }
                  return process;
                }
              }
              fourthNumbers.pop(); // 追加した演算結果を削除
            }
          }
        }
        secondNumbers.pop(); // 追加した演算結果を削除
      }
    }
  }
  return null;
}

/**
 * 四則演算
 * @param {number} first - 1つ目の数字
 * @param {number} second - 2つ目の数字
 * @param {number} calcType - 演算子（0:+, 1:-, 2:*, 3:/）
 * @returns {number} 計算結果
 */
function doCalc(first, second, calcType) {
  if (calcType === 0) {
    return Number(first) + Number(second);
  }
  else if (calcType === 1) {
    return Number(first) - Number(second);
  }
  else if (calcType === 2) {
    return Number(first) * Number(second);
  }
  else {
    return Number(first) / Number(second);
  }
}

/**
 * 計算式の生成
 * @param {number} firstNumber - 1つ目の数字
 * @param {number} secondNumber - 2つ目の数字
 * @param {number} thirdNumber - 3つ目の数字
 * @param {number} fourthNumber - 4つ目の数字
 * @param {number[]} finalNumbers - 最終計算に使用した数列[2]
 * @param {number} firstCalcType - 1回目の演算子
 * @param {number} secondCalcType - 2回目の演算子
 * @param {number} thirdCalcType - 3回目の演算子
 * @param {number[]} numbers - 数字の組み合わせ
 * @returns 
 */
function createProcess(firstNumber,
                      secondNumber,
                      thirdNumber,
                      fourthNumber,
                      finalNumbers,
                      firstCalcType,
                      secondCalcType,
                      thirdCalcType,
                      numbers) {
  // 最初の計算式を生成
  let process = firstNumber + getCalc(firstCalcType) + secondNumber;
  let _process = '';
  let finalNumber = 0; // 最後の計算まで余った値

  // 1回目に計算した値を3つ目の数字として2回目の計算で使用した場合
  if (!numbers.includes(thirdNumber)) {
    // 1回目の計算が足し算、もしくは引き算で、2回目の計算が掛け算、もしくは割り算の場合
    if ((firstCalcType === 0 || firstCalcType === 1) && (secondCalcType === 2 || secondCalcType === 3)) {
      process = '(' + process + ')' + getCalc(secondCalcType) + fourthNumber;
    }
    else {
      process = process + getCalc(secondCalcType) + fourthNumber;
    }
    const targetNumbers = [firstNumber, secondNumber, fourthNumber];
    const _numbers = [...numbers];
    targetNumbers.forEach(target => {
      const index = _numbers.indexOf(target);
      _numbers.splice(index, 1);
    });
    finalNumber = _numbers[0];
  }
  // 1回目に計算した値を4つ目の数字として2回目の計算で使用した場合
  else if (!numbers.includes(fourthNumber)) {
    // 1回目の計算が足し算、もしくは引き算で、2回目の計算が掛け算、もしくは割り算の場合
    if ((firstCalcType === 0 || firstCalcType === 1) && (secondCalcType === 2 || secondCalcType === 3)) {
      process = thirdNumber + getCalc(secondCalcType) + '(' + process + ')';
    }
    else {
      process = thirdNumber + getCalc(secondCalcType) + process;
    }
    const targetNumbers = [firstNumber, secondNumber, thirdNumber];
    const _numbers = [...numbers];
    targetNumbers.forEach(target => {
      const index = _numbers.indexOf(target);
      _numbers.splice(index, 1);
    });
    finalNumber = _numbers[0];
  }
  else {
    _process = thirdNumber + getCalc(secondCalcType) + fourthNumber;
  }

  // 最終計算でどちらも計算後の値を使用した場合
  if (_process !== '') {
    // 最後の計算が掛け算、割り算の場合
    if (thirdCalcType === 2 || thirdCalcType === 3) {
      // 1回目の計算が足し算、引き算の場合
      if (process.includes('+') || process.includes('-')) {
        process = '(' + process + ')';
      }
      // 2回目の計算が足し算、引き算の場合
      if (_process.includes('+') || _process.includes('-')) {
        _process = '(' + _process + ')';
      }
    }
    process = process + getCalc(thirdCalcType) + _process;
  }
  else {
    // 1つ目の数字が最後まで残った数字の場合
    if (finalNumbers[0] === finalNumber) {
      // 先頭が()で囲われている場合
      if (process.indexOf('(') === 0) {
        process = finalNumber + getCalc(thirdCalcType) + process;
      }
      // 最も左の演算子が掛け算か割り算の場合
      else if (!numbers.includes(thirdNumber) && (secondCalcType === 2 || secondCalcType === 3)) {
        process = finalNumber + getCalc(thirdCalcType) + process;
      }
      // 最も左の演算子が掛け算か割り算の場合
      else if (!numbers.includes(fourthNumber) && (secondCalcType === 2 || secondCalcType === 3)) {
        process = finalNumber + getCalc(thirdCalcType) + process;
      }
      else {
        process = finalNumber + getCalc(thirdCalcType) + '(' + process + ')';
      }
    }
    // 2つ目の数字が最後まで残った数字の場合
    else {
      // 最後が()で囲われている場合
      if (process.substring(process.length - 1, process.length) === ')') {
        process = process + getCalc(thirdCalcType) + finalNumber;
      }
      // 最も右の演算子が掛け算か割り算の場合
      else if (!numbers.includes(thirdNumber) && (firstCalcType === 2 || firstCalcType === 3)) {
        process = process + getCalc(thirdCalcType) + finalNumber;
      }
      // 最も左の演算子が掛け算か割り算の場合
      else if (!numbers.includes(fourthNumber) && (firstCalcType === 2 || firstCalcType === 3)) {
        process = process + getCalc(thirdCalcType) + finalNumber;
      }
      else {
        process = '(' + process + ')' + getCalc(thirdCalcType) + finalNumber;
      }
    }
  }

  return process;
}

/**
 * 文字の演算子を取得
 * @param {number} calcType 
 */
function getCalc(calcType) {
  if (calcType === 0) {
    return '+';
  }
  else if (calcType === 1) {
    return '-';
  }
  else if (calcType === 2) {
    return '×';
  }
  else {
    return '÷';
  }
}