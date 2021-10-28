function printBoard(vel,ship) {
	console.clear();
	ctx.clearRect(0,0,c.width,c.height);
	ctx.putImageData(stars,0,0);
	ctx.beginPath();
	let board = "";
	let topboard = ""
	for (let ij = 0; ij < GrSz + 2; ij++) {
		topboard += "-"
	}
	board += topboard + "\n";
	for(let i = 0; i < GrSz; i++) {
		board += "|"
		for(let j = 0; j < GrSz; j++){
			board += ""
			let sV = squareValue(j,i,true,-1,false);
			drawShip(sV,j,i);
			sV = squareValue(j,i,false,-1,false);
			if (j == Cx && i == Cy) {
				let dir = ["X","🡡","🡥","🡢","🡦","🡣","🡧","🡠","🡤"];
				board += dir[Crot+1];
			} else {
				board += Player[sV];
			}
		}
		board += "|\n";
	}
	
	drawCursor();
	board += topboard;
	console.log(board);
	ctx.drawImage(g,0,0);
}

function squareValue(x,y,test,faction,num) {
	var state = "";
	var ships = [];
	let t = 0;
	let star = faction*(faction >= 0);
	let len = (ShipList.length)*(faction < 0) + (faction + 1)*(faction >= 0);
	for(let i = star; i < len; i++) {
		for(let j = 0; j < ShipList[i].length; j++) {
			if (isInArray(ShipList[i][j].Area,[x,y])) {
				if (test) {
					if (!num) {
						ships[ships.length] = [ShipList[i][j],i];
					} else {
						ships[ships.length] = j;
					}
				} else {
					t += (2**i);
					//console.log("T");
					break;
				}
			}		}
	}
	if (!test){
		state += t;
		return state;
	} else {
		return ships;
	}
}

//faction is a boolean based on whether or not we are doing a global list of one that is player faction specific
function shipPos(x,y,signal,faction) {
	let str = "";
	let t = squareValue(x,y,true,-1,false);
	//console.log(t);
	let f = [];
	for (let val = 0; val < t.length; val++) {
		//console.log(val);
		if (val == 0) {
			str += PlayCom[sFaction[t[val][1]]] + ": \n";
			f = [t[val][1],val];
		} else if (t[val - 1][1] != t[val][1]){
			str += PlayCom[sFaction[t[val][1]]] + ": \n";
			f = [t[val][1],val];
		}
		if(faction) {
			if (val - f[1] == signal && f[0] == pNumber) {
				str += ">";
			} else {
				str += " ";
			}
		} else {
			if (val == signal) {
				str += ">";
			} else {
				str += " ";
			}
		}
		str += t[val][0].getData(false,false) + "\n\n";
	}
	return str;
}

function initGrid() {
	//Stars
	ctx.strokeStyle = "#d0d0d0";
	ctx.fillStyle = "#d0d0d0";
	for(let i = 0; i < 300; i++) {
		let starsize = 2*(Math.random()**9);
		let xpos = c.width*Math.random();
		let ypos = c.height*Math.random();
		ctx.beginPath();
		ctx.moveTo(xpos,ypos);
		ctx.arc(xpos,ypos,starsize,0,2*Math.PI);
		ctx.fill();
		ctx.stroke();
	}
	stars = ctx.getImageData(0,0,c.width,c.height);
	//console.log("Stars");
	ctx.clearRect(0,0,c.width,c.height);
	//Grid
	ctg.beginPath();
	ctg.strokeStyle = "#404040";
	ctg.fillStyle = "#404040";
	ctg.lineWidth = 1;
	for(let i = 1; i < GrSz; i++) {
		ctg.beginPath();
		if (i%8 == 0) {
			ctg.strokeStyle = "#606060";
		} else {
			ctg.strokeStyle = "#404040";
		}
		ctg.moveTo(i*scx, 0);
		ctg.lineTo(i*scx, c.height);
		ctg.moveTo(0, i*scy);
		ctg.lineTo(c.width, i*scy);
		ctg.moveTo(i*scx, 0);
		ctg.lineTo(i*scx, c.height);
		ctg.moveTo(0, i*scy);
		ctg.lineTo(c.width, i*scy);
		ctg.stroke();
	}
	//console.log("Grid");
}

