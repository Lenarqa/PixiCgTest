//configs
let config
const MAP_SIZE = 6;
let app;
let colors = ['./img/beer.png', './img/coffee.png', './img/martini.png', './img/coffee-mug.png', './img/teapot.png'];
let onOrDisable = ['./img/sound-off.png', './img/sound-on.png'];
let restart = ['./img/restart.png'];
let restartBtn;
let soundBtn;
let playerClick = 1;
let tempObj = {};
let players = [];
let container;
let gameTime = 30;
let time;

//Text
let scoreText;
let timerText;

// sounds
let mainSound;
let goodChoiceSound;
let noGoodChoiceSound;
let theEndSound;
let isSoundPlay = false;

window.onload = function(){
    container = document.getElementById('container');
    startGame();
}

// GamePlay
function startGame(){
    time = gameTime;

    config = {
        width: 410,//6 * 6
        height: 450,//6 * 6
        backgroundColor: 0x131317,
    }

    app = new PIXI.Application(config);

    //sound
    if(mainSound == null){
        initSound();
    }

    //soundBtn
    initSoundBtn();
    
    //createMap
    createMap(players, colors); 
    
    // timer
    initTimerText();
    startTimer();
    
    // score
    initScore();
    
    if(container.firstChild != null){
        let child = container.firstChild;
        container.removeChild(child);
    }

    container.appendChild(app.view);
}

function initRestartBtn(){
    restartBtn = new PIXI.Sprite.from(restart[0]);
    restartBtn.x = config.width * 0.45;
    restartBtn.y = config.height * 0.5;
    restartBtn.interactive = true;
    restartBtn.on('pointerdown', startGame);
    restartBtn.Animation = new TweenMax.to(restartBtn.scale, 1, {
        x: 1.3, 
        y: 1.3, 
        repeat: -1,
        repeatDelay: 0.02,
        ease: "power2.inOut",
        yoyo: true,
    });
    app.stage.addChild(restartBtn);
}

function gameOver(){
    if(isSoundPlay){
        mainSound.pause();
        theEndSound.play();
        setTimeout(()=>{
            mainSound.play();
        }, 2700);
    }

    players.forEach(arr =>{
        arr.forEach(el =>{
            el.Animation = new TweenMax.to(el.scale, 0.3, {
                x: 0.0,
                y: 0.0, 
                ease: Power3.easeOut
            });
        })
    });

    setTimeout(()=>{
        players.forEach(arr =>{
            arr.forEach(el =>{
                el.alpha = 0;
            })
        });
    }, 100);
    
    let score = parseInt(scoreText.text);
    scoreText.text = `Final score:\n ${score}`;
    scoreText.style = {fontFamily : 'Arial', fontSize: 42, fill : 0xFFFFFF, align : 'center'};
    scoreText.Animation = new TweenMax.to(scoreText, 1, {
        x: config.width * 0.25,
        y: config.height * 0.25, 
        ease: Power3.easeOut,
    });

    initRestartBtn();
}

function startTimer(){
    let timer = setInterval(tick, 1000)
    function tick(){
        timerText.text = `${--time}`;
        if(time == 0){
            clearInterval(timer);
            gameOver();
        }
    }
}

function initTimerText(){
    timerText = new PIXI.Text(`${time}`,{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF});
    timerText.x = config.width * 0.8;
    timerText.y = 10
    app.stage.addChild(timerText);
}

function initScore(){
    scoreText = new PIXI.Text('0',{fontFamily : 'Arial', fontSize: 24, fill : 0xFFFFFF, align : 'center'});
    scoreText.x = config.width * 0.45;
    scoreText.y = 10
    app.stage.addChild(scoreText);
}

