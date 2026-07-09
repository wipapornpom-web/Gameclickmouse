let selectedGame=null;
let score=0;
let wrong=0;
let timeLeft=30;
let mainTimer=null;
let targetTimer=null;
let running=false;

const gameArea=document.getElementById("gameArea");
const scoreEl=document.getElementById("score");
const wrongEl=document.getElementById("wrong");
const timeEl=document.getElementById("time");
const titleEl=document.getElementById("gameTitle");
const instructionEl=document.getElementById("instruction");
const messageEl=document.getElementById("message");

const games={
  balloon:{
    title:"🎈 เกมคลิกลูกโป่ง",
    instruction:"คลิกเฉพาะลูกโป่ง 🎈 อย่าคลิกระเบิด 💣",
    good:["🎈"],
    bad:["💣","🪨"]
  },
  star:{
    title:"⭐ เกมจับดาว",
    instruction:"คลิกเฉพาะดาว ⭐ อย่าคลิกเมฆ ☁️ หรือพระจันทร์ 🌙",
    good:["⭐","🌟"],
    bad:["☁️","🌙"]
  },
  fish:{
    title:"🐟 เกมจับปลา",
    instruction:"คลิกเฉพาะปลา 🐟 อย่าคลิกฉลาม 🦈 หรือปลาหมึก 🐙",
    good:["🐟","🐠"],
    bad:["🦈","🐙"]
  },
  cheese:{
    title:"🧀 เกมเก็บชีสให้หนู",
    instruction:"คลิกชีส 🧀 อย่าคลิกแมว 🐱 หรือกับดัก 🪤",
    good:["🧀"],
    bad:["🐱","🪤"]
  },
  fruit:{
    title:"🍎 เกมเก็บผลไม้",
    instruction:"คลิกแอปเปิล 🍎 อย่าคลิกพริก 🌶️ หรือเห็ด 🍄",
    good:["🍎"],
    bad:["🌶️","🍄"]
  }
};

function selectGame(name){
  selectedGame=name;
  if(name==="traffic"){
    titleEl.textContent="🚦 เกมไฟเขียวไฟแดง";
    instructionEl.textContent="คลิกเฉพาะสีเขียว ✅ ถ้าเป็นแดง/เหลือง ให้รอเฉย ๆ แล้วเกมจะเปลี่ยนเอง";
  }else{
    titleEl.textContent=games[name].title;
    instructionEl.textContent=games[name].instruction;
  }
  messageEl.textContent="";
  gameArea.innerHTML="";
  resetScore();
}

function startGame(){
  if(!selectedGame){
    messageEl.textContent="กรุณาเลือกเกมก่อนค่ะ";
    return;
  }
  score=0;
  wrong=0;
  timeLeft=30;
  running=true;
  updateAll();
  messageEl.textContent="";
  gameArea.innerHTML="";
  clearInterval(mainTimer);
  clearTimeout(targetTimer);

  mainTimer=setInterval(()=>{
    timeLeft--;
    updateAll();
    if(timeLeft<=0) endGame();
  },1000);

  spawnTarget();
}

function spawnTarget(){
  if(!running) return;
  clearTimeout(targetTimer);
  gameArea.innerHTML="";

  if(selectedGame==="traffic"){
    spawnTraffic();
    return;
  }

  const game=games[selectedGame];
  const makeBad=game.bad.length>0 && Math.random()<0.4;
  const iconList=makeBad?game.bad:game.good;
  const icon=iconList[Math.floor(Math.random()*iconList.length)];

  const target=document.createElement("div");
  target.className="target "+(makeBad?"bad":"good");
  target.textContent=icon;
  placeTarget(target,96,96);

  target.onclick=()=>handleClick(!makeBad);
  gameArea.appendChild(target);
}

function spawnTraffic(){
  const choices=[
    {emoji:"🟢",label:"คลิกได้",ok:true,cls:"go"},
    {emoji:"🔴",label:"ห้ามคลิก",ok:false,cls:"stop"},
    {emoji:"🟡",label:"รอก่อน",ok:false,cls:"wait"}
  ];

  const item=choices[Math.floor(Math.random()*choices.length)];
  const target=document.createElement("div");
  target.className="target traffic-card "+item.cls;
  target.innerHTML="<div>"+item.emoji+"</div><div class='label'>"+item.label+"</div>";
  placeTarget(target,160,160);

  target.onclick=()=>{
    clearTimeout(targetTimer);
    handleTrafficClick(item.ok);
  };

  gameArea.appendChild(target);

  // สำคัญ: ถ้าเป็นไฟแดง/เหลือง เด็กไม่ต้องคลิก เกมจะไปต่อเอง
  // ถ้าเป็นไฟเขียวแล้วไม่คลิก ก็เปลี่ยนเองเช่นกัน แต่ไม่ได้คะแนน
  targetTimer=setTimeout(()=>{
    if(!running) return;
    if(item.ok){
      messageEl.textContent="ผ่านไปแล้ว ลองคลิกไฟเขียวให้ทันนะ";
    }else{
      messageEl.textContent="ถูกต้อง! ไม่คลิกไฟแดง/เหลือง";
    }
    spawnTarget();
  },1200);
}

function placeTarget(target,w,h){
  const maxX=Math.max(10,gameArea.clientWidth-w);
  const maxY=Math.max(10,gameArea.clientHeight-h);
  target.style.left=Math.random()*maxX+"px";
  target.style.top=Math.random()*maxY+"px";
}

function handleClick(correct){
  if(!running) return;
  if(correct){
    score++;
    messageEl.textContent="เก่งมาก! +1 คะแนน";
  }else{
    wrong++;
    score=Math.max(0,score-1);
    messageEl.textContent="อุ๊ย! ตัวหลอก หัก 1 คะแนน";
  }
  updateAll();
  spawnTarget();
}

function handleTrafficClick(correct){
  if(!running) return;
  if(correct){
    score++;
    messageEl.textContent="เก่งมาก! คลิกไฟเขียว +1";
  }else{
    wrong++;
    score=Math.max(0,score-1);
    messageEl.textContent="ผิดค่ะ! ไฟแดง/เหลืองห้ามคลิก";
  }
  updateAll();
  spawnTarget();
}

function endGame(){
  running=false;
  clearInterval(mainTimer);
  clearTimeout(targetTimer);
  gameArea.innerHTML="";
  messageEl.textContent="🎉 หมดเวลา! คะแนน "+score+" | คลิกผิด "+wrong+" ครั้ง";
}

function backToMenu(){
  running=false;
  clearInterval(mainTimer);
  clearTimeout(targetTimer);
  selectedGame=null;
  titleEl.textContent="เลือกเกมเพื่อเริ่มเล่น";
  instructionEl.textContent="กดเลือกเกมก่อนค่ะ";
  gameArea.innerHTML="";
  messageEl.textContent="";
  resetScore();
}

function resetScore(){
  score=0;
  wrong=0;
  timeLeft=30;
  updateAll();
}

function updateAll(){
  scoreEl.textContent=score;
  wrongEl.textContent=wrong;
  timeEl.textContent=timeLeft;
}
