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
  BLACKHOLE: { index: 4 }
};


class Draw{
	
	constructor({ctx, FullTileEntities}){
		this.ctx = ctx; 
		this.FullTileEntities = FullTileEntities; 
	}

	rotate(x, y, angle){

		this.To_Radians = Math.PI/180;
		this.image = new Image();
		this.src = MapBaseURL;
	
		
			this.ctx.save();
			this.ctx.translate(x, y);
			this.ctx.rotate(angle* this.To_Radians);
	
			this.ctx.drawImage(this.image, -(this.image.width/2), -(this.image.height)/2);
			this.ctx.restore();
		
	}
	
	// Iscrtavanje podloge mape:
	drawMapBase(){
		this.ctx.drawImage(
			mapBase,
			-5,
			-5
		)
	};
	// Iscrtavanje Boss-a:
	drawBoss(){
		this.ctx.drawImage(
			boss,
			496.5,
			435.5
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

	drawPlayer(x, y, playerId){
		this.ctx.drawImage(
			players,
			sPlayerW*playerId,
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
	constructor(ctx, info) { // info tu je sve. index suvisan. 
	 	this.ctx = ctx;
        this._id = info.id; // 
        this.q = info.q; // pozicija
        this.r = info.r; // pozicija
        this.index = info._id - 1; // zbog indeksiranja sa slikom u realnosti islo 1 pa sad od 0

        this.HP = info.health;
        this.kills = info.kills;
        this.power = info.power;
        this.teamName = info.name ? info.name : info._id;	
	 	this.update(info);
	 	
		this.paralysed = false;
	 	
	 	this.steps = 5000;
	 	this.left = 4;
	}
	
	//crtanje igraca - TODO ubacivanje directiona
	draw(){
		
		let index = this.index;
        if(this.HP <= 0){
        	index = 5; // kad umre index za iscrtavanje 
        }
		if(index == 17 || index == 16) index = 4;


       
        this.ctx.drawImage(
            players, 
            sTileW*index,// sece po x
            0,
            sPlayerW,
            sPlayerH,
            convertCoordinates(this.q, this.r)[0],    
            convertCoordinates(this.r, this.q)[1],
            dTileW,
            dTileH
        );
        
        
        
	}
	
	//ne kapiram zasto ne moze samo direktno draw?
	refresh(){
		this.draw();
	}
	
	update(info) {
		/*
		
		this.health = info.health;
		*/
		// this.steps = info.steps;
		// this.q = info.q;
		// this.r = info.r;
		// if(info.direction == 1){
		// 	this.direction = 0;
		// }
		// if(info.direction == 0){
		// 	this.direction = 1;
		// }
		
		
        // this.HP = info.health;
        // this.coins = info.money;
        // this.cannons = info.cannons;
		// this.paralysed = info.paralysed;
		
		

		
		//TODO 
		//polja vervoatno sluze za infobox
		//this.info = info;
		//this.lastAction = info.lastAction;
		//this.setInfoBox();
	}
	
	// setInfoBox() {
	// 	if(this._id == 17 || this._id == 18) return;
	// 	//console.log(`.content${this.index}`);
	// 	const div = document.querySelector(`.content${this.index+1}`);
	// 	//console.log( div );
	// 	  
	// 	  div.querySelector(".coins").innerHTML = `${this.coins}`;
	// 	  div.querySelector(".health").innerHTML = `${this.HP}`;
	// 	  div.querySelector(".cannons").innerHTML = `${this.cannons}`;
    //       return;
    //     }
    
        
    //     div.querySelector("h3").innerHTML = `${this.teamName}`;     //ovo nama treba da radi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //     div.querySelector(".coins").innerHTML = `${this.coins}`;
    //     div.querySelector(".health").innerHTML = `${this.HP}`;
    //     div.querySelector(".cannons").innerHTML = `${this.cannons}`;
	// 	
    
    //     //this.partsDiv.innerHTML = '';
    
    // }
}

export class Game {
	constructor(gameId) {
        this.ctx = document.getElementById("game").getContext("2d"); // 2d kkanvas? just js things
        this.gameId = gameId;
        this.drawInstance = null; // na initu se inicij sve sto je ovde null 
        this.map = null;
        this.firstRender = true;
        this.players = [];
        this.shouldDraw = true;
       
		this.prevRes = null;
		
	}
	
	//inicijalizacija igrice - poziva se iz index.js
	init(){
		//kaci Draw na Game
		this.drawInstance = new Draw({
          ctx: this.ctx,
          FullTileEntities
        });

		jQuery(() => {
			//dozvoljava komunikaciju sa servervom bez reloadovanja stranice
			$.ajax({
				url: `http://${API_ROOT}/game?gameId=${this.gameId}&password=salamala`,
				dataType: "json",
				success: result => {					
					this.drawInstance = new Draw({
					ctx: this.ctx,
					FullTileEntities
				});
				var result1 = JSON.parse(result.gameState);
				
				this.update(result1); //result je json od servera
				
				
				
				if (result1.winner !== null) {
					this.showWinner(result1.winner);
				}
				
				requestAnimationFrame(this.draw.bind(this)); // bind vraca funkciju draw klase game, a prosledjuje joj Game
				},
				error: error => {
				
				}
			});
		});
	}	
	
	//postavlja sledeceg igraca, ne znam sto se zove isAcitve
	isActive(player, game) {
        return this.HP>0;
    }
	
	//update-uje klasu
	//TODO NPC-evi i promenljiv broj igraca
    update(game) {
		
        if (game.winner !== null) {
            this.shouldDraw = false;
			this.showWinner(game.winner);
        }
		
		//timer.text(game.turn);

		this.map = game.map.tiles;
		this.players[0] = game.player1;
		this.players[1] = game.player2;
		this.players[2] = game.player3;
		this.players[3] = game.player4;
		console.log(this.players[0]);
		
        const Player1Info = {
			_id: 1,
			active: this.isActive(game.player1, game),//ovo uvek vraca true, ne znam cemu sluzi
			...game.player1
        };
        const info2 = {
			_id: 2,
			
			active: this.isActive(game.player2, game),
			...game.player2
        };
        const info3 = {
			_id: 3,
			
			active: this.isActive(game.player3, game),
			...game.player3
        };
        const info4 = {
			_id: 4,
			
			active: this.isActive(game.player4, game),
			...game.player4
        };
		
		
		if (this.players.length) { 		
			/*
			this.players[0].update(Player1Info);
			this.players[1].update(info2);
			this.players[2].update(info3);
			this.players[3].update(info4);
			*/
			
        } else {
			// this.players = [
			// 	new Character(this.ctx, Player1Info),
			// 	new Character(this.ctx, info2),
			// 	new Character(this.ctx, info3),
			// 	new Character(this.ctx, info4),
			// 	new Character(this.ctx, info5),
			// 	new Character(this.ctx, info6)
			// ];
        }
		/*
		i=0
		for(element of players){
			if(elemet.health <= 0){
				element.refresh();
				players.splice(i,1);
			}
			i++;
		}
		*/
		//this.players.forEach(p => p.refresh())
	}
	
	draw(){
		if (this.ctx === null) {
			return;
        }
		
		this.drawInstance.drawMapBase();
		
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
		this.drawInstance.drawPlayer(convertCoordinates(this.players[0].r, this.players[0].q)[0],convertCoordinates(this.players[0].r, this.players[0].q)[1],0)
		this.drawInstance.drawPlayer(convertCoordinates(this.players[1].r, this.players[1].q)[0],convertCoordinates(this.players[1].r, this.players[1].q)[1],1);
		this.drawInstance.drawPlayer(convertCoordinates(this.players[2].r, this.players[2].q)[0],convertCoordinates(this.players[2].r, this.players[1].q)[1],2);
		this.drawInstance.drawPlayer(convertCoordinates(this.players[3].r, this.players[3].q)[0],convertCoordinates(this.players[3].r, this.players[1].q)[1],3);


		//this.players.forEach(p => p.refresh());
		

		if (this.shouldDraw || this.firstRender)  
			requestAnimationFrame(this.draw.bind(this));
        
		this.firstRender = false;
		this.drawInstance.drawBoss();
		
		
		
	}
	
	//winner pop-up
	async showWinner(winner) {
		console.log("uslo je u funkc");
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