function createMap(players){
    let x = 10;
    let y = 40;

    for (let i = 0; i < MAP_SIZE; i++) {

        players[i] = [];
        for (let j = 0; j < MAP_SIZE; j++) {

            let random = Math.floor(Math.random() * colors.length); 
            players[i][j] = new PIXI.Sprite.from(colors[random]);
            players[i][j].interactive = true;
            players[i][j].x = x;
            players[i][j].y = y;
            players[i][j].i = i;
            players[i][j].j = j;
            players[i][j].id = random;
            players[i][j].Animation = null;
            
            players[i][j].on('pointerdown', clickFunction.bind(this, players[i][j]));
            
            x += 70;

            app.stage.addChild(players[i][j]);
        }
        y += 70;
        x  = 10;
    }

    analizHorizontalMap();
    analizVerticalMap();
    analizHorizontalMap(); //уменьшаем вероятность появления на карте тройки.
}


function clickFunction(player){
    
    switch(playerClick){
        case 2:{
            playerClick = 1;
            
            if(player.i == tempObj.i && player.j == tempObj.j){
                 killPlayerAnimation(tempObj);
            }
            
            if(isNear(tempObj, player) && isThree(tempObj, player)){
                
                changeIandJ(tempObj, player);
                playAnimationMove(tempObj, player);
                swapObject(tempObj, player);
                deleteThree();                
                deadAnimation(tempObj, player);
                setTimeout(fallAnimation, 10);
                fallObjs();
                setTimeout(renderMap, 510);
                addScore();
                
                if(isSoundPlay){
                    goodChoiceSound.play();
                }
            }else{
                if(!isNear(tempObj, player)){
                    killPlayerAnimation(tempObj);
                }else{
                    badStepAnimation(tempObj, player);
                }
                if(isSoundPlay){
                    noGoodChoiceSound.play();
                }
            }       
            break;
        }
        case 1:{
            playerClick++;
            tempObj = player;
            playerAnimation(tempObj);
            break;
        }
    } 
}

function addScore(){
    scoreText.text = (parseInt(scoreText.text) + 100).toString();
    let lastX = scoreText.x
    scoreText.Animation =  new TweenMax.to(scoreText.scale, 0.3, {
        x: 1.3,
        y: 1.3, 
        rotation: 0.45, 
        repeatDelay: 0.05,
        ease: "power2.inOut",
    });

    setTimeout(()=>{
        scoreText.Animation =  new TweenMax.to(scoreText.scale, 0.3, {
            x: 1, 
            y: 1.0, 
            rotation: 0,
            repeatDelay: 0.05,
            ease: "power2.inOut",
        });
    }, 200)
    
    app.stage.addChild(scoreText);
}

function renderMap(){    
    let yPos = [40];
    for (let z = 0; z < MAP_SIZE-1; z++) {
        yPos.push(yPos[z] + 70);
    }

    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            if(players[i][j].id == 9){
                players[i][j].x = 10 + j * 70;
                players[i][j].y = yPos[i];
                let random = Math.floor(Math.random() * colors.length);
                if(j > 1){
                    if(random == players[i][j-1].id && random == players[i][j-1].id){
                        if(random < colors.length-1){
                            random++;
                        }else{
                            random--;
                        }
                    }
                }
                players[i][j].id = random;
                players[i][j].texture = PIXI.Texture.from(colors[random]);

                players[i][j].Animation = new TweenMax.to(players[i][j].scale, 0.5, {
                    x: 1.0, 
                    y: 1.0, 
                    ease: "power2.inOut",
                    // ease: Power3.easeOut,
                    yoyo: true,
                });
            }else{
                players[i][j].x = 10 + j * 70;
                players[i][j].y = yPos[i];
            } 
        }
    }
}

function sechNine(){
    let yPos = [10];
    for (let z = 0; z < MAP_SIZE-1; z++) {
        yPos.push(yPos[z] + 70);
    }
    console.log(yPos);
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            if(players[i][j].id == 9){
                players[i][j].x = 10 + j * 70;
                players[i][j].y = yPos[i];
                let random = Math.floor(Math.random() * colors.length); 
                players[0][j].id = random;
                players[0][j].texture = PIXI.Texture.from(colors[random]);
            }   
        }
    }
}

