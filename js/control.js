function moveCursor(dx,dy) {
	let a = false;
	if (stage == -1 || stage == 0 || stage == 1 || stage == 2 || stage == 2.4 || stage == 2.85 || stage == 2.9) {
		Cx += dx;
		Cy += dy;
		Cx += 1*(Cx < 0) - 1*(Cx >= GrSz);
		Cy += 1*(Cy < 0) - 1*(Cy >= GrSz);
	} else if (stage == 0.25 || stage == 1.25 || stage == 2.2 || stage == 2.6 || stage == 2.8) {
		Cmenu += dy;
		Cmenu += (CmenuLength)*(Cmenu < 0) - Cmenu*(Cmenu >= CmenuLength);
	} else if (stage == 0.5) {
		Crot = (8 - 4*Math.sign(dy + 1)+(4*Math.atan(-dx/dy)/Math.PI))%8;
	} else if (stage == 1.5 && movType == 0 && Math.abs(dx) + Math.abs(dy) < 2 && Math.abs(dx) + Math.abs(dy) > 0) {
		let temp = ((dy + 3)/2)*(dx == 0) + (((dx + 3)/2) + 2)*(dy == 0) - 1;
		//console.log(movDaText);
		if (ShipList[pNumber][movShip[1]].canMove(movType,temp,0,0)) {
				let tRot = (Crot*Math.PI)/4
				Cx += Math.sign(Math.round(Math.sin(tRot)))*Math.sign(-dy);
				Cy += Math.sign(Math.round(Math.cos(tRot)))*Math.sign(dy);
				Crot += dx;
				Crot = Crot - 8*(Crot >= 8) + 8*(Crot < 0);
			ShipList[pNumber][movShip[1]].addMovData(temp);
		}
	} else if (stage == 1.5 && movType == 1) {
		Cx += dx;
		Cy += dy;
		Cx += 1*(Cx < 0) - 1*(Cx > GrSz);
		Cy += 1*(Cy < 0) - 1*(Cy > GrSz);
		if (!ShipList[pNumber][movShip[1]].canMove(movType,"",Cx,Cy)) {
			Cx -= dx;
			Cy -= dy;
		}
	} else if (stage == 2.6) {
		Cmenu += dy;
		let tem = squareValue(Cx,Cy,true,-1,false).length;
		Cmenu += (tem)*(Cmenu < 0) - Cmenu*(Cmenu >= tem);
	}else if (stage == 2.8) {
		Cmenu += dy;
		let tem = 
		Cmenu += (tem)*(Cmenu < 0) - Cmenu*(Cmenu >= tem);
	}
	dispData();
	if (stage == 1.5) {
		let movDa = ["+","-","L","R"];
		console.log(ShipList[pNumber][movShip[1]].movData);
	}
	//mov.load();
	mov.play();
}

