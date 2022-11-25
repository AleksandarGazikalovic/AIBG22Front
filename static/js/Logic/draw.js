//Uploadovanje slika iz gif-a:

import PlayersURL from "../../gif/Players.png";
import MapBaseURL from "../../gif/MapBase.png";
import TileBorderURL from "../../gif/TileBorder.png"
import FullTileEntitiesURL from "../../gif/Tiles.png";
import BossURL from "../../gif/Boss.png";


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

var angle = 0;

// Tipovi entitija: =====================================================================================
const TileEntity = { // uzima delovi 1, drugi red kako to zna pitate se? ctrl f = 
    Fence300: { index: 0 },
    Fence200: { index: 1 },
    Fence100: { index: 2 },
    WORMHOLE: { index: 3 },
    BLACKHOLE:{ index: 4 }
};


export class Draw{
	
	constructor(ctx){
		this.ctx = ctx; 
	}

	drawRotatedPlayer(player){
		if(player.rotated == false){
			this.rotatePlayer(player);
		}		
		else if(player.moved == false){
			this.movePlayer(player);
		} else{
			var[x, y] = convertCoordinates(player.r, player.q);	
			this.ctx.save();
			this.ctx.translate(x+22,y+22);
			this.ctx.rotate(player.angle*Math.PI/180);
			this.ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
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
	}

	rotatePlayer(player){
		var[prevX, prevY] = convertCoordinates(player.prevR, player.prevQ);	
		this.ctx.save();
		this.ctx.translate(prevX+22,prevY+22);
			this.ctx.rotate(player.difAngle*Math.PI/180);
			this.ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
				0,				// source image start crop
				sPlayerW,		//source image width crop
				sPlayerW,       // source image 
				-22,
				-22,
				44,
				44
			)
		this.ctx.restore();
		
		if(Math.abs(player.angle - player.difAngle) > 2){
			if(player.difAngle>=269 && player.angle<=91) {
				if(player.difAngle>360) {
					player.difAngle=player.difAngle-360;
				}
				player.difAngle = player.difAngle + 3;
				return;
			}
			if(player.angle>=269 && player.difAngle<=91) {
				if(player.difAngle<0) {
					player.difAngle=360+player.difAngle;
				}
				player.difAngle = player.difAngle - 3;
				return;
			}		
			if(player.angle > player.difAngle){
				player.difAngle = player.difAngle + 3;
				
			} else player.difAngle = player.difAngle - 3;
		} else player.rotated = true;

	}

	movePlayer(player){
		
		this.ctx.save();
		this.ctx.translate(player.x - player.difX+22, player.y - player.difY+22);
			this.ctx.rotate(player.angle*Math.PI/180);
			this.ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
				0,				// source image start crop
				sPlayerW,		//source image width crop
				sPlayerW,       // source image 
				-22,
				-22,
				44,
				44
			)
		
		this.ctx.restore();	
		
		if(player.difX > 0){
			if(player.coefXY <1){
				player.difX = player.difX- player.coefXY*1;
			} else player.difX = player.difX- 1;
		}
		if(player.difX < 0){
			if(player.coefXY <1){
				player.difX = player.difX +  player.coefXY*1;
			} else player.difX = player.difX +  1;
		}
		if(player.difY > 0 ){
			if(player.coefXY >1){
				player.difY = player.difY - player.coefXY*1;
			} else player.difY = player.difY - 1;
			
		}
		if(player.difY < 0){
			if(player.coefXY >1){
				player.difY = player.difY + player.coefXY*1;
			} else player.difY = player.difY + 1;
		}

		if(player.difX == 0 && player.difY == 0){
			player.moved = true;
		}
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
                if(entity.health >100 && entity.health <= 200){
                    entityType = TileEntity['Fence200'];
                }
                if(entity.health <= 100 ){
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
		angle +=0.005;
		this.ctx.save();
		this.ctx.translate(x+22,y+22);
		this.ctx.rotate(angle*Math.PI/180);
		this.ctx.drawImage(
        	FullTileEntities,
        	sTileW * indexOfEntityType,
			0, 
			sTileW, 
			sTileH,
        	-22, 
        	-22, 
        	dTileW, 
        	dTileH
    	);
		this.ctx.restore();
  	}

}

function convertCoordinates(r, q){
	let x = 266 + (14+r)*19 + q*38;
	let y = (14 + r)*33;
	return [x,y];
}

