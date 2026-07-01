
let selectedSuffix="くん",questionNow=1,scoreNow=0,targetNumber=1,locked=false,hatched=false;
function el(id){return document.getElementById(id)}
function showScreen(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));el(id).classList.add("active")}
function vibrate(p){if(navigator.vibrate)navigator.vibrate(p)}
function speak(text){if(!("speechSynthesis"in window))return;window.speechSynthesis.cancel();const v=new SpeechSynthesisUtterance(text);v.lang="ja-JP";v.rate=.84;v.pitch=1.05;window.speechSynthesis.speak(v)}
function tone(freq,time=.16,vol=.1,delay=0){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type="sine";o.frequency.value=freq;const s=c.currentTime+delay;g.gain.setValueAtTime(vol,s);g.gain.exponentialRampToValueAtTime(.001,s+time);o.start(s);o.stop(s+time)}
function sound(kind){if(kind==="tap"){tone(520,.06,.06);return}if(kind==="ok"){tone(660,.13,.09);tone(880,.18,.10,.11);vibrate(35);return}if(kind==="bad"){tone(260,.18,.09);tone(190,.22,.08,.16);vibrate([45,40,45]);return}if(kind==="clear"){tone(523,.12,.08);tone(659,.12,.08,.12);tone(784,.22,.09,.24);vibrate([30,40,60]);return}if(kind==="eat"){tone(250,.06,.07);tone(210,.07,.06,.11);tone(330,.08,.07,.24);tone(520,.12,.07,.43);return}}
function playCrackSoundLong(){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const ctx=new A();function burst(delay,dur,vol,filterFreq){const start=ctx.currentTime+delay,bufferSize=Math.floor(ctx.sampleRate*dur),buffer=ctx.createBuffer(1,bufferSize,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<bufferSize;i++)data[i]=(Math.random()*2-1)*(1-i/bufferSize);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type="highpass";filter.frequency.value=filterFreq;gain.gain.setValueAtTime(vol,start);gain.gain.exponentialRampToValueAtTime(.001,start+dur);src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);src.start(start)}burst(0,.08,.18,1200);burst(.55,.07,.16,1400);burst(1.1,.09,.20,1000);burst(1.55,.07,.16,1600);burst(2,.12,.24,850);burst(2.35,.18,.32,650);vibrate([50,180,50,180,80,180,160]);setTimeout(()=>sound("clear"),2600)}
function getPlayerName(){return localStorage.getItem("pikoPlayerName")||""}function getPlayerSuffix(){return localStorage.getItem("pikoPlayerSuffix")||"くん"}function getPlayerCall(){return(getPlayerName()||"しゅり")+getPlayerSuffix()}function getHearts(){return Number(localStorage.getItem("pikoHearts")||0)}function setHearts(n){localStorage.setItem("pikoHearts",String(Math.min(5,n)))}function renderHearts(){const n=getHearts();return"❤️".repeat(n)+"🤍".repeat(5-n)}
function getBaseLevel(){return Number(localStorage.getItem("pikoBaseLevel")||1)}function setBaseLevel(n){localStorage.setItem("pikoBaseLevel",String(Math.min(5,n)))}
function speakIntro(){sound("tap");el("titleDoctorText").textContent="やあ！ぼくは うろこ！きみを待っていたよ。";speak("やあ！ぼくは、うろこ。きみを待っていたよ。今日はどんな恐竜に会えるかな？")}
function goNext(){sound("tap");getPlayerName()?openHome():(showScreen("nameScreen"),speak("ぼくは、うろこ。きみの名前を教えてね。"))}
function selectSuffix(s){selectedSuffix=s;el("kunBtn").classList.toggle("selected",s==="くん");el("chanBtn").classList.toggle("selected",s==="ちゃん");el("sanBtn").classList.toggle("selected",s==="さん");sound("tap")}
function savePlayerName(){const name=(el("nameInput").value.trim()||"しゅり");localStorage.setItem("pikoPlayerName",name);localStorage.setItem("pikoPlayerSuffix",selectedSuffix);openHome();speak("よろしくね。"+name+selectedSuffix+"。一緒に恐竜を守りに行こう。")}
function openHome(){const p=getPlayerCall();el("homeDoctorText").textContent="おかえり、"+p+"！今日もたんけんに行こう。";showScreen("homeScreen")}
function speakWelcome(){sound("tap");el("homeDoctorText").textContent="隊長、いい発見をしに行こう！";speak("隊長、いい発見をしに行こう。うろこはいつでも応援しているぞ。")}
function resetName(){localStorage.removeItem("pikoPlayerName");localStorage.removeItem("pikoPlayerSuffix");el("nameInput").value="しゅり";selectSuffix("くん");showScreen("nameScreen");speak("もういちど、おなまえを教えてね。")}
function openBase(){sound("tap");el("baseLevel").textContent=getBaseLevel();showScreen("baseScreen");speak("隊長。ここが恐竜基地だ。少しずつ育てていこう。")}
function baseAction(type){sound("tap");if(type==="tree"){el("baseText").textContent="木があると、基地がすずしくなるぞ！";speak("木があると、基地が涼しくなるぞ。")}if(type==="food"){el("baseText").textContent="ごはんの準備は大事だ！";speak("ごはんの準備は大事だ。")}if(type==="sleep"){el("baseText").textContent="休むことも、りっぱな作戦だ。";speak("休むことも、りっぱな作戦だ。")}}
function levelUpBase(){sound("clear");setBaseLevel(getBaseLevel()+1);openBase();el("baseText").textContent="やった！基地が少し大きくなったぞ！";speak("やった。基地が少し大きくなったぞ。いい発見だ、隊長。")}
function openMission(){sound("tap");const p=getPlayerCall();el("missionText").textContent=p+"、数字を5こ見つけよう！";showScreen("missionScreen");speak(p+"。数字を5こ見つけよう。クリアすると、たまごが光るぞ。")}function speakMission(){sound("tap");speak(getPlayerCall()+"。数字を5こ見つけよう。クリアすると、たまごが光るぞ。")}
function startNumberGame(){sound("tap");questionNow=1;scoreNow=0;locked=false;showScreen("gameScreen");makeQuestion()}function makeQuestion(){locked=false;targetNumber=Math.floor(Math.random()*5)+1;el("questionNow").textContent=questionNow;el("scoreNow").textContent=scoreNow;el("targetNumber").textContent=targetNumber;const grid=el("numberGrid");grid.innerHTML="";shuffle([1,2,3,4,5]).forEach(num=>{const b=document.createElement("button");b.className="number-btn color-"+num;b.textContent=num;b.onclick=()=>chooseNumber(num,b);grid.appendChild(b)});setTimeout(()=>repeatQuestion(false),300)}
function repeatQuestion(manual=false){const namePart=(questionNow===1||manual)?getPlayerCall()+"。":"";speak(namePart+({1:"いち",2:"に",3:"さん",4:"よん",5:"ご"}[targetNumber])+"をえらんでね。")}
function chooseNumber(num,b){if(locked)return;sound("tap");if(num===targetNumber){locked=true;scoreNow++;b.classList.add("correct");showFeedback("〇","ピンポーン！",true);sound("ok");speak("ピンポーン。いい発見だ。");setTimeout(()=>{hideFeedback();questionNow>=5?finishGame():(questionNow++,makeQuestion())},1050)}else{locked=true;b.classList.add("wrong");showFeedback("×","ポヨン…おしい！",false);sound("bad");speak("おしい。もう一回やってみよう。");setTimeout(()=>{b.classList.remove("wrong");hideFeedback();locked=false;repeatQuestion(false)},1200)}}
function finishGame(){el("clearText").textContent="すごい！"+getPlayerCall()+"、たまごが光ったぞ！";showScreen("clearScreen");sound("clear");speak("すごい。"+getPlayerCall()+"。数字を5こ見つけたね。たまごが光ったぞ。")}
function speakClear(){sound("tap");speak("隊長、よく最後までがんばったね。うろこはうれしいぞ。")}
function openHatch(){sound("tap");hatched=false;el("hatchTitle").innerHTML="たまごを<br>タッチしてね";el("hatchText").textContent="なにが生まれるかな？";el("crackText").classList.add("hidden");el("crackText").textContent="ピキ…";el("hatchEgg").className="hatch-egg";el("hatchEgg").textContent="🥚";document.querySelector(".hatch-area").classList.remove("cracking");el("babyDino").classList.add("hidden");el("afterHatchBtn").classList.add("hidden");showScreen("hatchScreen");speak(getPlayerCall()+"。たまごをタッチしてね。")}
function hatchEgg(){if(hatched)return;hatched=true;el("hatchTitle").innerHTML="うまれるよ！";el("hatchText").textContent="ピキ…ピキピキ…！";el("crackText").classList.remove("hidden");speak("おっ。たまごが、われそうだぞ。");playCrackSoundLong();document.querySelector(".hatch-area").classList.add("cracking");el("hatchEgg").classList.add("crack");setTimeout(()=>el("crackText").textContent="ピキ…",150);setTimeout(()=>el("crackText").textContent="ピキッ…",700);setTimeout(()=>el("crackText").textContent="ピキピキ…",1300);setTimeout(()=>el("crackText").textContent="ピキピキピキ…！",1900);setTimeout(()=>el("crackText").textContent="パカーン！",2550);setTimeout(()=>{el("babyDino").classList.remove("hidden");el("hatchText").textContent="赤ちゃん恐竜が 生まれたよ！";el("afterHatchBtn").classList.remove("hidden");speak("やったー。赤ちゃん恐竜が生まれたよ。")},3100)}
function openFeed(){sound("tap");el("feedDino").className="feed-dino-img hungry";el("heartMeter").textContent=renderHearts();el("feedText").innerHTML="ちびティラノは<br>おなかがすいているみたい！";el("feedDoctorText").textContent="なにをあげてみる？";el("finishFeedBtn").classList.add("hidden");document.querySelectorAll(".food-btn").forEach(btn=>btn.classList.remove("correct-food","wrong-food"));showScreen("feedScreen");speak("ちびティラノは、おなかがすいているみたい。ごはんをあげよう。")}function quickFeed(){openFeed()}
function flyMeat(){const layer=el("meatFlyLayer");const img=document.createElement("img");img.src="images/meat.png";img.className="flying-meat";img.style.left="58%";img.style.top="58%";layer.appendChild(img);setTimeout(()=>img.remove(),900)}
function feedDinoFood(food,btn){sound("tap");if(food==="meat"){btn.classList.add("correct-food");el("feedDino").classList.add("dino-eat");flyMeat();setHearts(getHearts()+1);el("heartMeter").textContent=renderHearts();el("feedText").innerHTML="ガブガブ！<br><span class='bone-left'>🦴</span>";el("feedDoctorText").textContent="いいぞ！お肉をガブッと食べたぞ！";sound("eat");speak("ガブガブ。いいぞ。お肉をガブッと食べたぞ。うろこのお弁当まで食べないでくれー。");setTimeout(()=>el("finishFeedBtn").classList.remove("hidden"),900)}else if(food==="fish"){btn.classList.add("correct-food");setHearts(getHearts()+1);el("heartMeter").textContent=renderHearts();el("feedText").innerHTML="ぱくっ！<br>さかなも食べたよ！";el("feedDoctorText").textContent="いい発見だ！魚も少し好きみたい。";sound("eat");speak("いい発見だ。魚も少し好きみたいだね。");setTimeout(()=>btn.classList.remove("correct-food"),900);setTimeout(()=>el("finishFeedBtn").classList.remove("hidden"),900)}else{btn.classList.add("correct-food");el("feedText").innerHTML="くんくん…<br>今日は見てるだけみたい。";el("feedDoctorText").textContent="隊長、試してくれてありがとう！";sound("ok");speak("隊長、試してくれてありがとう。今日は葉っぱを見ているだけみたいだ。");setTimeout(()=>btn.classList.remove("correct-food"),900)}}
function openDinoGet(){localStorage.setItem("pikoFirstDino","ちびティラノ");el("dinoGetText").textContent="やったー！"+getPlayerCall()+"、ちびティラノを発見したぞ！";showScreen("dinoGetScreen");speak("やったー。"+getPlayerCall()+"。ちびティラノを発見したぞ。")}function speakDinoGet(){sound("tap");speak("ちびティラノは、小さくても元気いっぱい。お肉が好きな赤ちゃん恐竜だよ。")}
function showFeedback(mark,text,good){el("feedbackMark").textContent=mark;el("feedbackMark").style.color=good?"#2a9d8f":"#e76f51";el("feedbackText").textContent=text;el("feedback").classList.add("show")}function hideFeedback(){el("feedback").classList.remove("show")}function shuffle(a){return[...a].sort(()=>Math.random()-.5)}
function openZukan(){
  sound("tap");
  el("zukanFound").textContent = "1";
  el("zukanTotal").textContent = "10";
  el("zukanText").textContent = "隊長！ここに発見した恐竜が集まるぞ。";
  showScreen("zukanScreen");
  speak("隊長。ここに発見した恐竜が集まるぞ。まずはティラノを発見しているね。");
}

