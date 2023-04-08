import React, { useEffect, useState } from 'react';
import { ButtonStyle, NumberCalcButtonStyles, ButtonType, ButtonAreaSize } from '../../core/types';
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
	const defaultButtonSize = 30; // 数字ボタンと演算ボタンのサイズのデフォルト値(px)
	// 数字ボタンと演算ボタンに動的に設定するスタイルのデフォルト値
	const defaultButtonStyle: ButtonStyle = {
		width: defaultButtonSize + 'px',
		height: defaultButtonSize + 'px',
		lineHeight: defaultButtonSize + 'px',
		top: '0px',
		left: '0px',
	}
	const buttonMarginPerWidth: number = 1/4; // ボタン幅に対するボタン間マージンの割合
	const numberButtonMarginPerHeight: number = 3/2; // 数字ボタン高さに対する数字ボタンと回答エリア間マージンの割当
	const calcButtonMarginPerHeight: number = 1/2; // 演算ボタン高さに対する数字ボタンと演算ボタン間マージンの割当
	const resizeEventInterval: number = 50; // リサイズイベントの発生インターバル(ms)
	const buttonAnimationStopInterval: number = 200; // ボタンのアニメーション一時停止時間(ms)
	const selectedButtonsCalcWaitTime: number = 500; // 選択したボタンの計算開始までの待機時間
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
		[ButtonType.Plus]: defaultButtonStyle,
		[ButtonType.Minus]: defaultButtonStyle,
		[ButtonType.Multiply]: defaultButtonStyle,
		[ButtonType.Division]: defaultButtonStyle,
	});

	// ボタンのサイズ(px)
	const [buttonSize, setButtonSize] = useState(defaultButtonSize);

	// ボタンエリアのサイズ(px)
	const [buttonAreaSize, setButtonAreaSize] = useState<ButtonAreaSize>({
		width: 100,
		height: 100,
	});

	// ボタンアニメーション有効フラグ
	const [isButtonAnimation, setIsButtonAnimation] = useState(false);

	/**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
		const buttonAreaWidth = getButtonAreaWidth(); // ボタンエリアの幅を取得
		const buttonSize = setButtonSizeStyle(buttonAreaWidth); // ボタンサイズの設定
		const buttonAreaHeight = getButtonAreaHeight(buttonSize); // ボタンエリアの高さを取得
		setButtonSize(buttonSize); // ボタンサイズを更新
		const buttonAreaSize: ButtonAreaSize = {
			width: buttonAreaWidth,
			height: buttonAreaHeight,
		};
		setButtonAreaSize(buttonAreaSize); // ボタンエリアのサイズを更新
		initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
		stopButtonAnimation(); // ボタンアニメーションの一時解除

		// ブラウザリサイズイベントの登録
		window.addEventListener('resize', (): void => {
			// タイムアウトが走っていない場合
			if (resizeEventSetTimeoutId === 0) {
				resizeEventSetTimeoutId = window.setTimeout(() => {
					const buttonAreaWidth = getButtonAreaWidth(); // ボタンエリアの幅を取得
					const buttonSize = setButtonSizeStyle(buttonAreaWidth); // ボタンサイズの設定
					const buttonAreaHeight = getButtonAreaHeight(buttonSize); // ボタンエリアの高さを取得
					setButtonSize(buttonSize); // ボタンサイズを更新
					const buttonAreaSize: ButtonAreaSize = {
						width: buttonAreaWidth,
						height: buttonAreaHeight,
					};
					setButtonAreaSize(buttonAreaSize); // ボタンエリアのサイズを更新
					initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
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
		console.log('selectedButtons:[' + selectedButtons + ']'); // TODO: 動作確認のためコンソール出力
		// TOOD: 3つボタンが選択された場合
		if (selectedButtons.length >= 3) {
			window.setTimeout(() => {
				setSelectedButtons([]); // 配列を初期化
				// ボタンを初期位置に戻す
				initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
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
	 * ボタン表示エリア幅の取得
	 * @returns ボタン表示エリア幅(px)
	 */
	const getButtonAreaWidth = (): number => {
		const numberButtonAreaElement = document.getElementById('button-area');
		// 存在チェック
		if (!numberButtonAreaElement) {
			console.error('Failed access element id. "button-area" is null.');
			return 0;
		}
		
		// ボタン表示エリア幅を取得
		const buttonAreaWidth = Number(window.getComputedStyle(numberButtonAreaElement).width.replace('px', ''));
		return buttonAreaWidth;
	}

	/**
	 * ボタンエリアの高さを取得
	 * @param buttonSize - 設定されているボタンサイズ(px)
	 * @returns ボタンエリアの高さ(px)
	 */
	const getButtonAreaHeight = (buttonSize: number): number => {
		// ボタンエリア高さを更新
		const newButtonAreaHeight = 3 * buttonSize
																+ Math.floor(buttonSize * numberButtonMarginPerHeight)
																+ Math.floor(buttonSize * calcButtonMarginPerHeight);
		return newButtonAreaHeight;
	}

	/**
	 * ボタンサイズを設定
	 * @param {number} buttonAreaWidth - ボタンエリアの幅(px)
	 * @returns - 設定したボタンのサイズ(px)
	 */
	const setButtonSizeStyle = (buttonAreaWidth: number): number => {
		// ボタンサイズを算出
		const buttonSize = Math.floor(buttonAreaWidth / (4 + 3 * buttonMarginPerWidth));

		// 数字と演算子ボタンサイズを更新
		setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
			...prevNumberCalcButtonStyles,
			[ButtonType.FirstNumber]: {
				...prevNumberCalcButtonStyles[ButtonType.FirstNumber],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.SecondNumber]: {
				...prevNumberCalcButtonStyles[ButtonType.SecondNumber],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.ThirdNumber]: {
				...prevNumberCalcButtonStyles[ButtonType.ThirdNumber],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.FourthNumber]: {
				...prevNumberCalcButtonStyles[ButtonType.FourthNumber],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.Plus]: {
				...prevNumberCalcButtonStyles[ButtonType.Plus],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.Minus]: {
				...prevNumberCalcButtonStyles[ButtonType.Minus],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.Multiply]: {
				...prevNumberCalcButtonStyles[ButtonType.Multiply],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			[ButtonType.Division]: {
				...prevNumberCalcButtonStyles[ButtonType.Division],
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
		}));
		return buttonSize;
	};

	/**
	 * ボタンを初期位置に設定
	 * @param {number} buttonSize - ボタンのサイズ(px)
	 * @param {ButtonAreaSize} buttonAreaSize - ボタンエリアのサイズ(px)
	 */
	const initAllButtonLayout = (buttonSize: number, buttonAreaSize: ButtonAreaSize): void => {
		const buttonMargin = Math.floor((buttonAreaSize.width - 4 * buttonSize) / 3); // ボタンマージン(px)
		// 初期位置に戻すボタン配列を生成
		const initButtons: ButtonType[] = [
			ButtonType.FirstNumber,
			ButtonType.SecondNumber,
			ButtonType.ThirdNumber,
			ButtonType.FourthNumber,
			ButtonType.Plus,
			ButtonType.Minus,
			ButtonType.Multiply,
			ButtonType.Division
		];

		// 配列内のボタンをすべて初期位置に戻す
		initButtons.forEach((button) => {
			initButtonLayout(button, buttonSize, buttonAreaSize); // 特定のボタンを初期位置に戻す
		});
	}

	/**
	 * 特定のボタンの表示位置を初期位置に更新
	 * @param {ButtonType} initButton - 初期位置に表示するボタン
	 * @param {number} buttonSize - ボタンのサイズ(px)
	 * @param {ButtonAreaSize} buttonAreaSize - ボタンエリアのサイズ(px)
	 */
	const initButtonLayout = (initButton: ButtonType, buttonSize: number, buttonAreaSize: ButtonAreaSize): void => {
		const buttonMargin = Math.floor((buttonAreaSize.width - 4 * buttonSize) / 3); // ボタンマージン(px)
		const styleTop: string = judgeCalcButton(initButton) 
														? ((buttonAreaSize.height - buttonSize) + 'px')
														: ((buttonSize + buttonSize * numberButtonMarginPerHeight) + 'px'); // ボタンに設定する上からの表示位置
		let styleLeft: string = ''; // ボタンに設定する左からの表示位置

		// 左から１つ目の数字ボタンの場合
		if (initButton === ButtonType.FirstNumber) {
			styleLeft = '0px';
		}
		// 左から２つ目の数字ボタンの場合
		else if (initButton === ButtonType.SecondNumber) {
			styleLeft = (buttonSize + buttonMargin) + 'px';
		}
		// 左から３つ目の数字ボタンの場合
		else if (initButton === ButtonType.ThirdNumber) {
			styleLeft = (2 * (buttonSize + buttonMargin)) + 'px';
		}
		// 左から４つ目の数字ボタンの場合
		else if (initButton === ButtonType.FourthNumber) {
			styleLeft = (3 * (buttonSize + buttonMargin)) + 'px';
		}
		// 「+」ボタンの場合
		else if (initButton === ButtonType.Plus) {
			styleLeft = '0px';
		}
		// 「-」ボタンの場合
		else if (initButton === ButtonType.Minus) {
			styleLeft = (buttonSize + buttonMargin) + 'px';
		}
		// 「×」ボタンの場合
		else if (initButton === ButtonType.Multiply) {
			styleLeft = (2 * (buttonSize + buttonMargin)) + 'px';
		}
		// 「÷」ボタンの場合
		else if (initButton === ButtonType.Division) {
			styleLeft = (3 * (buttonSize + buttonMargin)) + 'px';
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

		const buttonMargin = Math.floor((buttonAreaSize.width - 4 * buttonSize) / 3); // ボタンマージン(px)

		// 選択されているボタンが１つの場合
		if (newSelectedButtons.length === 1) {
			// 選択欄の中央に表示
			setNumberCalcButtonStyles((prevNumberCalcButtonStyles) => ({
				...prevNumberCalcButtonStyles,
				[newSelectedButtons[0]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[0]],
					top: '0px',
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
					top: '0px',
					left: (buttonSize + buttonMargin) + 'px',
				},
				[newSelectedButtons[1]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[1]],
					top: '0px',
					left: (2 * (buttonSize + buttonMargin)) + 'px',
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
					top: '0px',
					left: (((buttonAreaSize.width - buttonSize) / 2) - (buttonSize + buttonMargin)) + 'px',
				},
				[newSelectedButtons[1]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[1]],
					top: '0px',
					left: ((buttonAreaSize.width - buttonSize) / 2) + 'px',
				},
				[newSelectedButtons[2]]: {
					...prevNumberCalcButtonStyles[newSelectedButtons[2]],
					top: '0px',
					left: (((buttonAreaSize.width - buttonSize) / 2) + (buttonSize + buttonMargin)) + 'px',
				},
			}));
		}

		// 非選択状態になったボタンを初期位置に戻す
		diffSelectedButtons.forEach((button) => {
			initButtonLayout(button, buttonSize, buttonAreaSize); // 特定のボタンを初期位置に戻す
		});
	}

	/**
	 * リセットボタン押下イベント
	 */
	const handleClickResetButton = (): void => {
		setSelectedButtons([]); // 配列を初期化
		// ボタンを初期位置に戻す
		initAllButtonLayout(buttonSize, buttonAreaSize); // ボタンの初期位置設定
	}

	/**
	 * 選択されているボタン配列の更新
	 * @param {ButtonType} selectedButton - 新たに選択されたボタン
	 * @returns - 更新した選択されているボタン配列
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
	 * @returns - 種別が一致するか否か
	 */
	const judgeSameCategoryButton = (firstButton: ButtonType, secondButton: ButtonType): boolean => {
		const isFirstButtonCalc = judgeCalcButton(firstButton); // １つ目のボタンが演算子ボタンか判定
		const isSecondButtonCalc = judgeCalcButton(secondButton); // ２つ目のボタンが演算子ボタンか判定
		return (isFirstButtonCalc === isSecondButtonCalc);
	}

	/**
	 * 演算子ボタンか判定
	 * @param {ButtonType} button - 判定するボタン
	 * @returns - 演算子ボタンか否か
	 */
	const judgeCalcButton = (button: ButtonType): boolean => {
		return (button === ButtonType.Plus
			|| button === ButtonType.Minus
			|| button === ButtonType.Multiply
			|| button === ButtonType.Division);
	}

	return (
		<>
			<div id="button-area" style={{height: buttonAreaSize.height + 'px'}}>
				<div
					className={`${"number-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.FirstNumber]}
					onClick={() => handleClickButton(ButtonType.FirstNumber)}
				>{problemNumbers[0]}</div>
				<div
					className={`${"number-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.SecondNumber]}
					onClick={() => handleClickButton(ButtonType.SecondNumber)}
				>{problemNumbers[1]}</div>
				<div
					className={`${"number-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.ThirdNumber]}
					onClick={() => handleClickButton(ButtonType.ThirdNumber)}
				>{problemNumbers[2]}</div>
				<div
					className={`${"number-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.FourthNumber]}
					onClick={() => handleClickButton(ButtonType.FourthNumber)}
				>{problemNumbers[3]}</div>
				<div
					className={`${"plus-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Plus]}
					onClick={() => handleClickButton(ButtonType.Plus)}
				>+</div>
				<div
					className={`${"minus-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Minus]}
					onClick={() => handleClickButton(ButtonType.Minus)}
				>-</div>
				<div
					className={`${"multiply-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Multiply]}
					onClick={() => handleClickButton(ButtonType.Multiply)}
				>×</div>
				<div
					className={`${"division-button"} ${"round-button"} ${isButtonAnimation ? "button-animation" : ""}`}
					style={numberCalcButtonStyles[ButtonType.Division]}
					onClick={() => handleClickButton(ButtonType.Division)}
				>÷</div>
			</div>
			<div id="reset-button" onClick={handleClickResetButton}>
				Reset
			</div>
		</>
	);
}

export default MakeTen;