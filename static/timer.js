const startingMinutes = 1;
let time = startingMinutes*60;

let countdownEl = document.getElementById('countdown');
let popup = document.getElementById("popup");

t = setInterval(updateCountdown,1000);

function updateCountdown(){
  const minutes = Math.floor(time/60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds; 

  countdownEl.innerHTML = `${minutes}: ${seconds}`;
  time--;

  if(minutes == 0 && seconds ==0){
    openPopup();
    clearInterval(t);
  }
}

function openPopup(){
  popup.classList.add("open-popup");
}