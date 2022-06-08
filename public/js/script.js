const Peer = window.Peer;
const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
//Speech to Textの初期設定
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;
//Text to Speech の準備
let synth = window.speechSynthesis;

const reactions = ['👍', '😦', '🤔', '😮', '🤣'];
const reactionParams = {
  '👍': { text: 'いいね', volume: 2, rate: 3, pitch: 1.5 },
  '😦': { text: 'へえぇぇ', volume: 1, rate: 1, pitch: 2 },
  '🤔': { text: 'うぅうーん', volume: 1, rate: 1, pitch: 1 },
  '😮': { text: 'ぉおおぉお', volume: 1, rate: 1, pitch: 1.9 },
  '🤣': { text: 'ゎはっはっ', volume: 1, rate: 1, pitch: 2 }
};
let reactionRepeatCount = 0;

(async function main() {
  // const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  // const remoteVideos = document.getElementById('js-remote-streams');

  //const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const sendTrigger2 = document.getElementById('js-send-trigger2');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');

  let form = document.getElementById('form');
  let loginUsers = document.getElementById('loginUsers');
  let loginChildren = loginUsers.children;
  let userAdd = [];
  let userAdd2 = [];
  let flag;
  let NowTime;

  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  //下までチャットをスクロールさせる
  function scrollToBottom(){
    messages.scrollTop = messages.scrollHeight;
  };

  function appendText(text){
    if(reactions.some(r => messages.textContent.endsWith(r))) messages.textContent += "\n\n";
    messages.textContent += text + "\n";
  }

  let localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true
      // video: true
    })
    .catch(console.error);

  // マイクのストリームのオンオフ
  setInterval(() => {
    const onOff2 = document.getElementById("onoff2");
    const enableTrack = onOff2.classList.contains("active");
    localStream.getAudioTracks().forEach((track) => track.enabled = enableTrack);
  }, 1000); 

  // eslint-disable-next-line require-atomic-updates
  const peer = (window.peer = new Peer(yourName, {
    key: window.__SKYWAY_KEY__,
    credential,
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
    const room = peer.joinRoom(roomId, {
      mode: "sfu",
      stream: localStream
    });

    //自分のPeerId入れる
    MypeerId = room._peerId;


    room.once('open', () => {
      messages.textContent += '=== あなたが参加しました ===\n\n';
      let selfItem = document.createElement('li');
      selfItem.id = MypeerId;
      selfItem.textContent = yourName;
      loginUsers.appendChild(selfItem);

      //追加したコード：名前送れるかも
      room.send({ name: yourName, type: "open" });
      //接続したときに、すでに以前からログインずみの人達を表示する
      peer.listAllPeers((peers) => {
        let items = [];
          for (i = 0; i < peers.length; i++) {
          if (peers[i] !== MypeerId){
            items[i] = document.createElement('li');
            items[i].id = peers[i];
            loginUsers.appendChild(items[i]);
          }
        }

      });

    });



    room.on('peerJoin', (peerId) => {
      const item = document.createElement('li');
      item.id = peerId;
      loginUsers.appendChild(item);

      const data = { name: yourName, type: "login" };
      room.send(data);

      scrollToBottom();
    });



    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // // mark peerId to find it later at peerLeave event
      // newVideo.setAttribute('data-peer-id', stream.peerId);
      // remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });


    //リアクションボタンを受け取るための関数
    function receiveReaction(content){
      const params = reactionParams[content];
      if(!params){
        console.error('unsupported reaction type');
        return;
      }
      reactionRepeatCount = messages.textContent.endsWith(content) ? reactionRepeatCount + 1 : 0;
      messages.textContent += content;
      if(reactionRepeatCount >= 4){
        if (synth.speaking) {
          console.error('speechSynthesis.speaking');
          return;
        }
      }
      let msg = new SpeechSynthesisUtterance(params.text);
      let Voices = synth.getVoices().filter(v => v.lang == "ja-JP");
      msg.voice = Voices[0];
      msg.volume = params.volume;
      msg.rate = params.rate;
      msg.pitch = params.pitch;
      synth.speak(msg);
      scrollToBottom();
    }

    function handleData(data, src){
      switch (data.type) {
        case 'login':
          //ログイン時に前からいるユーザーを表示
          peer.listAllPeers((peers) => {
            let createUsers = () => {
              if (loginChildren.length < peers.length) {
                setTimeout(createUsers, 1000);
              }
              for (i = 0; i < loginChildren.length; i++) {
                if (loginChildren[i].id == src) {
                  loginChildren[i].textContent = data.name;
                }
              }
            };
            createUsers();
          });
          break;
        case 'say':
          let msg = new SpeechSynthesisUtterance();
          let Voices = synth.getVoices().filter(v => v.lang == "ja-JP");
          msg.voice = Voices[0];
          let text = data.msg;
          msg.text = text;
          synth.speak(msg);

          appendText(data.msg);

          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for (i = 0; i < userAdd.length; i++) {
            if (userAdd[i].name == data.name) {
              userAdd = userAdd.splice(i, 1);
            }
          }
          scrollToBottom();
          break;
        case 'send':
          appendText(data.msg);

          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for (i = 0; i < userAdd.length; i++) {
            if (userAdd[i].name == data.name) {
              userAdd = userAdd.splice(i, 1);
            }
          }
          scrollToBottom();
          break;
        case 'speech':
          appendText(data.msg);

          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for (i = 0; i < userAdd.length; i++) {
            if (userAdd[i].name == data.name) {
              userAdd = userAdd.splice(i, 1);
            }
          }
          scrollToBottom();
          break;
        case 'open':
          loginChildren[loginChildren.length - 1].textContent = data.name;
          appendText(`=== ${data.name} が参加しました ===`);
          scrollToBottom();
          break;
        case 'typing':
          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].id == src && loginChildren[i].textContent == data.name) {
              loginChildren[i].textContent += "が入力中....";
            }
          }

          if (!userAdd.map(m => m.name).includes(data.name)) {
            userAdd.push(data);
          }
          for (i = 0; i < userAdd.length; i++) {
            if (userAdd[i].peerId == src) {
              userAdd.splice(i, 1, data);
            }
          }
          break;
        case 'Blur':
          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for (i = 0; i < userAdd.length; i++) {
            if (userAdd[i].name == data.name) {
              userAdd = userAdd.splice(i, 1);
            }
          }
          break;
        case 'reaction':
          receiveReaction(data.reactionType);
          break;
      }
    }
  
    room.on('data', ({ data, src }) => { handleData(data, src); });


    //リアクションボタンを送る
    function sendReaction(reactionType){
      const params = reactionParams[reactionType];
      if(!params){
        console.error('unsupported reaction type');
        return;
      }
            
      const data = { type: 'reaction', reactionType, name: yourName };
      room.send(data);
      handleData(data, MypeerId);
    }

    const reactionButtons = document.getElementsByClassName('reaction-button');
    for(let i = 0; i < reactionButtons.length; i++){
      const button = reactionButtons[i];
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const reactionType = e.target.dataset.type;
        sendReaction(reactionType);
      });
    }



    //入力中にデータを送る
    form.addEventListener('input', (e) => {
      e.preventDefault();
      const time = Date.now();
      const data = { name: yourName, type: "typing", time, peerId: MypeerId };
      room.send(data);
      handleData(data, MypeerId);
    })

    //時間がたてば入力中の表示を消去
    setInterval(function () { updateTime(userAdd) }, 2000);

    // //現在時刻更新と時間が経てば入力中消去
    function updateTime(newUserAdd) {
      NowTime = Date.now();
      for (i = 0; i < newUserAdd.length; i++) {
        if ((NowTime - newUserAdd[i].time) > 10000) {

          userAdd2.push(newUserAdd[i]);
        }
      }
      for (i = 0; i < userAdd2.length; i++) {
        for (j = 0; j < loginChildren.length; j++) {
          if (loginChildren[j].textContent == `${userAdd2[i].name}が入力中....` && loginChildren[j].id == userAdd2[i].peerId) {
            loginChildren[j].textContent = userAdd2[i].name;

          }
          if (i == userAdd2.length - 1 && j == loginChildren.length - 1) {
            flag = true;
          }
        }
      }
      if (flag) {
        userAdd = newUserAdd.filter(i => userAdd2.indexOf(i) == -1);
        userAdd2 = [];
        flag = false;
      }
    }


    //テキストエリアの外を選択したら入力中が消えるようにする
    localText.addEventListener('blur', (e) => {
      e.preventDefault();
      const data = { type: 'Blur', name: yourName };
      room.send(data);
      handleData(data, MypeerId);
    })



    // for closing room members
    room.on('peerLeave', peerId => {
      for (i = 0; i < loginChildren.length; i++) {
        if (loginChildren[i].id == peerId) {
          if(reactions.some(r => messages.textContent.endsWith(r))){
              // 後方一致のときの処理
            messages.textContent += `\n\n=== ${loginChildren[i].textContent.replace('が入力中....', '')} が退出しました ===\n\n`;
          } else {
            messages.textContent += `=== ${loginChildren[i].textContent.replace('が入力中....', '')} が退出しました ===\n\n`;
          }
          loginUsers.removeChild(loginChildren[i]);
        }
      }
      scrollToBottom();
    });

    // for closing myself
    room.once('close', () => {
      // sendTrigger.removeEventListener('click', onClickSend);
      // sendTrigger2.removeEventListener('click', onClickSend2);
      // good.removeEventListener('click', SendReaction);
      // heee.removeEventListener('click', SendReaction);
      // uun.removeEventListener('click', SendReaction);
      // ooo.removeEventListener('click', SendReaction);
      // hahaha.removeEventListener('click', SendReaction);

      messages.textContent += '== あなたが退出しました ===\n';
    });

    //退出の際の処理
    function AreYouLeave() {
      let StartConv = confirm("本当に退出しますか？");
      if (StartConv) {
        () => room.close(), { once: true }
        window.location.href = "https://convivialchat.herokuapp.com/";
      } else {
        return;
      }
    }
    leaveTrigger.addEventListener('click', AreYouLeave);




    //下で定義した関数発動
    SpeechToText();
    sendTrigger.addEventListener('click', () => onClickSend("say"));
    sendTrigger2.addEventListener('click', () => onClickSend("send"));

    //以下メッセージ送信3種類の関数
    function onClickSend(type) {
      if (!localText.value) return;

      const text = `「${localText.value.trim()}」`; // TODO: 単に localText.value を送信して、受信側で整えた方がよい
      const msg = `${yourName}: ${text}\n`;
      const data = { name: yourName, msg, type };
      room.send(data); //自分の端末で読み上げる機能自体は一番下にある関数群が行っていて、ここでは接続しているPeerたちにデータの送信だけしてます。わかりにくいですが。　→やめた
      handleData(data, MypeerId); // TODO?: 自分の端末では自分の名前を読まないという特別扱いした処理も作ろうと思えば作れる

      localText.value = '';
    }

    function SpeechToText() {
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const speechtext = `『${event.results[event.results.length - 1][0].transcript}』`;
            const msg = `${yourName}:${speechtext}\n`;
            const data = { msg, type: "speech" };
            room.send(data);
            handleData(data, MypeerId);
          } 
        }
      }

      startBtn.onclick = () => {
        let sttStartMessages = document.getElementById('message2');
        sttStartMessages.textContent = "Speech recogniton is supported!"
      } 
    }
  });

  peer.on('error', console.error);
})();


const onoff2cb = document.getElementById('onoff2-cb');
onoff2cb.addEventListener('click', () => {
  const parent = onoff2cb.parentElement;
  if(onoff2cb.checked){
    parent.classList.add('active');
    recognition.start();
  } else{
    parent.classList.remove('active');
    recognition.stop();
  }
});

let toggleBotton = document.getElementById('onoff2');
let toggleBottonClass = toggleBotton.classList;

recognition.onend = function () {
  if (toggleBottonClass.contains('active')) {
    console.log('recognition restarted!');
    try {
      recognition.start();
    }
    catch (error) {
      console.error('音声認識は既に開始されています', error);
    }
  }
};

//JOINボタンをクリックする
const ClickJoinButton = () => {
  const joinTrigger = document.getElementById('js-join-trigger');
  joinTrigger.click();
  console.log("You can join the room!");
};

setTimeout(ClickJoinButton, 3000)