function fallObjs(){
    let pos = players.length - 1;
    for (let i = 0; i < players.length; i++) {
        pos = players.length-1;
        for (let j = players.length-1; j >= 0; j--) {
            if(players[j][i].id != 9){
                changeIandJ(players[pos][i], players[j][i]);
                swapObject(players[pos][i], players[j][i]);
                pos--;
            }
        }
        while(pos > -1){
            players[pos--][i].id = 9;
        }
    }
}

function swapObject(tempObj, player){
    let i = tempObj.i;
    let j = tempObj.j;

    tempObj.i = player.i;
    tempObj.j = player.j;

    player.i = i;
    player.j = j;
}

function changeId(tempObj, player){
    let tempID = tempObj.id;
    tempObj.id = player.id;
    player.id = tempID;
}

function deleteThree(){
    let tempIDs = players.map(function(arr) {
        return arr.map(el =>{
            return el.id;
        });
    });

    for (let i = 0; i < tempIDs.length; i++) {
    
        for (let j = 0; j < tempIDs.length; j++) {

            let coll = 0;
            
            for (let z = 0; z < tempIDs.length; z++) {
                if(tempIDs[i][j] == tempIDs[i][z] && tempIDs[i][j] == tempIDs[i][j+coll]){
                    coll++;
                }
            }
    
            if(coll > 2){
                for (let z = j; z < j + coll; z++) {
                    players[i][z].id = 9;
                }
            }
        }
    }

    for (let i = 0; i < tempIDs.length; i++) {   
        for (let j = 0; j < tempIDs.length-2; j++) {
            
            let coll = 0;
            
            for (let z = 0; z < tempIDs.length; z++) {
                if(j + coll > tempIDs.length-1){
                    coll--;
                }
                if(tempIDs[j][i] == tempIDs[z][i] && tempIDs[j][i] == tempIDs[j+coll][i]){
                    coll++;
                }
            }
    
            if(coll > 2){
                for (let z = j; z < j + coll; z++) {
                    players[z][i].id = 9;
                }
            }
        }
    }

}

function swapId(tempObj, player){
    let tempID = tempObj.id;  

    tempObj.id = player.id;
    player.id = tempID;
    
    let tempIDs = [];
    for (let i = 0; i < MAP_SIZE; i++) {
        tempIDs[i] = [];
       for (let j = 0; j < MAP_SIZE; j++) {
           tempIDs[i][j] = players[i][j].id;
       }
    }

    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            players[i][j].id = tempIDs[i][j];
        }
    }
}

function isThree(tempObj, player){
    let col = 0;
    let tempPlayersId = players.map(function(arr) {
        return arr.map(el =>{
            return el.id;
        });
    });
    
    tempPlayersId = swapObjs(tempObj, player, tempPlayersId);

    for (let i = 0; i < tempPlayersId.length; i++) {
        for (let j = 0; j < tempPlayersId[i].length; j++) {
            if(tempPlayersId[i][j] == tempPlayersId[i][j+1] && tempPlayersId[i][j] == tempPlayersId[i][j+2]){
                col++;
            }
        }
    }

    for (let i = 0; i < tempPlayersId.length; i++) {
        for (let j = 0; j < tempPlayersId[i].length-2; j++) {
            if(tempPlayersId[j][i] == tempPlayersId[j+1][i] && tempPlayersId[j][i] == tempPlayersId[j+2][i]){
                col++;
            }
        }
    }

    if(col > 0){
        return true;
    }else{
        return false;
    }
}

function swapObjs(tempObj, player, tempPlayersId){   
    let tempID = tempPlayersId[player.i][player.j];  
    
    tempPlayersId[player.i][player.j] = tempPlayersId[tempObj.i][tempObj.j];
    tempPlayersId[tempObj.i][tempObj.j] = tempID;

    return tempPlayersId;
}

function changeIandJ(tempObj, player){
    let tempObject = tempObj;
    let i = tempObj.i;
    let j = tempObj.j;
    
    players[i][j] = player;
    players[player.i][player.j] = tempObject;
}

