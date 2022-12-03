//Uploadovanje slika iz gif-a:
import { Draw } from "./draw";
import { Character } from "./character";
import { API_ROOT } from "../configuration";
import { Timer } from "./timer";
import { forEach } from "lodash";

const numOfRows = 29;
var row1 = document.querySelectorAll(".prvi td");
var row2 = document.querySelectorAll(".drugi td");
var row3 = document.querySelectorAll(".treci td");
var row4 = document.querySelectorAll(".cetvrti td");
var rows = [row1,row2,row3,row4]; 


export class Game {
	//Klasika konstruktor:
	constructor(gameId) {
        this.ctx = document.getElementById("game").getContext("2d"); 
        this.gameId = gameId;
        this.drawInstance = null; 
        this.map = null;
        this.players = [];
		this.attackedTiles = [];
        this.shouldDraw = true;
		this.firstRender = true;
		this.bossAction = false;
		this.playerAttack = null;
		this.time=null;
    }
	
	//inicijalizacija igrice - poziva se iz index.js
	init(){
		// Povezivanje Draw i Game
		this.drawInstance = new Draw(this.ctx);

		jQuery(() => {			
			$.ajax({
				url: `http://${API_ROOT}/game?gameId=${this.gameId}&password=salamala`,
				dataType: "json",
				success: result => {					
					this.drawInstance = new Draw(this.ctx); // Isto kao i prva linija inita-a. Sa svakim zahtevom mi povezujemo game i Draw() klasu. 
					var game = JSON.parse(result.gameState);
					var time = JSON.parse(result.time);
					var playerAttack = JSON.parse(result.playerAttack);
					// var attacks = JSON.parse(result.attacks);
					this.update(game, time, playerAttack); 
					requestAnimationFrame(this.draw.bind(this)); // bind vraca funkciju draw klase game, a prosledjuje joj Game
				},error: error => {}
			});
		});
	}		

	// Kupljenje podataka iz GameState-a:
    update(game, time, playerAttack) {		
		
		//Kupimo mapu:	
		this.map = game.map.tiles;
		this.bossAction = game.hugoBoss.bossAction;
		this.attackedTiles = game.hugoBoss.bossAttackedTiles;
		this.time = new Timer(time);
		this.playerAttack = playerAttack;
		// Ubacujemo igrace: 
        const Player1 = game.player1 ;
		const Player2 =game.player2 ;
        const Player3 = game.player3 ;
        const Player4 =game.player4 ;
		if(this.players.length){
			this.players[0].updatePlayer(Player1, playerAttack);
			this.players[1].updatePlayer(Player2, playerAttack);
			this.players[2].updatePlayer(Player3, playerAttack);
			this.players[3].updatePlayer(Player4, playerAttack);

		} else {
			this.players = [
				new Character(this.ctx, Player1),
				new Character(this.ctx, Player2),
				new Character(this.ctx, Player3),
				new Character(this.ctx, Player4)
			];
		}	
		//scoreboard
		for(let i=0;i<4;i++){
			 	let p=0;
			 	let row = rows[i]
			 	switch(p){
			 		case 0:
			 			 row[p].innerHTML = game.scoreBoard.players[i].name
			 			 p++;
			 		case 1:
			 			row[p].innerHTML = game.scoreBoard.players[i].kills
			 			p++;
			 		case 2:
			 			row[p].innerHTML = game.scoreBoard.players[i].deaths	
			 			p++;
			 		case 3:
			 			row[p].innerHTML = game.scoreBoard.players[i].kd
			 			p++;
			 		case 4:
			 			row[p].innerHTML = game.scoreBoard.players[i].score	
			 			p=0;
			 	}
			}
	}
	// Iscrtavanje svih elemenata:
	draw(){
		if (this.ctx === null) {
			return;
        }
		// Crtanje MapBase-a:
		
		this.drawInstance.drawMapBase();
		
		// Crtanje tile-ova:
		drawTiles(this.map, this.drawInstance);
        if(this.playerAttack != null){
			//this.ctx.clearRect(this.players[this.playerAttack.playerIdx -1].r,this.players[this.playerAttack.playerIdx -1].q,this.playerAttack.r, this.playerAttack.q);
			this.drawInstance.drawLaserAttack(this.players[this.playerAttack.playerIdx -1].r,this.players[this.playerAttack.playerIdx -1].q,this.playerAttack.r, this.playerAttack.q);
		}
		// Crtanje player-a:
		for(let i=0;i< 4;i++){
			this.drawInstance.drawRotatedPlayer(this.players[i]);
		}
		// Crtanje Boss-a:
		this.drawInstance.drawBoss();

		if(this.bossAction==true){
			this.attackedTiles.forEach(element => {
				this.drawInstance.drawAttackedTile(element.r, element.q);
			});
		}
		
		
		
		
		if (this.shouldDraw || this.firstRender)  
			requestAnimationFrame(this.draw.bind(this));
        
		this.firstRender = false;
		
	}
	
	
} 

function drawTiles(map, drawInstance){
	let cap = 15; 
	let sgn = 1; 
	for (let y = 0; y <= numOfRows; y++) {
		for (let x = 0; x < cap; x++) {
			drawInstance.drawTile(map[y][x]);

	}
	if(cap == 29) sgn = -1;
	cap = cap + sgn;
	if(sgn*cap == -14) break;
}
}