function showDinoInfo(name){
  sound("ok");
  el("zukanText").textContent = name + "！力が強くて、お肉が大好きな恐竜だ。";
  speak(name + "。力が強くて、お肉が大好きな恐竜だ。いい発見だ、隊長。");
}

function showDinoHint(name){
  sound("tap");
  el("zukanText").textContent = "まだ見つけていない恐竜だ。次のたまごにいるかもしれないぞ！";
  speak("まだ見つけていない恐竜だ。次のたまごにいるかもしれないぞ。");
}


window.addEventListener("load",()=>{if(getPlayerName())openHome()});




/* Ver.0.9.4 恐竜マスターデータ */
const DINO_MASTER = [
  {id:"tyrannosaurus", no:"001", name:"ティラノサウルス", short:"ティラノ", image:"images/dinosaurs/tyrannosaurus.png", food:"meat", foodLabel:"おにく", desc:"力が強くて、お肉が大好きな恐竜だ。"},
  {id:"triceratops", no:"002", name:"トリケラトプス", short:"トリケラ", image:"images/dinosaurs/triceratops.png", food:"leaf", foodLabel:"はっぱ", desc:"大きな角とえりかざりがかっこいい草食恐竜だ。"},
  {id:"mosasaurus", no:"003", name:"モササウルス", short:"モサ", image:"images/dinosaurs/mosasaurus.png", food:"fish", foodLabel:"さかな", desc:"海を泳ぐ、とても大きな水のなかま。魚が好きだ。"},
  {id:"spinosaurus", no:"004", name:"スピノサウルス", short:"スピノ", image:"images/dinosaurs/spinosaurus.png", food:"fish", foodLabel:"さかな", desc:"背中の大きな帆が目印。魚をとるのが得意だ。"},
  {id:"pteranodon", no:"005", name:"プテラノドン", short:"プテラ", image:"images/dinosaurs/pteranodon.png", food:"fish", foodLabel:"さかな", desc:"空を飛ぶ翼竜。高いところから魚を見つけるぞ。"},
  {id:"allosaurus", no:"006", name:"アロサウルス", short:"アロ", image:"images/dinosaurs/allosaurus.png", food:"meat", foodLabel:"おにく", desc:"すばやくて勇敢な肉食恐竜だ。"},
  {id:"stegosaurus", no:"007", name:"ステゴサウルス", short:"ステゴ", image:"images/dinosaurs/stegosaurus.png", food:"leaf", foodLabel:"はっぱ", desc:"背中の板がかっこいい草食恐竜だ。"},
  {id:"velociraptor", no:"008", name:"ヴェロキラプトル", short:"ラプトル", image:"images/dinosaurs/velociraptor.png", food:"meat", foodLabel:"おにく", desc:"小さくてすばしっこい、かしこい恐竜だ。"},
  {id:"ankylosaurus", no:"009", name:"アンキロサウルス", short:"アンキロ", image:"images/dinosaurs/ankylosaurus.png", food:"leaf", foodLabel:"はっぱ", desc:"かたいよろいとしっぽのハンマーで身を守るぞ。"},
  {id:"pachycephalosaurus", no:"010", name:"パキケファロサウルス", short:"パキケ", image:"images/dinosaurs/pachycephalosaurus.png", food:"leaf", foodLabel:"はっぱ", desc:"頭の骨がとても分厚い、元気な恐竜だ。"},
  {id:"liopleurodon", no:"011", name:"リオプレウロドン", short:"リオ", image:"images/dinosaurs/liopleurodon.png", food:"fish", foodLabel:"さかな", desc:"海の中で力強く泳ぐ、魚が好きななかまだ。"},
  {id:"giganotosaurus", no:"012", name:"ギガノトサウルス", short:"ギガノト", image:"images/dinosaurs/giganotosaurus.png", food:"meat", foodLabel:"おにく", desc:"とても大きくて迫力のある肉食恐竜だ。"}
];

