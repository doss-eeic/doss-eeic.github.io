<div style="counter-reset: h1 4;"></div>
<div style="counter-reset: h2 2;"></div>

## JavaScript (Node.js) : nvm + npm 編

### 概要

* JavaScript はもともとWebページの一部として書いて, 動的なページを作るためのプログラミング言語だった
* したがって実行環境はWebブラウザの中と決まっていたのだが, ブラウザ外でも通常のプログラミング言語として実行できるよう, 単体の処理系として切り出されたのが Node.js
* つまり Node.js = 普通の (ブラウザと無関係な) JavaScript の実行環境
  * Python プログラムを実行するためにPython処理系 (`python` コマンド)があるのと同じように JavaScript に対して Node.js (`node`コマンド) がある
  * `Node.js` というとまるでそれ自身がJavaScriptのプログラムのようだがそうではない (このネーミングは理解不能)
* JavaScript で書かれたソフトウェアは npm (Node Package Manager) という仕組みで配布・インストールされることが多い
  * つまりPython にとっての pip が JavaScript にとってはnpm
* Node.js は `node` のバージョンによって動作が変わることが多いため, 複数の `node` のバージョンを切り替えられる nvm (Node Version Manager) を組み合わせて使うのが一般的
* そこで以下では nvm, npm, ビルド手順, の順に説明する

### nvmをインストール

