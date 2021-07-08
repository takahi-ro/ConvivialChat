
const Peer = window.Peer;

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const sendTrigger2 = document.getElementById('js-send-trigger2');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  const Yourname = document.getElementById('dami');
  var form = document.getElementById('form');
  var targettext;

  var msg = new SpeechSynthesisUtterance();
  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();



  const getRoomModeByHash = () => (location.hash = 'sfu');

  roomMode.textContent = getRoomModeByHash();
  window.addEventListener(
    'hashchange',
    () => (roomMode.textContent = getRoomModeByHash())
  );



  var localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true
    })
    .catch(console.error);

  console.log(localStream);

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);
  //ストリームのオンオフ
  const onoffSwitch = () => {
    var OnOff = document.getElementById("onoff");
    var onoff = OnOff.className;
    var OnOff2 = document.getElementById("onoff2");
    var onoff2 = OnOff2.className;
    if (onoff == "toggle-btn active") {
      localStream.getVideoTracks().forEach((track) => (track.enabled = true));
    } else {
      localStream.getVideoTracks().forEach((track) => (track.enabled = false));
    }
    if (onoff2 == "toggle-btn active") {
      localStream.getAudioTracks().forEach((track) => (track.enabled = true));
    } else {
      localStream.getAudioTracks().forEach((track) => (track.enabled = false));
    }
    // console.log(onoff);
    // console.log(onoff2);
  }
  setInterval(onoffSwitch, 1000);


  // eslint-disable-next-line require-atomic-updates
  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));

  // Register join handler
  joinTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    //この下で相手に渡すデータを決めている
    const room = peer.joinRoom(roomId.value, {
      mode: getRoomModeByHash(),
      stream: localStream,
    }, {
      metadata: {
        name: Yourname.value
      }
    });

    console.log(room);

    room.once('open', () => {
      messages.textContent += '=== You joined ===\n';
      console.log(getRoomModeByHash);
      console.log(room);

    });



    room.on('peerJoin', (peerId) => {

      messages.textContent += `=== ${peerId} joined ===\n`;
      // console.log(metadata);
    });



    // Render remote stream for new peer join in the room この下が相手に送るデータを定めているはずだからここを直せば名前の件は解決するはず。
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
      console.log(stream);
    });





    room.on('data', ({ data, src }) => {
      // Show a message sent to the room and who sent
      if (data.match(/「/)) {
        var msg = new SpeechSynthesisUtterance();
        var text = data;
        msg.volume = 1; //ボリューム
        msg.rate = 1;  //レート
        msg.pitch = 1; //ピッチ
        msg.text = text;
        msg.lang = 'ja-JP'; //言語
        window.speechSynthesis.speak(msg);
      }
      messages.textContent += `${data}\n`;
      console.log(src);

      //下までチャットをスクロールさせる
      var scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
      };
      scrollToBottom();

    });

    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

      messages.textContent += `=== ${peerId} left ===\n`;
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== You left ===\n';
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });




    SpeechToText();
    sendTrigger.addEventListener('click', onClickSend);
    sendTrigger2.addEventListener('click', onClickSend2);
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });

    function onClickSend() {
      // Send message to all of the peers in the room via websocket
      if (localText.value == '') {
        console.log("text value is null");
      } else {
        //ワードクラウド（以下4行）
        // targettext = myWords.push({
        //   word: localText.value,size: Math.floor((Math.random()+0.1)*30)  
        //   });
        //   WordCloud();
        let saytext = `「${localText.value.trim()}」`;
        let senddata1 = `${Yourname.value}: ${saytext}`;
        room.send(senddata1);
        messages.textContent += `${senddata1}\n\n`;
        localText.value = '';

      }
    }
    function onClickSend2() {
      // Send message to all of the peers in the room via websocket
      if (localText.value == '') {
        console.log("text value is null");
      } else {
        //ワードクラウド（以下4行）
        // targettext = myWords.push({
        //   word: localText.value,size: Math.floor((Math.random()+0.1)*30)  
        //   });
        //   WordCloud();
        let senddata2 = `${Yourname.value}: ${localText.value.trim()}`;
        room.send(senddata2);
        messages.textContent += `${senddata2}\n\n`;
        localText.value = '';

      }
    }
    function SpeechToText() {
      const startBtn = document.querySelector('#start-btn');
      const stopBtn = document.querySelector('#stop-btn');
      // const resultDiv = document.querySelector('#result-div');
      SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
      let recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.continuous = true;

      let finalTranscript = ''; // 確定した(黒の)認識結果

      recognition.onresult = (event) => {
        let interimTranscript = ''; // 暫定(灰色)の認識結果
        for (let i = event.resultIndex; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            let speechtext = `『${event.results[event.results.length - 1][0].transcript}』`;
            let senddata3 = `${Yourname.value}:${speechtext}`;
            room.send(senddata3);
            messages.textContent += `${senddata3}\n\n`;
            // let finalspeech = `(音声）${event.results[event.results.length-1][0].transcript}`;
            // room.send(finalspeech);
            // messages.textContent += `${Yourname.value}: ${finalspeech}\n`;

            //チャットを一番下までスクロールさせる
            var scrollToBottom = () => {
              messages.scrollTop = messages.scrollHeight;
            };
            scrollToBottom();

            //ワードクラウド
            // targettext = myWords.push({
            // word: event.results[event.results.length-1][0].transcript,size: Math.floor((Math.random()+0.1)*30)  
            // });
            // WordCloud();


          } else {
            interimTranscript = transcript;
          }
        }
        // resultDiv.innerHTML = finalTranscript + '<i style="color:#ddd;">' + interimTranscript + '</i>';
        // console.log(event);
      }



      startBtn.onclick = () => {
        recognition.start();
      }
      stopBtn.onclick = () => {
        recognition.stop();
      }//ここまでがSpeech to text
    }



  });

  peer.on('error', console.error);


}
)();


