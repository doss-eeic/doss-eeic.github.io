<div style="counter-reset: h1 4;"></div>
<div style="counter-reset: h2 0;"></div>

## C/C++ + autotools/cmake 編

* 主にCやC++で書かれたソースコードのビルド方法
* C, C++は昔から開発言語の主流であり, 歴史も深い
* そのためビルドの慣習もいくつかあり, 古い方式と新しい方式が混在している
* ビルドするためにはそのソフト用のビルド手順を読むのが基本である
* ... と述べた上で, ほとんどのソフトが従っている, よくあるパターンをいくつか説明しておく

### configure; make; make install

#### 基本

* tarballで入手したソースツリーには多くの場合, `configure` という名前のファイル (実体はシェルスクリプト) が含まれる
* そのソフトを **本番用ディレクトリ (`/usr/local` など)にインストールする場合 (今はこちらはやらない) の** よくある手順は以下
```
# 注: 以下は本番ディレクトリにインストールするとき; 今はこちらは使わない
$ cd ソースツリーのトップディレクトリ
$ ./configure
$ make
$ sudo make install
```
+ `./configure` は
  * その環境で無事ビルドが可能かをチェックする --- 例えばある関数を使うのであればそれが使えるか (環境に必要なライブラリがインストールされているか) をチェックする
  * `config.h` を, (`config.h.in` を元に) 生成する . ここには `configure` で判明した環境固有の情報 --- この関数が使えるとか使えないとか --- が書き込まれており, 多くのファイルから `#include "config.h"` で取り込まれる
  * `Makefile` を (`Makefile.in` を元に) 生成する. 次の `make` コマンドで使われる
+ `make` は `Makefile` に書かれた命令を読み込んで実際のビルド (コンパイルやリンク) を行う. 普通はここで, `gcc`, `g++` などのコマンドが実行される
+ `make install` は最終的な生成物 --- 実行可能ファイル (いわゆるコマンド) やライブラリ --- を所定の場所 (コマンドは`/usr/local/bin`, ライブラリは`/usr/local/lib` が典型) にコピーする. それらのディレクトリに書き込み権限がないといけないのでここだけ `sudo` (root権限つき) で実行するのが普通

#### 開発・デバッグ用の configure

ここで我々が行う開発・デバッグ用の configureでは
* インストール先ディレクトリの指定
* デバッグオプションの指定
* 最適化なしオプションの指定
を行うので, 我々がよく使うテンプレートは以下である
```
# 開発・デバッグ用のビルド・インストール
$ cd ソースツリーのトップディレクトリ
$ mkdir inst  # インストール先ディレクトリを作る
$ ./configure --prefix=ソースツリーのトップディレクトリ/inst CFLAGS="-O0 -g3" CXXFLAGS="-O0 -g3"
$ make
$ make install
```
* ポイントは`configure`に与えた以下のオプション
  * `--prefix=`*dir* : インストール先のディレクトリを*dir*にする 
  * `CFLAGS="-O0 -g3"` : Cコンパイラ (`gcc`や`clang`) を起動するときのオプションを指定する
  * `CXXFLAGS="-O0 -g3"` : C++コンパイラ (`g++`や`clang++`) を起動するときのオプションを指定する
* `--prefix`で指定したディレクトリなどは, 生成される`Makefile` や `config.h` の中に焼き込まれ, `make` コマンド, ひいては生成されるプログラムの動作に影響を与える
* **注意: `configure` スクリプトはソフトごとに異なる**
  * すべてのソフトに共通した`configure`という唯一無二のコマンドがあるわけではない
  * これは`configure`の目的 --- そのソフトをビルドするのに必要なものが環境に備わっているかをチェックし, 環境の違いを`config.h` や `Makefile` に書き込む --- を考えれば当然
* 一方で `configure` 自身, ツールで自動生成されるものであり, ほとんどのソフトに共通の動作がある
  * `--prefix`などのオプションはほぼ全ての`configure`が受け付けている
  * `CFLAGS=, CXXFLAGS=` なども概ね受け付けている.  が, 必ずそうだと信じ込まないほうが良い (確かめ方は以下)