* `nvm`コマンド自身は[公式レポジトリ](https://github.com/nvm-sh/nvm) の指示にしたがって最新版を入れる
* 2025/09/30 時点での指示は以下
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
* 実行すると以下のように, シェルのスタートアップファイル(`~/.bashrc`)を「勝手に設定を書き加えたからね」と報告して勝手に書き換えるので一応確認しておく
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16631  100 16631    0     0   291k      0 --:--:-- --:--:-- --:--:--  300k

   ... <省略> ...

=> Appending nvm source string to /home/tau/.bashrc
=> Appending bash_completion source string to /home/tau/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
* 注: 
  * `~/.bashrc` はログイン時に自動的に実行されるものではない (対話的シェルを起動したときに実行される)
  * bash を使っている場合, ログインしたときに自動的に実行されるようにするには同じ内容を,  `~/.bash_profile` にも書かなければならない
  * bash以外のシェル (zsh, fishなど) を使っている人はメッセージを見ながら適切に設定してください
* 問題なければ一度ログアウトしてログインし直す
* `nvm`コマンドが実行されるかを確認
```
$ nvm --help
```

### Node.js (`node`, `npm`) のインストールと切り替え

#### `node`/`npm` のインストール = nvm install

* `nvm`コマンドがインストールできたら`nvm install ...` で`node`/`npm` をインストールできる
```
$ nvm install node
```
とすると最新版の`node`, `npm`がインストールされる
* 特定バージョン(例: 20)をインストールしたければ, 
```
$ nvm install 20
```
のようにする
* インストール先は `~/.nvm` の下, バージョンごとのディレクトリ
* 確認
```
$ which node
/home/tau/.nvm/versions/node/v24.9.0/bin/node
$ which npm
/home/tau/.nvm/versions/node/v24.9.0/bin/npm
```

#### `node`/`npm` の切り替え = nvm use

* `nvm`で複数のバージョンの`node`/`npm`をインストールしたら `nvm use ...` で, 利用する`node`/`npm`のバージョンを切り替えられる
```
$ nvm use node
```
は最新版を使う指定
* バージョンを指定したい場合は
```
$ nvm use 20
```
など
* `node`, `npm` が起動できることと, バージョンを確認
```
$ node -v
v24.9.0
$ npm -v
11.6.0
```

### npm 概論

* npm は, node パッケージを管理するツールであり, パッケージをインストールするには
```
$ npm install パッケージ名
```
とする
* これで, **指定したパッケージ** +  **それが依存する他のパッケージ** もインストールされる
* ファイルはカレントディレクトリ下の `node_modules` というディレクトリにインストールされる (存在していなければ作られる)
* つまり, `npm`を実行したディレクトリごとに「別の環境 (Pythonのvenv相当のもの)」が作られるということになる
* インストールされたパッケージ, それが依存しているパッケージは `package.json`, `package-lock.json` というファイルに記録される

#### 例

* [cowsay](https://www.npmjs.com/package/cowsay/v/1.4.0) は牛がセリフを喋っているアスキー画を生成してくれる他愛のないコマンド

```
$ npm install cowsay

added 41 packages in 2s

3 packages are looking for funding
  run `npm fund` for details
$ ls
node_modules/  package.json  package-lock.json
```
* コマンド (実行可能ファイル) は`node_modules/.bin` 下にインストールされる
```
$ ls node_modules/.bin
cowsay@  cowthink@
$ node_modules/.bin/cowsay "I am sleepy"
 _____________
< I am sleepy >
 -------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
* ライブラリとして使う場合は[ホームページ](https://www.npmjs.com/package/cowsay/v/1.4.0)を参考にJavaScriptを書き, `node`コマンドで実行
* 例えば以下のようなファイル `a.js` を, `npm install cowsay` を実行したディレクトリ (`node_modules` があるディレクトリ) に作り,
```
var cowsay = require("cowsay");

console.log(cowsay.say({
	text : "I'm a moooodule",
	e : "oO",
	T : "U "
}));
```
* 以下で実行
```
$ node a.js
```

#### 参考: グローバルなインストール (この演習では不要)

* `node_modules` の下に全てがインストールされるという仕様は, 環境がひとりでに隔離される(開発のためのファイルが普段使う環境を汚さない), 気軽にやり直せる (`node_modules`を削除すれば良い) という意味では便利だが, 普段から色々なところで使うソフトを入れる場合には不便でもある
* `-g` を使うと, グローバルなディレクトリにインストールされる
```
$ npm install -g パッケージ名
```
* 「グローバルなディレクトリ」とは, `nvm` を使って導入した `npm` の場合, あくまでユーザのホームディレクトリの下 (`~/.nvm`) の下であって, 全ユーザ共通ということではない

### ソースコードのダウンロード

* Python同様, 多くのプロジェクトは github にレポジトリがある
* git clone でソースツリーを入手したら, 通常そのトップディレクトリに `package.json` がある
* ソースツリーに入って`npm install` (**引数なし**)を実行すると, **依存しているパッケージだけ** (`package.json`, `package-lock.json` から読み込まれる) が, `node_modules`へインストールされる
* 例:
```
$ git clone git@github.com:piuccio/cowsay.git
$ cd cowsay
$ npm install
```
* `npm install パッケージ名` としたときと異なり, **本体** (`cowsay` **自身**)はインストールされないことに注意

### 開発用のビルド

* 一般にJavaScript処理系 (`node` やブラウザ) はソースファイルを直接実行できるため, 特別なビルドのステップは不要な場合が多い
* 必要なパッケージもあり, そのような場合は, `npm install`のあと, 
```
$ npm run build
```
を実行する
* これが必要か否かは, `package.json`の `"scripts"` という属性の中に, `"build"` という属性があるかで判断する (`npm run build` は `package.json` -> "scripts" -> "build" に書かれているコマンドを実行する)
* この状態で, パッケージを使う準備がほぼ整っているが, 上述した動作 (**ソースツリー内で** `npm install` **を実行してもそのパッケージ自身はインストールされない**) のためやや注意が必要

(a) `node_modules/.bin` 下にコマンドがインストールされないため, コマンドの動作を追跡したければそのソースファイルを突き止める必要がある
* それは `package.json` の `"bin"` という属性を見るとわかる
```
  "bin": {
    "cowsay": "./cli.js",
    "cowthink": "./cli.js"
  },
```
* `:` の左側がインストールされた後のコマンド名, 右側がそのソースコード(ソースツリーのトップディレクトリからの相対パス)
* これを見て, ソースツリー直下の`cli.js` が `cowsay` コマンドの実体であるとわかる

(b) `node_modules/` 下にインストールされないため, ライブラリとして使いながらデバッグする場合も, `require(パッケージ名)` ではダメで, `require(パス名)` とする必要がある
* 例えば以下の `require("cowsay")` は `node_modules`下に `cowsay`がないため失敗する
```
var cowsay = require("cowsay");
```
* 代わりに (`git clone` を実行したフォルダで実行するのであれば)
```
var cowsay = require("./cowsay");
```
とする. 
  * または `cowsay` フォルダで実行するのであれば, 
```
var cowsay = require(".");
```
でもよい

### パッケージの検索

* `npm search`コマンドで検索することもできる
```
npm search キーワード
```
* [npm](https://www.npmjs.com/) ホームページで検索することもできる

### <font color="green">練習</font>

* JavaScript のパッケージ `cowsay` のgithubレポジトリを見つけ, 
* 空のディレクトリを作り, コードをダウンロード (git clone), 
* 開発用インストール
  + `cowsay` ディレクトリに入って `npm install`
  + (任意) `cowsay` の親ディレクトリで `npm install ./cowsay`
を行ってみよ 

<iframe width="560" height="315" src="https://www.youtube.com/embed/B45opH38rOI?si=ZA3SHU7m_qG7Foir&amp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
