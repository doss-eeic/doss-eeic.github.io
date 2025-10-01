# JavaScript (Node.js) : nvm + npm 編

## 基本

* JavaScript はもともとWebブラウザの中で, ページの表現をリッチにするためのプログラミング言語だったが, 単体の JavaScript 実行処理系として切り出されたのが Node.js
* つまり Node.js = 普通の (ブラウザと無関係な) JavaScript の実行環境
  * Python プログラムを実行するためにPython処理系 (`python` コマンド)があるのと同じように JavaScript に対して Node.js (`node`コマンド) がある
* `Node.js` というとまるでそれ自身がJavaScriptのプログラムのようだがそうではない (このネーミングセンスは理解不能)
* JavaScript で書かれたソフトウェアは npm (Node Package Manager) という仕組みで配布・インストールされることが多い
  * つまりPython にとっての pip が JavaScript にとってはnpm
* Node.js は `node` のバージョンによって動作が変わることが多いため, 複数の `node` のバージョンを切り替えられる nvm (Node Version Manager) を組み合わせて使うのが一般的
* そこで以下では nvm, npm, ビルド手順, の順に説明する

## nvmをインストール

* `nvm`コマンド自身は[公式レポジトリ](https://github.com/nvm-sh/nvm) の指示にしたがって最新版を入れる
* 2025/09/30 時点での指示は以下
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```
* 実行すると以下のように, シェルのスタートアップファイル(`~/.bashrc`)を「勝手に設定を書き加えたからね」と報告して勝手に書き換えるので一応確認しておく
* 問題なければ一度ログアウトしてログインし直す
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16631  100 16631    0     0   291k      0 --:--:-- --:--:-- --:--:--  300k
=> Downloading nvm from git to '/home/tau/.nvm'
=> Cloning into '/home/tau/.nvm'...
remote: Enumerating objects: 383, done.
remote: Counting objects: 100% (383/383), done.
remote: Compressing objects: 100% (326/326), done.
remote: Total 383 (delta 43), reused 179 (delta 29), pack-reused 0 (from 0)
Receiving objects: 100% (383/383), 391.78 KiB | 4.84 MiB/s, done.
Resolving deltas: 100% (43/43), done.
* (HEAD detached at FETCH_HEAD)
  master
=> Compressing and cleaning up git repository

=> Appending nvm source string to /home/tau/.bashrc
=> Appending bash_completion source string to /home/tau/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
* `nvm`コマンドが実行されるかを確認
```
$ nvm --help
```

## Node.js (`node`) のインストールと切り替え

### `node` のインストール = nvm install

* `nvm`コマンドがインストールできたら
```
$ nvm install node
```
とすると最新版の`node`, `npm`がインストールされる
* 確認
```
$ which node
/home/tau/.nvm/versions/node/v24.9.0/bin/node
$ which npm
/home/tau/.nvm/versions/node/v24.9.0/bin/npm
```
* 特定バージョン(例: 20)をインストールしたければ, 
```
$ nvm install 20
```
のようにする

### `node` の切り替え = nvm use

* 複数のバージョンをインストールしたら
```
$ nvm use node
$ nvm use 20
```
などで, 使う`node`のバージョンを切り替えられる
```
$ which node
$ node -v
```
などで確認

## npm

### ディレクトリごとのインストール
* npm は, node パッケージを管理するツールであり, パッケージをインストールするには
```
$ npm install パッケージ名
```
とする
* これで, 指定したパッケージとともに, それが依存する他のパッケージもインストールされる
* ファイルは, カレントディレクトリに `node_modules` というディレクトリがなければ作られその下にインストールされる
* つまり, `npm`を実行したディレクトリごとに「別の環境 (Pythonのvenv相当のもの)」が作られるということになる
* インストールされたパッケージ, それが依存しているパッケージは `package.json`, `package-lock.json` というファイルに記録される

### グローバルなインストール (この演習では不要)

* 普段から使うようなソフトは
```
$ npm install -g パッケージ名
```
で, 共通のディレクトリにインストールすることも可能
* グローバルと言っても, `nvm` を使って導入した `npm` の場合, あくまでユーザのホームディレクトリの下 (`~/.nvm`) にインストールされる

## ビルド

* Python同様, 多くのプロジェクトは github にレポジトリがある
* ソースツリーを入手したら通常そのトップディレクトリに `package.json` がある
* そこで
```
$ npm install .
```
を実行すると, ソースツリー及びそれが依存しているパッケージ (`package.json`, `package-lock.json` から読み込まれる) がインストールされる

* 別のやり方として, 
```
$ npm install
$ npm link
```
とすると, はじめのコマンドでは以前するパッケージだけがインストールされ, 2つ目のコマンドではソースツリー中のファイルへのリンクがインストールされる
* この方法だとその後ソースツリー中のソースコードを変更すればそれがひとりでに反映される
* `pip`の `pip install -e .`と似た効果を持つ

## パッケージの検索

* `npm search`コマンドで検索することもできる
```
npm search キーワード
```
* [npm](https://www.npmjs.com/) ホームページで検索することもできる

