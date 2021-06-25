# mysite

## package.json作成
```
npm init -y
```

### webpack、関連のインストール
```
npm i -D　webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin
```

### Three.jsのインストール
```
npm i -S three
```

### gitignore
```
echo node_modules/ > .gitignore
```

### webpack 設定ファイル
```
type nul > webpack.common.js
type nul > webpack.dev.js
type nul > webpack.prod.js
```
