import React, { useEffect, useState } from 'react';
import { ButtonStyle, NumberCalcButtonStyles, ButtonType, ButtonAreaSize, VisibilityInButtonStyle } from '../../core/types';
import './MakeTen.css';

/**
 * MakeTenコンポーネントのprops
 * @property {number[]} problemNumbers - 問題の数字配列[4]
 */
type Props = {
	problemNumbers: number[];
}

/**
 * MakeTenコンポーネント
 * @returns MakeTenコンポーネント
 */
const MakeTen = ({problemNumbers}: Props): JSX.Element => {
	// 丸いボタンの色
	const buttonColor = {
		number: '#93c7c9',
		plus: '#d7ffd4',
		minus: '#fffde8',
		multiply: '#fcdede',
		division: '#f6e2ff',
	};
	// 丸いボタン配列
	const roundButtons: ButtonType[] = [
		ButtonType.FirstNumber,
		ButtonType.SecondNumber,
		ButtonType.ThirdNumber,
		ButtonType.FourthNumber,
		ButtonType.FirstResultNumber,
		ButtonType.SecondResultNumber,
		ButtonType.AnswerNumber,
		ButtonType.Plus,
		ButtonType.Minus,
		ButtonType.Multiply,
		ButtonType.Division
	];
	// 数字ボタンと演算ボタンの表示エリアサイズのデフォルト値
	const defaultButtonAreaSize: ButtonAreaSize = {
		width: 300,
		height: 600,
	};
	const defaultButtonSize: number = 30; // 数字ボタンと演算ボタンのサイズのデフォルト値(px)
	// 数字ボタンと演算ボタンに動的に設定するスタイルのデフォルト値
	const defaultButtonStyle: ButtonStyle = {
		width: defaultButtonSize + 'px',
		height: defaultButtonSize + 'px',
		lineHeight: defaultButtonSize + 'px',
		top: '0px',
		left: '0px',
		backgroundColor: buttonColor.number,
		opacity: '1',
		visibility: VisibilityInButtonStyle.Visible,
	}
	const buttonMarginPerWidth: number = 1/4; // ボタン幅に対するボタン間マージンの割合
	const selectedButtonAreaPerHeight: number = 3; // 数字ボタン高さに対する選択したボタン表示エリアの高さの割合
	const numberButtonBottomMarginPerHeight: number = 1/2; // 数字ボタン高さに対する数字ボタン下の余白の高さの割合
	const calcButtonBottomMarginPerHeight: number = 1; // 演算ボタン高さに対する演算ボタン下の余白の高さの割合
	const resizeEventInterval: number = 50; // リサイズイベントの発生インターバル(ms)
	const buttonAnimationStopInterval: number = 200; // ボタンのアニメーション一時停止時間(ms)
	const selectedButtonsCalcWaitTime: number = 200; // 選択したボタンの計算開始までの待機時間(ms)
	const resultButtonVisibleWaitTime: number = 100; // 算出した数字を表示するまでの待機時間(ms)
	const setPositionButtonWaitTime: number = 300; // 選択しているボタンをもとの位置に戻すまでの待機時間(ms)
	const failedWaitTime: number = 200; // 不正解時に回答を表示しておく時間(ms)
	const maxAppContainerWidth: number = 500; // 最大アプリケーション幅(px)
	let resizeEventSetTimeoutId: number = 0; // リサイズイベント時のsetTimeoutID
	let buttonAnimationSetTimeoutId: number = 0; // ボタンアニメーションの一時解除setTimeoutID

	// 選択されているボタン配列（[3]{数字, 演算子, 数字}）
	const [selectedButtons, setSelectedButtons] = useState<ButtonType[]>([]);

	// 数字と演算子ボタンに動的に設定するスタイル連想配列
	const [numberCalcButtonStyles, setNumberCalcButtonStyles] = useState<NumberCalcButtonStyles>({
		[ButtonType.FirstNumber]: defaultButtonStyle,
		[ButtonType.SecondNumber]: defaultButtonStyle,
		[ButtonType.ThirdNumber]: defaultButtonStyle,
		[ButtonType.FourthNumber]: defaultButtonStyle,
		[ButtonType.FirstResultNumber]: defaultButtonStyle,
		[ButtonType.SecondResultNumber]: defaultButtonStyle,
		[ButtonType.AnswerNumber]: defaultButtonStyle,
		[ButtonType.Plus]: defaultButtonStyle,
		[ButtonType.Minus]: defaultButtonStyle,
		[ButtonType.Multiply]: defaultButtonStyle,
		[ButtonType.Division]: defaultButtonStyle,
	});

	// 算出された1つ目の数字ボタンの表示位置
	const [firstResultNumberPosition, setFirstResultNumberPosition] = useState<ButtonType>(ButtonType.FirstNumber);

	// 算出された2つ目の数字ボタンの表示位置
	const [secondResultNumberPosition, setSecondResultNumberPosition] = useState<ButtonType>(ButtonType.SecondNumber);

	// 算出された1つ目の数字ボタンの値
	const [firstResultNumberValue, setFirstResultNumberValue] = useState<string>('');

	// 算出された2つ目の数字ボタンの値
	const [secondResultNumberValue, setSecondResultNumberValue] = useState<string>('');

	// 算出した回答の値
	const [answerNumberValue, setAnswerNumberValue] = useState<string>('');

	// ボタンのサイズ(px)
	const [buttonSize, setButtonSize] = useState(defaultButtonSize);

	// ボタンエリアのサイズ(px)
	const [buttonAreaSize, setButtonAreaSize] = useState<ButtonAreaSize>(defaultButtonAreaSize);

	// ボタンアニメーション有効フラグ
	const [isButtonAnimation, setIsButtonAnimation] = useState(false);

	/**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
		const newButtonAreaSize = getButtonAreaSize(); // ボタンエリアのサイズを取得
		const newButtonSize = setButtonSizeStyle(newButtonAreaSize); // ボタンサイズの設定
		// ボタンエリアの高さをボタンサイズを加味した高さに調整
		newButtonAreaSize.height = getButtonAreaHeightRefButtonSize(newButtonSize, newButtonAreaSize.height);
		setButtonSize(newButtonSize); // ボタンサイズを更新
		setButtonAreaSize(newButtonAreaSize); // ボタンエリアのサイズを更新
		initAllButtonLayout(newButtonSize, newButtonAreaSize); // ボタンの初期位置設定
		stopButtonAnimation(); // ボタンアニメーションの一時解除

		// ブラウザリサイズイベントの登録
		window.addEventListener('resize', (): void => {
			// タイムアウトが走っていない場合
			if (resizeEventSetTimeoutId === 0) {
				resizeEventSetTimeoutId = window.setTimeout(() => {
					const newButtonAreaSize = getButtonAreaSize(); // ボタンエリアのサイズを取得
					const newButtonSize = setButtonSizeStyle(newButtonAreaSize); // ボタンサイズの設定
					// ボタンエリアの高さをボタンサイズを加味した高さに調整
					newButtonAreaSize.height = getButtonAreaHeightRefButtonSize(newButtonSize, newButtonAreaSize.height);
					setButtonSize(newButtonSize); // ボタンサイズを更新
					setButtonAreaSize(newButtonAreaSize); // ボタンエリアのサイズを更新
					initAllButtonLayout(newButtonSize, newButtonAreaSize); // ボタンの初期位置設定
					stopButtonAnimation(); // ボタンアニメーションの一時解除
					window.clearTimeout(resizeEventSetTimeoutId); // タイムアウトイベントの削除
					resizeEventSetTimeoutId = 0; // IDリセット
				}, resizeEventInterval);
			}
		});
	}, []);

	/**
	 * 選択されたボタン配列の変更イベント
	 */
	useEffect(() => {
		// 選択されたボタン配列に要素が3つ以上設定された場合
		if (selectedButtons.length >= 3) {
			// 一定時間待機後に選択されたボタンを中央に寄せる
			// 待機時間: selectedButtonsCalcWaitTime
			window.setTimeout(() => {
				selectedButtons.forEach((button) => {
					setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
						...prevNumberCalcButtonStyles,
						[button]: {
							...prevNumberCalcButtonStyles[button],
							left: ((buttonAreaSize.width - buttonSize) / 2) + 'px',
						},
					}));
				});
				
				// 一定時間待機後に算出した数字ボタンを表示する
				// 待機時間: resultButtonVisibleWaitTime
				window.setTimeout(() => {
					let isAnswer = false; // 回答フラグ

					// 計算を実行
					const resultNumber = calcNumber(selectedButtons[0], selectedButtons[2], selectedButtons[1]);

					// 分母に0がある場合
					if (resultNumber.includes('/0')) {
						// 不正な計算が行われたため選択されたボタンをもとの位置に戻す
						selectedButtons.forEach((button) => {
							// 選択されたボタンが算出された1つ目の数字ボタンだった場合
							if (button === ButtonType.FirstResultNumber) {
								// 選択される前に表示していた場所に移動させる
								moveResultButtonToSpecificButtonPosition(button, buttonSize, buttonAreaSize, firstResultNumberPosition);
							}
							// 選択されたボタンが算出された2つ目の数字ボタンだった場合
							else if (button === ButtonType.SecondResultNumber) {
								// 選択される前に表示していた場所に移動させる
								moveResultButtonToSpecificButtonPosition(button, buttonSize, buttonAreaSize, secondResultNumberPosition);
							}
							else {
								initButtonLayout(button, buttonSize, buttonAreaSize);
							}
						});

						// 配列を初期化
						setSelectedButtons([]);

						return; // 後続処理をスキップする
					}

					// 算出した1つ目と2つ目の数字ボタンが表示されていない場合
					if (numberCalcButtonStyles.firstResult.visibility === VisibilityInButtonStyle.Hidden
						&& numberCalcButtonStyles.secondResult.visibility === VisibilityInButtonStyle.Hidden) {
						// 算出した1つ目の数字ボタンを表示する
						changeButtonVisible(ButtonType.FirstResultNumber, true);

						// 算出した1つ目の数字ボタンの値を設定する
						setFirstResultNumberValue(resultNumber);
					}
					// 算出した1つ目の数字ボタンが表示されていて、算出した2つめの数字ボタンが表示されていない場合
					else if (numberCalcButtonStyles.firstResult.visibility === VisibilityInButtonStyle.Visible
						&& numberCalcButtonStyles.secondResult.visibility === VisibilityInButtonStyle.Hidden) {
						// 算出した2つ目の数字ボタンを表示する
						changeButtonVisible(ButtonType.SecondResultNumber, true);

						// 算出した2つ目の数字ボタンの値を設定する
						setSecondResultNumberValue(resultNumber);
					}
					// 回答時
					else {
						// 回答時フラグ更新
						isAnswer = true;

						// 回答を表示する
						changeButtonVisible(ButtonType.AnswerNumber, true);

						// 回答の値を設定する
						setAnswerNumberValue(resultNumber);
					}

					// 回答時でない場合
					if (!isAnswer) {
						// 選択された数字ボタンを非表示にする
						changeButtonVisible(selectedButtons[0], false);
						changeButtonVisible(selectedButtons[2], false);
					}
					
					// 一定時間待機後にボタンを所定の位置に移動させる
					// 待機時間: setPositionButtonWaitTime
					window.setTimeout(() => {
						
						// 算出した1つ目と2つ目の数字ボタンが表示されていない場合
						if (numberCalcButtonStyles.firstResult.visibility === VisibilityInButtonStyle.Hidden
							&& numberCalcButtonStyles.secondResult.visibility === VisibilityInButtonStyle.Hidden) {
							// 算出した1つ目のボタンの表示位置を設定する
							initButtonLayout(ButtonType.FirstResultNumber, buttonSize, buttonAreaSize);
						}
						// 算出した1つ目の数字ボタンが表示されていて、算出した2つめの数字ボタンが表示されていない場合
						else if (numberCalcButtonStyles.firstResult.visibility === VisibilityInButtonStyle.Visible
							&& numberCalcButtonStyles.secondResult.visibility === VisibilityInButtonStyle.Hidden) {
							// 算出した2つ目のボタンの表示位置を設定する
							initButtonLayout(ButtonType.SecondResultNumber, buttonSize, buttonAreaSize);
						}
						// 回答時
						else {
							// 回答が10でない場合
							if (resultNumber !== '10') {
								window.setTimeout(() => {
									initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
								}, failedWaitTime);
							}
						}

						// 回答時以外の場合(回答時はすべてリセットするため以下実施不要)
						if (!isAnswer) {
							// 選択されている演算子ボタンを初期位置に戻す
							initButtonLayout(selectedButtons[1], buttonSize, buttonAreaSize);
						}
	
						// 配列を初期化
						setSelectedButtons([]);
					}, setPositionButtonWaitTime);
				}, resultButtonVisibleWaitTime);
			}, selectedButtonsCalcWaitTime);
		}
	}, [selectedButtons]);

	/**
	 * ボタンのアニメーションの一時解除
	 */
	const stopButtonAnimation = (): void => {
		// アニメーション無効
		setIsButtonAnimation(false);

		// タイムアウトが既に走っている場合
		if (buttonAnimationSetTimeoutId !== 0) {
			window.clearTimeout(buttonAnimationSetTimeoutId); // タイムアウトイベントの削除
		}
		// タイムアウトスタート
		buttonAnimationSetTimeoutId = window.setTimeout(() => {
			setIsButtonAnimation(true); // アニメーション有効
			window.clearTimeout(buttonAnimationSetTimeoutId); // タイムアウトイベントの削除
			buttonAnimationSetTimeoutId = 0; // IDリセット
		}, buttonAnimationStopInterval);
	}

	/**
	 * ボタン表示エリアサイズの取得
	 * @returns {ButtonAreaSize} ボタン表示エリアサイズ
	 */
	const getButtonAreaSize = (): ButtonAreaSize => {
		const newButtonAreaSize: ButtonAreaSize = defaultButtonAreaSize; // 新しいボタンエリアサイズ
		try {
			const windowHeight = window.innerHeight; // 画面の高さを取得
			const headerHeight = (document.getElementById('app-header') as HTMLElement).clientHeight; // ヘッダーの高さを取得
			const resetButtonHeight = (document.getElementById('reset-button') as HTMLElement).clientHeight; // リセットボタンの高さを取得
			const buttonAreaHeight = windowHeight - headerHeight - resetButtonHeight; // ボタン表示エリアの高さを算出
			const buttonAreaElement = document.getElementById('button-area') as HTMLElement; // ボタン表示エリアの要素を取得
			const buttonAreaWidth = Number(window.getComputedStyle(buttonAreaElement).width.replace('px', '')); // ボタン表示エリア幅を取得
			// ボタンエリアサイズの最大値を取得
			const maxButtonAreaSize = getMaxButtonAreaSize();
			// ボタン表示エリアサイズを更新（サイズの最大値より大きい場合は最大値を設定する）
			newButtonAreaSize.width = (buttonAreaWidth < maxButtonAreaSize.width) ? buttonAreaWidth : maxButtonAreaSize.width;
			newButtonAreaSize.height = (buttonAreaHeight < maxButtonAreaSize.height) ? buttonAreaHeight : maxButtonAreaSize.height;
		}
		catch (e) {
			console.error(e); // エラーログ出力
			alert('画面サイズがうまく読み込めませんでした。\nブラウザをリサイズ、もしくは更新してください。');
		}
		return newButtonAreaSize;
	}

	/**
	 * 最大のボタンエリアサイズを取得
	 * @returns {ButtonAreaSize} 最大のボタンエリアサイズ
	 */
	const getMaxButtonAreaSize = (): ButtonAreaSize => {
		const maxButtonAreaSize = defaultButtonAreaSize;
		try {
			// app-core要素のpaddingの値を取得(px)
			const appCorePadding = Number(window.getComputedStyle(document.getElementById('app-core') as HTMLElement).paddingRight.replace('px', ''));
			// ボタンエリアのmarginの値を取得(px)
			const buttonAreaMargin = Number(window.getComputedStyle(document.getElementById('button-area') as HTMLElement).marginRight.replace('px', ''));
			// ボタンエリアの最大幅
			const maxButtonAreaWidth = maxAppContainerWidth - appCorePadding - buttonAreaMargin;
			// ボタンエリアが最大幅である場合のボタンサイズを算出
			// ボタン幅 = ボタンエリア幅 / (横一列のボタン数 + ボタン間の余白数 * ボタン間の余白割合)
			const buttonSizeInMaxButtonAreaWidth = Math.floor(maxButtonAreaWidth / (4 + 3 * buttonMarginPerWidth));
			// ボタンエリアが最大幅である場合の最大高さの算出
			// ボタンエリア高さ = ボタン高さ * (縦一列のボタン数 + 選択したボタンの表示高さ割合 + 数字ボタン下の余白の割合 + 演算子ボタン下の余白の割合)
			const maxButtonAreaHeight = Math.floor(buttonSizeInMaxButtonAreaWidth * (2 + selectedButtonAreaPerHeight + numberButtonBottomMarginPerHeight + calcButtonBottomMarginPerHeight));
			// 算出した最大値を格納
			maxButtonAreaSize.width = maxButtonAreaWidth;
			maxButtonAreaSize.height = maxButtonAreaHeight;
		}
		catch (e) {
			console.error(e); // エラーログ出力
			alert('画面サイズがうまく読み込めませんでした。\nブラウザをリサイズ、もしくは更新してください。');
		}
		return maxButtonAreaSize;
	}

	/**
	 * 新しいボタンサイズを加味したボタンエリア高さを取得
	 * @param {number} newButtonSize - 新しいボタンサイズ
	 * @param {number} buttonAreaHeight - 現在のボタンエリア高さ
	 * @returns {number} ボタンサイズを加味したボタンエリア高さ
	 */
	const getButtonAreaHeightRefButtonSize = (newButtonSize: number, buttonAreaHeight: number): number => {
		// ボタンサイズからボタンエリア高さを算出
		// ボタンエリア高さ = 選択したボタンエリア高さ + 数字と演算子ボタンの高さ + 数字ボタン下余白 + 演算子ボタンした余白
		const newButtonAreaHeight = newButtonSize * (selectedButtonAreaPerHeight + 2 + numberButtonBottomMarginPerHeight + calcButtonBottomMarginPerHeight);
		// 算出値と現在値とで高さが小さい方を返す
		return (newButtonAreaHeight < buttonAreaHeight) ? newButtonAreaHeight : buttonAreaHeight;
	}

	/**
	 * ボタンサイズを設定
	 * @param {ButtonAreaSize} newButtonAreaSize - 新しいボタンエリアサイズ
	 * @returns {number} 設定したボタンのサイズ(px)
	 */
	const setButtonSizeStyle = (newButtonAreaSize: ButtonAreaSize): number => {
		// ボタンエリアの幅をもとにボタンサイズを算出
		// ボタン幅 = ボタンエリア幅 / (横一列のボタン数 + ボタン間の余白数 * ボタン間の余白割合)
		const buttonSizeForWidth = Math.floor(newButtonAreaSize.width / (4 + 3 * buttonMarginPerWidth));
		// ボタンエリアの高さをもとにボタンサイズを算出
		// ボタン高さ = ボタンエリア高さ / (縦一列のボタン数 + 選択したボタンの表示高さ割合 + 数字ボタン下の余白の割合 + 演算子ボタン下の余白の割合)
		const buttonSizeForHeight = Math.floor(newButtonAreaSize.height / (2 + selectedButtonAreaPerHeight + numberButtonBottomMarginPerHeight + calcButtonBottomMarginPerHeight));
		// 小さい方を新しいボタンサイズを選定
		const newButtonSize = (buttonSizeForWidth < buttonSizeForHeight) ? buttonSizeForWidth : buttonSizeForHeight;

		roundButtons.forEach((changeSizeButton) => {
			// ボタンサイズを更新
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[changeSizeButton]: {
					...prevNumberCalcButtonStyles[changeSizeButton],
					width: newButtonSize + 'px',
					height: newButtonSize + 'px',
					lineHeight: newButtonSize + 'px',
					backgroundColor: getButtonColor(changeSizeButton),
				}
			}));
		});
		return newButtonSize;
	};

	/**
	 * ボタンを初期位置に設定
	 * @param {number} currentButtonSize -  現在のボタンのサイズ(px)
	 * @param {ButtonAreaSize} currentButtonAreaSize - 現在のボタンエリアのサイズ(px)
	 */
	const initAllButtonLayout = (currentButtonSize: number, currentButtonAreaSize: ButtonAreaSize): void => {
		// 配列内のボタンをすべて初期位置に戻す
		roundButtons.forEach((initButton) => {
			// 特定のボタンを初期位置に戻す
			initButtonLayout(initButton, currentButtonSize, currentButtonAreaSize);
			
			// 算出された数字ボタン、もしくは回答の場合
			if (initButton === ButtonType.FirstResultNumber
				|| initButton === ButtonType.SecondResultNumber
				|| initButton === ButtonType.AnswerNumber) {
				// 非表示にする
				changeButtonVisible(initButton, false);
			}
			else {
				// 表示する
				changeButtonVisible(initButton, true);
			}
		});
	}

	/**
	 * 特定のボタンの表示位置を初期位置に更新
	 * @param {ButtonType} initButton - 初期位置に表示するボタン
	 * @param {number} currentButtonSize - 現在のボタンのサイズ(px)
	 * @param {ButtonAreaSize} currentButtonAreaSize - 現在のボタンエリアのサイズ(px)
	 */
	const initButtonLayout = (initButton: ButtonType, currentButtonSize: number, currentButtonAreaSize: ButtonAreaSize): void => {
		// ボタン間の余白を算出
		const buttonMargin = currentButtonSize * buttonMarginPerWidth;
		// ボタンの左右の余白を算出(px)
		// 左右の余白 = (ボタンエリア幅 - ボタン幅の合計 - ボタン間の余白の合計) / 2 
		const buttonSideMargin = Math.floor((currentButtonAreaSize.width - 4 * currentButtonSize - 3 * buttonMargin) / 2);
		// ボタンに設定する上からの表示位置
		// 演算子ボタン：上からの表示位置 = 数字ボタンより１ボタン分下のの表示位置 - 数字ボタンと演算子ボタンの余白
		// 数字ボタン：上からの表示位置 = 選択されたボタン表示エリア高さ
		let styleTop: string = judgeCalcButton(initButton) 
														? (currentButtonSize * (selectedButtonAreaPerHeight + 1) + currentButtonSize * numberButtonBottomMarginPerHeight) + 'px'
														: (currentButtonSize * selectedButtonAreaPerHeight) + 'px';
		let styleLeft: string = ''; // ボタンに設定する左からの表示位置

		// 数字ボタンの場合
		if (!judgeCalcButton(initButton)
			&& initButton !== ButtonType.FirstResultNumber
			&& initButton !== ButtonType.SecondResultNumber
			&& initButton !== ButtonType.AnswerNumber) {
			// 数字ボタンの左からの表示位置を取得
			styleLeft = getStyleLeftForNumberButton(initButton, currentButtonSize, buttonSideMargin, buttonMargin);
		}
		// 「+」ボタンの場合
		else if (initButton === ButtonType.Plus) {
			styleLeft = buttonSideMargin + 'px';
		}
		// 「-」ボタンの場合
		else if (initButton === ButtonType.Minus) {
			styleLeft = (buttonSideMargin + currentButtonSize + buttonMargin) + 'px';
		}
		// 「×」ボタンの場合
		else if (initButton === ButtonType.Multiply) {
			styleLeft = (buttonSideMargin + 2 * (currentButtonSize + buttonMargin)) + 'px';
		}
		// 「÷」ボタンの場合
		else if (initButton === ButtonType.Division) {
			styleLeft = (buttonSideMargin + 3 * (currentButtonSize + buttonMargin)) + 'px';
		}
		// 回答の場合
		else if (initButton === ButtonType.AnswerNumber) {
			styleTop = currentButtonSize + 'px';
			styleLeft = ((currentButtonAreaSize.width - currentButtonSize) / 2) + 'px';
		}
		// 算出された数字ボタンの場合
		else {
			// 選択されたボタン配列が設定されていて、算出された2つ目の数字ボタンが表示されていない場合
			if (selectedButtons.length >= 3 && numberCalcButtonStyles.secondResult.visibility === VisibilityInButtonStyle.Hidden) {
				// 非表示になっている数字ボタンを抽出
				const invisibleNumberButtons: ButtonType[] = [];
				const numberButtons = [
					ButtonType.FirstNumber,
					ButtonType.SecondNumber,
					ButtonType.ThirdNumber,
					ButtonType.FourthNumber
				];
				// 算出した数字ボタンを表示可能な数字ボタンの場所を探索
				numberButtons.forEach((button) => {
					// 数字ボタンが非表示か選択中の場合
					if (numberCalcButtonStyles[button].visibility === VisibilityInButtonStyle.Hidden || selectedButtons.includes(button)) {
						invisibleNumberButtons.push(button);
					}
				});
				// 1つ目の場合
				if (initButton === ButtonType.FirstResultNumber) {
					// 非表示の数字ボタンのうち、左から一番目のボタンの初期表示位置を設定する
					styleLeft = getStyleLeftForNumberButton(invisibleNumberButtons[0], currentButtonSize, buttonSideMargin, buttonMargin);
					// 算出した1つ目の数字ボタンを表示した場所を保持する
					setFirstResultNumberPosition(invisibleNumberButtons[0]);
				}
				// 2つ目の場合
				else if (initButton === ButtonType.SecondResultNumber) {
					// 非表示となっている数字ボタンの中で、算出された1つ目の数字ボタンが表示されていない、最も左の場所に2つ目の算出した数字ボタンを表示させる
					for (let i = 0; i < invisibleNumberButtons.length; i++) {
						// 算出された1つ目の数字ボタンと場所が被っていない場合
						if (firstResultNumberPosition !== invisibleNumberButtons[i]) {
							styleLeft = getStyleLeftForNumberButton(invisibleNumberButtons[i], currentButtonSize, buttonSideMargin, buttonMargin);
							// 算出した2つ目の数字ボタンを表示した場所を保持する
							setSecondResultNumberPosition(invisibleNumberButtons[i]);
							break;
						}
					}
				}
			}
			// 非表示時の場合
			else {
				// 選択したボタン表示欄の中央に設定
				styleTop = currentButtonSize + 'px';
				styleLeft = ((currentButtonAreaSize.width - currentButtonSize) / 2) + 'px';
			}
		}

		// 数字と演算子ボタンの表示位置を初期位置に更新
		setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
			...prevNumberCalcButtonStyles,
			[initButton]: {
				...prevNumberCalcButtonStyles[initButton],
				top: styleTop,
				left: styleLeft,
			}
		}));
	}

	/**
	 * 算出された数字ボタンの表示位置を特定の数字ボタンの位置に更新
	 * @param {ButtonType.FirstResultNumber | ButtonType.SecondResultNumber} resultButton - 位置を更新する算出された数字ボタン
	 * @param {number} currentButtonSize - 現在のボタンのサイズ(px)
	 * @param {ButtonAreaSize} currentButtonAreaSize - 現在のボタンエリアのサイズ(px)
	 * @param {ButtonType} targetButton - 移動先のボタン
	 */
	const moveResultButtonToSpecificButtonPosition = (
		resultButton: ButtonType.FirstResultNumber | ButtonType.SecondResultNumber,
		currentButtonSize: number,
		currentButtonAreaSize: ButtonAreaSize,
		targetButton: ButtonType): void => {
			// ボタン間の余白を算出
			const buttonMargin = currentButtonSize * buttonMarginPerWidth;
			// ボタンの左右の余白を算出(px)
			// 左右の余白 = (ボタンエリア幅 - ボタン幅の合計 - ボタン間の余白の合計) / 2 
			const buttonSideMargin = Math.floor((currentButtonAreaSize.width - 4 * currentButtonSize - 3 * buttonMargin) / 2);
			// ボタンに設定する上からの表示位置
			// 上からの表示位置 = 選択されたボタン表示エリア高さ
			const styleTop = (currentButtonSize * selectedButtonAreaPerHeight) + 'px';
			const targetPosition = resultButton === ButtonType.FirstResultNumber ? firstResultNumberPosition : secondResultNumberPosition;
			const styleLeft = getStyleLeftForNumberButton(targetPosition, currentButtonSize, buttonSideMargin, buttonMargin); // ボタンに設定する左からの表示位置
			// 算出された数字ボタンの表示位置を特定の数字ボタンの位置に更新
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[resultButton]: {
					...prevNumberCalcButtonStyles[resultButton],
					top: styleTop,
					left: styleLeft,
				}
			}));
		}

	/**
	 * 数字ボタンに設定する左からの表示位置を取得
	 * @param {ButtonType} button - 取得するボタン
	 * @param {number} currentButtonSize - ボタンサイズ
	 * @param {number} buttonSideMargin - 取得するボタン
	 * @param {number} buttonMargin - 取得するボタン
	 * @return {string} 設定する左からの表示位置
	 */
	const getStyleLeftForNumberButton = (button: ButtonType, currentButtonSize: number, buttonSideMargin: number, buttonMargin: number): string => {
		// 左から１つ目の数字ボタンの場合
		if (button === ButtonType.FirstNumber) {
			return buttonSideMargin + 'px';
		}
		// 左から２つ目の数字ボタンの場合
		else if (button === ButtonType.SecondNumber) {
			return (buttonSideMargin + currentButtonSize + buttonMargin) + 'px';
		}
		// 左から３つ目の数字ボタンの場合
		else if (button === ButtonType.ThirdNumber) {
			return (buttonSideMargin + 2 * (currentButtonSize + buttonMargin)) + 'px';
		}
		// 左から４つ目の数字ボタンの場合
		else if (button === ButtonType.FourthNumber) {
			return (buttonSideMargin + 3 * (currentButtonSize + buttonMargin)) + 'px';
		}
		else {
			console.error(button);
			throw new Error('Invalid value entered in getStyleLeftForNumberButton(MakeTen.tsx)');
		}
	}

	/**
	 * 数字と演算子ボタンの表示非表示を切り替える
	 * @param {ButtonType} button - 表示非表示を切り替えるボタン
	 * @param {boolean} isVisible - 表示させるか否か
	 */
	const changeButtonVisible = (button: ButtonType, isVisible: boolean): void => {
		// 表示非表示を切り替える
		setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
			...prevNumberCalcButtonStyles,
			[button]: {
				...prevNumberCalcButtonStyles[button],
				opacity: isVisible ? '1' : '0',
				visibility: isVisible ? VisibilityInButtonStyle.Visible : VisibilityInButtonStyle.Hidden,
			}
		}));
	}

	/**
	 * 数字ボタンと演算子ボタンのクリックイベント
	 * @param selectedButton - 押下した数字ボタンの種類
	 */
	const handleClickButton = (selectedButton: ButtonType): void => {
		// 既に３つボタンが選択されている状態の場合
		if (selectedButtons.length >= 3) {
			return; // 後続処理をスキップ
		}

		const oldSelectedButtons = [...selectedButtons]; // 更新前の選択されているボタン配列を保持
		const newSelectedButtons = updateSelectedButtons(selectedButton); // 選択されているボタン配列の更新
		const diffSelectedButtons = oldSelectedButtons.filter(buttonType => newSelectedButtons.indexOf(buttonType) === -1); // 非選択となったボタン配列

		const buttonMargin = Math.floor(buttonSize * buttonMarginPerWidth); // ボタン間マージン(px)

		// 選択されているボタンが１つの場合
		if (newSelectedButtons.length === 1) {
			// 選択欄の中央に表示
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[newSelectedButtons[0]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[0]],
					top: buttonSize + 'px',
					left: ((buttonAreaSize.width - buttonSize) / 2) + 'px',
				},
			}));
		}
		// 選択されているボタンが２つの場合
		else if (newSelectedButtons.length === 2) {
			// 選択欄に2つ表示
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[newSelectedButtons[0]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[0]],
					top: buttonSize + 'px',
					left: (buttonAreaSize.width / 2 - buttonSize - buttonMargin / 2) + 'px',
				},
				[newSelectedButtons[1]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[1]],
					top: buttonSize + 'px',
					left: (buttonAreaSize.width / 2 + buttonMargin / 2) + 'px',
				},
			}));
		}
		// 選択されているボタンが３つの場合
		else if (newSelectedButtons.length === 3) {
			// 選択欄に3つ表示
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[newSelectedButtons[0]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[0]],
					top: buttonSize + 'px',
					left: (((buttonAreaSize.width - buttonSize) / 2) - (buttonSize + buttonMargin)) + 'px',
				},
				[newSelectedButtons[1]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[1]],
					top: buttonSize + 'px',
					left: ((buttonAreaSize.width - buttonSize) / 2) + 'px',
				},
				[newSelectedButtons[2]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[2]],
					top: buttonSize + 'px',
					left: (((buttonAreaSize.width - buttonSize) / 2) + (buttonSize + buttonMargin)) + 'px',
				},
			}));
		}

		// 非選択状態になったボタンを初期位置に戻す
		diffSelectedButtons.forEach((button) => {
			// 算出した数字ボタンの場合
			if (button === ButtonType.FirstResultNumber || button === ButtonType.SecondResultNumber) {
				// ボタンの左右の余白を算出(px)
				// 左右の余白 = (ボタンエリア幅 - ボタン幅の合計 - ボタン間の余白の合計) / 2 
				const buttonSideMargin = Math.floor((buttonAreaSize.width - 4 * buttonSize - 3 * buttonMargin) / 2);
				const buttonPosition = button === ButtonType.FirstResultNumber ? firstResultNumberPosition : secondResultNumberPosition;
				// 算出した数字ボタンの表示位置を選択前の位置に更新
				setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
					...prevNumberCalcButtonStyles,
					[button]: {
						...prevNumberCalcButtonStyles[button],
						top: (buttonSize * selectedButtonAreaPerHeight) + 'px',
						left: getStyleLeftForNumberButton(buttonPosition, buttonSize, buttonSideMargin, buttonMargin),
					}
				}));
			}
			else {
				initButtonLayout(button, buttonSize, buttonAreaSize); // 特定のボタンを初期位置に戻す
			}
		});
	}

	/**
	 * リセットボタン押下イベント
	 */
	const handleClickResetButton = (): void => {
		// ボタンを3つ選択している状態の場合
		if (selectedButtons.length >= 3) {
			return; // 処理をスキップ
		}

		setSelectedButtons([]); // 配列を初期化
		// ボタンを初期位置に戻す
		initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
	}

	/**
	 * 選択されているボタン配列の更新
	 * @param {ButtonType} selectedButton - 新たに選択されたボタン
	 * @returns {ButtonType[]} 更新した選択されているボタン配列
	 */
	const updateSelectedButtons = (selectedButton: ButtonType): ButtonType[] => {
		// 選択されているボタン配列をコピー
		const newSelectedButtons = [...selectedButtons];
		
		// まだ何も選択されていない状態の場合
		if (newSelectedButtons.length === 0) {
			newSelectedButtons.push(selectedButton); // 新たに選択されたボタンを格納
		}
		// 既に１つ選択されている状態の場合
		else if (newSelectedButtons.length === 1) {
			// 選択中のボタンが押下された場合
			if (newSelectedButtons[0] === selectedButton) {
				newSelectedButtons.shift(); // 選択中のボタンを削除
			}
			// 格納されているボタンと新たに選択されたボタンが数字同士、もしくは演算子同士であった場合
			else if (judgeSameCategoryButton(newSelectedButtons[0], selectedButton)) {
				newSelectedButtons[0] = selectedButton; // 格納されているボタンを選択されたボタンと置き換える
			}
			// ボタンの種別が異なる場合
			else {
				// 既に格納されているボタンが演算子ボタンである場合
				if (judgeCalcButton(newSelectedButtons[0])) {
					newSelectedButtons.unshift(selectedButton); // 配列の先頭に選択されたボタンを挿入
				}
				else {
					newSelectedButtons.push(selectedButton); // 配列に選択されたボタンを格納
				}
			}
		}
		// 既に２つ選択されている状態の場合
		else if (newSelectedButtons.length === 2) {
			const index = newSelectedButtons.indexOf(selectedButton); // 選択されたボタンの配列中のインデックスを取得
			// 選択されたボタンが配列中になかった場合
			if (index === -1) {
				// 新しく選択されたボタンが演算子ボタンだった場合
				if (judgeCalcButton(selectedButton)) {
					newSelectedButtons[1] = selectedButton; // 演算子ボタンを更新
				}
				// 新しく選択されたボタンが数字ボタンだった場合
				else {
					newSelectedButtons.push(selectedButton); // 新しく選択されたボタンを格納
				}
			}
			// 選択中の数字ボタンが押下された場合
			else {
				newSelectedButtons.splice(index, 1); // 選択された数字ボタンを削除
			}
		}
		setSelectedButtons(newSelectedButtons); // 配列の更新
		return newSelectedButtons;
	}

	/**
	 * ２つのボタンの種別（数字、演算子）が一致するか判定
	 * @param {ButtonType} firstButton - １つ目のボタン
	 * @param {ButtonType} secondButton - ２つ目のボタン
	 * @returns {boolean} 種別が一致するか否か
	 */
	const judgeSameCategoryButton = (firstButton: ButtonType, secondButton: ButtonType): boolean => {
		const isFirstButtonCalc = judgeCalcButton(firstButton); // １つ目のボタンが演算子ボタンか判定
		const isSecondButtonCalc = judgeCalcButton(secondButton); // ２つ目のボタンが演算子ボタンか判定
		return (isFirstButtonCalc === isSecondButtonCalc);
	}

	/**
	 * 演算子ボタンか判定
	 * @param {ButtonType} button - 判定するボタン
	 * @returns {boolean} 演算子ボタンか否か
	 */
	const judgeCalcButton = (button: ButtonType): boolean => {
		return (button === ButtonType.Plus
			|| button === ButtonType.Minus
			|| button === ButtonType.Multiply
			|| button === ButtonType.Division);
	}

	/**
	 * 数字ボタンと演算子ボタンの色を取得
	 * @param {ButtonType} button - 色を取得したいボタン
	 * @returns {string} ボタンの色
	 */
	const getButtonColor = (button: ButtonType): string => {
		// 演算子ボタンの場合
		if (judgeCalcButton(button)) {
			if (button === ButtonType.Plus) {
				return buttonColor.plus;
			}
			else if (button === ButtonType.Minus) {
				return buttonColor.minus;
			}
			else if (button === ButtonType.Multiply) {
				return buttonColor.multiply;
			}
			else if (button === ButtonType.Division) {
				return buttonColor.division;
			}
		}
		return buttonColor.number;
	}

	/**
	 * 計算の実行
	 * @param {ButtonType} firstNumber - 1つ目の数字
	 * @param {ButtonType} secondNumber - 2つ目の数字
	 * @param {ButtonType} calcType - 演算子
	 * @returns {string} 計算結果
	 */
	const calcNumber = (firstNumber: ButtonType, secondNumber: ButtonType, calcType: ButtonType): string => {
		// 計算結果
		let resultNumber = '';

		// 数字ボタンに設定されている値を文字列で取得
		const firstValue = getButtonValue(firstNumber);
		const secondValue = getButtonValue(secondNumber);

		if (calcType === ButtonType.Plus) {
			resultNumber = calcPlus(firstValue, secondValue);
		}
		else if (calcType === ButtonType.Minus) {
			resultNumber = calcMinus(firstValue, secondValue);
		}
		else if (calcType === ButtonType.Multiply) {
			resultNumber = calcMultiply(firstValue, secondValue);
		}
		else if (calcType === ButtonType.Division) {
			resultNumber = calcDivision(firstValue, secondValue);
		}
		else {
			throw new Error('Invalid value entered in calcNumber(MakeTen.tsx)');
		}
		
		return resultNumber;
	}

	/**
	 * 足し算の計算
	 * @param {string} firstValue - 1つ目の値
	 * @param {string} secondValue - 2つ目の値
	 * @returns {string} 計算結果
	 */
	const calcPlus = (firstValue: string, secondValue: string): string => {
		// 計算結果
		let resultNumber = '';

		// 2つの値の文字列をそれぞれ数字の配列に変換
		const firstValueArray = stringValueConvertNumberArray(firstValue);
		const secondValueArray = stringValueConvertNumberArray(secondValue);

		// どちらも値が分数の場合
		if (firstValueArray.length > 1 && secondValueArray.length > 1) {
			// 分母の最小公倍数を求める
			const leastCommonMultiple = getLeastCommonMultiple(firstValueArray[1], secondValueArray[1]);
			// それぞれの分子を算出
			const firstChildNumber = firstValueArray[0] * (leastCommonMultiple / firstValueArray[1]);
			const secondChildNumber = secondValueArray[0] * (leastCommonMultiple / secondValueArray[1]);
			// 分子同士を足し算する
			const childNumber = firstChildNumber + secondChildNumber;
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, leastCommonMultiple);
		}
		// 1つ目の値が分数の場合
		else if (firstValueArray.length > 1) {
			// 2つ目の数字の分子を1つ目の数字の分母に合わせた値にする（通分）
			const secondChildNumber = secondValueArray[0] * firstValueArray[1];
			// 分子同士を足し算する
			const childNumber = firstValueArray[0] + secondChildNumber;
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, firstValueArray[1]);
		}
		// 2つ目の値が分数の場合
		else if (secondValueArray.length > 1) {
			// 1つ目の数字の分子を2つ目の数字の分母に合わせた値にする（通分）
			const firstChildNumber = firstValueArray[0] * secondValueArray[1];
			// 分子同士を足し算する
			const childNumber = firstChildNumber + secondValueArray[0];
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, secondValueArray[1]);
		}
		// どちらも値が分数でない場合
		else {
			resultNumber = String(firstValueArray[0] + secondValueArray[0]);
		}

		return resultNumber;
	}

	/**
	 * 引き算の計算
	 * @param {string} firstValue - 1つ目の値
	 * @param {string} secondValue - 2つ目の値
	 * @returns {string} 計算結果
	 */
	const calcMinus = (firstValue: string, secondValue: string): string => {
		// 計算結果
		let resultNumber = '';

		// 2つの値の文字列をそれぞれ数字の配列に変換
		const firstValueArray = stringValueConvertNumberArray(firstValue);
		const secondValueArray = stringValueConvertNumberArray(secondValue);

		// どちらも値が分数の場合
		if (firstValueArray.length > 1 && secondValueArray.length > 1) {
			// 分母の最小公倍数を求める
			const leastCommonMultiple = getLeastCommonMultiple(firstValueArray[1], secondValueArray[1]);
			// それぞれの分子を算出
			const firstChildNumber = firstValueArray[0] * (leastCommonMultiple / firstValueArray[1]);
			const secondChildNumber = secondValueArray[0] * (leastCommonMultiple / secondValueArray[1]);
			// 分子同士を引き算する
			const childNumber = firstChildNumber - secondChildNumber;
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, leastCommonMultiple);
		}
		// 1つ目の値が分数の場合
		else if (firstValueArray.length > 1) {
			// 2つ目の数字の分子を1つ目の数字の分母に合わせた値にする（通分）
			const secondChildNumber = secondValueArray[0] * firstValueArray[1];
			// 分子同士を引き算する
			const childNumber = firstValueArray[0] - secondChildNumber;
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, firstValueArray[1]);
		}
		// 2つ目の値が分数の場合
		else if (secondValueArray.length > 1) {
			// 1つ目の数字の分子を2つ目の数字の分母に合わせた値にする（通分）
			const firstChildNumber = firstValueArray[0] * secondValueArray[1];
			// 分子同士を引き算する
			const childNumber = firstChildNumber - secondValueArray[0];
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, secondValueArray[1]);
		}
		// どちらも値が分数でない場合
		else {
			resultNumber = String(firstValueArray[0] - secondValueArray[0]);
		}

		return resultNumber;
	}

	/**
	 * 掛け算の計算
	 * @param {string} firstValue - 1つ目の値
	 * @param {string} secondValue - 2つ目の値
	 * @returns {string} 計算結果
	 */
	const calcMultiply = (firstValue: string, secondValue: string): string => {
		// どちらか一方でも0の場合
		if (firstValue === '0' || secondValue === '0') {
			return '0';
		}
		
		// 計算結果
		let resultNumber = '';

		// 2つの値の文字列をそれぞれ数字の配列に変換
		const firstValueArray = stringValueConvertNumberArray(firstValue);
		const secondValueArray = stringValueConvertNumberArray(secondValue);

		// どちらも値が分数の場合
		if (firstValueArray.length > 1 && secondValueArray.length > 1) {
			// 分子と分母をそれぞれ掛け算
			const childNumber = firstValueArray[0] * secondValueArray[0]; // 分子を計算
			const motherNumber = firstValueArray[1] * secondValueArray[1]; // 分母を計算 
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, motherNumber);
		}
		// 1つ目の値が分数の場合
		else if (firstValueArray.length > 1) {
			const childNumber = firstValueArray[0] * secondValueArray[0] // 分子を計算
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, firstValueArray[1]);
		}
		// 2つ目の値が分数の場合
		else if (secondValueArray.length > 1) {
			const childNumber = firstValueArray[0] * secondValueArray[0]; // 分子を計算
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, secondValueArray[1]);
		}
		// どちらも値が分数でない場合
		else {
			resultNumber = String(firstValueArray[0] * secondValueArray[0]);
		}

		return resultNumber;
	}

	/**
	 * 割り算の計算
	 * @param {string} firstValue - 割られる値
	 * @param {string} secondValue - 割る値
	 * @returns {string} 計算結果
	 */
	const calcDivision = (firstValue: string, secondValue: string): string => {
		// 計算結果
		let resultNumber = '';

		// 割られる値と割る値の文字列をそれぞれ数字の配列に変換
		const firstValueArray = stringValueConvertNumberArray(firstValue);
		const secondValueArray = stringValueConvertNumberArray(secondValue);

		// どちらも値が分数の場合
		if (firstValueArray.length > 1 && secondValueArray.length > 1) {
			// 逆数の掛け算
			const childNumber = firstValueArray[0] * secondValueArray[1]; // 分子を計算
			const motherNumber = firstValueArray[1] * secondValueArray[0]; // 分母を計算 
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, motherNumber);
		}
		// 割られる値が分数の場合
		else if (firstValueArray.length > 1) {
			const motherNumber = firstValueArray[1] * secondValueArray[0] // 分母を計算
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(firstValueArray[0], motherNumber);
		}
		// 割る値が分数の場合
		else if (secondValueArray.length > 1) {
			const childNumber = firstValueArray[0] * secondValueArray[1]; // 分子を計算
			// 約分した分数の文字列を取得
			resultNumber = reduceFractions(childNumber, secondValueArray[0]);
		}
		// どちらも値が分数でない場合
		else {
			// 割り切れる場合
			if (firstValueArray[0] % secondValueArray[0] === 0) {
				resultNumber = String(firstValueArray[0] / secondValueArray[0]);
			}
			// 分数となる場合
			else {
				// 約分した分数の文字列を取得
				resultNumber = reduceFractions(firstValueArray[0], secondValueArray[0]);
			}
		}

		return resultNumber;
	}

	/**
	 * 値の文字列を数字の配列に変換(1/2 => [1,2])
	 * @param {string} stringValue - 配列に変換する文字列
	 * @returns {number[]} 数字の配列 
	 */
	const stringValueConvertNumberArray = (stringValue: string): number[] => {
		// 変換結果
		const resultArray: number[] = [];

		// 分数の場合
		if (stringValue.includes('/')) {
			const slashIndex = stringValue.indexOf('/');
			resultArray.push(Number(stringValue.substring(0, slashIndex))); // 分子を数字として格納
			resultArray.push(Number(stringValue.substring(slashIndex + 1, stringValue.length))); // 分母を数字として格納
		}
		// 分数でない場合
		else {
			resultArray.push(Number(stringValue));
		}

		return resultArray;
	}

	/**
	 * 最小公倍数を算出する
	 * @param {number} firstNumber - 1つ目の数字
	 * @param {number} secondNnumber - 2つ目の数字
	 * @returns {number} 2つの数字の最小公倍数
	 */
	const getLeastCommonMultiple = (firstNumber: number, secondNumber: number): number => {
		let resultNumber = firstNumber * secondNumber;

		// 最小公倍数を探索する
		firstNumberMultiple: for (let i = 1; i <= secondNumber; i++) {
			for (let j = 1; j <= firstNumber; j++) {
				const first = firstNumber * i;
				const second = secondNumber * j;
				// 最小公倍数を見つけた場合
				if (first === second) {
					resultNumber = first;
					break firstNumberMultiple;
				}
				else if (first < second) {
					continue firstNumberMultiple;
				}
			}
		}

		return resultNumber;
	}

	/**
	 * 分子と分母を約分した分数の文字列を取得
	 * @param {number} childNumber - 分子の値
	 * @param {number} motherNumber - 分母の値
	 * @returns {string} 約分した分数の文字列 
	 */
	const reduceFractions = (childNumber: number, motherNumber: number): string => {
		// 分子の値が分母の値以下の場合
		const minValue = childNumber <= motherNumber ? childNumber : motherNumber;

		// 最大公約数を求める
		let greatestCommonDivisor = 1;
		for (let i = minValue; i > 1; i--) {
			// 最大公約数の場合
			if (childNumber % i === 0 && motherNumber % i === 0) {
				greatestCommonDivisor = i; // 最大公約数を更新
				break;
			}
		}
		// 分母が1となる場合
		if (motherNumber / greatestCommonDivisor === 1) {
			return String(childNumber / greatestCommonDivisor);
		}

		// 分母が0となる場合についてはuseEffect(selectButtons)にて'/0'を判定するためそのまま返す
		return (childNumber / greatestCommonDivisor) + '/' + (motherNumber / greatestCommonDivisor);
	}

	/**
	 * ボタンに設定されている数字を取得
	 * @param {ButtonType} button - 数字を取得するボタン
	 * @returns {string} ボタンに設定されている数字（文字）
	 */
	const getButtonValue = (button: ButtonType): string => {
		if (button === ButtonType.FirstNumber) {
			return String(problemNumbers[0]);
		}
		else if (button === ButtonType.SecondNumber) {
			return String(problemNumbers[1]);
		}
		else if (button === ButtonType.ThirdNumber) {
			return String(problemNumbers[2]);
		}
		else if (button === ButtonType.FourthNumber) {
			return String(problemNumbers[3]);
		}
		else if (button === ButtonType.FirstResultNumber) {
			return firstResultNumberValue;
		}
		else if (button === ButtonType.SecondResultNumber) {
			return secondResultNumberValue;
		}
		else {
			throw new Error('Invalid value entered in getButtonNumber(MakeTen.tsx)');
		}
	}

	return (
		<>
			<div id="button-area" style={{height: buttonAreaSize.height + 'px'}}>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.FirstNumber]}
					onClick={() => handleClickButton(ButtonType.FirstNumber)}
				>{problemNumbers[0]}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.SecondNumber]}
					onClick={() => handleClickButton(ButtonType.SecondNumber)}
				>{problemNumbers[1]}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.ThirdNumber]}
					onClick={() => handleClickButton(ButtonType.ThirdNumber)}
				>{problemNumbers[2]}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.FourthNumber]}
					onClick={() => handleClickButton(ButtonType.FourthNumber)}
				>{problemNumbers[3]}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Plus]}
					onClick={() => handleClickButton(ButtonType.Plus)}
				>+</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Minus]}
					onClick={() => handleClickButton(ButtonType.Minus)}
				>-</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Multiply]}
					onClick={() => handleClickButton(ButtonType.Multiply)}
				>×</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Division]}
					onClick={() => handleClickButton(ButtonType.Division)}
				>÷</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.FirstResultNumber]}
					onClick={() => handleClickButton(ButtonType.FirstResultNumber)}
				>{firstResultNumberValue}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.SecondResultNumber]}
					onClick={() => handleClickButton(ButtonType.SecondResultNumber)}
				>{secondResultNumberValue}</div>
				<div
					className={`${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.AnswerNumber]}
				>{answerNumberValue}</div>
			</div>
			<div id="reset-button" onClick={handleClickResetButton}>
				Reset
			</div>
		</>
	);
}

export default MakeTen;