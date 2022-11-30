//Uploadovanje slika iz gif-a:
import { Draw } from "./draw";
import { Character } from "./character";
import { API_ROOT } from "../configuration";

const numOfRows = 29;



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
					// var attacks = JSON.parse(result.attacks);
					this.update(game); 
					requestAnimationFrame(this.draw.bind(this)); // bind vraca funkciju draw klase game, a prosledjuje joj Game
				
				},error: error => {}
			});
		});
	}		
	
	// Kupljenje podataka iz GameState-a:
    update(game) {
		
		//Ako imamo pobednika, samo to pokazi i tu stani. 
        if (game.winner !== null) {
            this.shouldDraw = false;
			this.showWinner(game.winner);
        }

		//Kupimo mapu:	
		this.map = game.map.tiles;
		this.bossAction = game.hugoBoss.bossAction;
		this.attackedTiles = game.hugoBoss.bossAttackedTiles;
	
		
		
		
		// Ubacujemo igrace: 
        const Player1 = game.player1 ;
		const Player2 =game.player2 ;
        const Player3 = game.player3 ;
        const Player4 =game.player4 ;
		if(this.players.length){
			this.players[0].updatePlayer(Player1);
			this.players[1].updatePlayer(Player2);
			this.players[2].updatePlayer(Player3);
			this.players[3].updatePlayer(Player4);

		} else {

			this.players = [

				new Character(this.ctx, Player1),
				new Character(this.ctx, Player2),
				new Character(this.ctx, Player3),
				new Character(this.ctx, Player4)
			];
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
        let cap = 15; 
        let sgn = 1; 
        for (let y = 0; y <= numOfRows; y++) {
			for (let x = 0; x < cap; x++) {
				this.drawInstance.drawTile(this.map[y][x]);

            }
			if(cap == 29) sgn = -1;
            cap = cap + sgn;
			if(sgn*cap == -14) break;
        }
		// Crtanje player-a:
		for(let i=0;i< 4;i++){
			this.drawInstance.drawRotatedPlayer(this.players[i]);
		}
		
		this.drawInstance.drawBoss();	
		if(this.bossAction==true){
			this.attackedTiles.forEach(element => {
				this.drawInstance.drawAttackedField(element.r, element.q);
			});
		}
		this.drawInstance.drawLaserAttack();
		//this.drawInstance.drawAttackedField(4,4);
		if (this.shouldDraw || this.firstRender)  
			requestAnimationFrame(this.draw.bind(this));
        
		this.firstRender = false;
	}
	
	//winner pop-up
	async showWinner(winner) {
		//console.log("uslo je u funkc");
        //const sleep = ms => new Promise(res => setTimeout(res, ms));
        //await sleep(2000);
        this.shouldDraw = false;
        let text = "Game over";
        const el = document.querySelector(".finished");
        if (winner) {
			text = `${winner.name} won the game!`;
        }else{
			text = `Ladies and gentleman, its a draw!`;
			el.querySelector("p").innerHTML = "";
        }
		el.querySelector("h1").innerHTML = text;
        el.classList.remove("hidden");
     }
} 








