//Ship Class V2
class Ship {
	constructor(faction, type, X, Y, R) {
		//console.log("Faction: " + faction + " T: " + type);
		this.ShipType = Shiptypes[faction][type].Name;
		this.HP = Shiptypes[faction][type].HP;
		this.Acc = Shiptypes[faction][type].Acc;
		this.Def = Shiptypes[faction][type].Def;
		this.Mov = Shiptypes[faction][type].Mov;
		this.Weap = $.extend(true, [], Shiptypes[faction][type].Weap);
		this.Weap[this.Weap.length] = {Name: "Wait", Type:"Wait", Count:Infinity, Watk: 0, Whit: 0, Wran: 0, WRatk: 0, APCost:1}
		this.sX = Shiptypes[faction][type].SizeX;
		this.sY = Shiptypes[faction][type].SizeY;
		this.shape = Shiptypes[faction][type].Shape;
		this.faction = faction;
		this.type = type;
		this.x = X;
		this.y = Y;
		this.rot = R;
		this.dX = 0;
		this.dY = 0;
		this.oldHP = this.HP;
		this.maxHP = this.HP;
		this.oldx = X;
		this.oldy = Y;
		this.oldR = R;
		this.odX = 0;
		this.odY = 0;
		this.defensive = -1;
		this.checkDefenses();
		this.Area = [];
		this.reArea();
		console.log("Area: " + this.Area);
		this.movData = "";
		this.shipmoved = 0;
	}
	getPos(old, delta) {
		let x = 0;
		let y = 0;
		let rot = 0;
		if(old) {
			let x = this.oldx;
			let y = this.oldy;
			let rot = this.rot;
			if (delta) {
				x += this.odX;
				y += this.odY;
				//rot += this.dR[0] - this.dR[1];
				//rot = rot - 8*(rot >= 8) + 7*(rot < 0);
			}
		} else {
			x = this.x;
			y = this.y;
			rot = this.rot;
			if (delta) {
				x += this.dX;
				y += this.dY;
				//rot += this.dR[0] - this.dR[1];
				//rot = rot - 8*(rot >= 8) + 7*(rot < 0);
			}
		}
		return [x,y,rot];
	}

	getData(alldata,weapData) {
		let str = "";
		str += this.ShipType;
		str += "\n HP: " + this.HP;
		if(alldata) {
			str += "\n Accuracy: " + this.Acc;
			str += "\n Movement: " + this.Mov;
			str += "\n Defense: " + this.Def;
			str += "\n Size-X: " + this.sX;
			str += "\n Size-Y: " + this.sY;
		}
		if (weapData) {
			str += "\n Weapons: \n";
			for (let i = 0; i < this.Weap.length; i++) {
				let val = this.Weap[i];
				if (val.Type == "Deploying") {
					str += "\tDeploys: " + val.Name + " Number: " + val.Count + "\n";
				} else if (val.Type == "Defensive") {
					str += "\tType: " + val.Name;
					str += "\tNumber: " + val.Count + "\n";
					if (alldata) {
						str += "\tWeapon Damage: " + val.Watk + "\n";
						str += "\tWeapon Range: " + val.Wran + "\n";
						str += "\tWeapon Accuracy: " + val.Whit + "\n";
						str += "\tDefense Coverage: " + val.Wcov + "\n";
						str += "\tDamage Range Modifier: " + val.WRatk + "\n";
						str += "\tAction Point Cost: " + val.APCost + "\n";
					}
				} else if (val.Type == "Ramming"){
					str += "\tType: " + val.Name + "\n";
					if (alldata) {
						str += "\tWeapon Damage: " + val.Watk + "\n";
						str += "\tWeapon Accuracy: " + val.Whit + "\n";
						str += "\tAction Point Cost: " + val.APCost + "\n";
					}
				} else {
					str += "\tType: " + val.Name;
					str += "\tNumber: " + val.Count + "\n";
					if (alldata) {
						str += "\tWeapon Damage: " + val.Watk + "\n";
						str += "\tWeapon Range: " + val.Wran + "\n";
						str += "\tWeapon Accuracy: " + val.Whit + "\n";
						str += "\tDamage Range Modifier: " + val.WRatk + "\n";
						str += "\tAction Point Cost: " + val.APCost + "\n";
					}
				}
			}
		}
		return str;
	}
	//reMove is for if the ship has been re-moved during Move Phase
	moveShip (nX,nY,rota) {
		this.dX = nX - this.oldx;
		this.dY = nY - this.oldy;
		this.rot = rota;
		this.x = this.oldx + this.dX;
		this.y = this.oldy + this.dY;
		this.reArea();
		this.shipmoved = 1;
	}
	
