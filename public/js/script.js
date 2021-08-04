
const Peer = window.Peer;
const startBtn = document.querySelector('#start-btn');
const stopBtn = document.querySelector('#stop-btn');
//Speech to Textの初期設定
SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;





//会話はじめるかどうか聞く。
if(window.location.href == "http://localhost:3000/home"){
  let StartConv = confirm("会話を始めますか？");
  if(!StartConv){
    window.location.href = "http://localhost:3000/";
  }else{
    //音声認識をはじめる
   
    setTimeout(()=>{

     startBtn.click();
      
    },4000);
   
    
  }
}

 

(async function main() {
  // const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  // const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const sendTrigger2 = document.getElementById('js-send-trigger2');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  const Yourname = document.getElementById('namae');
  let form = document.getElementById('form');
  let targettext;
  let loginUsers = document.getElementById('loginUsers');
  let loginChildren = loginUsers.children;
  let userAdd = [];
  let userAdd2 = [];
  let flag;
  let MyPeerId;
  let NowTime;
  let actionTime;
  let good = document.getElementById('good');
  let heee = document.getElementById('heee');
  let uun = document.getElementById('uun');
  let ooo = document.getElementById('ooo');
 
  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();
  //下までチャットをスクロールさせる
  let scrollToBottom = () => {
    messages.scrollTop = messages.scrollHeight;
  };











  let localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true
      // video: true
    })
    .catch(console.error);

  // Render local stream
  // localVideo.muted = true;
  // localVideo.srcObject = localStream;
  // localVideo.playsInline = true;
  // await localVideo.play().catch(console.error);


  //ストリームのオンオフ
  const onoffSwitch = () => {
    // let OnOff = document.getElementById("onoff");
    // let onoff = OnOff.className;
    let OnOff2 = document.getElementById("onoff2");
    let onoff2 = OnOff2.className;
    // if (onoff == "toggle-btn active") {
    //   // localStream.getVideoTracks().forEach((track) => (track.enabled = true));
    // } else {
    //   // localStream.getVideoTracks().forEach((track) => (track.enabled = false));
    // }
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
      mode: "sfu",
      stream: localStream
    });

   //自分のPeerId入れる
    MypeerId = room._peerId;
     

    room.once('open', () => {
      console.log(MypeerId);
      messages.textContent += '=== あなたが参加しました ===\n\n';
      let selfItem = document.createElement('li');
      selfItem.id = MypeerId;
      selfItem.textContent = Yourname.value;
      loginUsers.appendChild(selfItem);
      //追加したコード：名前送れるかも
      // room.send(Yourname.value)
      room.send({name:Yourname.value,type:"open"});
     //接続したときに、すでに以前からログインずみの人達を表示する
      peer.listAllPeers((peers) => {
        console.log(peers);
        let items = [];
        for(i=0;i<peers.length-1;i++){
          items[i]=document.createElement('li');
          items[i].id = peers[i];
          loginUsers.appendChild(items[i]);
        }

      });

    });

  

    room.on('peerJoin', (peerId) => {
      let item = document.createElement('li');
      item.id = peerId;
      loginUsers.appendChild(item);
      
      // messages.textContent += `=== ${peerId} joined ===\n`;
      
      let yourdata = {name:Yourname.value,type:"login",peerId:MypeerId};
      room.send(yourdata);

      //チャット下までスクロール
      let scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
      };
      scrollToBottom();
    });



    // Render remote stream for new peer join in the room この下が相手に送るデータを定めているはずだからここを直せば名前の件は解決するはず。
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // // mark peerId to find it later at peerLeave event
      // newVideo.setAttribute('data-peer-id', stream.peerId);
      // remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });





    room.on('data', ({ data, src }) => {
     
      // Show a message sent to the room and who sent
      switch(data.type){
        case 'login':
          //ログイン時に前からいるユーザーを表示
          peer.listAllPeers((peers) => {
          console.log(loginChildren.length);
          console.log(data.peerId);
          let createUsers = ()=>{
            if(loginChildren.length<peers.length){
              setTimeout(createUsers,1000);
            }
            console.log(loginChildren.length);
            for(i=0;i<loginChildren.length;i++){
              if(loginChildren[i].id == data.peerId){
                loginChildren[i].textContent = data.name;
            }
          }
        };
  
          createUsers(); 
    
          });
          break;
        case 'say':
            let msg = new SpeechSynthesisUtterance();
            let text = data.msg;
            msg.text = text;
            window.speechSynthesis.speak(msg);
            if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
              // 後方一致のときの処理
              messages.textContent += `\n\n${data.msg}\n`;
            }else{
              messages.textContent += `${data.msg}\n`;
            }
            // console.log(src);
            for (i = 0; i < loginChildren.length; i++) {
              if (loginChildren[i].textContent == data.name + "が入力中....") {
                loginChildren[i].textContent = data.name;
              }
            }
            for(i=0;i<userAdd.length;i++){
              if(userAdd[i].name == data.name){
                userAdd = userAdd.splice(i,1);
              }
            }
            scrollToBottom();
            break;
        case 'send':
          if(messages.textContent.endsWith('👍')|| messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
            // 後方一致のときの処理
            messages.textContent += `\n\n${data.msg}\n`;
          }else{
            messages.textContent += `${data.msg}\n`;
          }

          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for(i=0;i<userAdd.length;i++){
            if(userAdd[i].name == data.name){
              userAdd = userAdd.splice(i,1);
            }
          }
          // console.log(src);
          scrollToBottom();
          break;
        case 'speech':
          if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
            // 後方一致のときの処理
            messages.textContent += `\n\n${data.msg}\n`;
          }else{
            messages.textContent += `${data.msg}\n`;
          }
          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for(i=0;i<userAdd.length;i++){
            if(userAdd[i].name == data.name){
              userAdd = userAdd.splice(i,1);
            }
          }
          // console.log(src);
          scrollToBottom();
          break;
        case 'open':
          loginChildren[loginChildren.length-1].textContent = data.name;
          if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
            // 後方一致のときの処理
            messages.textContent += `\n\n=== ${data.name} が参加しました ===\n\n`;
          }else{
            messages.textContent += `=== ${data.name} が参加しました ===\n\n`;
          }
          
           scrollToBottom();
          break;
        case 'typing':
          for(i=0;i<loginChildren.length;i++){
            if(loginChildren[i].id == data.peerId && loginChildren[i].textContent == data.name){
              loginChildren[i].textContent += "が入力中....";
              console.log(loginChildren[i].id);
            }
          }
         
          if (!userAdd.map(m => m.name).includes(data.name)) {
            userAdd.push(data);
            console.log(userAdd)
          }
          for(i=0;i<userAdd.length;i++){
            if(userAdd[i].peerId == data.peerId){
             userAdd.splice(i,1,data);
            }
          }
          break;
        case 'Blur':
          for (i = 0; i < loginChildren.length; i++) {
            if (loginChildren[i].textContent == data.name + "が入力中....") {
              loginChildren[i].textContent = data.name;
            }
          }
          for(i=0;i<userAdd.length;i++){
            if(userAdd[i].name == data.name){
              userAdd = userAdd.splice(i,1);
            }
          }
          break;
        case 'good':
          messages.textContent += '👍';
          let msg2 = new SpeechSynthesisUtterance();
          let text2 = 'いいね';
          msg2.text = text2;
          msg2.volume = 2;
          msg2.rate = 3;
          msg2.pitch = 2;
          window.speechSynthesis.speak(msg2);
          scrollToBottom();
          break;
        case 'heee':
          messages.textContent += '😦';
          let msg3 = new SpeechSynthesisUtterance();
          let text3 = 'へえぇぇ';
          msg3.text = text3;
          msg3.volume = 1;
          msg3.rate = 1;
          msg3.pitch = 2;
          window.speechSynthesis.speak(msg3);
          scrollToBottom();
          break;
        case 'uun':
          messages.textContent += '🤔';
          let msg4 = new SpeechSynthesisUtterance();
          let text4 = 'うぅうーん';
          msg4.text = text4;
          msg4.volume = 1;
          msg4.rate = 1;
          msg4.pitch = 1;
          window.speechSynthesis.speak(msg4);
          scrollToBottom();
          break;

        case 'ooo':
          messages.textContent += '😮';
          let msg5 = new SpeechSynthesisUtterance();
          let text5 = 'ぉおおぉお';
          msg5.text = text5;
          msg5.volume = 1;
          msg5.rate = 1;
          msg5.pitch = 1.9;
          window.speechSynthesis.speak(msg5);
          scrollToBottom();
          break;
        
      }

     

    });

    //👍ボタンを送る
    good.addEventListener('click',(e)=>{
      e.preventDefault();
      messages.textContent += '👍';
      let GoodSendData = {type:'good',name: Yourname.value, peerId: MypeerId};
      room.send(GoodSendData);

      let msg = new SpeechSynthesisUtterance();
      let text = 'いいね';
      msg.text = text;
      msg.volume = 1;
      msg.rate = 3;
      msg.pitch = 2;
      window.speechSynthesis.speak(msg);
    

      scrollToBottom();
    
    })

    heee.addEventListener('click',(e)=>{
      e.preventDefault();
      messages.textContent += '😦';
      let GoodSendData = {type:'heee',name: Yourname.value, peerId: MypeerId};
      room.send(GoodSendData);

      let msg = new SpeechSynthesisUtterance();
      let text = 'へえぇぇ';
      msg.text = text;
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 2;
      window.speechSynthesis.speak(msg);
    

      scrollToBottom();
    
    })

    uun.addEventListener('click',(e)=>{
      e.preventDefault();
      messages.textContent += '🤔';
      let GoodSendData = {type:'uun',name: Yourname.value, peerId: MypeerId};
      room.send(GoodSendData);

      let msg = new SpeechSynthesisUtterance();
      let text = 'うぅうーん';
      msg.text = text;
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 1;
      window.speechSynthesis.speak(msg);
      scrollToBottom();
    })

    ooo.addEventListener('click',(e)=>{
      e.preventDefault();
      messages.textContent += '😮';
      let GoodSendData = {type:'ooo',name: Yourname.value, peerId: MypeerId};
      room.send(GoodSendData);

      let msg = new SpeechSynthesisUtterance();
      let text = 'ぉおおぉお';
      msg.text = text;
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 1.9;
      window.speechSynthesis.speak(msg);
    

      scrollToBottom();
    
    })

      //入力中にデータを送る
      form.addEventListener('input',function(e){
        e.preventDefault();
        actionTime = Date.now();
        let typingData = {name:Yourname.value, type:"typing", time:actionTime, peerId:MypeerId};
        room.send(typingData);
        if(loginChildren[0].textContent == Yourname.value){
          loginChildren[0].textContent += "が入力中....";
        }
       
        if (!userAdd.map(m => m.peerId).includes(MypeerId)) {
          userAdd.push(typingData);
        }
        for(i=0;i<userAdd.length;i++){
          if(userAdd[i].peerId == MypeerId){
           userAdd.splice(i,1,typingData);
          }
        }
        console.log(userAdd);

      
      })
        //時間がたてば入力中の表示を消去
        setInterval(function(){updateTime(userAdd)}, 2000);
        
       // //現在時刻更新と時間が経てば入力中消去
       function updateTime(newUserAdd) {
         NowTime = Date.now();
        //  console.log(newUserAdd);
         for (i = 0; i < newUserAdd.length; i++) {
           if ((NowTime - newUserAdd[i].time) > 10000) {

             userAdd2.push(newUserAdd[i]);
               // console.log(userAdd2);
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
           // console.log(userAdd);
           userAdd2 = [];
           flag = false;
         }
       }
         
      
      //テキストエリアの外を選択したら入力中が消えるようにする
      localText.addEventListener('blur',(e)=>{
          e.preventDefault();
          console.log('blur');
          let BlurSendData = {type:'Blur',name:Yourname.value, peerId:MypeerId};
          room.send(BlurSendData);
      if(loginChildren[0].textContent == Yourname.value +"が入力中...."){
        loginChildren[0].textContent = Yourname.value;
      }
      })
  
    

    // for closing room members
    room.on('peerLeave', peerId => {
      // const remoteVideo = remoteVideos.querySelector(
      //   `[data-peer-id="${peerId}"]`
      // );
      // remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      // remoteVideo.srcObject = null;
      // remoteVideo.remove();
      // messages.textContent += `=== ${peerId} left ===\n`;
      for (i = 0; i < loginChildren.length; i++) {
        if (loginChildren[i].id == peerId) {
          if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
            // 後方一致のときの処理
            messages.textContent += `\n\n=== ${loginChildren[i].textContent.replace('が入力中....','')} が退出しました ===\n\n`;
          }else{
            messages.textContent += `=== ${loginChildren[i].textContent.replace('が入力中....','')} が退出しました ===\n\n`;
          }
          loginUsers.removeChild(loginChildren[i]);

         
        }
      }
       //チャット下までスクロール
       let scrollToBottom = () => {
        messages.scrollTop = messages.scrollHeight;
      };
      scrollToBottom();
    });

    // for closing myself
    room.once('close', () => {
      sendTrigger.removeEventListener('click', onClickSend);
      messages.textContent += '== あなたが退出しました ===\n';
      // Array.from(remoteVideos.children).forEach(remoteVideo => {
      //   remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      //   remoteVideo.srcObject = null;
      //   remoteVideo.remove();
      // });
    });

    //退出の際の処理
    function AreYouLeave() {
      let StartConv = confirm("本当に退出しますか？");
      if (StartConv) {
        () => room.close(), { once: true }
        window.location.href = "http://localhost:3000/";
      } else {
        return;
      }
    }
    leaveTrigger.addEventListener('click', AreYouLeave);