function getOwnedDinos(){
  let owned = JSON.parse(localStorage.getItem("pikoOwnedDinos") || "null");
  if(!owned){
    owned = ["tyrannosaurus"];
    localStorage.setItem("pikoOwnedDinos", JSON.stringify(owned));
  }
  return owned;
}

function setOwnedDinos(arr){
  localStorage.setItem("pikoOwnedDinos", JSON.stringify([...new Set(arr)]));
}

function getCurrentDinoId(){
  return localStorage.getItem("pikoCurrentDino") || "tyrannosaurus";
}

function setCurrentDino(id){
  localStorage.setItem("pikoCurrentDino", id);
}

function getDino(id){
  return DINO_MASTER.find(d => d.id === id) || DINO_MASTER[0];
}

function getRandomNewOrAnyDino(){
  const owned = getOwnedDinos();
  const notOwned = DINO_MASTER.filter(d => !owned.includes(d.id));
  const pool = notOwned.length ? notOwned : DINO_MASTER;
  return pool[Math.floor(Math.random()*pool.length)];
}

/* 既存関数の上書き：図鑑 */
function openZukan(){
  sound("tap");
  const owned = getOwnedDinos();
  el("zukanFound").textContent = owned.length;
  el("zukanTotal").textContent = DINO_MASTER.length;
  const grid = el("zukanGrid");
  grid.innerHTML = "";

  DINO_MASTER.forEach(d => {
    const found = owned.includes(d.id);
    const btn = document.createElement("button");
    btn.className = "zukan-item " + (found ? "found" : "locked");
    btn.onclick = () => found ? showDinoInfo(d.id) : showDinoHint(d.name);
    btn.innerHTML = `
      <img class="zukan-dino-img" src="${d.image}" alt="${d.name}">
      <div class="zukan-name">${found ? d.short : "？？？"}</div>
      <div class="zukan-badge">${found ? "GET!" : "まだ"}</div>
    `;
    grid.appendChild(btn);
  });

  el("zukanText").textContent = "隊長！ここに発見した恐竜が集まるぞ。";
  showScreen("zukanScreen");
  speak("隊長。ここに発見した恐竜が集まるぞ。");
}