	addMovData(strnum) {
		let movStr = ["+","-","L","R"];
		let revMovStrs = ["-","+","R","L"];
		if (this.movData.slice(-1) == revMovStrs[strnum]) {
			this.removeMovData();
		} else {
			this.movData += movStr[strnum];
		}
	}
	
	removeMovData() {
		this.movData = this.movData.slice(0,this.movData.length - 1);
	}
	//This is to check if a ship can move this distance
	canMove(movType, addmovStrin, dx, dy) {
		let movStr = ["+","-","L","R"];
		let revMovStrs = ["-","+","R","L"];
		let cMove = false;
		if (movType == 0) {
			if (this.movData.length == 0 && this.Mov != 0) {
				 cMove = true;
			} else  if (this.Mov == 0) {
				cMove = false;
			} else if (this.movData.slice(-1) == revMovStrs[addmovStrin]) {
				cMove = true;
			} else {
				this.addMovData(addmovStrin);
				cMove = Math.ceil(this.movData.replace(/[+-]/g,"AAAA").length/4) <= this.Mov;
				this.removeMovData();
			}
		} else if (movType == 1) {
			cMove = (dx+dy) <= this.Mov;
		}
		return cMove
	}
	//This replaces the oldx,y and odX/odY with its new values
	officializeMove (moveType) {
		if (this.shipmoved == 0) {
			this.x = this.oldx + this.dX;
			this.y = this.oldy + this.dY;
			this.reArea();
		}
		this.oldx = this.x;
		this.oldy = this.y;
		this.oldR = this.rot;
		if (moveType == 1) {
			this.dX = 0;
			this.dY = 0;
		}
		this.odX = this.dX;
		this.odY = this.dY;
		this.movData = "";
	}
	//Getting Weapon Data
	getWeapons(alldata, number) {
		let str = "";
		let opening = number*(number != -1);
		let ending = (this.Weap.length - 1)*(number == -1) + opening + 1;
		for (let i = opening; i < ending; i++) {
			let val = this.Weap[i];
			if (val.Type == "Deploying") {
				str += "\tDeploys: " + val.Name + " Number: " + val.Count + "\n";
			} else if (val.Type == "Defensive") {
				str += "\tType: " + val.Name;
				str += "\tNumber: " + val.Count + "\n";
				if (alldata) {
					str += "\tWeapon Damage: " + val.Watk + "\n";
					str += "\tWeapon Range: " + val.Wran + "\n";
					str += "\tWeapon Accuracy: " + val.Whit + "\n";
					str += "\tDefense Coverage: " + val.Wcov + "\n";
					str += "\tDamage Range Modifier: " + val.WRatk + "\n";
					str += "\tAction Point Cost: " + val.APCost + "\n";
				}
			} else if (val.Type == "Ramming"){
				str += "\tType: " + val.Name + "\n";
				if (alldata) {
					str += "\tWeapon Damage: " + val.Watk + "\n";
					str += "\tWeapon Accuracy: " + val.Whit + "\n";
					str += "\tAction Point Cost: " + val.APCost + "\n";
				}
			} else {
				str += "\tType: " + val.Name;
				str += "\tNumber: " + val.Count + "\n";
				if (alldata) {
					str += "\tWeapon Damage: " + val.Watk + "\n";
					str += "\tWeapon Range: " + val.Wran + "\n";
					str += "\tWeapon Accuracy: " + val.Whit + "\n";
					str += "\tDamage Range Modifier: " + val.WRatk + "\n";
					str += "\tAction Point Cost: " + val.APCost + "\n";
				}
			}
		}
		return str;
	}
	