* 自分が手にした `configure` が何をサポートしているかは,
```
$ ./configure --help
```
で確かめられる

#### make

* `./configure`後に`make`コマンドを実行すると`gcc`, `g++`などが (普通は数多く) 実行され, うまくすれば成功する
* `make` コマンドは一般的にはどのようなコマンドが実行されるかを表示してくれるので, `CFLAGS` **や** `CXXFLAGS` **で指定したオプションが渡っているかに注目**せよ
* しかし, コマンドラインを垂れ流すのが汚いと思うからなのか, それを隠す`Makefile`もある
* そのような場合にはそれを露出させるオプションがないかを探ることに価値がある
* 典型的には
```
$ make VERBOSE=1
$ make V=1
```

#### make install

* `--prefix` で指定したディレクトリ下に最終生成物をインストールする
* `--prefix=`_D_ としたのであれば _D_`/bin`, _D_`/lib`, などのディレクトリができ, コマンドは _D_`/bin`の下に生成されているはず

#### <font color="green">練習</font>

* GNU awk のtarballをダウンロードし, configure; make; make install でビルド, インストールせよ
  * `--prefix` の指定
  * `CFLAGS`  の指定
を忘れずに, gccのコマンドラインにCFLAGSが渡っていることを目視せよ

<iframe width="560" height="315" src="https://www.youtube.com/embed/7cr74yewNqc?si=GkUA0MNO9Pjqg-S0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### autotools

* 上記で tarball には `configure` が含まれておりその場合は述べた手順でビルドができる (ことが多い) と述べた
* 一方 `git clone` してできたディレクトリはさにあらずで, `configure` を生成するというステップから行う想定である場合が多い
* それは, `configure` 自身が非常にややこしいスクリプトであって, 手動で書くものではなく, 別のファイル (`configure.ac`) からツール (`autoconf`) を使って生成しており, git のレポジトリは通常, ツールで生成されたものは含まないよう管理されているという方針による
* 実は tarball に同梱されているファイルには `configure` 以外にもそのような, ツールで生成されているもの (`Makefile.in` など) があり, 生成方法もややこしい
* 処世術としては, 
  + `configure` が含まれておらず代わりに `configure.ac` が含まれていたら,
  + 以下のコマンドでもろもろのファイルを生成する
```
$ autoreconf -i
```
  + `configure, Makefile.in` が生成されていることを確認
* `autorefonf`を初めて実行した人は多くの場合, エラーになるだろう
* 多くの場合以下の3つのツールをインストールすれば解決する
  * autoconf 
  * automake 
  * libtoolize
```
$ sudo apt install autoconf automake libtoolize
```
* その後の手順は前節 (`configure; make; make install`) で述べたものと同じ

*  configure.ac, Makefile.am, config.h.in
* `autoreconf -i` -> configure, Makefile.in, libtool 
* `./configure` -> Makefile config.h

### CMake

#### 基本

