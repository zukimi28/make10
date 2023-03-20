import React from 'react';

/**
 * 数字ボタンに動的に設定するスタイル
 * ※pxをつけること
 * @property {string} width - 幅
 * @property {string} height - 高さ
 * @property {string} lineHeight - 文字表示高さ
 * @property {string} top - 上からの表示位置
 * @property {string} left - 左からの表示位置
 */
export interface NumberButtonStyle {
	width: string,
	height: string,
	lineHeight: string,
  top: string,
	left: string,
}

/**
 * 数字ボタンの動的に設定するスタイル配列
 * @property {NumberButtonStyle} first - 1つ目の数字ボタンに設定するスタイル
 * @property {NumberButtonStyle} second - 2つ目の数字ボタンに設定するスタイル
 * @property {NumberButtonStyle} third - 3つ目の数字ボタンに設定するスタイル
 * @property {NumberButtonStyle} fourth - 4つ目の数字ボタンに設定するスタイル
 */
export interface NumberButtonStyles {
  first: NumberButtonStyle,
  second: NumberButtonStyle,
  third: NumberButtonStyle,
  fourth: NumberButtonStyle,
}