	canFire(weapon){
		return this.Weap[weapon].Count > 0;
	}
	//Attack is for decreasing count or similar
	attack(weapon, undo) {
		let aWeap = this.Weap[weapon];
		if (undo) {
			switch (aWeap.Type) {
			case "Generic":
				aWeap.Count += 1;
			break;
			
			case "Missile":
				aWeap.Count += 1;
			break;
			
			case "Defensive":
				aWeap.Count += 1;
			break;
			
			case "Deploying":
				aWeap.Count += 1;
			break;
			
			case "Healing":
				aWeap.Count += 1;
			break;
			
			case "Ramming":
				//aWeap.Count += 1;
			break;
			
			case "Destruct":
				this.HP = aWeap.Count;
				aWeap.Count = 1;
				this.reArea();
			break;
		}
		} else {
			switch (aWeap.Type) {
			case "Generic":
				aWeap.Count -= 1;
			break;
			
			case "Missile":
				aWeap.Count -= 1;
			break;
			
			case "Defensive":
				aWeap.Count -= 1;
			break;
			
			case "Deploying":
				aWeap.Count -= 1;
			break;
			
			case "Healing":
				aWeap.Count -= 1;
			break;
			
			case "Ramming":
				
			break;
			
			case "Destruct":
				aWeap.Count = this.HP;
				this.HP = 0;
				this.reArea();
			break;
			}
		}
		this.reArea();
		//Returns the Weapon and Acc if it can
		return [aWeap,this.Acc];
	}
	//wType is for subtracting from defensive weapons
	defend(damage, wType, undo) {
		if (wType == "Missile" && this.defensive != -1) {
			this.Weap[defensive] += 2*undo -1;
			checkDefenses();
		} else if (wType == 'Healing') {
			damage = -damage;
		}
		this.HP += (2*undo -1)*damage;
		if (this.HP > this.maxHP) this.HP = this.maxHP;
	}
	//return Ship defenses, so [Def, Mov, defensive]
	getDefenses() {
		return [this.Def, this.Mov, this.defensive];
	}
	//Check if any defensive weapons are fully loaded
	checkDefenses() {
		this.defensive = -1;
		for(let d = 0; d < this.Weap.length; d++) {
			if (this.Weap[d].type == "Defensive" && this.Weap[d].Count > 0) {
				this.defensive = d;
			}
		}
		return this.Weap[this.defensive];
	}
	//Redo do reArea soon
	reArea(){
		this.Area = [];
		if (this.HP != 0) {
			let xcent = this.x + 0.5;
			let ycent = -(this.y + 0.5);
			//console.log("XCent: " + xcent + "\nYCent: " + ycent);
			let ix = 0;
			let iy = 0;
			let lines = [[],[],[],[]];
			let pTheta = -(Math.PI*this.rot)/4;
			let eVen = 1 - ((this.sX * this.sY)%2);
			//console.log("Even: " + eVen);
			let rTheta = Math.PI*(this.rot-((1-(this.sX%2))+this.sY%2))/4;
			xcent -= (eVen*Math.sign(Math.round(Math.sin(rTheta))))/2;
			ycent -= (eVen*Math.sign(Math.round(Math.cos(rTheta))))/2;
			console.log(Math.cos(rTheta));
			//console.log("XCent: " + xcent + "\nYCent: " + ycent);
			let thetan = Math.atan(this.sY/this.sX);
			let hypo = (Math.sqrt(this.sX**2 + this.sY**2))/2;
			let rectPoints = [[xcent + hypo*Math.cos(Math.PI - thetan + pTheta),-(ycent + hypo*Math.sin(Math.PI - thetan + pTheta))],
							  [xcent + hypo*Math.cos(thetan + pTheta),-(ycent + hypo*Math.sin(thetan + pTheta))],
							  [xcent + hypo*Math.cos(0 - thetan + pTheta),-(ycent + hypo*Math.sin(0 - thetan + pTheta))],
							  [xcent + hypo*Math.cos(Math.PI + thetan + pTheta),-(ycent + hypo*Math.sin(Math.PI + thetan + pTheta))]];
			//console.log("rectPoints: " + rectPoints);
			var xLeft = 1000;
			var xRight = -1;
			var yLeft = 1000;
			var yRight = -1;
			for(ix = 0; ix < rectPoints.length; ix++) {
				iy = ix + 1;
				if (rectPoints[ix][0] < xLeft) {
					xLeft = Math.floor(rectPoints[ix][0]);
				}
				if (rectPoints[ix][0] > xRight) {
					xRight = Math.ceil(rectPoints[ix][0]);
				}
				if (rectPoints[ix][1] < yLeft) {
					yLeft = Math.floor(rectPoints[ix][1]);
				}
				if (rectPoints[ix][1] > yRight) {
					yRight = Math.ceil(rectPoints[ix][1]);
				}
				if (iy == 4) {iy = 0;}
				lines[ix][1] = rectPoints[ix][0];
				lines[ix][2] = rectPoints[ix][1];
				lines[ix][0] = (rectPoints[iy][1]-rectPoints[ix][1])/(rectPoints[iy][0]-rectPoints[ix][0]);
			}
			//console.log("xLeft: " + xLeft + " xRight: " + xRight);
			for(ix = xLeft; ix <= xRight; ix++) {
				for(iy = yLeft; iy <= yRight; iy++) {
					let val = isInBox(lines,ix + 0.5,iy + 0.5,xcent,-ycent)
					if (val) {
						this.Area[this.Area.length] = [ix,iy];
					}
				}
			} 
			//console.log(this.Area);
		}
	}
};