function showDinoInfo(id){
  const d = getDino(id);
  sound("ok");
  el("zukanText").textContent = d.name + "！" + d.desc + " 好きなごはんは「" + d.foodLabel + "」だ。";
  speak(d.name + "。" + d.desc + "好きなごはんは、" + d.foodLabel + "だ。");
}

function showDinoHint(name){
  sound("tap");
  el("zukanText").textContent = name + "はまだ見つけていない。次のたまごにいるかもしれないぞ！";
  speak(name + "はまだ見つけていない。次のたまごにいるかもしれないぞ。");
}

/* 基地表示 */
function renderBaseDinos(){
  const holder = el("baseDinoList");
  if(!holder) return;
  const owned = getOwnedDinos();
  holder.innerHTML = "";
  owned.slice(0, 12).forEach(id => {
    const d = getDino(id);
    const img = document.createElement("img");
    img.src = d.image;
    img.alt = d.name;
    img.className = "base-dino-mini";
    holder.appendChild(img);
  });
}

function openBase(){
  sound("tap");
  el("baseLevel").textContent=getBaseLevel();
  showScreen("baseScreen");
  renderBaseDinos();
  speak("隊長。ここが恐竜基地だ。発見した恐竜がここに集まるぞ。");
}

/* 卵：新しい恐竜を選ぶ */
function openHatch(){
  sound("tap");
  hatched=false;
  const nextDino = getRandomNewOrAnyDino();
  localStorage.setItem("pikoNextHatchDino", nextDino.id);

  el("hatchTitle").innerHTML="たまごを<br>タッチしてね";
  el("hatchText").textContent="なにが生まれるかな？";
  el("crackText").classList.add("hidden");
  el("crackText").textContent="ピキ…";
  el("hatchEgg").className="hatch-egg";
  el("hatchEgg").textContent="🥚";
  document.querySelector(".hatch-area").classList.remove("cracking");

  const baby = el("babyDino");
  baby.src = nextDino.image;
  baby.alt = nextDino.name;
  baby.classList.add("hidden");

  el("afterHatchBtn").classList.add("hidden");
  showScreen("hatchScreen");
  speak(getPlayerCall()+"。たまごをタッチしてね。");
}