// ここから下はオンオフボタンのコード
$('.cb-value').click(function () {
  var mainParent = $(this).parent('.toggle-btn');
  if ($(mainParent).find('input.cb-value').is(':checked')) {
    $(mainParent).addClass('active');

  } else {
    $(mainParent).removeClass('active');

  }
})



//JOINボタンをクリックする
const ClickJoinButton = () => {
  const joinTrigger = document.getElementById('js-join-trigger');
  joinTrigger.click();
  console.log("You can join the room!");
};

setTimeout(ClickJoinButton, 3000)


//以下はテキストtoスピーチ
window.addEventListener('DOMContentLoaded', function () {
  var speech = new Speech();
  speech.init();
}, null);

function Speech() {
  this.textValue = null;
  this.langValue = null;
  this.volumeValue = null;
  this.rateValue = null;
  this.pitchValue = null;
  this.message = document.getElementById('message');
  this.text = document.getElementById("js-local-text");
  this.btn = document.getElementById("js-send-trigger");
  this.support = 'Speech Synthesis is supported!';
  this.unsupported = 'Speech Synthesis is unsupported!';
}

Speech.prototype.init = function () {
  var self = this;
  if ('speechSynthesis' in window) {
    self.message.textContent = self.support;
  } else {
    self.message.textContent = self.unsupported
    self.text.setAttribute('disabled', 'disabled');
    self.btn.setAttribute('disabled', 'disabled');
  }
  self.event();
};
Speech.prototype.getTextValue = function () {
  return this.textValue = this.text.value;
};
//   Speech.prototype.getLangValue = function(){
//     return this.langValue = document.querySelector('input[type=radio]:checked').value;
//   };
//   Speech.prototype.getVolumeValue = function(){
//     return this.volumeValue = document.getElementById('volume').value;
//   };
//   Speech.prototype.getRateValue = function(){
//     return this.rateValue = document.getElementById('rate').value;
//   };
//   Speech.prototype.getPitchValue = function(){
//     return this.pitchValue = document.getElementById('pitch').value;
//   };
Speech.prototype.setSpeech = function () {
  var msg = new SpeechSynthesisUtterance();
  var text = this.getTextValue();
  // var lang = this.getLangValue();
  // var volume = this.getVolumeValue();
  // var rate = this.getRateValue();
  // var pitch = this.getPitchValue();
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 0.6;
  msg.text = text;
  msg.lang = 'ja-JP';
  window.speechSynthesis.speak(msg);
};
Speech.prototype.event = function () {
  var self = this;
  self.btn.addEventListener('click', function () { self.setSpeech(); }, null);
};