function pressButton() {
	if (stage == 0) {
		stage = 0.25;
		Cmenu = temC[1];
		CmenuLength = Shiptypes[sFaction[pNumber]].length;
		dispData();
	} else if (stage == 0.25) {
		stage = 0.5;
		Crot = temC[2];
		dispData();
	} else if (stage == 0.5) {
		temC[2] = Crot;
		temC[1] = Cmenu;
		placeShip(Cmenu,Cx,Cy,Crot);
		Crot = -1;
		Cmenu = -1;
		stage = 0;
		dispData();
		updateDataString();
	} else if (stage == 1 && (Math.floor(squareValue(Cx,Cy,false,-1,false)/(2**pNumber))%2) == 1) {
		CmenuLength = squareValue(Cx,Cy,true,pNumber,false).length;
		stage = 1.25;
		Cmenu = 0;
		if (CmenuLength == 1) {
			pressButton();
			console.log("Movin");
		}
		dispData();
	} else if (stage == 1.25) {
		movShip = [pNumber,squareValue(Cx,Cy,true,pNumber,true)[Cmenu]];
		stage = 1.5;
		tMovData = ShipList[movShip[0]][movShip[1]].movData;
		console.log("Moving");
		if (ShipList[pNumber][movShip[1]].shipmoved == 1) {
			temC = [Cx,Cy,-1];
			let PosData = ShipList[pNumber][movShip[1]].getPos(false,false);
			Cx = PosData[0];
			Cy = PosData[1];
			Crot = PosData[2];
			console.log("Huh?")
		}else { 
			temC = [Cx,Cy,-1];
			//console.log(temC);
			let PosData = ShipList[pNumber][movShip[1]].getPos(false,true);
			Cx = PosData[0];
			Cy = PosData[1];
			Crot = PosData[2];
			console.log([Cx,Cy]);
		}
		Cmenu = -1;
		dispData();
	} else if (stage == 1.5) {
		stage = 1;
		ShipList[pNumber][movShip[1]].moveShip(Cx,Cy,Crot);
		Cx = temC[0];
		Cy = temC[1];
		Crot = temC[2];
		dispData();
		updateDataString();
	} else if (stage == 2 && curAP > 0 && (Math.floor(squareValue(Cx,Cy,false,-1,false)/(2**pNumber))%2) == 1) {
		CmenuLength = squareValue(Cx,Cy,true,pNumber,false).length;
		stage = 2.2;
		Cmenu = 0;
		if (CmenuLength == 1) {
			pressButton();
		}
		dispData();
	} else if (stage == 2.2) {
		aShip = [pNumber,squareValue(Cx,Cy,true,pNumber,true)[Cmenu]];
		stage = 2.4;
		Cmenu = -1;
		dispData();
	} else if (stage == 2.4 && (squareValue(Cx,Cy,false,-1,false) > 0)) {
		CmenuLength = squareValue(Cx,Cy,true,-1,false).length;
		stage = 2.6;
		Cmenu = 0;
		if (CmenuLength == 1) {
			pressButton();
		}
		dispData();
	} else if (stage == 2.6) {
		dShip = [squareValue(Cx,Cy,true,-1,false)[Cmenu][1],squareValue(Cx,Cy,true,-1,true)[Cmenu]];
		CmenuLength = ShipList[pNumber][aShip[1]].Weap.length;
		stage = 2.8;
		Cmenu = 0;
		dispData();
	} else if (stage == 2.8) {
		if (ShipList[aShip[0]][aShip[1]].canFire(Cmenu)) {
			stage = 2;
			attackShip(aShip,dShip,Cmenu,-1,false);
			Cmenu = -1;
		}
		dispData();
	} else if (stage == 2 && (Math.floor(squareValue(Cx,Cy,false,-1,false)/(2**pNumber))%2) == 1) {
		stage = 2.85;
		dispData();
	} 
	press.play();
	console.log("Pressed");
	updateDataString();
}

function goback() {
	if (stage == 0) {
		ShipList[pNumber].pop();
	} else if (stage == 0.25) {
		stage = 0;
		Cmenu = -1;
	} else if (stage == 0.5) {
		stage = 0.25
		Crot = -1;
	} else if (stage == 1.25) {
		stage = 1;
		Cmenu = -1;
	} else if (stage == 1.5) {
		stage = 1;
		ShipList[movShip[0]][movShip[1]].movData = tMovData;
		Cx = temC[0];
		Cy = temC[1];
		Crot = temC[2];
	} else if ((stage == 2 || stage == 2.9) && dString.length > 0) {
		let temp = attackList[attackList.length - 1];
		attackShip([pNumber,temp[0]],[temp[2],temp[3]],temp[1],temp[4],true);
		dString = dStrin.slice()
		//curAP += 1;
		weaponFired = 0;
	} else if (stage < 2.9) {
		stage = 2;
		Cmenu = -1;
	}
	dispData();
	back.play();
}

function destroyShips() {
	for (let f = 0; f < ShipList.length; f++) {
		for (let s = 0; s < ShipList[f].length; s++) {
			if ((ShipList[f][s].x > (GrSz - 1) || ShipList[f][s].x < 0) || (ShipList[f][s].y > (GrSz - 1) || ShipList[f][s].y < 0) || (ShipList[f][s].HP < 0)) {
				ShipList[f].splice(s,1);
			}
		}
	}
}