function isNear(tempObj, player){
    if((Math.abs(tempObj.i - player.i) == 1) ||  (Math.abs(tempObj.j - player.j) == 1)){
        if((tempObj.i == player.i) || (tempObj.j == player.j)){
            return true;
        }
    }
}

// Analiz Functions
function analizHorizontalMap(){
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 2; j < MAP_SIZE; j++) {
            if((players[i][j].id == players[i][j-1].id) && (players[i][j].id == players[i][j-2].id)){
                let newId = (players[i][j].id + 1 < colors.length - 1 ? players[i][j].id + 1 : players[i][j].id - 1);
                players[i][j].texture = PIXI.Texture.from(colors[newId]);
                players[i][j].id = newId;
            }
        }
    }
}

function analizVerticalMap(){
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 2; j < MAP_SIZE; j++) {
            if((players[j][i].id == players[j-1][i].id) && (players[j][i].id == players[j-2][i].id)){
                let newId = (players[j][i].id + 1 < colors.length - 1 ? players[j][i].id + 1 : players[j][i].id - 1);
                players[j][i].texture = PIXI.Texture.from(colors[newId]);
                players[j][i].id = newId;
            }
        }
    }
}

// Sounds
function initSoundBtn(){
    
    soundBtn = new PIXI.Sprite.from(onOrDisable[1]);
    soundBtn.x = config.width * 0.03;
    soundBtn.y = 1;
    soundBtn.on('pointerdown', soundOfforOn);
    soundBtn.interactive = true;
    app.stage.addChild(soundBtn);

    if(isSoundPlay){
        soundBtn.texture = PIXI.Texture.from(onOrDisable[1]);
    }else{
        soundBtn.texture = PIXI.Texture.from(onOrDisable[0]);
    }
}

function soundOfforOn(){
    isSoundPlay = !isSoundPlay;
    if(isSoundPlay){
        mainSound.play();
        soundBtn.texture = PIXI.Texture.from(onOrDisable[1]);
    }else{
        soundBtn.texture = PIXI.Texture.from(onOrDisable[0]);
        mainSound.pause();
    }
}

function initSound(){
    mainSound = new Howl({
        src: ['./sound/mainSound.mp3'],
        loop: true,
        volume: 0.8,
    });  

    goodChoiceSound = new Howl({
        src: ['./sound/GoodChoice.mp3'],
        volume: 0.5,
    });  

    noGoodChoiceSound = new Howl({
        src: ['./sound/noGoodChoice.mp3'],
        volume: 0.5,
    });

    theEndSound = new Howl({
        src: ['./sound/theEnd.mp3'],
        volume: 0.5,
    });  
}

// Animations
function fallAnimation(){
    for(let i = MAP_SIZE - 2; i >= 0; i--){
        for(let j = 0; j < MAP_SIZE; j++){
            let fallTiles = freeSpaceBelow(i, j);
            if(fallTiles > 0){
                players[i][j].Animation = new TweenMax.to(players[i][j], 0.33, {
                    y: players[i][j].y + fallTiles * 70,//70px = размер картинки + отступ  
                    ease: "power2.inOut",
                });
            }
        }
    }
}

function freeSpaceBelow(row, col){
    let result = 0;
    for(let i = row + 1; i < MAP_SIZE; i++){
        if(players[i][col].id == 9){
            result++;
        }
    }
    return result;
}

function deadAnimation(tempObj, player){
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            if(players[i][j].id == 9 ){
                players[i][j].Animation = new TweenMax.to(players[i][j].scale, 0.75, {
                    x: 0.0,
                    y: 0.0, 
                    ease: Power3.easeOut
                });
            }
        }
    }
}