function hatchEgg(){
  if(hatched)return;
  hatched=true;
  const d = getDino(localStorage.getItem("pikoNextHatchDino") || "tyrannosaurus");

  el("hatchTitle").innerHTML="うまれるよ！";
  el("hatchText").textContent="ピキ…ピキピキ…！";
  el("crackText").classList.remove("hidden");
  speak("おっ。たまごが、われそうだぞ。");
  playCrackSoundLong();
  document.querySelector(".hatch-area").classList.add("cracking");
  el("hatchEgg").classList.add("crack");
  setTimeout(()=>el("crackText").textContent="ピキ…",150);
  setTimeout(()=>el("crackText").textContent="ピキッ…",700);
  setTimeout(()=>el("crackText").textContent="ピキピキ…",1300);
  setTimeout(()=>el("crackText").textContent="ピキピキピキ…！",1900);
  setTimeout(()=>el("crackText").textContent="パカーン！",2550);
  setTimeout(()=>{
    el("babyDino").classList.remove("hidden");
    el("hatchText").textContent=d.name+"が 生まれたよ！";
    el("afterHatchBtn").classList.remove("hidden");
    setCurrentDino(d.id);
    const owned = getOwnedDinos();
    if(!owned.includes(d.id)){
      owned.push(d.id);
      setOwnedDinos(owned);
    }
    speak("やったー。" + d.name + "が生まれたよ。");
  },3100);
}

