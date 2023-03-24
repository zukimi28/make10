import React, { useEffect, useState } from 'react';
import { ButtonStyle, NumberButtonStyles, ButtonType, CalcButtonStyles } from '../../core/types';
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
	const numberButtonMarginPerHeight: number = 2/3; // 数字ボタン高さに対する数字ボタンと回答エリア間マージンの割当
	const calcButtonMarginPerHeight: number = 1/3; // 演算ボタン高さに対する演算ボタンと回答エリア間マージンの割当
	// ボタンエリア高さのデフォルト値(px)
	const defaultButtonAreaHeight = 3 * defaultButtonSize 
																	+ Math.floor(defaultButtonSize * numberButtonMarginPerHeight)
																	+ Math.floor(defaultButtonSize * calcButtonMarginPerHeight);
	const resizeEventInterval: number = 100; // リサイズイベントの発生インターバル(ms)
	let resizeEventSetTimeoutId: number = 0; // リサイズイベント時のsetTimeoutID

	// 数字ボタンに動的に設定するスタイル連想配列
	const [numberButtonStyles, setNumberButtonStyles] = useState<NumberButtonStyles>({
		first: defaultButtonStyle,
		second: defaultButtonStyle,
		third: defaultButtonStyle,
		fourth: defaultButtonStyle,
	});

	// ボタンエリア高さ(px)
	const [buttonAreaHeight, setButtonAreaHeight] = useState(defaultButtonAreaHeight);

	// 演算ボタンに動的に設定するスタイル連想配列
	const [calcButtonStyles, setCalcButtonStyles] = useState<CalcButtonStyles>({
		plus: defaultButtonStyle,
		minus: defaultButtonStyle,
		multiply: defaultButtonStyle,
		division: defaultButtonStyle,
	});

	/**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
		const newButtonSize = setButtonSize(); // ボタンサイズの設定
		const newButtonAreaHeight = setButtonAreaSize(newButtonSize); // ボタンエリアのサイズの設定
		initButtonLayout(newButtonSize, newButtonAreaHeight); // ボタンの初期位置設定

		// ブラウザリサイズイベントの登録
		window.addEventListener('resize', (): void => {
			// タイムアウトが走っていない場合
			if (resizeEventSetTimeoutId === 0) {
				resizeEventSetTimeoutId = window.setTimeout(() => {
					const newButtonSize = setButtonSize(); // ボタンサイズの設定
					const newButtonAreaHeight = setButtonAreaSize(newButtonSize); // ボタンエリアのサイズの設定
					initButtonLayout(newButtonSize, newButtonAreaHeight); // ボタンの初期位置設定
					window.clearTimeout(resizeEventSetTimeoutId); // タイムアウトイベントの削除
					resizeEventSetTimeoutId = 0; // IDリセット
				}, resizeEventInterval);
			}
		});
	}, []);

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
	 * ボタンサイズの設定
	 * @returns - 設定したボタンのサイズ(px)
	 */
	const setButtonSize = (): number => {
		// ボタン表示エリア幅を取得
		const buttonAreaWidth = getButtonAreaWidth();
		
		// ボタンサイズを算出
		const buttonSize = Math.floor(buttonAreaWidth / (4 + 3 * buttonMarginPerWidth));

		// 数字ボタンサイズを更新
		setNumberButtonStyles((prevNumberButtonStyles) => ({
			...prevNumberButtonStyles,
			first: {
				...prevNumberButtonStyles.first,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			second: {
				...prevNumberButtonStyles.second,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			third: {
				...prevNumberButtonStyles.third,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			fourth: {
				...prevNumberButtonStyles.fourth,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
		}));

		// 演算ボタンサイズを更新
		setCalcButtonStyles((prevCalcButtonStyles) => ({
			...prevCalcButtonStyles,
			plus: {
				...prevCalcButtonStyles.plus,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			minus: {
				...prevCalcButtonStyles.minus,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			multiply: {
				...prevCalcButtonStyles.multiply,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
			division: {
				...prevCalcButtonStyles.division,
				width: buttonSize + 'px',
				height: buttonSize + 'px',
				lineHeight: buttonSize + 'px',
			},
		}));

		return buttonSize;
	};

	/**
	 * ボタンエリアのサイズの設定
	 * @param buttonSize - 設定されているボタンサイズ(px)
	 * @returns 設定したボタンエリアの高さ(px)
	 */
	const setButtonAreaSize = (buttonSize: number): number => {
		// ボタンエリア高さを更新
		const newButtonAreaHeight = 3 * buttonSize
																+ Math.floor(buttonSize * numberButtonMarginPerHeight)
																+ Math.floor(buttonSize * calcButtonMarginPerHeight);
		
		setButtonAreaHeight(newButtonAreaHeight);

		return newButtonAreaHeight;
	}

	/**
	 * ボタンを初期位置に設定
	 * @param buttonSize - 設定されているボタンサイズ(px)
	 * @param areaHeight - ボタンエリアの高さ(px)
	 */
	const initButtonLayout = (buttonSize: number, areaHeight: number): void => {
		const buttonAreaWidth = getButtonAreaWidth(); // ボタンエリア幅(px)
		const buttonMargin = Math.floor((buttonAreaWidth - 4 * buttonSize) / 3); // ボタンマージン(px)

		// 数字ボタンの表示位置を初期位置に更新
		setNumberButtonStyles((prevNumberButtonStyles) => ({
			...prevNumberButtonStyles,
			first: {
				...prevNumberButtonStyles.first,
				top: '0px',
				left: '0px',
			},
			second: {
				...prevNumberButtonStyles.second,
				top: '0px',
				left: (buttonSize + buttonMargin) + 'px',
			},
			third: {
				...prevNumberButtonStyles.third,
				top: '0px',
				left: (2 * (buttonSize + buttonMargin)) + 'px',
			},
			fourth: {
				...prevNumberButtonStyles.fourth,
				top: '0px',
				left: (3 * (buttonSize + buttonMargin)) + 'px',
			},
		}));

		// 演算ボタンの表示位置を初期位置に更新
		setCalcButtonStyles((prevCalcButtonStyles) => ({
			...prevCalcButtonStyles,
			plus: {
				...prevCalcButtonStyles.plus,
				top: (areaHeight - buttonSize) + 'px',
				left: '0px',
			},
			minus: {
				...prevCalcButtonStyles.minus,
				top: (areaHeight - buttonSize) + 'px',
				left: (buttonSize + buttonMargin) + 'px',
			},
			multiply: {
				...prevCalcButtonStyles.multiply,
				top: (areaHeight - buttonSize) + 'px',
				left: (2 * (buttonSize + buttonMargin)) + 'px',
			},
			division: {
				...prevCalcButtonStyles.division,
				top: (areaHeight - buttonSize) + 'px',
				left: (3 * (buttonSize + buttonMargin)) + 'px',
			},
		}));
	}

	/**
	 * ボタンのクリックイベント
	 * @param type - 押下した数字ボタンの種類
	 */
	const handleClickButton = (type: ButtonType) => {
		console.log('Clicked ' + ButtonType[type] + ' button!');

	}

	return (
	
		<div id="button-area" style={{height: buttonAreaHeight + 'px'}}>
			<div
				className="number-button"
				style={numberButtonStyles.first}
				onClick={() => handleClickButton(ButtonType.FirstNumber)}
			>{problemNumbers[ButtonType.FirstNumber]}</div>
			<div
				className="number-button"
				style={numberButtonStyles.second}
				onClick={() => handleClickButton(ButtonType.SecondNumber)}
			>{problemNumbers[ButtonType.SecondNumber]}</div>
			<div
				className="number-button"
				style={numberButtonStyles.third}
				onClick={() => handleClickButton(ButtonType.ThirdNumber)}
			>{problemNumbers[ButtonType.ThirdNumber]}</div>
			<div
				className="number-button"
				style={numberButtonStyles.fourth}
				onClick={() => handleClickButton(ButtonType.FourthNumber)}
			>{problemNumbers[ButtonType.FourthNumber]}</div>
			<div
				className="calc-button"
				style={calcButtonStyles.plus}
				onClick={() => handleClickButton(ButtonType.Plus)}
			>+</div>
			<div
				className="calc-button"
				style={calcButtonStyles.minus}
				onClick={() => handleClickButton(ButtonType.Minus)}
			>-</div>
			<div
				className="calc-button"
				style={calcButtonStyles.multiply}
				onClick={() => handleClickButton(ButtonType.Multiply)}
			>×</div>
			<div
				className="calc-button"
				style={calcButtonStyles.division}
				onClick={() => handleClickButton(ButtonType.Division)}
			>÷</div>
		</div>
	);
}

export default MakeTen;