//下で定義した関数発動
    SpeechToText();
    sendTrigger.addEventListener('click', onClickSend);
    sendTrigger2.addEventListener('click', onClickSend2);
    //以下メッセージ送信3種類の関数
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
        let senddata1 = `${Yourname.value}: ${saytext}\n`;
        let sendDataSet1 = {name:Yourname.value,msg:senddata1,type:"say"};
        room.send(sendDataSet1);
        if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
          // 後方一致のときの処理
          messages.textContent += `\n\n${senddata1}\n`;
        }else{
          messages.textContent += `${senddata1}\n`;
        }       
        localText.value = '';
      }
       //送信したら入力中消去
       if (loginChildren[0].textContent == Yourname.value + "が入力中....") {
           loginChildren[0].textContent = Yourname.value;
         }
     
         for(i=0;i<userAdd.length;i++){
           if(userAdd[i].name == Yourname.value){
             userAdd = userAdd.splice(i,1);
           }
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
        let senddata2 = `${Yourname.value}: ${localText.value.trim()}\n`;
        let sendDataSet2 = {name:Yourname.value,msg:senddata2,type:"send"};
        room.send(sendDataSet2);
        // const item = document.createElement('p');
        // item.textContent = `${senddata2}\n`;
        // messages.appendChild(item);
        if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
          // 後方一致のときの処理
          messages.textContent += `\n\n${senddata2}\n`;
        }else{
          messages.textContent += `${senddata2}\n`;
        }
        localText.value = '';

      }

          //送信したら入力中消去
          if (loginChildren[0].textContent == Yourname.value + "が入力中....") {
            loginChildren[0].textContent = Yourname.value;
          }
      
          for(i=0;i<userAdd.length;i++){
            if(userAdd[i].name == Yourname.value){
              userAdd = userAdd.splice(i,1);
            }
          }
    }
    function SpeechToText() {
      // const resultDiv = document.querySelector('#result-div');

      // let finalTranscript = ''; // 確定した(黒の)認識結果

      recognition.onresult = (event) => {
        let interimTranscript = ''; // 暫定(灰色)の認識結果
        for (let i = event.resultIndex; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // finalTranscript += transcript;
            let speechtext = `『${event.results[event.results.length - 1][0].transcript}』`;
            let senddata3 = `${Yourname.value}:${speechtext}\n`;
            let sendDataSet3 = {msg:senddata3,type:"speech"};
            room.send(sendDataSet3);
            if(messages.textContent.endsWith('👍') || messages.textContent.endsWith('😦') || messages.textContent.endsWith('😮') || messages.textContent.endsWith('🤔')){
              // 後方一致のときの処理
              messages.textContent += `\n\n${senddata3}\n`;
            }else{
              messages.textContent += `${senddata3}\n`;
            }

            //チャットを一番下までスクロールさせる
            let scrollToBottom = () => {
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
      }


      //音声入力のトグル
      let startClass = startBtn.classList;
      let stopClass = stopBtn.classList;
      let sttTimer;
      function startTimer(){
        sttTimer = setInterval(()=>{
          recognition.start();
          console.log("start!");
        },10000);
      };
      function stopTimer(){
        clearInterval(sttTimer);
        };

      startBtn.onclick = () => {
        // console.log(startClass);
        let sttStartMessages = document.getElementById('message2');
        sttStartMessages.textContent = "Speech recogniton is supported!"
        recognition.start();             
        startTimer();
       
        // startClass = "btn btn-primary";
        // stopClass = "btn btn-outline-danger";
        if(startClass.contains('btn-outline-primary')){
           startClass.remove('btn-outline-primary');
           startClass.add('btn-primary');
           stopClass.remove('btn-danger');
           stopClass.add('btn-outline-danger');
        }
        // startBtn.removeClass()
      }
      stopBtn.onclick = () => {
        recognition.stop();
        stopTimer();
        if(stopClass.contains('btn-outline-danger')){
          stopClass.remove('btn-outline-danger');
          stopClass.add('btn-danger');
          startClass.remove('btn-primary');
          startClass.add('btn-outline-primary');
       }
        // startClass = "btn btn-outline-primary";
        // stopClass = "btn btn-danger";
      }//ここまでがSpeech to text
    }

    

  });

 


  peer.on('error', console.error);

 
  
}
)();


