// Student Name: Moyukh Shabon Khan
// Student ID: 20987452

let score = 0;
let yLoc;
let xLoc;
let planeSize;
let planeSpeed;
let fireX;
let fireY;
let gunFired = false;
let planeFireSpeed;
let fireHitCount = 0;
let angle = 0;
let planeHealth = 100;
let healthDecrementFire = 2;
let healthDecrementContact = 20;

let alienX = [];
let alienY = [];
let alienSpawned = false;
let alienNumber = 5;
let alienSpeed;
let wavePassCheck = false;
let alienFireX = [];
let alienFireY = [];
let alienFirePassCheck = false;
let alienFireSpeed = 4;

let starPositionX = [];
let starPositionY = [];
let starSize = [];

let difficulty = "Normal";

let titleImage;

let fontComicSans;
let fontSomethingStrange;
let fontSizeShift = 0.05;
let fontSize;

let titleSong;
let gameplaySong;
let gunshotSound;
let laserFireSound;
let planeSound;

let cloudX;
let cloudY;

let enterIsPressed = false;

function preload(){
	imgAlien = loadImage("Alien.png");
	star = loadImage('star.png');
	titleImage = loadImage("Title Screen.jpg");
	
	fontComicSans = loadFont("ComicSansMS.otf");
	fontSomethingStrange = loadFont("SomethingStrange.otf");
	
	titleSong = loadSound('Nightcall - Instrumental.mp3');
	gameplaySong = loadSound('Dark SynthWave.mp3');
	gunshotSound = loadSound("GunShot.mp3");
	laserFireSound = loadSound("LaserFires.mp3");
	planeSound = loadSound("Propeller.mp3");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSL, 360, 100, 100, 100);
	yLoc = height*0.2;
	xLoc = width*0.05;
	angleMode(DEGREES);
	planeSize = width/96;
	planeSpeed = height/150;
	planeFireSpeed = width/30;
	alienSpeed = width/1000;
	
	cloudX = width*0.3;
	cloudY = height*0.8;
	
	fontSize = width*height/30000;
	
	generateStarParameters();
}



function draw() {
	titleScreen();
	gameplay();
	gameOverScreen();
}

function gameplay(){
	if(planeHealth > 0 && enterIsPressed === true){
		background(197, 71, map(sin(second()/60*180)*height/2 + yLoc, 0, height*1.5, 20, 60));
		drawStars();
		cloudRender();
		drawHeader();
		drawPlane();
		planeUpdate();
		gunFire();
		spawnAlien();
		planeFireHitAlien();
		planeAlienCollision();
		
		if(titleSong.isPlaying()){
			titleSong.stop();
		}
		if(!gameplaySong.isPlaying()){
			gameplaySong.play();
		}
		if(!planeSound.isPlaying()){
			planeSound.play();
			planeSound.amp(0.2);
		}
	}
}

function titleScreen(){
	if(enterIsPressed === false){
		image(titleImage, 0, 0, width, height);
		noStroke();
		fill(0, 100, 50);
		textSize(width*height/10000);
		if(frameCount%int(random(2, 10)) === 0){
			fill(random(0, 360), 100, 60);
			textSize(width*height/10000 + random(-2, 2));
		}
		textAlign(CENTER);
		textFont(fontSomethingStrange);
		text("Shoot  The Aliens", width*0.5, height*0.45);

		fill(150, 90, 60);
		
		fontSize += fontSizeShift;
		if(fontSize > (width*height/30000) + 2){
			fontSizeShift = -fontSizeShift;
		}
		if(fontSize < (width*height/30000) - 2){
			fontSizeShift = -fontSizeShift;
		}
		textSize(fontSize);
		textFont(fontComicSans);
		text("To Start, Press \"Enter\" ", width*0.5, height*0.55);
		
		if(gameplaySong.isPlaying()){
			gameplaySong.stop();
		}
		if(!titleSong.isPlaying()){
			titleSong.play();
		}
	}
}

function gameOverScreen(){
	if(planeHealth <= 0){
		background(0, 0, 0);
		textSize(width/20);
		fill("White")
		textAlign(CENTER);
		textFont("sans-serif");
		text("GAME OVER\nScore: " + score, width/2, height/2);
		if(!planeSound.isPlaying()){
			planeSound.stop();
		}
	}
}

function spawnAlien(){
	if(alienSpawned === false){
		for(let i = 0; i < alienNumber; i++){
			alienX[i] = width;
			alienY[i] = random(height*0.2, height*0.95);
		}
		for(let i = 0; i < alienNumber; i++){
			alienFireX[i] = alienX[i];
			alienFireY[i] = alienY[i];
		}
		alienSpawned = true;
	}
	for(let i = 0; i < alienNumber; i++){
		image(imgAlien, alienX[i], alienY[i], planeSize*2, planeSize*2);
		alienX[i] -= alienSpeed;
	}
	
	if(fireHitCount >= alienNumber || wavePassCheck === true){
		alienSpawned = false;
		alienNumber++;
		alienSpeed += 0.2;
		fireHitCount = 0;
		laserFireSound.play();
	}
	for(let i = 0; i < alienNumber; i++){
		if(alienX[i] > -planeSize){
			wavePassCheck = false;
			break;
		}	else {
				wavePassCheck = true;
			}
	}
	for(let i = 0; i < alienNumber; i++){
		rect(alienFireX[i], alienFireY[i], planeSize/2, planeSize/10);
		alienFireX[i] -= alienSpeed*alienFireSpeed;
	}
	
	for(let i = 0; i < alienNumber; i++){
		if(alienFireX[i] > -width){
			alienFirePassCheck = false;
			break;
		}	else {
				alienFirePassCheck = true;
			}
	}
	if(alienFirePassCheck === true){
		laserFireSound.play();

		for(let i = 0; i < alienNumber; i++){
			alienFireX[i] = alienX[i];
			alienFireY[i] = alienY[i];
		}
	}
}