* `configure` (autotools) があまりにもややこしいからか, それに変わるものとして [CMake](https://cmake.org/) があり, 最近はそれが多い印象
* `make` と似た名前なので `make` の代替のように見えるがそれは誤解で, あくまで `configure` のステップ (`Makefile` を生成するまで) の代替であり, 実際のコンパイルは `make` で行う
* CMakeでもconfigureでもどちらでもビルドできるようになっているプロジェクトもある

* CMake でのビルドを想定しているソースツリーでは, (普通はトップレベルに) `CMakeLists.txt`というファイルが存在している

* 最低限, configureとの以下のような対応を覚えれば足りる

| configure           |  CMake                        |
|---------------------| ------------------------------| 
|`--prefix=`*D*       | `-DCMAKE_INSTALL_PREFIX=`*D*  |
|`CFLAGS="-O0 -g3"`   | `-DCMAKE_C_FLAGS="-O0 -g3"`   |
|`CXXFLAGS="-O0 -g3"` | `-DCMAKE_CXX_FLAGS="-O0 -g3"` |

* `cmake` には `-DCMAKE_BUILD_TYPE=Debug` というオプションを指定するだけで, 普通は "-g" フラグを指定してくれるが, `"-O0 -g3"` を指定したければ信用しないほうが良い (きちんと gcc などのコマンドラインを目視する)

* CMake は慣例として, 「生成物でソースツリーを汚さない (ソースと生成物は別ディレクトリ)」という方針が貫かれており, build途中のファイルが全て入ったディレクトリ (e.g., `build`) を作ってそこで`cmake`も`make`も実行するのが普通である
* なお`cmake`が生成する`Makefile`はコマンドラインを表示しない (まるでそうすることが美しいと思っているかのような, 進捗表示だけを行う) が, `make VERBOSE=1` とすることで表示してくれるので開発をしたいならそれを推奨する

* 以上より, 開発・デバッグ用の典型的なビルド手順は以下
```
$ cd ソースツリーのトップディレクトリ
$ mkdir build inst # 生成物置き場(build), 最終青果物置き場(inst) を作成
$ cd build
$ cmake -DCMAKE_INSTALL_PREFIX=ソースツリーのトップディレクトリ/inst -DCMAKE_C_FLAGS="-O0 -g3" -DCMAKE_CXX_FLAGS="-O0 -g3" ..
$ make VERBOSE=1
$ make install
```
* 注: cmake の最後の引数 (`..`) は `CMakeLists.txt` の存在するディレクトリを指定している

* cmake では一般に, `-D変数=値` という形でオプションを指定するが, おびただしいオプションがあり名前も長い上, どのようなオプションがあるのかがわかりにくい
* cmakeを実行すると変数の設定が`CMakeCache.txt`というファイルから読み込まれるとともに, 施した設定が同じファイルに書かれるので, 以下のようなやり方が実践的である
```
$ cmake ..
$ # CMakeCahce.txt をエディタで変更する (CMAKE_C_FLAGS, CMAKE_CXX_FLAGS, CMAKE_INSTALL_PREFIX ほか)
$ cmake ..      # もう一度cmake .. を実行
$ make VERBOSE=1
$ make install
```

#### <font color="green">練習</font>

* CMakeでビルドすることを想定した小さなプロジェクトとして [fastfetch](https://github.com/fastfetch-cli/fastfetch) を開発・デバッグ用にビルド, インストールして実行してみよ
* 適切にオプション (`CMAKE_C_FLAGS`, `CMAKE_CXX_FLAGS`, `CMAKE_INSTALL_PREFIX`) を設定すること
* `make VERBOSE=1` をつけてコンパイラのコマンドラインを目視し, `"-O0 -g3"` が行き渡っていることを確認すること

### コードを修正した後の再ビルド

* ソースコードの一部を修正してもう一度ビルドする場合は `make` と `make install` をやり直せば良い
```
$ make 
$ make install
```
* つまり `./configure` や `cmake` の再実行は通常は不要
* `make` はビルドを完了するのに必要なコマンド (修正があったファイルやそれに影響を受けるファイルのコンパイル) だけを実行してくれるので初回のビルドに比べて普通は高速に終わる
* しかし人生においては, 時として全てをやり直したくなるときもある
* その場合は `make clean` とする
```
$ make clean
$ make 
$ make install
```

### configure の再実行

* `./configure` を実行すると `config.cache` というファイルが生成される
* 以降の実行ではこれを参照して一部のコマンド実行をスキップする
* このせいで環境を修正したにもかかわらずエラーがで続けることがあるので, 万全を期したければ `config.cache` を消す
```
$ rm config.cache
$ ./configure
```
* もっとも`./configure` からやり直す, その際に万全を期したいのであれば tarball の展開からやり直すのが一番確実

### cmake の再実行

* `cmake`を実行すると`CMakeCache.txt`というファイルが生成される
* `cmake`実行中にエラーがでて, 環境を修正したにもかかわらずエラーがで続ける場合, `CMakeCache.txt` を消してから再実行する
```
$ rm CMakeCache.txt
$ cmake .. 
```
* この場合も, 初期状態に戻すことに万全を期したければ, ソースツリーごと一旦消去してやり直すのも一考する


### configure/cmake時のエラー対策

* `./configure` や `cmake` 時にはエラーや警告が出ることがある
* その環境ではビルドができない, ということを早めに検出して, その環境の何が問題なのかを指摘することが主な役割である
* 典型的なエラー
  * ツール (コマンド) がない. 例えば gcc/g++ などのC/C++コンパイラがない
  * ライブラリがない. 典型的にはそのライブラリがあれば存在しているはずのヘッダファイル (`xxxx.h`) や共有ライブラリファイル (`libxxx.so`) がない
* それらの多くは必要なソフトをパッケージ管理ソフト (Ubuntuであれば `apt`) でインストールすることで解決する. 例えば`gcc`であれば, 
```
$ sudo apt install gcc
```
* 入れるべきパッケージ名を調べる完璧な方法はない (OS (Linux? Mac? BSD?) が違ったり, 同じOSでもディストリビューション (Ubuntu? Arch? Fedora?) が異なればそれによってもパッケージ名が異なる可能性があるためある程度致し方ない)

### make時のエラー (コンパイルエラー) 対策

* `configure`/`cmake` は成功したが `make`の最中にエラーがおきたらそれはじっくりと腰を据えた調査が必要になる
* しっかりと, 
  * どのディレクトリで実行したどのコマンドがエラーを起こしているのか (だからそれを表示させることが重要!)を見極める
  * 同じエラーを手動で再現する
  * その上でエラーメッセージやその場所を見てじっくり原因を探る
のが重要
* エラーの理由についてはありとあらゆる可能性があるとしか言えないが, おそらく他の環境 (OS, ディストリビューションやそのバージョン) ではコンパイル成功したものだから, 非常に初歩的なエラーということは稀
* 依存しているライブラリが更新されてインタフェースが変更された (ソースコードは少し前のバージョンを前提に書かれている), みたいなことが典型である

### 必要なパッケージ名を探り当てるいくつかの方法

* `./configure`/`cmake` 時によく遭遇するエラーは, 環境に必要なソフト (コマンド, ライブラリ) が入っていないことに起因するものが多い
* 典型的な調査・解決方法

#### コマンドがないと言われた場合
* コマンド名=パッケージ名となっていることは結構多い
```
$ g++
g++: command not found
$ sudo apt install g++
```
* Ubuntuのデスクトップ環境では, シェルにコマンドを打ち込んでそのコマンドがない場合, 必要なパッケージ名を教えてくれる
```
$ g++
Command 'g++' not found, but can be installed with:
sudo apt install g++
```
* 教えてくれない場合, `command-not-found` というパッケージをインストールすると教えてくれるようになる
```  
$ sudo apt install command-not-found
$ sudo apt update
```
* このあと改めて再ログインが必要になるかもしれない

#### ライブラリ (必要な関数が入ったパッケージ) がないと言われた場合
* Ubuntuのライブラリのパッケージ名は `libXXX-dev` という名前のパッケージ名になっていることが多い
* 例えばライブラリ `gmp` がないと言われたら, 
```
$ sudo apt install libgmp-dev
```
をやってみる価値はある. ただしやや当てずっぽうがすぎるという嫌いはある

#### 汎用的なパッケージ検索方法1 apt sesarch

* Ubuntu であれば `apt search キーワード` でそのキーワードがパッケージ名や記述に含まれるパッケージを列挙してくれるので, あるパッケージ名が存在することやその簡単な説明を確認できるため, `apt install` を試みる前に試すことを推奨する
```
$ apt search libgmp-dev
$ apt search libgmp-dev | less  # ページめくりで表示
$ apt search libgmp-dev | grep -A1 -B1 arithmetic  # arithmeticが出現する行とその前後1行を表示
```

#### 汎用的なパッケージ検索方法2 apt-file sesarch

* Ubuntu には `apt-file` というコマンドがありファイル名を与えるとそれが含まれるパッケージ名を教えてくれる
```
$ apt-file search gmp.h
$ apt-file search /gmp.h  # igmp.h などが引っかかってほしくない場合
```
* `apt-file`をインストール, セットアップする手順は以下
```
$ sudo apt apt-file
$ sudo apt-file update
```