// ここから下はオンオフボタンのトグル
$('.cb-value').click(function () {
  let mainParent = $(this).parent('.toggle-btn');
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
  let speech = new Speech();
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
  let self = this;
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


Speech.prototype.setSpeech = function () {
  let msg = new SpeechSynthesisUtterance();
  let text = this.getTextValue();
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;
  msg.text = text;
  msg.lang = 'ja-JP';
  window.speechSynthesis.speak(msg);
};
Speech.prototype.event = function () {
  let self = this;
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



// ここからはワードクラウドのコード
// let myWords =[
//   //   // {"word":"イノシシ","size":10}
//   //   // {"word":"おにやんま","size":6},
//   //   // {"word":"ゆるっと","size":8},
//   //   // {"word":"映画","size":6},
//   //   // {"word":"ヘルシンキ","size":20},
//   //   // {"word":"メタリカ","size":15},
//   //   // {"word":"お面","size":10},
//   //   // {"word":"おいしい","size":20},
//   ];
// let w = 1320,
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

//     let WordCloud = (wordcloud) => {

//       layout
//       .size([w, h])
//       .words(myWords.map( function (d) { return { text: d.word, size: sizeScale(d.size)}; }))
//       .padding(10)        //単語の距離
//       .rotate(function () { return (~~(Math.random() * 6) - 3)*30; })
//       .fontSize(function (d) { return d.size; })      // フォントサイズ
//       .on("end", draw);
//       let wordcloud = () =>{
//       layout.start();
//       console.log(myWords);
//       };
//       setInterval(wordcloud,3000);

//     // 'ayoutの出力を受け取り単語を描画
//     function draw(words) {
//           //  let socket;
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











