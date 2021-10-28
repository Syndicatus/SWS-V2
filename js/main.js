$(function() {
	console.log("Init was called");
	init();
});

function boardmake() {
	for(i = 0; i < GrSz; i++){
		Board[i] = new Array(GrSz);
	}
}

function init() {
	//fetch("test.json").then(response => response.json()).then(json => console.log(json));
	initGrid();
	updateHTML();
	updateDataString();
	hideThings();
	stage = 0;
	dispData();
	//var ship = new Ship(0,0,16,16,0);
	printBoard(false,0);
	scrResize();
}