//Yahoo テキスト解析
// const  textYahooAPI =() => {


//     const ns = XmlService.getNamespace("urn:yahoo:jp:jlp");
//     const result = parseText("君は君らしく生きていく自由があるんだ");

//     const doc = XmlService.parse(result.getContentText());
//     const root = doc.getRootElement();
//     const words = root.getChild("ma_result", ns).getChild("word_list", ns).getChildren("word", ns);
//     const surfaces = words.map(w => w.getChildText("surface", ns));
//     const pos = words.map(w => w.getChildText("pos", ns));

//     sheet.appendRow(surfaces);
//     sheet.appendRow(pos);
//   }

// function parseText(text){
//   const yahooUrl = "https://jlp.yahooapis.jp/MAService/V1/parse";
//   const appid = "dj00aiZpPWlXVW9WcWs3S1FyZyZzPWNvbnN1bWVyc2VjcmV0Jng9ZGM-";
//   const url = yahooUrl + "?appid=" + appid;

//   const payload = {
//     "sentence": text,
//     "results": "ma,uniq"
//   };

//   const params = {
//     "method": "post",
//     "muteHttpExceptions": true,
//     "payload": payload
//   };



// ここからはワードクラウド
// var myWords =[
//   //   // {"word":"イノシシ","size":10}
//   //   // {"word":"おにやんま","size":6},
//   //   // {"word":"ゆるっと","size":8},
//   //   // {"word":"映画","size":6},
//   //   // {"word":"ヘルシンキ","size":20},
//   //   // {"word":"メタリカ","size":15},
//   //   // {"word":"お面","size":10},
//   //   // {"word":"おいしい","size":20},
//   ];
// var w = 1320,
//     h = 1078,
//     sizeScale = d3.scaleLinear().domain([0, myWords.length]).range([10, 100]),
//     layout = d3.layout.cloud(),
//   // svgオブジェクトの追加
//     svg = d3.select("#cloud").append("svg")
//       .attr("class", "ui fluid image") 
//       .attr("viewBox", "0 0 " + w + " " + h ) 
//         .attr("width", "100%" )
//         .attr("height","100%")
//         .append("g");




//   // インスタンスの作成

//     var WordCloud = (wordcloud) => {

//       layout
//       .size([w, h])
//       .words(myWords.map( function (d) { return { text: d.word, size: sizeScale(d.size)}; }))
//       .padding(10)        //単語の距離
//       .rotate(function () { return (~~(Math.random() * 6) - 3)*30; })
//       .fontSize(function (d) { return d.size; })      // フォントサイズ
//       .on("end", draw);
//       var wordcloud = () =>{
//       layout.start();
//       console.log(myWords);
//       };
//       setInterval(wordcloud,3000);

//     // 'ayoutの出力を受け取り単語を描画
//     function draw(words) {
//           //  var socket;
//           //  socket = io.connect("http://localhost:3000");
//            svg
//           // style using semantic ui
//           .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

//           .selectAll("text")
//           .data(words)
//           .enter().append("text")
//           .style("font-size", function (d) { return d.size+ "px"; })
//           .style("font-family", "Impact")
//           .attr("fill", function(d, i) { return d3.schemeCategory10[i % 10]; } )
//           .attr("text-anchor", "middle")
//           .attr("transform",function(d) {
//                       return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
//           })
//           //  .attr("transform",function(d) {
//           //             return "translate(" + [d.x, d.y] + ")";
//           // })
//           .text(function (d) { return d.text; });

//     }
//     };











