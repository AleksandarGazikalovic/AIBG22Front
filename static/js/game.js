//Uploadovanje slika iz gif-a:

import PlayersURL from "../gif/Players.png";
import MapBaseURL from "../gif/MapBase.png";
import TileBorderURL from "../gif/TileBorder.png"
import FullTileEntitiesURL from "../gif/Tiles.png";
import BossURL from "../gif/Boss.png";

import { API_ROOT } from "./configuration";

// Slike =====================================================================================

let players = new Image();	
let mapBase = new Image();
let tileBorder = new Image();
let FullTileEntities = new Image();
let boss = new Image();

players.src = PlayersURL;
mapBase.src = MapBaseURL;
tileBorder.src =  TileBorderURL;
FullTileEntities.src = FullTileEntitiesURL;
boss.src = BossURL;


// Dimenzije za Tajlove =====================================================================================
const numOfRows = 29;
const dTileW = 44;  // Skraceno od  - Destination Tile Width - Sirina tile-a na canvasu
const dTileH = 44;  // Skraceno od  - Destination Tile Height - Visina tile-a na canvasu
const sTileW =  44; // Skraceno od  - Source Tile Width - Sirinu koju uzima od izvorne slike
const sTileH =  44; // Skraceno od  - Source Tile Height - Visinu koju uzima od izvorne slike
const sPlayerW =  44; 
const sPlayerH = 44;



// Tipovi entitija: =====================================================================================
const TileEntity = { // uzima delovi 1, drugi red kako to zna pitate se? ctrl f = 
  Fence300: { index: 0 },
  Fence200: { index: 1 },
  Fence100: { index: 2 },
  WORMHOLE: { index: 3 },
  BLACKHOLE:{ index: 4 }
};


class Draw{

	constructor({ctx, FullTileEntities}){
		this.ctx = ctx; 
		this.FullTileEntities = FullTileEntities; 
	}

	drawRotatedPlayer(r, q, index, angle){
		var [x,y] = convertCoordinates(r, q);		
		this.ctx.save();
		this.ctx.translate(x+22,y+22);
		this.ctx.rotate(angle*Math.PI/180);
		this.ctx.drawImage(
			players,		// what image
			sPlayerW*index, //source image start crop
			0,				// source image start crop
			sPlayerW,		//source image width crop
			sPlayerW,       // source image 
			-22,
			-22,
			44,
			44
		)
		this.ctx.restore();
	}
	
	// Iscrtavanje podloge mape:
	drawMapBase(){
		this.ctx.drawImage(
			mapBase,
			-1,
			-3
		)
	};
	// Iscrtavanje Boss-a:
	drawBoss(){
		this.ctx.drawImage(
			boss,
			492,
			429
		)
	}
	
	// Opsta funkcija:
	drawTile(tile) {
		var [x,y] = convertCoordinates(tile.r, tile.q);
		let entity = tile.entity;
		var entityType;

		if(!(entity.type === 'EMPTY' || entity.type === 'BOSS')){		
            if(entity.type === 'FENCE'){
                if(entity.health > 200){
					entityType = TileEntity['Fence300'];
                }
                if(entity.health >= 100 && entity.health < 200){
                    entityType = TileEntity['Fence200'];
                }
                if(entity.health < 100 ){
                    entityType = TileEntity['Fence100'];
                }
            } else entityType = TileEntity[entity.type];

            this.drawEntity(x, y, entityType.index);	
		}
       this.drawTileBorder(x,y);	
	}
    // za vezbu okvir tajla:
	drawTileBorder(x,y){
        this.ctx.drawImage(
            tileBorder, 
            x, 
            y
        );
    }
    // Ako ima entity poziva ovo:
	drawEntity(x, y, indexOfEntityType){
		
		this.ctx.drawImage(
        	FullTileEntities,
        	sTileW * indexOfEntityType,
			0, 
			sTileW, 
			sTileH,
        	x-1, 
        	y+1, 
        	dTileW, 
        	dTileH
    	);
  	}

