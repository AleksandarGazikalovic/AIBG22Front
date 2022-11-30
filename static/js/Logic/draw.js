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
    Fence300:   { index: 0 },
    Fence200:   { index: 1 },
    Fence100:   { index: 2 },
    WORMHOLE:   { index: 3 },
    BLACKHOLE:  { index: 4 }, 
	HEALTH :    { index: 5},
	EXPERIENCE: {index: 6}
};


export class Draw{
	constructor(ctx){
		window.ctx = ctx; 
	}

	drawRotatedPlayer(player){
		if(player.rotated == false){
			this.rotatePlayer(player);
		}		
		else if(player.moved == false){
			this.movePlayer(player);
		} else{
			ctx.save();
			ctx.translate(player.x+22,player.y+22);
			ctx.rotate(player.angle*Math.PI/180);
			ctx.drawImage(
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
		
		ctx.restore();	
		}
	}

	rotatePlayer(player){
			
		ctx.save();
		ctx.translate(player.prevX+22,player.prevY+22);
			ctx.rotate(player.difAngle*Math.PI/180);
			ctx.drawImage(
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
		ctx.restore();

		calculateAngle(player);
		
		

	}

	movePlayer(player){
		
		ctx.save();
		ctx.translate(player.x - player.difX+22, player.y - player.difY+22);
			ctx.rotate(player.angle*Math.PI/180);
			ctx.drawImage(
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
		
		ctx.restore();	
		calculateDifXY(player);
		
	}
	
	// Iscrtavanje podloge mape:
	drawMapBase(){
		ctx.drawImage(
			mapBase,
			-1,
			-3
		)
	};
	// Iscrtavanje Boss-a:
	drawBoss(){
		ctx.drawImage(
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
        ctx.drawImage(
            tileBorder, 
            x, 
            y
        );
    }
    // Ako ima entity poziva ovo:
	drawEntity(x, y, indexOfEntityType){
		angle +=0.005;
		ctx.save();
		ctx.translate(x+22,y+22);
		ctx.rotate(angle*Math.PI/180);
		ctx.drawImage(
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
		ctx.restore();
  	}
	drawAttackedTile(r, q){
		var [x,y] = convertCoordinates(r, q);
		//console.log(x,y);
		ctx.drawImage(
        	FullTileEntities,
        	0,
			44,
			44,
			44,
			x,
			y,
			44,
			44
    	); 
		//console.log(y, x);

	}

	drawLaserAttack(){
		(function () {
			var lastTime = 0;
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
			}
		
			if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				},
				timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		
			if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
		}());
		var t = 1;
		var vertices = [{x: 10,y: 10},{x: 100,y: 100 }];
		
		
		
		var points = calcWaypoints(vertices);
		animate();	
		ctx.lineWidth = 1;
		ctx.strokeStyle = "orange";
		function animate() {
			if (t < points.length - 1) {
				requestAnimationFrame(animate);
			}
			// draw a line segment from the last waypoint
			// to the current waypoint
			ctx.beginPath();
			ctx.moveTo(points[t - 1].x, points[t - 1].y);
			ctx.lineTo(points[t].x, points[t].y);
			ctx.stroke();
			// increment "t" to get the next waypoint
			t++;
		}
	}
		
}

function convertCoordinates(r, q){
	let x = 266 + (14+r)*19 + q*38;
	let y = (14 + r)*33;
	return [x,y];
}
function calculateAngle(player){
	if(Math.abs(player.angle - player.difAngle) > 2){
		var speed = 3;
		if(player.difAngle>=269 && player.angle<=91) {
			if(player.difAngle>360) {
				player.difAngle=player.difAngle-360;
			}
			player.difAngle = player.difAngle + speed;
			return;
		}
		if(player.angle>=269 && player.difAngle<=91) {
			if(player.difAngle<0) {
				player.difAngle=360+player.difAngle;
			}
			player.difAngle = player.difAngle - speed;
			return;
		}		
		if(player.angle > player.difAngle){
			player.difAngle = player.difAngle + speed;
			
		} else player.difAngle = player.difAngle - speed;
	} else player.rotated = true;
}
function calculateDifXY(player){
	var speed = 1;

	if(player.difX > 0){
		if(player.coefXY <1){
			player.difX = player.difX- player.coefXY*speed;
		} else player.difX = player.difX- speed;
	}
	if(player.difX < 0){
		if(player.coefXY <1){
			player.difX = player.difX +  player.coefXY*speed;
		} else player.difX = player.difX +  speed;
	}
	if(player.difY > 0 ){
		if(player.coefXY >1){
			player.difY = player.difY - player.coefXY*speed;
		} else player.difY = player.difY - speed;
		
	}
	if(player.difY < 0){
		if(player.coefXY >1){
			player.difY = player.difY + player.coefXY*speed;
		} else player.difY = player.difY + speed;
	}

	if(player.difX == 0 && player.difY == 0){
		player.moved = true;
	}
}

// Laser Attacks
function calcWaypoints(vertices) {
	var speed = 100;
    var waypoints = [];
    for (var i = 1; i < vertices.length; i++) {
        var pt0 = vertices[i - 1];
        var pt1 = vertices[i];
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        for (var j = 0; j < speed; j++) {
            var x = pt0.x + dx * j / speed;
            var y = pt0.y + dy * j / speed;
            waypoints.push({
                x: x,
                y: y
            });
        }
    }
    return (waypoints);
}