function placeShip(shipType,x,y,r) {
	ShipList[pNumber][ShipList[pNumber].length] = new Ship(sFaction[pNumber],shipType,x,y,r);
}

function movAllShips() {
	for (let f = 0; f < ShipList.length; f++) {
		for(let s = 0; s < ShipList[f].length; s++) {
			ShipList[f][s].officializeMove(movType);
		}
	}
}

function unmoveShips() {
	for (let f = 0; f < ShipList.length; f++) {
		for(let s = 0; s < ShipList[f].length; s++) {
			ShipList[f][s].shipmoved = 0;
		}
	}
}

function setOlHP() {
	for (let f = 0; f < ShipList.length; f++) {
		for(let s = 0; s < ShipList[f].length; s++) {
			ShipList[f][s].oldHP = ShipList[f][s].HP;
		}
	}
}
//hit is the actual state of the hit 0,1,2
function attackShip(aShip,dShip,weap,hit,undo) {
	let atShip = ShipList[aShip[0]][aShip[1]];
	let atadata = atShip.attack(weap,undo);
	aWeap = atadata[0];
	let deShip;
	if (!(aWeap.Type == "Deploying" || aWeap.Type == "Destruct")) deShip = ShipList[dShip[0]][dShip[1]];
	let defdata;
	if (!(aWeap.Type == "Deploying" || aWeap.Type == "Destruct")) defdata = deShip.getDefenses();
	//hhhhhhhhhhhhhh
	if (aShip[0] == pNumber) {
		curAP += aWeap.APCost*(2*undo - 1);
	}
	if (hit == -1) {
		if (aWeap.Type == "Deploying") {
			hit = atShip.rot;
			dShip = [Cx,Cy];
			attackList[attackList.length] = [pNumber,aShip[1],Cmenu,Cx,Cy,hit];
		} else if (aWeap.Type == "Healing") {
			let dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y)
			hit = 2*(dist <= 1)
			attackList[attackList.length] = [pNumber,aShip[1],weap,dShip[0],dShip[1],hit];
		} else if (aWeap.Type == "Destruct") {
			let hitSList = [[],[],[]];
			let wRan = aWeap.Wran;
			let wHit = aWeap.Whit;
			let acc = atadata[1] + FactionTraits[sFaction[aShip[0]]][2]*(FactionTraits[sFaction[aShip[0]]][10]) + FactionTraits[sFaction[aShip[0]]][2];
			for (let x = Cx - wRan; x <= Cx + wRan; x++) {
				for (let y = Cy - wRan; y <= Cy + wRan; y++) {
					let sNums = squareValue(x,y,true,-1,true);
					let hShips = squareValue(x,y,true,-1,false);
					for (let l = 0; l < hShips.length; l++) {
						let deShip = hShips[l][0];
						let defdata = deShip.getDefenses();
						let mov = defdata[1];
						let dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
						let hitchance = wHit + acc - 5*(3^(mov/5));
						hitchance /= (dist - wRan - 1)*(dist - wRan > 0) + 1;
						let rand = Math.round(Math.random()*100 + Math.random()*100)/2;
						hit = 2*(hitchance > rand);
						hitSList[0][hitSList[0].length] = hShips[l][1];
						hitSList[1][hitSList[1].length] = sNums[l];
						hitSList[2][hitSList[2].length] = hit;
					}
				}
			}
			attackList[attackList.length] = [pNumber,aShip[1],weap,hitSList[0],hitSList[1],hitSList[2]];
			dShip = [hitSList[0],hitSList[1]];
			hit = hitSList[2];
		} else if (aWeap.type == "Wait") {
			attackList[attackList.length] = [pNumber,aShip[1],weap,dShip[0],dShip[1],0];
		} else {
			let wHit = aWeap.Whit;
			let wRan = aWeap.Wran; // + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			let acc = atadata[1] + FactionTraits[sFaction[aShip[0]]][2]*(FactionTraits[sFaction[aShip[0]]][10]) + FactionTraits[sFaction[aShip[0]]][2];
			let mov = defdata[1];
			let dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
			let wCov = 0;
			let dHit = 0;
			let hitchance = wHit + acc - 5*(3^(mov/5));
			hitchance /= (dist - wRan - 1)*(dist - wRan > 0) + 1;
			let hitDchance = hitchance;
			if (defdata[2] >= 0 && atadata.Type == "Missile") {
				let dWeapon = deShip.checkDefenses();
				wCov  = dWeapon.Wcov;
				dHit = dWeapon.Whit;
				hitDchance -= ((dHit*wCov)/20) + FactionTraits[sFaction[aShip[0]]][3];
				console.log(hitchance + " " + hitDchance);
			} 
			let rand = Math.round(Math.random()*100 + Math.random()*100)/2;
			hit = (hitchance > rand) + (hitDchance > rand);
			console.log("Hit: " + hit + "\nHit Chance: " + hitchance + "\nHit DChance: " + hitDchance + "\nRandom: " + rand);
			attackList[attackList.length] = [pNumber,aShip[1],weap,dShip[0],dShip[1],hit];
		}
	}
	if (weap == -1) {
		return;
		curAP = 0;
	}
	str = "";
	let wAtk = 0;
	let wRan = 0;
	let wRAtk = 0;
	let def = 0;
	let dist = 0;
	let damage = 0;
	let cDefW = 0;
	switch (aWeap.Type) {
		case "Generic":
			wAtk = aWeap.Watk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRan = aWeap.Wran + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRAtk = aWeap.WRatk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			def = defdata[0];
			dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100 + Math.round(FactionTraits[sFaction[aShip[0]]][0]*(1-(atShip.oldHP/atShip.maxHP)))*(FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][0]*(!FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][1];
			damage = Math.round(damage/100);
			console.log(damage);
			damage = damage*(damage > 0);
			deShip.defend(damage*(hit == 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " hits Player " + dShip[0] + "'s " + deShip.ShipType + " for " + damage + " HP.";
				} else {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " misses Player " + dShip[0] + "'s " + deShip.ShipType + ".";
				}
			}
		break;
		
		case "Missile":
			wAtk = aWeap.Watk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRan = aWeap.Wran + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRAtk = aWeap.WRatk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			def = deShip.Def;
			dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100 + Math.round(FactionTraits[sFaction[aShip[0]]][0]*(1-(atShip.oldHP/atShip.maxHP)))*(FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][0]*(!FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			deShip.defend(damage*(hit == 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " hits Player " + dShip[0] + "'s " + deShip.ShipType + " for " + damage + " HP.";
				} else if (hit == 1) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + "'s fire is intercepted by Player " + dShip[0] + "'s " + deShip.ShipType + ".";
				} else {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " misses Player " + dShip[0] + "'s " + deShip.ShipType + ".";
				}
			}
		break;
		
		case "Defensive":
			wAtk = aWeap.Watk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRan = aWeap.Wran + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRAtk = aWeap.WRatk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			def = defdata[0];
			dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100 + Math.round(FactionTraits[sFaction[aShip[0]]][0]*(1-(atShip.oldHP/atShip.maxHP)))*(FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][0]*(!FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			deShip.defend(damage*(hit == 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " hits Player " + dShip[0] + "'s " + deShip.ShipType + " for " + damage + " HP.";
				} else {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " misses Player " + dShip[0] + "'s " + deShip.ShipType + ".";
				}
			}
		break;
		
		case "Deploying":
			if (undo) {
				shipList[aShip[0]].pop();
			} else {
				console.log(dShip);
				ShipList[aShip[0]][ShipList[aShip[0]].length] = new Ship(atShip.faction,aWeap.dType,dShip[0],dShip[1],hit);
				str += "Player " + aShip[0] + "'s " + atShip.ShipType + " deploys a " + Shiptypes[sFaction[aShip[0]]][aWeap.dType].Name + ".";
			}
		break;
		
		case "Healing":
			wAtk = aWeap.Watk;
			damage = wAtk;
			damage = damage*(damage > 0);
			deShip.defend(damage*(hit == 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " heals Player " + dShip[0] + "'s " + deShip.ShipType + " for " + damage + " HP.";
				}
			}
		break;
		
		case "Ramming":
			wAtk = aWeap.Watk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRan = aWeap.Wran + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRAtk = aWeap.WRatk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			def = defdata[0];
			dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
			damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
			damage *= 100 + Math.round(FactionTraits[sFaction[aShip[0]]][0]*(1-(atShip.oldHP/atShip.maxHP)))*(FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][0]*(!FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][1];
			damage = Math.round(damage/100);
			damage = damage*(damage > 0);
			deShip.defend(damage*(hit == 2),aWeap.Type,undo);
			if (!undo) {
				if (hit == 2) {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " hits Player " + dShip[0] + "'s " + deShip.ShipType + " for " + damage + " HP.";
				} else {
					str += "Player " + aShip[0] + "'s " + atShip.ShipType + " misses Player " + dShip[0] + "'s " + deShip.ShipType + ".";
				}
			}
		break;
		
		case "Destruct":
			wAtk = aWeap.Watk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRan = aWeap.Wran + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			wRAtk = aWeap.WRatk + FactionTraits[sFaction[aShip[0]]][5] + FactionTraits[sFaction[aShip[0]]][5];
			for (let s = 0; s < hit.length; s++) {
				deShip = ShipList[Number(dShip[0][s])][Number(dShip[1][s])];
				def = deShip.getDefenses()[0];
				dist = Math.abs(atShip.x - deShip.x) + Math.abs(atShip.y - deShip.y);
				damage = wAtk - def + wRAtk*(dist + (wRan - dist)*(wRAtk >= 0 && dist >= wRan));
				damage *= 100 + Math.round(FactionTraits[sFaction[aShip[0]]][0]*(1-(atShip.oldHP/atShip.maxHP)))*(FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][0]*(!FactionTraits[sFaction[aShip[0]]][9]) + FactionTraits[sFaction[aShip[0]]][1];
				damage = Math.round(damage/100);
				damage = damage*(damage > 0);
				deShip.defend(damage*(Number(hit[s]) == 2),aWeap.Type,undo);
				if (!undo) {
					if (Number(hit[s]) == 2) {
						str += "Player " + aShip[0] + "'s " + atShip.ShipType + " hits Player " + dShip[0][s] + "'s " + deShip.ShipType + " for " + damage + " HP.";
					} else {
						str += "Player " + aShip[0] + "'s " + atShip.ShipType + " misses Player " + dShip[0][s] + "'s " + deShip.ShipType + ".";
					}
				}
			}
		break;
		
		case "Wait":
			str += "Player " + aShip[0] + "'s " + atShip.ShipType + " waits.";
		break;
	}
	console.log(str);
	if (weaponFired == 0) {
		weaponFired = 1;
		weaponText = "";
	}
	weaponText += "\n" + str;
}

