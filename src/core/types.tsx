
/**
 * ボタン種類
 */
export enum ButtonType {
  /**
   * 左から1つ目の数字ボタン
   */
  FirstNumber = 0,
  /**
   * 左から2つ目の数字ボタン
   */
  SecondNumber = 1,
  /**
   * 左から3つ目の数字ボタン
   */
  ThirdNumber = 2,
  /**
   * 左から4つ目の数字ボタン
   */
  FourthNumber = 3,
  /**
   * 「＋」ボタン
   */
  Plus = 4,
  /**
   * 「ー」ボタン
   */
  Minus = 5,
  /**
   * 「×」ボタン
   */
  Multiply = 6,
  /**
   * 「÷」ボタン
   */
  Division = 7,
}

/**
 * 数字ボタンと演算ボタンに動的に設定するスタイル
 * ※pxをつけること
 * @property {string} width - 幅
 * @property {string} height - 高さ
 * @property {string} lineHeight - 文字表示高さ
 * @property {string} top - 上からの表示位置
 * @property {string} left - 左からの表示位置
 */
export interface ButtonStyle {
	width: string,
	height: string,
	lineHeight: string,
  top: string,
	left: string,
}

/**
 * 数字ボタンの動的に設定するスタイル配列
 * @property {ButtonStyle} first - 1つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} second - 2つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} third - 3つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} fourth - 4つ目の数字ボタンに設定するスタイル
 */
export interface NumberButtonStyles {
  first: ButtonStyle,
  second: ButtonStyle,
  third: ButtonStyle,
  fourth: ButtonStyle,
}

/**
 * 演算ボタンの動的に設定するスタイル配列
 * @property {ButtonStyle} plus - 「＋」ボタンに設定するスタイル
 * @property {ButtonStyle} minus - 「ー」ボタンに設定するスタイル
 * @property {ButtonStyle} multiply - 「×」ボタンに設定するスタイル
 * @property {ButtonStyle} division - 「÷」ボタンに設定するスタイル
 */
export interface CalcButtonStyles {
  plus: ButtonStyle,
  minus: ButtonStyle,
  multiply: ButtonStyle,
  division: ButtonStyle,
}