//IsInBox time
function isInBox(lines, x, y, xcen, ycen) {
	let inBox = true;
	//console.log("Lines: " + lines + "\nXY: " + [x,y]);
	if (lines[0][0] == 0) {
		if(lines[0][2] > lines[2][2]) {
			inBox = (lines[0][2] > y && lines[2][2] < y ) && (lines[1][1] < x &&lines[3][1] > x );
		} else {
			inBox = (lines[0][2] < y && lines[2][2] > y ) && (lines[1][1] > x &&lines[3][1] < x );
		}
		return inBox;
	} else if(!isFinite(lines[0][0])) {
		if(lines[1][2] > lines[3][2]) {
			inBox = (lines[1][2] > y && lines[3][2] < y ) && (lines[2][1] < x &&lines[0][1] > x );
		} else {
			inBox = (lines[1][2] < y && lines[3][2] > y ) && (lines[2][1] > x &&lines[0][1] < x );
		}
		return inBox;
	}
	let ylist = [];
	let xlist = [];
	for(iy = 0; iy < 4; iy++) {
		xlist[iy] = (y - lines[iy][2])/lines[iy][0] +lines[iy][1];
		ylist[iy] = (x - lines[iy][1])*lines[iy][0] + lines[iy][2];
	}
	let xleft = -1000;
	let xright = 1000;
	let yleft = -1000;
	let yright = 1000;
	for(let val of xlist) {
		if (val > xleft && val <= xcen) {
			xleft = val;
		}
		if (val < xright && val >= xcen) {
			xright = val;
		}
	}
	for(let val of ylist) {
		if (val > yleft && val <= ycen) {
			yleft = val;
		}
		if (val < yright && val >= ycen) {
			yright = val;
		}
	}
	inBox = (xleft < x && xright > x) && (yleft < y && yright > y);
	//console.log(/*"xList: " + xlist + "\nyList: " + ylist + */"\nxLR: " + [xleft,xright] + "\nyLR: " + [yleft,yright] + "\nInBox: "+ inBox);
	return inBox;
}

function arrEqual(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return false;
	}
	let valout = true;
	for (let i = 0; i < arr1.length; i++) {
		if(arr1[i] != arr2[i]) {
			valout = false;
			break;
		}
	}
	return valout;
}

function isInArray(arr1,arr2) {
	for(let k =0; k < arr1.length; k++) {
		if (arrEqual(arr1[k],arr2)) {
			return true;
		}
	}
	return false;
}

function updateSelector(sel) {
	if (sel == "Player" || sel == "PlayCo") {
		if (stage < 0) stage = 0;
		if ($("#Player").val() == 4) {
			stage = -1;
		}else if ($("#Player").val() >= $("#PlayCo").val()) {
			$("#Player").val(Number($("#PlayCo").val()) - 1);
		}
		let temp = sFaction[pNumber];
		sFaction[pNumber] = sFaction[Number($("#Player").val())];
		sFaction[Number($("#Player").val())] = temp;
		pNumber = Number($("#Player").val());
		hideThings();
	} else if (sel == "Faction") {
		sFaction[pNumber] = $("#Faction").val();
		dispData();
		updateDataString();
		//console.log(sFaction);
	} else if (sel == "Mov" && stage < 1) {
		movType = $("#MovStyl").val();
	} else if (sel == "Load" && $("#Saves").val() != -1 && save) {
		stage = 0;
		let storeData = JSON.parse(localStorage.getItem(Number($("#Saves").val())));
		storedPlayer = [0,0,0,0];
		for (let i = 0; i < storeData.length; i++) {
			for (let f = 0; f < storeData[i].length; f++) {
				if (storeData[i][f].length > 0) {
					inputDataString(f,storeData[i][f]);
				}
			}
			storedPlayer = [0,0,0,0];
		} 
	}
}

