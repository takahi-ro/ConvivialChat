# ConvivialChat:遠隔会話ツールにおけるテキストとスピーチの共生

このシステムは、遠隔会話ツールにおいてテキストとスピーチが共生する新たなコミュニケーションのスタイルを提案します。
Webアプリケーションとして実装しました。

I am developing teleconversation tool where text and speech can coexist without any border.
This is my graduation project.

## 使用した技術/Technologies used in this system
- [SKyWay](https://webrtc.ecl.ntt.com/)
- [Web SPeech API](https://wicg.github.io/speech-api/)


## 概要/Outline
![image](https://user-images.githubusercontent.com/57240543/132833383-58544033-4891-42b5-8bc7-f3fb047c7b05.png)
![image](https://user-images.githubusercontent.com/57240543/132832314-2c7d7f54-dbf4-447b-9cca-b50fcb96c278.png)

### 遠隔会話ツールとしての基本機能
- SkyWayのSDKを用いて実装したWeb上での音声通話機能
  - 画像右側中央のマイクのトグルボタンの切り替えで音声のオンオフ
- Socket.ioを用いたチャット機能
  - 画像の中央下部にあるSendボタンを押すと通常ののチャット送信が可能

### テキストとスピーチの共生を実現するための機能
#### Text to Speechの機能
- テキストでチャット送信された文字が機会音声で読み上げられる
  - 画像の中央下部にあるSayボタンを押すと送信したテキストを読み上げ
    - チャットのログ上に「」で囲まれ表示
  - 画像右下のリアクションボタンも押すと添え字が読み上げられる
  

#### Speech to Textの機能
- 音声による発言がテキストとしてチャットのログに表示される
  - マイクをオンにして発言した内容が機会により認識され、チャットのログに表示される
    - チャットのログ上に『』で囲まれ表示