/* ごはん画面 */
function openFeed(){
  sound("tap");
  const d = getDino(getCurrentDinoId());
  el("feedDino").className="feed-dino-img hungry";
  el("feedDino").src = d.image;
  el("feedDino").alt = d.name;
  el("heartMeter").textContent=renderHearts();
  el("feedText").innerHTML=d.short+"は<br>おなかがすいているみたい！";
  el("feedDoctorText").textContent=d.short+"は何が好きかな？";
  el("finishFeedBtn").classList.add("hidden");
  document.querySelectorAll(".food-btn").forEach(btn=>btn.classList.remove("correct-food","wrong-food"));
  showScreen("feedScreen");
  speak(d.short+"は、おなかがすいているみたい。ごはんをあげよう。");
}

function feedDinoFood(food,btn){
  sound("tap");
  const d = getDino(getCurrentDinoId());
  const good = food === d.food;

  if(food==="meat"){
    btn.classList.add(good ? "correct-food" : "wrong-food");
    el("feedDino").classList.add("dino-eat");
    flyMeat();
    if(good){ setHearts(getHearts()+1); }
    el("heartMeter").textContent=renderHearts();
    el("feedText").innerHTML = good ? "ガブガブ！<br><span class='bone-left'>🦴</span>" : "くんくん…<br>今日は少しだけみたい。";
    el("feedDoctorText").textContent = good ? "いいぞ！大好きなごはんだ！" : d.short+"の大好きは「"+d.foodLabel+"」みたい。";
    sound(good ? "eat" : "ok");
    speak(good ? "いいぞ。大好きなごはんだ。" : d.short+"の大好きは、"+d.foodLabel+"みたいだ。");
  }else if(food==="fish"){
    btn.classList.add(good ? "correct-food" : "wrong-food");
    if(good){ setHearts(getHearts()+1); }
    el("heartMeter").textContent=renderHearts();
    el("feedText").innerHTML = good ? "ぱくっ！<br>さかなが大好き！" : "ぱくっ。<br>少し食べたよ。";
    el("feedDoctorText").textContent = good ? "いい発見だ！魚が大好きだ！" : d.short+"の大好きは「"+d.foodLabel+"」みたい。";
    sound("eat");
    speak(good ? "いい発見だ。魚が大好きだ。" : d.short+"の大好きは、"+d.foodLabel+"みたいだ。");
  }else{
    btn.classList.add(good ? "correct-food" : "wrong-food");
    if(good){ setHearts(getHearts()+1); }
    el("heartMeter").textContent=renderHearts();
    el("feedText").innerHTML = good ? "むしゃむしゃ！<br>はっぱが大好き！" : "くんくん…<br>今日は見てるだけみたい。";
    el("feedDoctorText").textContent = good ? "いいぞ！葉っぱが大好きだ！" : d.short+"の大好きは「"+d.foodLabel+"」みたい。";
    sound(good ? "eat" : "ok");
    speak(good ? "いいぞ。葉っぱが大好きだ。" : d.short+"の大好きは、"+d.foodLabel+"みたいだ。");
  }

  setTimeout(()=>btn.classList.remove("correct-food","wrong-food"),900);
  setTimeout(()=>el("finishFeedBtn").classList.remove("hidden"),900);
}

