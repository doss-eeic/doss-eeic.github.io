# ソースコードのダウンロード

## tarball

* "tarball"は多数のファイルを収めたディレクトリ一式を, tarというコマンドで一つのファイルにまとめ (Windowsでzipに馴染みのある人はそれのUnix版だと思えば良い), 通常はそれを gzip, bzip2 などの圧縮ファイルで圧縮したものである. 
* そのためtarballのファイル名は通常, xyz.tar.gz (gzipの場合) または xyz.tar.gz2 (bzip2の場合)
* その昔は, ソースコードの配布はビルドに必要なファイルをすべて収めたディレクトリ --- **ソースツリー** --- をtarballの形式にしてダウンロードささせるだけ, というパターンが多かった
* tarball が無事入手できたら, 以下のコマンドで解凍するとディレクトリ構造が復元される
```bash
$ tar xf xyz.tar.bz2
```
* 慣習上, **通常は**これで `xyz` という名前の, 全てのファイルを含んだディレクトリができるが必ずそうなるとは限らない (あくまでtarballを作った人の名前付けに依存する) し, 場合によっては複数のファイルを解凍した場所にぶちまける行儀の悪いtarballもある
* したがって安全のため, 作業は空のディレクトリを作って行うのがよい
```bash
$ mkdir empty
$ # empty/ の中に xyz.tar.bz2 を入れる
$ cd empty
$ tar xvf xyz.tar.bz2
```

* `xvf`の
  * `x` ... 解凍 (extract)
  * `v` ... 進捗表示 (verbose) : ファイルが解凍されるたびにその名前を表示する
  * `f` ... ファイル指定 : xyz.tar.bz2 が解凍の対象であることを指定

### 練習

+ GNU hello というプログラムの tarball をダウンロードしてみよ
+ 空フォルダを作りそこでそれを解凍してみよ

* 検索で見つけることを推奨するが見つからないときのため, 一応 [ここ](https://www.gnu.org/software/hello/)

## github

* C/C++に限らず殆どの言語で, 多くのオープンソースプロジェクトのソースコードが [github](https://github.com/) から提供されている
* ソフトの名前がわかっていればGoogleで "ソフト名 github" などとすれば github 上の, そのソフトの着地ページが見つかることだろう
* github上で, あるプロジェクトのソースコードを収めた実体をそのプロジェクトの「レポジトリ」と呼ぶ
* そのレポジトリを開発用マシンに, コピー (clone) することでソースコードを含んだディレクトリがまるごとダウンロードできる
* 着地ページが見つかったら, 同ページの Code という緑のボタンをおすとレポジトリをcloneするための URL もしくはコマンドが表示される
* URLは 
```
git@github.com:xyz/xyz.git
```
もしくは
```
https://github.com/xyz/xyz.git
```
のような文字列
* これをcloneするコマンドは `git clone レポジトリのURL`
```
$ git clone git@github.com:xyz/xyz.git
```
もしくは
```
$ git clone https://github.com/xyz/xyz.git
```

`git` コマンドが見つからなければ, Ubuntuであれば以下のようにしてインストールする

```
$ sudo apt install git
```

### 練習

+ `curl` という, (主に) webページをブラウザを使わず, コマンドラインでアクセスするツールのgit レポジトリを発見し, `git clone` してみよ
* 見つからなかったときは[ここ](https://github.com/curl/curl)

