#import "@preview/touying:0.6.1": *
#import themes.metropolis: *
//#import themes.university: *
//#import themes.aqua: *
//#import themes.dewdrop: *
//#import themes.simple: *
//#import themes.stargazer: *
//#import themes.default: *
//#import "@preview/numbly:0.1.0": numbly

#show: metropolis-theme.with(
  aspect-ratio: "16-9",
  config-info(
    title: [大規模ソフトウェアを手探る],
    author: [田浦 健次朗 \ 高橋淳一郎 (田浦研M1), 瀧川雄理 (田浦研B4) ],
    date: [2025/10/07],
  ),
)

//#set text(font: ("Liberation Serif", "Noto Sans CJK JP"))
#set text(font: ("Liberation Serif", "TakaoMincho"))
#set text(size: 24pt)
#set quote(block: true)
#let ao(x) = text(blue)[#x]
#let aka(x) = text(red)[#x]
#let small(x) = text(size: 20pt)[#x]

/* include image sequence xxx_L1.svg, xxx_L2.svg, ... */
#let images(prefix, rng, ..kwargs) = for (i, j) in rng.enumerate() [
  #only(i+1, image(prefix + "_L" + str(j) + ".svg", ..kwargs))
]

#let blink(x, y) = ao(link(x, y))
#let comment(x) = ""

#title-slide()

// #outline(depth: 1)

== この課題の目標

#grid(columns: (0.6fr, 0.4fr), inset: 0.1em, [
- 「演習レベルの小さなプログラムが作れること」と, 「実用規模のプログラムが作れること」のギャップを埋める(ための知識と経験を得る)
- ささやかでも, ソフトをどう改良するかについて, アイデアを出しあう(whatとhow)
],[
#image("svg/goal.svg")
])

== ぜひマスターしてほしいスキル

- 全容がよくわからないソフトウェアの概要を把握し, 拡張・変更できるようになる
- $<-$ そのために, #ao[ソースファイル中で修正が必要な場所]を突き止める
- $<-$ そのためのツール
    - 汎用的な文字列検索(grepなど)
    - クロスリファレンスツール(globalsなど)
    - #ao[デバッガ $<-$ 個人的にはこれが最重要と考えている]
    - プロファイラ, トレーサ (uftrace)

== 代表的なプログラミング言語とビルドの流儀

- C/C++
    - configure; make; make install
    - cmake; make; make install
- Python
    - pip
- JavaScript (Node.js)
    - npm
- Rust, Go, ...

- #ao[ソースコードのダウンロード $->$ ビルド $->$ デバッガなどで追跡 $->$ 修正 $->$ 反映 の流れをマスター]

== これを身につけることの意義
- ソフトウェアの研究では, #ao[成果をソフトウェアとして発信]することが重要
- しかし大きなソフトウェアを一から作ることは, 困難な場合が多い
- $->$ 既存のソフトウェアの拡張として作ることが多い
- 一から作る場合でも, 成果を実用的なソフトウェアとして発信する際, 常識的なお作法を守っておくことは重要

#comment[
== 道中で学ぶ「基礎知識」

- 多数のファイルからなるソフトはどう書くのか (ファイルをまたがったシンボル参照の基本)
- 実用ソフトで常識的なソースの書きかたあれこれ
    - #ao[コマンドライン引数, 設定ファイル]など, プログラムを汎用的にするための書き方
    - C/C++の#ao[`#ifdef`]など, 単一ソースを何通りにもコンパイル(条件付きコンパイル)するための処理
    - その他修正がしやすいように, 大きなプログラムがよくやっている技法
]

== 課題期間全体のロードマップ (目安) 

- 1日目 : ソフトのインストール, デバッガで動作追跡手法を練習
- 2-3日目 : チームを作る, 手探るソフト, 目標議論スタート
- 3-4日目 : 試しになんでもいいから変更してみる
- 4-9日目 : 目標を決め, 実行
- 10日目 : 最終発表

== 日々行うこと

- 議論
- 作業
- #ao[その記録] (進捗記録)
    - 他の人, あるいは後の自分が#ao[一から再現できるよう]な情報を記録
    - #ao[トラブルも進捗]
        - 他の人が再現できる情報
        - なるべく小さな例で (Minimum Working Example)
- 進捗発表 (チーム結成以降, 各回終了時, 持ち回りで何班かずつ)
- 他の班の進捗発表を見て, 質問, コメント, #ao[互助]

== 本日の以降の作業

- #blink("https://doss.eidos.ic.i.u-tokyo.ac.jp/new_site/book/")[新テキスト] を眺める
- そこにある「コードのダウンロード, ビルド, デバッグの練習」をやってみる
    - C/C++ 編
    - Python 編
    - JavaScript 編

== AI利用について

- プロ (またはその卵) として生産性向上のために使うことは重要
    - プログラムを見ていて文法的に謎な式を見たときに解説させる
    - 謎なエラーに遭遇したときに原因を推測させる
    - コードを断片ではなくどっさり与えて解説させることも可能
    - コード補完AI (github copilotなど), コーディングAI (Claude Codeなど) では作業の大部分をやらせることも可能であろう
- プログラムを書く技術をどのような気持ちで学べばいいのか?

== 精神論

- AIはどんな一人の人間が持ちうる知識よりも多くの知識を持っているので, 「自分にできないがAIがすぐにやってしまうこと」がたくさんあるのは当たり前
- やがて皆さんが取り組む問題には, AIにはできないことが必ず出てくる $->$ 勉強は*その時*のため
- この演習でAIにできない (e.g., ハルシネーションの無限ループ) に遭遇するかもしれないし, しないかもしれないが, *その時*に備えて, 自分が何を学びたいのかを考え続けることが重要
- $->$ 「何かができた」ことに大した意味はなく, (AIに教えたもらった場合でも) 知見を *自分の脳に刻む* ことが重要
