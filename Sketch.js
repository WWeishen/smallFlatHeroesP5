const canvaWidth = 800;
const canvaHeight = 700;
let monstersFall = [];
let monstersTrack = [];
let obstacles = [];
let playerList = [];
let nbPlayer;
let invincibleDuration = 2000;  //2 sec invincible when collision Pl & Em
const data=[
    {monsters: [[[25,"top"],[25,"bottom"]],2],//list of [#monstersFall,"top"|"bottom"|"left"|"right"],#monstersTrack
    obstacles:[[0,canvaHeight-5,canvaWidth,20],[0,300,canvaWidth/2-150 ,20],[0, 500, 400, 20]]
    },
    {monsters: [[[25,"bottom"]],0],
    obstacles:[[0,250,100,20],[canvaWidth-300,250,20,150],[100,550,100,20]]
    },
    {monsters: [[[5,"left"]],25],
    obstacles:[[canvaWidth - 400, 300, 400, 20],[0, 500, 400, 20]]
    },
    {monsters: [[[25,"right"]],1],
    obstacles:[[0,250,100,20],[canvaWidth-150,250,150,20],[canvaWidth-300,250,20,150]]
    }
]

getnbPlayer();
function getnbPlayer() {
    nbPlayer = prompt("Nomber of player(enter 1 or 2):");
  if (Number.isInteger(Number(nbPlayer)) && (nbPlayer == 1 || nbPlayer == 2)) {
    validInput = true;
  } else {
    alert("Invalid input. Please enter a valid integer (1 or 2).");
  }
}

function setup(){
    backgroundMusic = createAudio('assets/backgroundMusic.mp3',playMusic);
    let playButton = createButton('Play Music');
    playButton.mousePressed(startMusic);
    let stopButton = createButton('Stop Music');
    stopButton.mousePressed(stopMusic);

    createCanvas(canvaWidth, canvaHeight);
    //canvas creation 
    currentLvl = 1;

    //player initialisation
    player1 = new Player(50,100,'blue');
    playerList.push(player1);
    if(nbPlayer==2){
        player2 = new Player(100,100,'pink');
        playerList.push(player2);
    }
    createMonster(1);
    createObstacle(1);
}


function draw() {
    background(100,100,100);
    //player instructions 
    playerList.forEach(player => {
        player.update();
        player.draw();
        player.grounded = false;
    });
    //obstacle intructions 
    obstacles.forEach(obstacle => {
        obstacle.draw();
        playerList.forEach(player => {
            player.checkObstacleCollision(obstacle);
        });
    })
    //monsters instructions
    monstersFall.forEach(monster => {
        monsterDraw(monster);
        monster.update();
    });

    monstersTrack.forEach(monster => {
        let target = playernearest(monster).pos;
        monster.applyBehaviors(target); 
        monsterDraw(monster);
        monster.update(target);
    });
    deletMonster();
    
    if(monstersTrack.length === 0 && monstersFall.length ===0){
        currentLvl += 1;
        if(data[currentLvl-1]){
            createMonster(currentLvl);
            createObstacle(currentLvl);
        }else{
            displayPlayerWinWindow();
        }
    }
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        player1.move('right');
    } else if (keyCode === LEFT_ARROW) {
        player1.move('left');
    } else if (keyCode === UP_ARROW){//up
        player1.move('up');
    }

    if(player2){
        if (keyCode === 68) {//d
            player2.move('right');
          } else if (keyCode === 81) {//q
            player2.move('left');
          }else if(keyCode === 90){//z
            player2.move('up');
          }  
    }
}
  
function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW|| keyCode === UP_ARROW){
        player1.stop();
    }
    if (keyCode === 68|| keyCode === 81|| keyCode === 90) {
      player2.stop();
    }
}



function displayGameOverWindow() {
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
}  

function displayPlayerWinWindow(){
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("You win", width / 2, height / 2);
}

