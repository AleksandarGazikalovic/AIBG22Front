export class Timer{
    constructor(timer){
      this.timer = timer;
        this.updateCountdown(this.timer);
    }
    
    updateCountdown(timer){
        let countdownEl = document.getElementById('countdown');
        timer=timer/1000;
        const minutes = Math.floor(timer/60);
        let seconds = timer % 60;
      
        seconds = seconds < 10 ? "0" + seconds : seconds; 
      
        countdownEl.innerHTML = `${minutes}: ${seconds}`;
      
        if(minutes == 0 && seconds ==0){
          openPopup();
        }
      }

}