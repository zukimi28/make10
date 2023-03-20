import React, { useEffect, useState } from 'react';
import { NumberButtonStyle, NumberButtonStyles } from '../../core/types';
import './MakeTen.css';

/**
 * MakeTenコンポーネント
 * @returns MakeTenコンポーネント
 */
const MakeTen = (): JSX.Element => {
	// 数字ボタンに動的に設定するスタイルのデフォルト値
	const defaultNumberButtonStyle: NumberButtonStyle = {
		width: '30px',
		height: '30px',
		lineHeight: '30px',
		top: '0px',
		left: '0px',
	}

	// 数字ボタンに動的に設定するスタイル連想配列
	const [numberButtonStyles, setNumberButtonStyles] = useState<NumberButtonStyles>({
		first: defaultNumberButtonStyle,
		second: defaultNumberButtonStyle,
		third: defaultNumberButtonStyle,
		fourth: defaultNumberButtonStyle,
	});
	const buttonMarginPerWidth: number = 1/4; // ボタン幅に対するボタン間マージンの割合
	const resizeEventInterval: number = 100; // リサイズイベントの発生インターバル(ms)
	let resizeEventSetTimeoutId: number = 0; // リサイズイベント時のsetTimeoutID

	/**
	 * 初回レンダリング時処理
	 */
	useEffect(() => {
		const buttonSize = setButtonSize(); // ボタンサイズの設定
		initButtonLayout(buttonSize); // ボタンの初期位置設定

		// ブラウザリサイズイベントの登録
		window.addEventListener('resize', (): void => {
			// タイムアウトが走っていない場合
			if (resizeEventSetTimeoutId === 0) {
				resizeEventSetTimeoutId = window.setTimeout(() => {
					const buttonSize = setButtonSize(); // ボタンサイズの設定
					initButtonLayout(buttonSize); // ボタンの初期位置設定
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
		const numberButtonAreaElement = document.getElementById('number-button-area');
		// 存在チェック
		if (!numberButtonAreaElement) {
			console.error('Failed access element id. "number-button-area" is null.');
			return 0;
		}
		
		// ボタン表示エリア幅を取得
		const buttonAreaWidth = Number(window.getComputedStyle(numberButtonAreaElement).width.replace('px', ''));
		return buttonAreaWidth;
	}

	/**
	 * ボタンサイズの設定
	 * @returns 設定したボタンサイズ(px)
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

		return buttonSize;
	};

	/**
	 * ボタンを初期位置に設定
	 * @param buttonSize - 設定されているボタンサイズ(px)
	 */
	const initButtonLayout = (buttonSize: number): void => {
		const buttonAreaWidth = getButtonAreaWidth(); // ボタンエリア幅(px)
		const buttonMargin = Math.floor((buttonAreaWidth - 4 * buttonSize) / 3); // ボタンマージン(px)

		// 数字ボタンの表示位置を初期位置に更新
		setNumberButtonStyles((prevNumberButtonStyles) => ({
			...prevNumberButtonStyles,
			first: {
				...prevNumberButtonStyles.first,
				left: '0px',
			},
			second: {
				...prevNumberButtonStyles.second,
				left: (buttonSize + buttonMargin) + 'px',
			},
			third: {
				...prevNumberButtonStyles.third,
				left: (2 * (buttonSize + buttonMargin)) + 'px',
			},
			fourth: {
				...prevNumberButtonStyles.fourth,
				left: (3 * (buttonSize + buttonMargin)) + 'px',
			},
		}));
	}

	return (
		<div id="number-button-area">
			<div className="number-button" style={numberButtonStyles.first}>1</div>
			<div className="number-button" style={numberButtonStyles.second}>2</div>
			<div className="number-button" style={numberButtonStyles.third}>3</div>
			<div className="number-button" style={numberButtonStyles.fourth}>4</div>
		</div>
	);
}

export default MakeTen;