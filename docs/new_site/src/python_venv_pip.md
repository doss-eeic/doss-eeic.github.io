<div style="counter-reset: h1 4;"></div>
<div style="counter-reset: h2 1;"></div>

## Python : venv + pip 編

### 基本

* Pythonで書かれたソフトウェアは [pip](https://pypi.org/project/pip/) というソフトウェア (Ubuntu の `apt` の Python版だと思えば良い) でインストールできることが多い
* ただし最近の `pip` は全ユーザ共通のディレクトリ (`/usr/local`など) へのインストールを非推奨 (最近は禁止に近い) としており, 個人のディレクトリへ, それも [venv](https://docs.python.org/3/library/venv.html) (仮想環境. 仮想マシンと紛らわしいが, つまりは目的に応じて複数の Python 環境を持てる仕組み) というものを組み合わせて指定した環境へインストールすることを前提にしている
* Pythonプログラムは通常「ビルド」という手順は不要で, `pip`もソースコード (.py) をインストールするので原理的には `pip` でソースコードを入手可能だが, 通常は git でダウンロードする
* git でソースコードをダウンロードした場合も `pip` を使ってそのソースコードを適切な場所に配置するため結局 `pip` が必要となる
* そこで以下では venv, pip, ビルド手順, の順に説明する
* 動画で概要を見たい人用 (倍速推奨)

### venv : virtual env 

* Pythonの[venv](https://docs.python.org/3/library/venv.html) は, 目的に応じた複数の Python 環境 (ここでは環境 = インストールされているパッケージの集合のことだと思えば良い) を持つことができる仕組み
* 最初に, システム共通の `python` コマンド (`python3` という名前の場合もある) が使える状態を前提とする

```
$ which python
/usr/bin/python   # システム共通の python
```

* ここで以下
```
$ python -m venv my_env
```
を実行すると, 
* `my_env` というフォルダが作られ, まっさらなPython環境がその下に作られる. 続けて
* ここで以下
```
$ . my_env/bin/activate
```
を実行すると, `my_env`下のPython環境が使われるようになる
* 具体的には以下のように, `my_env`下の`python`コマンドや`pip`コマンドが使われるようになる
```
$ which python
/ ... /my_env/bin/python   # 絶対パス名
$ which pip
/ ... /my_env/bin/pip      # 絶対パス名
```
* 仕組みは単純で, `PATH`という環境変数で, `my_env/bin`ディレクトリが先に検索されるようにしているだけである
```
$ echo $PATH
```
* この`pip`コマンドはパッケージを `my_env` 下にインストールするし, `python`コマンドは `import` 文を実行する際に `my_env` 下でモジュールを探す
* `my_env` ディレクトリを消せばそのPython仮想環境は跡形もなく消える

#### 余談: venvディレクトリの場所と名前

* venv でディレクトリ (上記の `my_env`) を作る際にどこになんという名前で作るのが良いのだろう? 世の中では主に2つの流儀があるようである
  * プロジェクトに特化したディレクトリを, ソースツリー内に決まった名前 (e.g., `.venv`)で作る (`venv` という名前は避けておくのが無難だろう)
  * ホームディレクトリ直下に `~/.venvs` のようなディレクトリを作りその下に集める
なおどちらの場合も, `.` から始めることが世の中の慣習になっているようだが, 積極的な理由があるのか不明

### pip : Pythonのパッケージインストーラ

* pip であるPythonパッケージを見つけたら
```
pip install パッケージ名
```
でインストール可能
* ファイルは実行した`pip`コマンドと同じPython環境内に配置される

#### パッケージの検索

* かつては `pip search 文字列` というコマンドで検索できていたがあるときからその機能が廃止され, [https://pypi.org/](https://pypi.org/) から探せということになった (理解不能)

### ビルド

* 通常はそのプロジェクトの github レポジトリが存在しているので git clone する (やり方は[ソースコードのダウンロード](download_source.md) を参照
* ソースツリーのトップレベルに `pyproject.toml`, `setup.py`, `setup.cfg` のどれかが見つかったら
```
$ pip install -e .
```
とすれば, ビルド(と言っても Pythonであればコンパイルは不要)及び, ファイルの配置が行われる
* なお, `-e` (editable) オプションをつけると, ファイルのコピーは行われず, ソースツリー中のファイルがそのまま参照される 
  * 本来インストールされる場所からソースツリー中にシンボリックリンク・ショートカットのようなものができるとイメージすればよい
* ソースコードを修正すればそれがそのまま反映されるので, 開発するのに便利

### <font color="green">練習</font>

* Pythonのライブラリ `art` のgithubレポジトリを見つけ, 
* コードをダウンロード (git clone), 
* `pip install -e` で開発用インストールを行ってみよ

<iframe width="560" height="315" src="https://www.youtube.com/embed/dk84pK1Nk5E?si=9bINBWMKMh1q2aZs&amp;start=649" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