function inputDataString(factionIn,strin) {
	if (strin.startsWith("S-")) {
		sFaction[factionIn] = Number(strin.substr(2,1));
		let dStrIn = strin.substr(4).split(";");
		//console.log(dStrIn);
		for (let val of dStrIn) {
			let substrs = val.split(",");
			ShipList[factionIn][ShipList[factionIn].length] = new Ship(Number(substrs[0]),Number(substrs[1]),Number(substrs[2]),Number(substrs[3]),Number(substrs[4]));
		}
		dispData();
		stage = 1;
	} else if (strin.startsWith("M-")) {
		let dStrIn = strin.substr(4).split(";");
		for (val = 0; val < dStrIn.length; val++) {
			let substrs = dStrIn[val].split(",");
			let ship = ShipList[factionIn][Number(substrs[0])];
			console.log("Ship: " + ship + "Substr " + substrs);
			ship.moveShip(ship.oldx + Number(substrs[1]), ship.oldy + Number(substrs[2]),Number(substrs[3]));
		}
		movAllShips();
		if (pNumber != 4) {
			//console.log(actPoints);
			actPoints[pNumber] = ShipList[pNumber].length;
			subAP = 2*Math.round(actPoints[pNumber]/16 + 0.5);
			actPoints[factionIn] = ShipList[factionIn].length;
			//console.log(actPoints);	x
			if (actPoints[pNumber] > subAP) {
				curAP = subAP;
				actPoints[pNumber] -= subAP;
			} else {
				curAP = actPoints[pNumber];
				actPoints[pNumber] = 0;
			}
		}
		stage = 2;
		attackList = [];
		dString = "";
		destroyShips();
		dispData();
	} else if (strin.startsWith("A-")) {
		let tem = strin.substr(2).split(";");
		let tlen = tem.length - 1;
		let temp = [];
		str = "";
		weaponFired = 0;
		weaponText = "";
		for (let i = 0; i < tlen; i++) {
			temp = tem[i].split(",");
			if (temp[2].includes(":")) {
				temp[2] = temp[2].split(":");
				temp[3] = temp[3].split(":");
				temp[4] = temp[4].split(":");
				attackShip([factionIn,Number(temp[0])],[(temp[2]),(temp[3])],Number(temp[1]),(temp[4]),false);
			} else {
				attackShip([factionIn,Number(temp[0])],[Number(temp[2]),Number(temp[3])],Number(temp[1]),Number(temp[4]),false);
			}
			actPoints[factionIn] -= ShipList[factionIn][Number(temp[0])].Weap[Number(temp[1])].APCost;
		}
		if (actPoints.reduce(sum) == actPoints[pNumber]) {
			curAP += actPoints[pNumber];
			actPoints = [0,0,0,0];
		} else if (actPoints[pNumber] >= subAP && curAP < 1) {
			curAP = subAP;
			actPoints[pNumber] -= subAP;
		} else if (actPoints[pNumber] > 0 && curAP < 1) {
			curAP = actPoints[pNumber];
			actPoints[pNumber] = 0;
		} 
		if (curAP + actPoints[pNumber] > 0) {
			stage = 2;
		} else if (actPoints[factionIn] > 0) {
			stage = 2.9;
		} else {
			stage = 1;
			unmoveShips();
		}
		attackList = [];
		dispData();
		dString = "";
	}
	storedPlayer[factionIn] = 1;
	storedData[storeNum][factionIn] = strin;
	if(storedPlayer.reduce(sum) == playerCount) {
		storeNum++;
		storedPlayer = [0,0,0,0];
		storedData.push([]);
		destroyShips();
		setOlHP();
	}
}