function hideThings () {
	playerCount = Number($("#PlayCo").val());
	//console.log(pNumber);
	$("#GridHome").hide();
	$("#P0").hide();
	$("#P1").hide();
	$("#P2").hide();
	$("#P3").hide();
	if (pNumber != 0) $("#P0").show();
	if (pNumber != 1) $("#P1").show();
	if (playerCount > 2 && pNumber != 2) $("#P2").show();
	if (playerCount > 3 && pNumber != 3) $("#P3").show();
}

function scrResize () {
	let inx = window.innerWidth;
	let iny = window.innerHeight;
	let root = document.querySelector(':root');
	console.log(inx);
	console.log(iny + "\n")
	if(inx > iny) {
		console.log("Inx>Iny");
		root.style.setProperty('--ButtonsX', '800px');
		root.style.setProperty('--ButtonsY', '250px');
		root.style.setProperty('--BGridL', '0px');
		root.style.setProperty('--BGridT', '0px');
		root.style.setProperty('--BGridH', '30px');
		root.style.setProperty('--BGridW', '30px');
	} else {
		console.log("Iny>Inx");
		root.style.setProperty('--ButtonsX', '305px');
		root.style.setProperty('--ButtonsY', '900px');
		root.style.setProperty('--BGridL', '0px');
		root.style.setProperty('--BGridT', '0px');
		root.style.setProperty('--BGridH', '50px');
		root.style.setProperty('--BGridW', '50px');
	}
}

function updateHTML() {
	var select = document.getElementById("Faction");
	for (let i = openingFaction; i < endingFaction; i++) {
		select.options[i] = new Option(PlayCom[i], i, false, false);
	}
	select = document.getElementById("Saves") 
	select.options[0] = new Option("New Game", -1, false, false);
	if (typeof(Storage) !== "undefined") {
		id = JSON.parse(localStorage.getItem("Saves"));
		if (id == null) id = [];
		for (let i = 0; i < id.length; i++){
			select.options[i + 1] = new Option(id[i], i, false, false);
		}
	} else {
		$("#SaveHame").placeholder = "Sorry, your browser does not support Web Storage...";
		save = false;
	}
}

function sum(tot,next) {
	return tot + next;
}

function menuToggle() {
	menuState = !menuState;
	if (!menuState) {
		$("#MenuOptions").hide();
		document.getElementById("MenuButton").innerHTML = "Menu >";	
	} else {
		$("#MenuOptions").show();
		document.getElementById("MenuButton").innerHTML = "Menu v";
	} 
}
//Variables
//Set Grid size to 32 and Cursor position to 0,0
var GrSz = 32;
var Cx = 0;
var Cy = 0;
var Crot = -1;
var Cmenu = -1;
var CmenuLength = 0;
var temC = [0,0,0];
var stage = 0;
var save = true;
var id;
var menuState = true;
//var cursorBlink;
//var cursorVisable = 0;

//Grid Stuff
var c = document.getElementById("BoardControl");
var g = document.getElementById("GridHome");
//var caneasel = new createjs.Stage("BoardControl");
var ctx = c.getContext("2d");
var ctg = g.getContext("2d");
var scx = c.width/GrSz;
var scy = c.height/GrSz;
var grid;
var stars;

//The Ship List is an array of arrays of ships
var ShipList = [[],[],[],[]];
//Moving, Attacking, and Defending Ships
var movShip;
var aShip;
var dShip;
var attackList = [];
var weaponFired = 0;
var weaponText = "";
//Creating Save Data
var storedData = [["",""]];
var storedPlayer = [0,0,0,0];
var storeNum = 0;

var Board = new Array(GrSz);
var pNumber = 0;
var playerCount = 2;
var sFaction = [0,0,0,0];
var actPoints = [0,0,0,0];
var subAP = 0;
var curAP =0;

//Sound Files
var mov = document.getElementById("move");
var press = document.getElementById("press");
var back = document.getElementById("back");

// movType 0 = Good & 1 = Naval
var movType = 0;
var tMovData = "";
//Data Strings
var movStr = "u        u";
var dString = "";
var dStringIn = "";
var str = "";