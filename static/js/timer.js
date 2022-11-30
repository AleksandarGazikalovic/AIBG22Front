
var {time} = require("./Logic/game");

console.log(time)

const startingMinutes = 3;
let tim = startingMinutes*60;

let countdownEl = document.getElementById('countdown');
let popup = document.getElementById("popup");

t = setInterval(updateCountdown,1000);

function updateCountdown(){
  const minutes = Math.floor(tim/60);
  let seconds = tim % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds; 

  countdownEl.innerHTML = `${minutes}: ${seconds}`;
  tim--;

  if(minutes == 0 && seconds ==0){
    openPopup();
    clearInterval(t);
  }
}

function openPopup(){
  popup.classList.add("open-popup");
}

//implementiranje ScoreBoard-a na klik

addEventListener("keydown", e=>{
  if(e.code == "KeyR"){
  openPopup();
  }
})
addEventListener("keyup", e=>{
  if(e.code == "KeyR"){
  popup.classList.remove("open-popup");
  }
})

  