function updateDataString() {
	if (stage < 1) {
		dString = "";
		dString += "S-" + sFaction[pNumber] + ";";
		for (let i = 0; i < ShipList[pNumber].length; i++) {
			dString += ShipList[pNumber][i].faction + "," + ShipList[pNumber][i].type + "," + ShipList[pNumber][i].x + "," + ShipList[pNumber][i].y + "," + ShipList[pNumber][i].rot
			if(i + 1 != ShipList[pNumber].length) {
				dString += ";"
			}
		}
	} else if (stage < 2) {
		dString = "";
		dString += "M-" + movType + ";";
		for (let i = 0; i < ShipList[pNumber].length; i++) {
			dString += i + "," + ShipList[pNumber][i].dX + "," + ShipList[pNumber][i].dY + "," + ShipList[pNumber][i].rot;
			if(i + 1 != ShipList[pNumber].length) {
				dString += ";"
			}
		}
	} else if (stage < 3) {
		dString = "";
		dString += "A-"
		for (let a = 0; a < attackList.length; a++) {
			console.log(a);
			dString += attackList[a][1] + "," + attackList[a][2] + "," + attackList[a][3].toString().replace(/,/g,":") + "," + attackList[a][4].toString().replace(/,/g,":") + "," + attackList[a][5].toString().replace(/,/g,":") + ";";
		}
		if (stage == 2.9) {
			dString = "A-"
		}
	}
	setDataOut(dString);
	storedData[storeNum][pNumber] = dString;
	storedPlayer[pNumber] = 1;
}