function drawShip(ships,x,y) {
	if(ships.length == 0){
		return;
	}
	ctx.beginPath();
	let factn = [];
	let preFaction = -1;
	let shType = -1;
	let shape = [0,""];
	let tRot = 0;
	for(let i = 0; i < ships.length; i++) {
		if (preFaction != ships[i][1]) {
			factn[factn.length] = ships[i][1];
		}
		if (shType < ships[i][0].type) {
			shType = ships[i][0].type;
			shape[0] = ships[i][1];
			shape[1] = ships[i][0].shape;
			tRot = ships[i][0].rot;
		}
		preFaction = ships[i][1];
	}
	if (factn.length == 1) {
		drawShape(x,y,shape[0],shape[1],ctx,tRot);
	} else {
		for (let i = 0; i < factn.length; i++) {
			//console.log(factn[i]);
			ctx.strokeStyle = FactColor[sFaction[factn[i]]];
			ctx.fillStyle = FactColor[sFaction[factn[i]]];
			ctx.fillRect(x*scx, (i/factn.length + y)*scy ,scx ,scy/factn.length);
			ctx.stroke();
		}
	}
}

function drawShape(x,y,faction,shape,place,rotation) {
	place.beginPath();
	place.strokeStyle = FactColor[sFaction[faction]];
	place.fillStyle = FactColor[sFaction[faction]];
	if (shape == "") {
		return;
	} else if (shape == "Rectangle") {
		place.moveTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*((rotation/4) - 1/6))),scy*((y +0.5)-0.5*Math.cos(Math.PI*((rotation/4) - 1/6))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*((rotation/4) + 1/6))),scy*((y +0.5)-0.5*Math.cos(Math.PI*((rotation/4) + 1/6))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(((rotation-4)/4) - 1/6))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(((rotation-4)/4) - 1/6))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(((rotation-4)/4) + 1/6))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(((rotation-4)/4) + 1/6))));
		place.closePath();
		place.fill();
		place.stroke();
		return;
	} else if(shape == "Square") {
		place.fillRect(x*scx,y*scy,scx,scy);
		place.stroke();
		place.beginPath();
		place.strokeStyle = "#ffffff";
		place.fillStyle = "#ffffff";
	} else if(shape == "Octagon") {
		place.moveTo(scx*((x +0.5)+0.5*Math.sin(0)),scy*((y +0.5)-0.5*Math.cos(0)));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(1/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(1/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(2/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(2/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(3/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(3/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(4/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(-4/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(-3/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(-3/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(-2/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(rotation-2/4))));
		place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(-1/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(-1/4))));
		place.closePath();
		place.fill();
		place.stroke();
		place.beginPath();
		place.strokeStyle = "#ffffff";
		place.fillStyle = "#ffffff";
	} else if(shape == "Circle") {
		console.log("aaaaaaaa");
		ctx.arc((x + 0.5)*scx, (y + 0.5)*scy, scx/2, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		place.beginPath();
		place.strokeStyle = "#ffffff";
		place.fillStyle = "#ffffff";
	}
	//Drawing Direction Triangle
	place.moveTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*(rotation/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*(rotation/4))));
	place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*((rotation+3)/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*((rotation+3)/4))));
	place.lineTo(scx*((x +0.5)+0.5*Math.sin(Math.PI*((rotation-3)/4))),scy*((y +0.5)-0.5*Math.cos(Math.PI*((rotation-3)/4))));
	place.closePath();
	place.fill();
	place.stroke();
}

function drawCursor() {
	ctx.beginPath();
	ctx.strokeStyle = "#808080";
	ctx.fillStyle = "#808080";
	ctx.arc((Cx + 0.5)*scx, (Cy + 0.5)*scy, scx/2, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	if (Crot != -1){
		ctx.beginPath();
		ctx.strokeStyle = "#ffffff";
		ctx.fillStyle = "#ffffff";
		let tx = Cx + 0.5 + Math.sin(Math.PI*(Crot/4))/2;
		let ty = Cy + 0.5 - Math.cos(Math.PI*(Crot/4))/2;
		console.log("tX: " + tx + " tY: " + ty);
		ctx.moveTo(tx*scx,ty*scy);
		let tRot = (Crot-4)/4;
		tx = Cx + 0.5 + Math.sin(Math.PI*(tRot-(1/4)))/2;
		ty = Cy + 0.5 - Math.cos(Math.PI*(tRot-(1/4)))/2;
		console.log("tX: " + tx + " tY: " + ty);
		ctx.lineTo(tx*scx,ty*scy);
		tx = Cx + 0.5 + Math.sin(Math.PI*(tRot+(1/4)))/2;
		ty = Cy + 0.5 - Math.cos(Math.PI*(tRot+(1/4)))/2;
		console.log("tX: " + tx + " tY: " + ty);
		ctx.lineTo(tx*scx,ty*scy);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
}

function dispData () {
	printBoard(false,0);
	let str = "";
	if (stage == 0.25) {
		str += ">" + Shiptypes[sFaction[pNumber]][Cmenu].Name;
		str += "\n\n HP: " + Shiptypes[sFaction[pNumber]][Cmenu].HP;
		str += "\n Accuracy: " + Shiptypes[sFaction[pNumber]][Cmenu].Acc;
		str += "\n Movement: " + Shiptypes[sFaction[pNumber]][Cmenu].Mov;
		str += "\n Defense: " + Shiptypes[sFaction[pNumber]][Cmenu].Def;
		str += "\n Size-X: " + Shiptypes[sFaction[pNumber]][Cmenu].SizeX;
		str += "\n Size-Y: " + Shiptypes[sFaction[pNumber]][Cmenu].SizeY;
		str += "\n Weapons: \n";
		for (let val of Shiptypes[sFaction[pNumber]][Cmenu].Weap) {
			if (val.Type == "Deploying") {
				str += "\tDeploys: " + val.Name + " \tNumber: " + val.Count + "\n";
			} else if (val.Type == "Defensive") {
				str += "\tType: " + val.Name + "\n";
				str += "\tNumber: " + val.Count + "\n";
				str += "\tWeapon Damage: " + val.Watk + "\n";
				str += "\tWeapon Range: " + val.Wran + "\n";
				str += "\tWeapon Accuracy: " + val.Whit + "\n";
				str += "\tDefense Coverage: " + val.Wcov + "\n";
				str += "\tDamage Range Modifier: " + val.WRatk + "\n";
				str += "\tAction Point Cost: " + val.APCost + "\n";
			} else {
				str += "\tType: " + val.Name + "\n";
				str += "\tNumber: " + val.Count + "\n";
				str += "\tWeapon Damage: " + val.Watk + "\n";
				str += "\tWeapon Range: " + val.Wran + "\n";
				str += "\tWeapon Accuracy: " + val.Whit + "\n";
				str += "\tDamage Range Modifier: " + val.WRatk + "\n";
				str += "\tAction Point Cost: " + val.APCost + "\n";
			}
		}
	} else if (stage == 0.5) {
		str = Shiptypes[sFaction[pNumber]][Cmenu].Name + "\nRotation: " + Crot;
	} else if (stage == 1.25) {
		let t = squareValue(Cx,Cy,true,pNumber,false);
		str = "> " + t[Cmenu][0].getData(true,true);
	} else if (stage == 2.8) {
		val = ShipList[pNumber][aShip[1]];
		str = ">";
		str += val.getWeapons(true,Cmenu);
	} else {
		switch (stage) {
			case 0:
				str = "Place Ships\n";
			break;
			
			case 1:
				str = "Select Ship to move\n";
			break;
			
			case 1.5:
				if (movType == 0) {
					str = "Movement Steps: " + ShipList[pNumber][movShip[1]].movData + "\n";
				} else {
					str = "Moved dX: " + (Cx - ShipList[pNumber][movShip[1]].oldx) + " dY: " + (Cy - ShipList[pNumber][movShip[1]].oldy) + "\n"; 
				}
			break;
			
			case 2:
				str = "Choose Ship to Attack with\nTotal Action Points: " + (curAP + actPoints[pNumber]) + "\tCurrent Action Points: " + curAP +"\n";
			break;
			
			case 2.4:
				str = "Choose Ship to Attack/Heal Choose your own ship for deploying\n";
			break;
		} 
		str += shipPos(Cx,Cy,Cmenu,(stage != 2.6));
		//console.log("AAAAAAAAA");
	}
	if (weaponFired == 1) {
		str += "\n" + weaponText;
		weaponFired = 0;
	}
	console.log(str);
	str = str.replace(/\n/g,"<br />");
	str = str.replace(/\t/g,"&emsp;");
	document.getElementById("Info").innerHTML = str;
}

function setDataOut(string) {
	//console.log(string);
	$("#OutBox").val(string);
}