function openDinoGet(){
  const d = getDino(getCurrentDinoId());
  localStorage.setItem("pikoFirstDino", d.name);
  el("getDinoImg").src = d.image;
  el("getDinoImg").alt = d.name;
  el("getDinoName").textContent = d.name;
  el("dinoGetText").textContent="やったー！"+getPlayerCall()+"、"+d.name+"を発見したぞ！";
  showScreen("dinoGetScreen");
  speak("やったー。"+getPlayerCall()+"。"+d.name+"を発見したぞ。");
}

function speakDinoGet(){
  sound("tap");
  const d = getDino(getCurrentDinoId());
  speak(d.name+"。" + d.desc);
}





/* Ver.0.9.5 数字レベルと恐竜ごとのハート */
function getNumberLevel(){
  return Number(localStorage.getItem("pikoNumberLevel") || 5);
}
function setNumberLevel(n){
  localStorage.setItem("pikoNumberLevel", String(n));
}
function selectNumberLevel(n){
  setNumberLevel(n);
  const l1 = el("level1Btn");
  const l2 = el("level2Btn");
  if(l1 && l2){
    l1.classList.toggle("selected", n === 5);
    l2.classList.toggle("selected", n === 10);
  }
  sound("tap");
  speak(n === 5 ? "レベルいち。いちからごまでだよ。" : "レベルに。いちからじゅうまでに挑戦だ。");
}
function updateLevelButtons(){
  const n = getNumberLevel();
  const l1 = el("level1Btn");
  const l2 = el("level2Btn");
  if(l1 && l2){
    l1.classList.toggle("selected", n === 5);
    l2.classList.toggle("selected", n === 10);
  }
}

/* 既存 openMission を上書き */
function openMission(){
  sound("tap");
  const p=getPlayerCall();
  const level = getNumberLevel();
  el("missionText").textContent = p + "、1から" + level + "までの数字を見つけよう！";
  showScreen("missionScreen");
  updateLevelButtons();
  speak(p+"。1から"+level+"までの数字を見つけよう。クリアすると、たまごが光るぞ。");
}
function speakMission(){
  sound("tap");
  const level = getNumberLevel();
  speak(getPlayerCall()+"。1から"+level+"までの数字を見つけよう。クリアすると、たまごが光るぞ。");
}

function startNumberGame(){
  sound("tap");
  questionNow=1;
  scoreNow=0;
  locked=false;
  showScreen("gameScreen");
  makeQuestion();
}