	drawPlayer(r, q, index){
		var [x,y] = convertCoordinates(r, q);
		this.ctx.drawImage(
			players,
			sPlayerW*index,
			0,
			sPlayerW,
			sPlayerW,
			x+2,
			y+1,
			44,
			44
		)
	}
}


class Character {
	constructor(ctx, Player) { // info tu je sve. index suvisan. 
	 	
		this.ctx = ctx;

		this.id = Player.info.playerIdx;           // 
		this.index = Player.id - 1; 
        this.q = Player.info.q;             // pozicija
        this.r = Player.info.r;             // pozicija
        
		this.level  = Player.info.level;
		this.health = Player.info.health;
		this.power  = Player.info.power;
        this.deaths = Player.info.deaths;
		this.kills  = Player.info.kills;
        this.trapped = Player.info.trapped;
        //this.teamName = Player.name ? Player.name : Player._id;	
		this.setInfoBox();			 	
	}
	
	setInfoBox() {
		const div = document.querySelector(`.player${this.index+1}`);
		console.log(div);
		div.querySelector(".level").innerHTML = `${this.level}`;
		div.querySelector(".health").innerHTML = `${this.health}`;
		div.querySelector(".power").innerHTML = `${this.power}`;
		div.querySelector(".deaths").innerHTML = `${this.deaths}`;
		div.querySelector(".kills").innerHTML = `${this.kills}`;
    
		let angle = find_angle(10, 10, 20, 10);
		console.log(angle);
     }
}

export class Game {
	//Klasika konstruktor:
	constructor(gameId) {
        this.ctx = document.getElementById("game").getContext("2d"); 
        this.gameId = gameId;
        this.drawInstance = null; 
        this.map = null;
        this.players = [];
        this.shouldDraw = true;
		this.firstRender = true;
    }
	
	//inicijalizacija igrice - poziva se iz index.js
	init(){
		// Povezivanje Draw i Game
		this.drawInstance = new Draw({ctx: this.ctx,FullTileEntities});

		jQuery(() => {			
			$.ajax({
				url: `http://${API_ROOT}/game?gameId=${this.gameId}&password=salamala`,
				dataType: "json",
				success: result => {					
					this.drawInstance = new Draw({ ctx: this.ctx,FullTileEntities}); // Isto kao i prva linija inita-a. Sa svakim zahtevom mi povezujemo game i Draw() klasu. 
					var game = JSON.parse(result.gameState); 
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

		
		// Ubacujemo igrace: 
        const Player1 = { id: 1, info: game.player1 };
		const Player2 = { id: 2, info: game.player2 };
        const Player3 = { id: 3, info: game.player3 };
        const Player4 = { id: 4, info: game.player4 };
		this.players = [
			new Character(this.ctx, Player1),
			new Character(this.ctx, Player2),
			new Character(this.ctx, Player3),
			new Character(this.ctx, Player4)
		];
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
			//this.drawInstance.drawPlayer(this.players[i].r,this.players[i].q, i );
			this.drawInstance.drawRotatedPlayer(this.players[i].r, this.players[i].q, i, find_angle(this.players[i].r, this.players[i].q, this.players[i].r-20, this.players[i].q));
		}
		this.drawInstance.drawBoss();	

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

// ============================================================================================================



function convertCoordinates(r, q){
	let x = 266 + (14+r)*19 + q*38;
	let y = (14 + r)*33;
	return [x,y];
}

function find_angle(prevR, prevQ,currR, currQ){
	
	let [Bx, By] = convertCoordinates(prevR, prevQ);
	let [Cx, Cy] = convertCoordinates(currR, currQ);

	var Ax =Bx;
	var Ay = By-10;
	var AB = Math.sqrt(Math.pow(Bx-Ax, 2) + Math.pow(By -Ay,2));
	var BC = Math.sqrt(Math.pow(Bx-Cx, 2) + Math.pow(By -Cy,2));
	var AC = Math.sqrt(Math.pow(Cx-Ax, 2) + Math.pow(Cy -Ay,2));
	return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180/Math.PI;
}
