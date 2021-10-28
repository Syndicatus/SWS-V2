//Gui Stuff
$("#SetD0").click(function (){
	dStringIn = $("#P0dIn").val();
	inputDataString(0,dStringIn);
})

$("#SetD1").click(function (){
	dStringIn = $("#P1dIn").val();
	inputDataString(1,dStringIn);
})

$("#SetD2").click(function (){
	dStringIn = $("#P2dIn").val();
	inputDataString(2,dStringIn);
})

$("#SetD3").click(function (){
	dStringIn = $("#P3dIn").val();
	inputDataString(3,dStringIn);
})

$("#CopyText").click(function (){
	 /* Get the text field */
  var copyText = $("#OutBox");
  /* Select the text field */
  copyText.select();
  //copyText.setSelectionRange(0, 99999); /* For mobile devices */
  /* Copy the text inside the text field */
  document.execCommand("copy");
});
//Numpad
$("#b1").click(function (){
	moveCursor(-1,-1);
	//$(this).hide("slow");
})

$("#b2").click(function (){
	moveCursor(0,-1);
	eggEaster("u");
})

$("#b3").click(function (){
	moveCursor(1,-1);
})

$("#b4").click(function (){
	moveCursor(-1,0);
	eggEaster("l");
})

$("#b5").click(function (){
	pressButton();
	eggEaster("a");
})

$("#b6").click(function (){
	moveCursor(1,0);
	eggEaster("r");
})

$("#b7").click(function (){
	moveCursor(-1,1);
})

$("#b8").click(function (){
	moveCursor(0,1);
	eggEaster("d");
})

$("#b9").click(function (){
	moveCursor(1,1);
})

$("#Back").click(function (){
	goback();
	eggEaster("b");
})

$("#Player").change(function () {
	updateSelector("Player");
	//console.log("Changed Player Number");
})

$("#PlayCo").change(function () {
	updateSelector("PlayCo");
})

$("#Faction").change(function () {
	updateSelector("Faction");
})

$("#MovStyl").change(function () {
	updateSelector("Mov");
})

$("#MenuButton").click(function () {
	//console.log(menuState);
	menuToggle();
})

document.addEventListener('keydown', function(event) {
	switch (event.key) {
		case "s":
			moveCursor(0,1);
			eggEaster("d");
		break;
		
		case "w":
			moveCursor(0,-1);
			eggEaster("u");
		break;
		
		case "a":
			moveCursor(-1,0);
			eggEaster("l");
		break;
		
		case "d":
			moveCursor(1,0);
			eggEaster("r");
		break;
		
		case "e":
			pressButton();
			eggEaster("a");
		break;
		
		case "q":
			goback();
			eggEaster("b");
		break;
	default:
      return; // Quit when this doesn't handle the key event.
  }
});

//Resize Stuff Fails
$( window ).resize(function () {
	scrResize();
});

//Keep inline with MoveCursor
$('#BoardControl').click(function(e){
	let mouseX = e.pageX - this.offsetLeft;
	let mouseY = e.pageY - this.offsetTop;
	if(stage == -1 || stage == 0 || stage == 1 || stage == 2 || stage == 2.4 || stage == 2.85 || stage == 2.9) {
		Cx = Math.floor(mouseX/scx);
		Cy = Math.floor(mouseY/scy);
	}
	dispData();
	mov.play();
})

$("#LoadGame").click(function() {
	updateSelector("Load");
	console.log("Loading");
})

$("#SaveGame").click(function() {
	if (save) {
		let name = $("#SaveName").val();
		//console.log(name)
		if (name.length == 0) {
			//console.log("Empty")
			name = "\n" + PlayCom[sFaction[0]];
			for(let i = 1; i < playerCount; i++) {
				name += " vs " + PlayCom[sFaction[i]];
			}
		}
		let jstore = JSON.stringify(storedData);
		localStorage.setItem(id.length,jstore);
		id.push(name);
		let jid = JSON.stringify(id);
		localStorage.setItem("Saves",jid);
	}
	updateHTML();
})

$("#DelSave").click(function() {
	if ($("#Saves").val() != -1 && save){
		let val = $("#Saves").val();
		localStorage.removeItem(val);
		id.splice(val,1);
		let jid = JSON.stringify(id);
		localStorage.setItem("Saves",jid);
	}
	updateHTML();
})

var astley = true;
var oAstley = true;
function eggEaster(str) {
	if (stage >= 1) {
		return;
	}
	movStr = movStr.slice(1) + str;
	if (movStr == "uuddlrlrba") {
		console.log("Trans Rights");
		document.getElementById("Info").innerHTML = "Trans Rights";
	} else if (movStr.slice(2) == "uulrlrdd") {
		console.log("Working");
		endingFaction = 5;
		updateHTML();
	} else if (movStr.split("u").length == 1 && astley) {
		document.getElementById("Info").innerHTML = "Astley Ready";
		let root = document.querySelector(':root');
	} else if ((!movStr.includes("u")) && astley) {
		console.log("hhhhhhhhhhhh");
		window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
	} else if (!astley && oAstley && str != "u") {
		oAstley = false;
	} else if (movStr.split("u").length - 1 == movStr.length && oAstley) {
		astley = false;
		document.getElementById("Info").innerHTML = "Astley Offline";
	}
}