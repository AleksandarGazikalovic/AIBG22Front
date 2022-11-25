export class Character {
	constructor(ctx, Player) { 
		this.ctx = ctx;

		this.id = Player.playerIdx;          
		this.index = this.id - 1; 
        this.q = Player.q;      
        this.r = Player.r;
		[this.x, this.y] = convertCoordinates(this.r, this.q);             
        
		this.prevQ = this.q;
		this.prevR = this.r;
		[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);             

		this.difX = 0;
		this.difY = 0;
		this.coefXY = 1;

		this.level  = Player.level;
		

		this.health = Player.health;
		this.power  = Player.power;
        this.deaths = Player.deaths;
		this.kills  = Player.kills;
        this.trapped = Player.trapped;
		this.angle = 0;
		this.rotated = true;
		this.moved = true;
		this.setInfoBox();			 	
	}

	updatePlayer(Player){
		this.id = Player.playerIdx;
		this.index = this.id - 1; 

		this.prevQ = this.q;
		this.prevR = this.r;
		[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);
		
        this.q = Player.q;             
        this.r = Player.r;
		[this.x, this.y] = convertCoordinates(this.r, this.q);    
		
		this.difX  = this.x - this.prevX;
		this.difY = this.y - this.prevY;
		if(this.difX!=0  || this.difY !=0){
			this.coefXY  = Math.abs(this.difX/this.difY);
		} else this.coefXY = 1;
		
        this.level  = Player.level;
		this.health = Player.health;
		this.power  = Player.power;
        this.deaths = Player.deaths;
		this.kills  = Player.kills;
        this.trapped = Player.trapped;
		this.difAngle = this.angle;
		this.angle = find_angle(this.prevR, this.prevQ, this.r, this.q);
		
		this.setInfoBox();		
		this.rotated = false;
		this.moved = false;

	}
	
	setInfoBox() {
		const div = document.querySelector(`.player${this.index+1}`);
		
		div.querySelector(".level").innerHTML = `${this.level}`;
		div.querySelector(".health").innerHTML = `${this.health}`;
		div.querySelector(".power").innerHTML = `${this.power}`;
		div.querySelector(".deaths").innerHTML = `${this.deaths}`;
		div.querySelector(".kills").innerHTML = `${this.kills}`;		
     }
}

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
	var angle =Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180/Math.PI;

	if(Cx < Bx){
		return 360-angle;
	} else return angle;
}