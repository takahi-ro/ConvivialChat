# ConvivialChat：A Remote Conversation Tool Designed for Text-Speech Symbiosis
![ConvivialChat](public/img/ConvivialChat2.png)

このシステムは、遠隔会話ツールにおいてテキストとスピーチが共生する新たなコミュニケーションのスタイルを提案します。テキスト参加者（チャットのみを使用する参加者）とスピーチ参加者（主に音声発言を行う参加者）同士の分断のない相互補完的なコミュニケーションの実現を目指しました。


I am developing remote conversation tool where text and speech can coexist without any border. ConvivialChat would provide a way for mixing of participants to have equal and complementary discussions with each other who speak in voice as the main way of communicating and those who prefer to use only text chat.

This is my graduation project.


## 使用した技術 / Technologies used in this system
- [SkyWay](https://webrtc.ecl.ntt.com/)
- [Web Speech API](https://wicg.github.io/speech-api/)


## 概要 / Outline
![image](https://user-images.githubusercontent.com/57240543/132832314-2c7d7f54-dbf4-447b-9cca-b50fcb96c278.png)

### 遠隔会話ツールとしての基本機能
- SkyWayのSDKを用いて実装したWeb上での音声通話&チャット機能
  - 画像右側中央のマイクのトグルボタンの切り替えで音声のオンオフ
  - 画像の中央下部にあるSendボタンを押すと通常のチャット送信が可能

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

## ローカル環境で動かす手順 / Steps to run in your local environment
1.  git cloneする
```sh 
git clone https://github.com/takahi-ro/ConvivialChat_Public.git 
```
2.  cloneしたディレクトリに移動してnpm installする
```sh
cd ConvivialChat_Public
npm install 
```
3.  [./public/js/key.js](https://github.com/takahi-ro/ConvivialChat_Public/blob/main/public/js/key.js) のAPIキーを自分のものに書き換える([SkyWay](https://webrtc.ecl.ntt.com/)に登録後、新しくアプリケーションを作成するとAPIキーが取得できるのですが、その際に利用可能ドメイン名にlocalhostを追加しておくのを忘れないように）
4.  [./main.js](https://github.com/takahi-ro/ConvivialChat_Public/blob/main/main.js)のデータベースへの接続先URLを自分のものに書き換える（MongoDBをインストールしてローカルホストのデータベースを使用するか、クラウドのサービスであるMongoDB Atlasを使用（詳細は割愛））
5.  node mainによりローカルで起動
```sh 
node main 
```
6.  [localhost:3000](http://localhost:3000/)にブラウザでアクセスする（Google Chromeを推奨）