function checkPlayerList(){
    console.log(playerList.length);
    if (playerList.length == 0){
        noLoop();
        displayGameOverWindow();
    }
}

function playernearest(monster){
    let min = playerList[0]
    let d1 = dist(min.pos.x, min.pos.y, monster.pos.x, monster.pos.y);
    if(playerList[1]){
        let d2 = dist(playerList[1].pos.x, playerList[1].pos.y, monster.pos.x, monster.pos.y);
        if (d2 < d1){
            min = playerList[1];
        }
    }
    return min;
}

function monsterDraw(monster){
        monster.draw();
        monster.checkObstacleCollision(obstacles);
        playerList.forEach(player => {
            if(millis() - player.lastCollisionTime > invincibleDuration){
                if(monster.checkPlayerCollision(player)){
                    let soundEffect = new Audio('assets/playerHurt.wav');soundEffect.play();
                    player.lives--;
                    console.log(player.lives);
                    player.lastCollisionTime = millis();
                }
                //delet player if player get hurt
                if(player.lives==0){
                    let index = playerList.indexOf(player);
                    if (index !== -1){
                        playerList.splice(index, 1);
                    }
                checkPlayerList();
                }
            }
        });
}

function createMonster(level){
    console.log(data);
    console.log(data[currentLvl-1]);
    data[level-1].monsters[0].forEach(element => {
        console.log(element+"**")
        let monsterFallNumber = element[0];
        let sens = element[1];
        if(sens){//this.width = 20;this.height = 8;
            let monsterX= canvaWidth /(2*monsterFallNumber);
            let monsterY = canvaHeight /(2*monsterFallNumber) ;
            switch(sens){
                case "top":
                    for(let i = 0 ; i < monsterFallNumber ; i++) {
                        monstersFall.push(new MonsterFall(monsterX,20,sens));
                        monsterX += canvaWidth/monsterFallNumber;
                    }
                    break;
                case "bottom":
                    for(let i = 0 ; i < monsterFallNumber ; i++) {
                        monstersFall.push(new MonsterFall(monsterX,canvaHeight-40,sens));
                        monsterX += canvaWidth/monsterFallNumber;
                    }
                    break; 
                case "right":
                    
                    for(let i = 0 ; i < monsterFallNumber ; i++) {
                        monstersFall.push(new MonsterFall(canvaWidth-20,monsterY,sens));
                        monsterY += canvaHeight/monsterFallNumber;
                    }
                    break; 
                default://"left"
                    //monsterY = canvaHeight /(2*monsterFallNumber) ;
                    for(let i = 0 ; i < monsterFallNumber ; i++) {
                        monstersFall.push(new MonsterFall(20,monsterY,sens));
                        monsterY += canvaHeight/monsterFallNumber;
                    }
            }
    }
    });
    // let monsterFallNumber = data[level-1].monsters[0][0];
    // let sens=data[level-1].monsters[0][1];
    

    let monsterTrackNumber = data[level-1].monsters[1];
    let monsterY = canvaWidth /(2*monsterTrackNumber);
    for(let i = 0 ; i < monsterTrackNumber ; i++) {
        monstersTrack.push(new MonsterTrack(monsterY,0));
        monsterY += canvaWidth/monsterTrackNumber;
    }
}

function createObstacle(currentLvl){
    console.log(currentLvl);
    obstacles.splice(1,obstacles.length);
    data[currentLvl-1].obstacles.forEach(e => {
        let obstacle = new Obstacle(e[0],e[1],e[2],e[3]);
        obstacles.push(obstacle);
    });
}

function startMusic() {
    //backgroundMusic.autoplay(true);
    backgroundMusic.play();
}

function stopMusic(){
    backgroundMusic.pause();
}

function playMusic(){
    backgroundMusic.loop();
}

function deletMonster(){
    monstersFall = monstersFall.filter(monster => monster.collided === false);
    monstersTrack = monstersTrack.filter(monster => monster.collided === false);
}