function makeQuestion(){
  locked=false;
  const level = getNumberLevel();
  targetNumber=Math.floor(Math.random()*level)+1;
  el("questionNow").textContent=questionNow;
  el("scoreNow").textContent=scoreNow;
  el("targetNumber").textContent=targetNumber;
  const grid=el("numberGrid");
  grid.innerHTML="";
  grid.classList.toggle("level10", level === 10);

  const nums = [];
  for(let i=1;i<=level;i++){ nums.push(i); }

  shuffle(nums).forEach(num=>{
    const b=document.createElement("button");
    const colorNum = ((num - 1) % 5) + 1;
    b.className="number-btn color-"+colorNum;
    b.textContent=num;
    b.onclick=()=>chooseNumber(num,b);
    grid.appendChild(b);
  });
  setTimeout(()=>repeatQuestion(false),300);
}

function repeatQuestion(manual=false){
  const namePart=(questionNow===1||manual)?getPlayerCall()+"。":"";
  const yomi = {
    1:"いち",2:"に",3:"さん",4:"よん",5:"ご",
    6:"ろく",7:"なな",8:"はち",9:"きゅう",10:"じゅう"
  };
  speak(namePart + (yomi[targetNumber] || targetNumber) + "をえらんでね。");
}

/* 恐竜ごとのハート */
function getAllDinoHearts(){
  return JSON.parse(localStorage.getItem("pikoDinoHearts") || "{}");
}
function saveAllDinoHearts(data){
  localStorage.setItem("pikoDinoHearts", JSON.stringify(data));
}
function getDinoHeart(id){
  const data = getAllDinoHearts();
  return Number(data[id] || 0);
}
function setDinoHeart(id, value){
  const data = getAllDinoHearts();
  data[id] = Math.max(0, Math.min(5, Number(value)));
  saveAllDinoHearts(data);
}
function addDinoHeart(id, amount=1){
  setDinoHeart(id, getDinoHeart(id) + amount);
}
function renderDinoHearts(id){
  const n = getDinoHeart(id);
  return "❤️".repeat(n) + "🤍".repeat(5-n);
}

/* 既存 openFeed を上書き */
function openFeed(){
  sound("tap");
  const d = getDino(getCurrentDinoId());
  el("feedDino").className="feed-dino-img hungry";
  el("feedDino").src = d.image;
  el("feedDino").alt = d.name;
  el("heartMeter").textContent=renderDinoHearts(d.id);
  el("feedText").innerHTML=d.short+"は<br>おなかがすいているみたい！";
  el("feedDoctorText").textContent=d.short+"は何が好きかな？";
  el("finishFeedBtn").classList.add("hidden");
  document.querySelectorAll(".food-btn").forEach(btn=>btn.classList.remove("correct-food","wrong-food"));
  showScreen("feedScreen");
  speak(d.short+"は、おなかがすいているみたい。ごはんをあげよう。");
}

/* 既存 feedDinoFood を上書き：好きな食べ物だけハートが増える */
function feedDinoFood(food,btn){
  sound("tap");
  const d = getDino(getCurrentDinoId());
  const good = food === d.food;

  btn.classList.add(good ? "correct-food" : "wrong-food");

  if(good){
    addDinoHeart(d.id, 1);
    el("feedDino").classList.add("dino-eat");
  }

  el("heartMeter").textContent=renderDinoHearts(d.id);

  if(food==="meat"){
    flyMeat();
    el("feedText").innerHTML = good ? "ガブガブ！<br><span class='bone-left'>🦴</span>" : "くんくん…<br>今日は少しだけみたい。";
  }else if(food==="fish"){
    el("feedText").innerHTML = good ? "ぱくっ！<br>さかなが大好き！" : "ぱくっ。<br>少し食べたよ。";
  }else{
    el("feedText").innerHTML = good ? "むしゃむしゃ！<br>はっぱが大好き！" : "くんくん…<br>今日は見てるだけみたい。";
  }

  if(good){
    el("feedDoctorText").textContent = "いいぞ！"+d.short+"の大好きなごはんだ！";
    sound("eat");
    speak("いいぞ。"+d.short+"の大好きなごはんだ。");
  }else{
    el("feedDoctorText").textContent = d.short+"の大好きは「"+d.foodLabel+"」みたい。";
    sound("ok");
    speak(d.short+"の大好きは、"+d.foodLabel+"みたいだ。");
  }

  setTimeout(()=>btn.classList.remove("correct-food","wrong-food"),900);
  setTimeout(()=>el("finishFeedBtn").classList.remove("hidden"),900);
}

