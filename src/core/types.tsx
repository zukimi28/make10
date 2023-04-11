/**
 * ストレージに保存するデータ種類
 */
export enum StorageData {
  /**
   * ページを開いた日付
   */
  OpenPageDate = 'OpenPageDate',
}

/**
 * ボタン種類
 */
export enum ButtonType {
  /**
   * 左から1つ目の数字ボタン
   */
  FirstNumber = 'first',
  /**
   * 左から2つ目の数字ボタン
   */
  SecondNumber = 'second',
  /**
   * 左から3つ目の数字ボタン
   */
  ThirdNumber = 'third',
  /**
   * 左から4つ目の数字ボタン
   */
  FourthNumber = 'fourth',
  /**
   * 「＋」ボタン
   */
  Plus = 'plus',
  /**
   * 「ー」ボタン
   */
  Minus = 'minus',
  /**
   * 「×」ボタン
   */
  Multiply = 'multiply',
  /**
   * 「÷」ボタン
   */
  Division = 'division',
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
 * 数字と演算子ボタンの動的に設定するスタイル配列
 * @property {ButtonStyle} first - 1つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} second - 2つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} third - 3つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} fourth - 4つ目の数字ボタンに設定するスタイル
 * @property {ButtonStyle} plus - 「＋」ボタンに設定するスタイル
 * @property {ButtonStyle} minus - 「ー」ボタンに設定するスタイル
 * @property {ButtonStyle} multiply - 「×」ボタンに設定するスタイル
 * @property {ButtonStyle} division - 「÷」ボタンに設定するスタイル
 */
export interface NumberCalcButtonStyles {
  [ButtonType.FirstNumber]: ButtonStyle,
  [ButtonType.SecondNumber]: ButtonStyle,
  [ButtonType.ThirdNumber]: ButtonStyle,
  [ButtonType.FourthNumber]: ButtonStyle,
  [ButtonType.Plus]: ButtonStyle,
  [ButtonType.Minus]: ButtonStyle,
  [ButtonType.Multiply]: ButtonStyle,
  [ButtonType.Division]: ButtonStyle,
}

/**
 * ボタンエリアサイズ
 * @property {number} width - ボタンエリアの幅(px)
 * @property {number} height - ボタンエリアの高さ(px)
 */
export interface ButtonAreaSize {
  width: number;
  height: number;
}