function planeFireHitAlien(){
	for(let i = 0; i < alienNumber; i++){
		if(abs(fireX - alienX[i]) < planeFireSpeed*1.5 && abs(fireY - alienY[i]) < planeSize*1.5){
			alienX[i] = -planeSize*3;
			fireHitCount++;
			score++;
			//fireX = width+20;
		}
	}
}

function planeAlienCollision(){
	for(let i = 0; i < alienNumber; i++){
		if(abs(xLoc - alienX[i]) < planeSize && abs(yLoc - alienY[i]) < planeSize*2){
			alienX[i] = -20;
			score--;
			planeHealth -= healthDecrementContact;
		}
	}
	for(let i = 0; i < alienNumber; i++){
		if(abs(xLoc - alienFireX[i]) < planeSize && abs(yLoc - alienFireY[i]) < planeSize){
			alienFireX[i] = -20;
			planeHealth -= healthDecrementFire;
		}
	}
}

function gunFire(){
	if(gunFired === true){
		rect(fireX, fireY, planeSize, planeSize/4);	
		fireX += planeFireSpeed;
	}
	if(fireX > width){
		gunFired = false;
	}
}

function drawPlane() {
	fill("Black");
	ellipse(xLoc, yLoc, planeSize*3, planeSize);
	fill(10, 80, 60);
	rectMode(CENTER);
	rect(xLoc+2, yLoc, planeSize/2, planeSize*3);
	stroke("White");
	strokeWeight(2);
	

	push();
	translate(xLoc+planeSize*1.5, yLoc);
	rotate(angle);
	line(-planeSize/2, 0, planeSize/2, 0);
	line(0, planeSize/2, 0, -planeSize/2);
	angle += 63;
	pop();
}

function planeUpdate(){
	if(keyIsPressed){
		if(keyCode === UP_ARROW || key === "w"){
			yLoc= constrain(yLoc-=planeSpeed, height*0.2, height*0.95);
		} else if(keyCode === DOWN_ARROW || key === "s"){
				yLoc= constrain(yLoc+=planeSpeed, height*0.2, height*0.95);
			}
	}
}

function keyPressed(){
	if(key === " "){
		fireX = xLoc + planeSize*2;
		fireY = yLoc;
		gunFired = true;
		gunshotSound.play();
	}
	if(key === "1"){
		difficulty = "Easy";
		planeSpeed = height/100;
		planeFireSpeed = width/20;
		alienSpeed = width/1250;
		alienFireSpeed = 2;
		let healthDecrementFire = 1;
		let healthDecrementContact = 10;
	}
	if(key === "2"){
		difficulty = "Normal";
		planeSpeed = height/150;
		planeFireSpeed = width/30;
		alienSpeed = width/1000;
		alienFireSpeed = 4;
		let healthDecrementFire = 2;
		let healthDecrementContact = 20;
		
	}
	if(key === "3"){
		difficulty = "Hard";
		planeSpeed = height/200;
		planeFireSpeed = width/40;
		alienSpeed = width/900;
		alienFireSpeed = 6;
		let healthDecrementFire = 3;
		let healthDecrementContact = 25;
	}
	if(keyCode === ENTER){
		enterIsPressed = true;
		laserFireSound.play();
	}
}

function drawHeader() {
	rectMode(CORNER);
	noStroke();
	fill("Black");
	rect(10, 10, width - 10*2, height*0.1);
	
	textFont("sans-serif");
	textSize(width/75);
	fill(random(0, 360), 100, 70);
	text("Shoot The Aliens", width*0.075, height*0.075);
	fill(map(planeHealth, 0, 100, 0, 150), 90, 80);
	text("Plane Health: " + planeHealth + "%", width/20*6, height*0.075);
	fill("White");
	text("Score: " + score, width/20*11, height*0.075);
	text("Difficulty: " + difficulty, width/20*15, height*0.075);
}

function clouds(cloudx, cloudy) {
  fill(0, 0, 100, 92);
  noStroke();
  ellipse(cloudx, cloudy, 70, 50);
  ellipse(cloudx + 10, cloudy + 10, 70, 50);
  ellipse(cloudx - 20, cloudy + 10, 70, 50);
}

function cloudCluster(cloudx, cloudy){
	clouds(cloudx, cloudy-25);
	clouds(cloudx + 100, cloudy + 50);
	clouds(cloudx - 50, cloudy + 65);
	clouds(cloudx - 150, cloudy);
	
}

function cloudRender(){
	for(let i = 0; i < 10; i++){
		cloudCluster(cloudX - i*1000, cloudY);
	}
	cloudX += width/9600;
	
	if(cloudX > width*1.25*10){
		cloudX = -width*0.25;
	}
}

function generateStarParameters(){
	for (let i = 0; i <100; i++){
		starPositionX[i] = random(0, width);
		starPositionY[i] = random(0, height*0.25);
		starSize[i] = random(width/350, width/50);
	}
}

function drawStars(){
	for (let i = 0; i <100; i++){
		image(star, starPositionX[i], starPositionY[i], starSize[i], starSize[i]);
	}
}
