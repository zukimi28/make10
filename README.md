# Make10

[Make10](https://c-jacknon.github.io/make10/) とは、ランダムに生成される4つの数字から、四則演算を用いて「10」を作り出すゲームです。

## 開発コマンド

以下のコマンドはターミナルで実行して使用する。
### `npm start`

開発者モードで [http://localhost:3000](http://localhost:3000) にアプリケーションをデバッグ実行させる。  
ソースコードを編集し、保存することで自動的にリビルドを実行して画面に反映される。  
終了するにはターミナルより以下のコマンドを実行する。
```
Shift + c
```

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
### `npm run deploy`

ソースコードをビルドし、github-pagesにデプロイを行う。  
ビルドしたソースコードは `make10/docs/` に配置される。