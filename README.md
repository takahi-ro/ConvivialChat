# ConvivialChat：A Remote Conversation Tool Designed for Text-Speech Symbiosis
![ConvivialChat](public/img/ConvivialChat2.png)

このシステムは、遠隔会話ツールにおいてテキストとスピーチが共生する新たなコミュニケーションのスタイルを提案します。

Webアプリケーションとして実装しました。

I am developing remote conversation tool where text and speech can coexist without any border.
This is my graduation project.


## 使用した技術/Technologies used in this system
- [SkyWay](https://webrtc.ecl.ntt.com/)
- [Web Speech API](https://wicg.github.io/speech-api/)


## 概要/Outline
![image](https://user-images.githubusercontent.com/57240543/132832314-2c7d7f54-dbf4-447b-9cca-b50fcb96c278.png)

### 遠隔会話ツールとしての基本機能
- SkyWayのSDKを用いて実装したWeb上での音声通話機能
  - 画像右側中央のマイクのトグルボタンの切り替えで音声のオンオフ
- Socket.ioを用いたチャット機能
  - 画像の中央下部にあるSendボタンを押すと通常ののチャット送信が可能

### テキストとスピーチの共生（Text-Speech Symbiosis）を実現するための機能
#### TTS機能（Sayボタン）
- テキストでチャット送信された文字が機械音声で読み上げられる
  - 画像の中央下部にあるSayボタンを押すと送信したテキストを読み上げ
    - チャットのログ上に「」で囲まれ表示
#### リアクションボタン読み上げ機能
- 送信されたリアクションスタンプに応じた音声が読み上げられる
  - 画像右下のリアクションボタンも押すと付された文字が読み上げられる　　 
    - 絵文字は横に並んで表示される。   
#### STT機能
- 音声による発言がテキストとしてチャットのログに表示される
  - マイクをオンにして発言した内容が音声認識され、チャットのログに表示される
    - チャットのログ上に『』で囲まれ表示

## ローカル環境で動かす手順
-  git cloneする
```sh git clone https://github.com/takahi-ro/ConvivialChat_Public.git
-  ./public/js/key.js のAPIKeyをSkyWayに登録して取得した自分のものに書き換える
-  npm installする
-  node mainによりローカルで起動
-  localhost:3000にブラウザでアクセスする（Google Chromeを推奨）
