// -------------- title, author, etc. --------------

#let title = [大規模ソフトウェアを手探る \ レポートについて]
#let author = [田浦 健次朗]
#let date = [2026/10/27]
#let footer = text(size: 0.5em)[]

// -------------- slide or report --------------
#let slide-mode = true // switch between slide and report

// -------------- color: change this on a whim --------------

#let accent-color = blue.darken(30%)
//#let accent-color = red.darken(30%)

// -------------- load slide library and select theme --------------
#import "@preview/touying:0.6.1": *
#import themes.metropolis: *
#let theme = metropolis-theme
//#import themes.university: *
//#let theme = university-theme
//#import themes.aqua: *
//#let theme = aqua-theme
//#import themes.dewdrop: *
//#let theme = dewdrop-theme
//#import themes.stargazer: *
//#let theme = stargazer-theme

//#import themes.default: *
//#let theme = default-theme
//#import themes.simple: *
//#let theme = simple-theme

// -------------- common commands --------------
#let ifslide(x)  = if slide-mode { x } else { [] }
#let ifreport(x) = if slide-mode { [] } else { x }
#let ao(x) = text(blue)[#x]
#let aka(x) = text(red)[#x]
#let blink(x, y) = ao(link(x, y))
#let indent(b) = grid(columns: (2em, auto), [], b)
#let comment(x) = []

/* #images("svg/foo", (2,4,7), start: 3)
-> include image sequence svg/foo_L2.svg, svg/foo_L4.svg,
   and svg/foo_L7.svg at 3, 4, 5 */
#let images(prefix, rng, start: 1, ..kwargs) = for (i, j) in rng.enumerate() [
  #only(i+start, image(prefix + "_L" + str(j) + ".svg", ..kwargs))
]

// -------------- config slides --------------
#show: if slide-mode {
  theme.with(
    aspect-ratio: "16-9",
    footer: self => footer,
    config-info(title: title, author: author, date: date),
    config-colors(
      primary: accent-color,
      secondary: accent-color,
      neutral-lightest: white,
    ),
  )
} else { doc => {
  set page(paper: "a4", numbering: "1 / 1")
  set heading(numbering: "1.")
  doc
} }


// -------------- font settings after loading above --------------

//#set text(font: ("Liberation Serif", "TakaoMincho"))
#set text(font: ("Liberation Serif", "Noto Serif CJK JP"))
// #set text(size: 12pt)
#let small(x) = text(size: 0.75em)[#x]
#let large(x) = text(size: 1.33em)[#x]

// -------------- title (title slide) --------------

#ifslide[ #title-slide() ]

#ifreport[
#align(center, large[
    #title

    #author

    #date
])
]

// -------------- real contents begin --------------

// #outline(depth: 1)

== この課題の提出物

- いじったコード $->$ github
- 最終回発表資料 $->$ github
- #aka[レポート] $->$ githubからリンク
- UTOLに (レポート出しましたとだけ言う形式的な) 提出


== 最終回発表

- スライドでプレゼン
- 改めて何をしたかを始めから説明
- 動いているもののデモ
- アプローチ
  - 関係箇所の特定、
  - いじった後の顛末など色々...
- #ao[演習の感想、得たもの]
- 喋り時間 : 11分 (10分のつもりがよい)
- 質問時間 : 4分 *(他の班の発表に質問して下さい!!)*
- _*あるある*_ 何を話せば決まってないほどその場で思いついたことで時間が伸びがち

== レポートについて

- #strike[田浦とTAにしか読まれないPDFファイル] $->$ *世の中に公開されるブログ記事*
- *世の中の*読者に役に立つものを残そうという気持ちで
- 世の中にあふれる「○○をやってみた」という系のブログの大部分は「インストールしてみた」「使ってみた」の類で，この課題の方が深いが，それでも同じソフトをインストールしてハマった人とかには有用な情報 #small[(それもAIで要らなくなっていくのだろうか...)]
- あまり方に力を入れず
- ♡がつくように頑張って下さい

== 役に立つ記事の書き方

- 要点・目的をはっきりと
  - LLVMを◯◯してみた
  - Firefoxを...
  - OpenCodeを...
  - lamma2.cを...
  - ...
- 他の人が真似できるだけの情報を，「ありのまま」書く
  - download先，バージョン，ビルド方法
- (長くなり過ぎない限り)「コマンドやログをそのまま」載せるのがよい
- ググって得た情報などは，その情報源へのリンクをつける (出典明記)

== 役に立つ記事の書き方

- 日本中の「通りすがりの人」を読者だと思って書く
    - 何度も聞いてる人にしか通じない話をしない
- 結果的にこういじればできた, おしまい, ではなく, #ao[どうやってその情報へ至ったか], の過程も書く
- 課題の過程で得た色々なノウハウを, できるなら (そのソフト固有の断片知識ではなく) 一般的に有用なノウハウ, スキルとして書く
- 課題を始める前の自分へ, なに (注: 答よりもやり方) を教えたらいいかを想像しながら書くといい

== より形式的なこと

- どこに書くか? $=>$ お気に入りがある人は自由
- 公開に足る内容がないんですが... $=>$ github の wiki機能でもよいことにする
- だが，課題で当初やろうとしたことに限らず，自分が今回経験したことで，「同じ問題に遭遇した人に役立つ内容」は何らか切り出せるのではないかと思う．その内容を公開すればよい．
- サンプルブログ，前のタームのレポートも参考に
