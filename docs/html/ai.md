<link rel="stylesheet" href="../scripts/style.css">

# 大規模ソフトウェアを手探る</br> AI coding の使い方 {.unnumbered}

# Open WebUI

- [こちら](https://taulec.zapto.org:3000/) に東大の Google アカウント (@g.ecc) でログインして下さい

# OpenCode

- OpenCode はオープンソースの Coding Agent ツール (骨組み, ハーネス)
- 知っている人は Claude Code, Codex CLI もどきと思ってくれればいいと思いますが, 授業ではこちらを使ってみます

## インストール

- <font color=red>注意:</font> 最近(?) version 2 になったらしく普通に見つかるのは version 2 の方だが, こちらで提供する設定ファイル等を version 1 でしか確認していないので, おとなしくversion 1 にするか, version 2 でダメだったらそこで引き下がって version 1 にするか頑張って version 2 用の設定を作って共有して下さい
- 自分のPCへのインストール
  - version 1 (無難): `npm install -g opencode-ai`
  - version 2 (参考): `npm install -g @opencode/cli`
  - 詳しくは https://opencode.ai/docs/ja
  - npm のインストールの仕方はちょうど[こちら](https://doss.eidos.ic.i.u-tokyo.ac.jp/new_site/book/js_nvm_npm.html)

## 起動

初めての人は一旦設定ファイル無しで起動して終了してから設定ファイルをコピーするとよいでしょう

- 端末から
```
$ opencode
```
(`$` はシェルプロンプトのつもりで, 入力の一部ではありません)
- 終了
```
> /exit
```
(`>` はコーディングエージェント, つまりOpenCode に向かっての入力というつもりですが実際はこんなものは出てきません)
- 起動して終了すると以下の二つのフォルダが勝手にできているはず (Windows は WSL を使えば同様のはず. そうじゃない場合は誰か教えて)

これをやると

- `~/.config/opencode/`
- `~/.local/share/opencode/`

という二つのフォルダが勝手にできていることと思います

## 設定ファイル

- opencode.jsonc を[こちら](https://drive.google.com/drive/folders/1Jww4rPH9tC0HQ0eiAW6uZ-CudQ_XiLkq?usp=sharing)からダウンロードして, `~/.config/opencode/opencode.jsonc` としてコピー (元々あったら一応中身を確認. 初めて使ったのならほぼ空のはず. 問題なさげなことを確認して上書き)
- auth.json.template を同じ場所からダウンロードして, `~/.local/share/opencode/auth.json` にコピー (OpenCode が初めてだったらこのファイルは存在していないはずだがあったら中身を確認. マージする場合は "litellm" { ... } の部分を書き足す(多分)). エディタで開いて鍵 (`sk-...` の部分に, UTOLで配布) を書き込む

## 会話の続き

```
$ opencode --continue
```
省略形:
```
$ opencode -c 
```

これは最後のセッションを勝手に起動するもののよう. もう少し柔軟に選ぶ方法があると思うが調べて共有して下さい.

## モデルの選択

- `opencode.jsonc` に列挙されたモデルが使えるようになっています
- 最後の行がデフォルトのモデルです
- `/models` というコマンドで, OpenCodeの中から切り替え可能です
```
> /models
```
こちらで提供しているのと違うモデルも表示されるので
- (mdx MaaS)
- (LLM-jp)
- (UTokyo Azure)
のどれかの印が入った物を選んで下さい

- UTokyo Azure には新し目の強力なモデル (GPT-6など) があります
- 試すのは全然OKですが, どれがお高めか (Astra > Sol > Luna) も知らずにとにかく一番いいモデル, とかいう使い方はNG 
- UTokyo Azure 大量に使うと料金が発生する可能性があるので, 様子を見て利用が激しければ制限したくなるかも知れません
- [LLM-jp](https://llm-jp.nii.ac.jp/) は日本の研究者が作っているモデルで, 発展途上で粗が見つかるかも知れませんがLLMに興味があるならば将来参加することも含めて積極的に使ってみて下さい
- 実用的には日常の質問用途での利用は gpt-oss-20b-mdx-maas (レスポンス速め), LLM-jp を試しつつ, 必要な時には gpt-5.3-codex-utokyo-azure, それでも足りないと思った時に GPT-6 に手を出す, くらいの感じでしょうか (主観)



