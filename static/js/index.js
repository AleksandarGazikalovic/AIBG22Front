import qs from 'qs';



import { Game, Character } from "./game"; // 
import { WebsocketHandler } from  "./ws"; //  ovo sa serverom komunicira
import { API_ROOT } from './configuration'; // lokalno 

const queryArgs = qs.parse( //parsira argumente iz urla
  window.location.search.substring(1)  //vraca ? i query deo URL-a (?gameId=1)
)


const gameId = queryArgs.gameId;
//let audioLoading = new Audio('../js/loading_screen.mp3')
//audioLoading.play();

if (gameId) {  
  //audioLoading.pause();
  console.info(`Connecting to game ${ gameId }`);
  const game = new Game(gameId);

  console.log(game);
  
  game.init();
  console.log(game);
  //let audioGame = new Audio('../js/music.mp3');
  //audioGame.play();
  new WebsocketHandler(`ws://${API_ROOT}/streaming?gameId=${gameId}&password=salamala`, game); // 
	console.log(game);


  //let audioGame = new Audio('../js/music.mp3');
  //audioGame.play();
  //new WebsocketHandler(`ws://${API_ROOT}/streaming?gameId=${gameId}&password=salamala`, game);
  //new WebsocketHandler(`ws://localhost:8080/streaming?gameId=${gameId}&password=salamala`, game);
}