function playAnimationMove(tempObj, player){
    let playerLastX = player.x;
    let playerLastY = player.y;

    let tempObjLastX = tempObj.x;
    let tempObjLastY = tempObj.y;
    
    if((tempObj.j - player.j) == -1){
        player.Animation = new TweenMax.to(player, 0.5, {
            x: tempObjLastX, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
    }else if((tempObj.j - player.j) == 1){
        player.Animation = new TweenMax.to(player, 0.5, {
            x: tempObj.x, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            x: playerLastX, 
            ease: Power3.easeOut
        });

    }else if((tempObj.i - player.i) == 1){
        console.log("TOP")
        player.Animation = new TweenMax.to(player, 0.5, {
            y: tempObjLastY, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }else if((tempObj.i - player.i) == -1){
        console.log("BOTTOM")
        // killPlayerAnimation(player);
        player.Animation = new TweenMax.to(player, 0.5, {
            y: tempObjLastY, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }
}

function badStepAnimation(tempObj, player){
    let playerLastX = player.x;
    let playerLastY = player.y;

    let tempObjLastX = tempObj.x;
    let tempObjLastY = tempObj.y;
    
    if((tempObj.j - player.j) == -1){
        player.Animation = new TweenMax.to(player, 0.5, {
            x: tempObjLastX, 
            ease: Power3.easeOut,
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            x: playerLastX, 
            yoyo: true,
            ease: Power3.easeOut,
        });

        setTimeout(()=>{
            player.Animation = new TweenMax.to(player, 0.5, {
                x: playerLastX, 
                ease: Power3.easeOut,
            });
    
            tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
                x: tempObjLastX, 
                yoyo: true,
                ease: Power3.easeOut,
            });
        }, 500); 
    }else if((tempObj.j - player.j) == 1){
        player.Animation = new TweenMax.to(player, 0.5, {
            x: tempObj.x, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            x: playerLastX, 
            ease: Power3.easeOut
        });

        setTimeout(()=>{
            player.Animation = new TweenMax.to(player, 0.5, {
                x: playerLastX, 
                ease: Power3.easeOut,
            });
    
            tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
                x: tempObjLastX, 
                yoyo: true,
                ease: Power3.easeOut,
            });
        }, 500);
    }else if((tempObj.i - player.i) == 1){
        player.Animation = new TweenMax.to(player, 0.5, {
            y: tempObjLastY, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            y: playerLastY, 
            ease: Power3.easeOut
        });

        setTimeout(()=>{
            player.Animation = new TweenMax.to(player, 0.5, {
                y: playerLastY, 
                ease: Power3.easeOut,
            });
    
            tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
                y: tempObjLastY, 
                yoyo: true,
                ease: Power3.easeOut,
            });
        }, 500);

    }else if((tempObj.i - player.i) == -1){
        player.Animation = new TweenMax.to(player, 0.5, {
            y: tempObjLastY, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            y: playerLastY, 
            ease: Power3.easeOut
        });

        setTimeout(()=>{
            player.Animation = new TweenMax.to(player, 0.5, {
                y: playerLastY, 
                ease: Power3.easeOut,
            });
    
            tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
                y: tempObjLastY, 
                yoyo: true,
                ease: Power3.easeOut,
            });
        }, 500);
    }
}

function playerAnimation(player){
    player.Animation = new TweenMax.to(player.scale, 0.4, {
        x: 1.3, 
        y: 1.3, 
        repeat: -1,
        pixi: { tint: 0x2196F3 },
        repeatDelay: 0.05,
        ease: "power2.inOut",
        yoyo: true,
    });
}

function killPlayerAnimation(player){
    if(player.Animation != null){
        player.Animation.kill();
        player.Animation = new TweenMax.to(player.scale, 0.7, {
            x: 1.0, 
            y: 1.0, 
            pixi: { tint: 0x2196F3 },
            repeatDelay: 0.2,
            ease: "power2.inOut",
            yoyo: true,
        });
    }else{
        player.Animation = new TweenMax.to(player.scale, 0.7, {
            x: 1.0, 
            y: 1.0, 
            pixi: { tint: 0x2196F3 },
            repeatDelay: 0.2,
            ease: "power2.inOut",
            yoyo: true,
        });
    }
    
}