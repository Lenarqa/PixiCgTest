//configs
let config
let MAP_SIZE = 6;
let MAP_WIDTH = 410;
let MAP_HEIGHT = 450;
let app;
let menu;
let colors = ['./img/beer.png', './img/coffee.png', './img/martini.png', './img/coffee-mug.png', './img/teapot.png'];
let onOrDisable = ['./img/sound-off.png', './img/sound-on.png'];
let restart = ['./img/restart.png'];
let restartBtn;
let soundBtn;
let playerClick = 1;
let isPlayerClick = false;
let tempObj = {};
let players = [];
let container;
let gameTime = 30;
let time;
let updateInterval;

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
    initChooseTime();
}

function initChooseTime(){
    container = document.getElementById('container');
    config = {
        width: 410,//6 * 6
        height: 450,//6 * 6
        backgroundColor: 0x131317,
    }

    menu = new PIXI.Application(config);
    container.appendChild(menu.view);

    if(container.firstChild != null){
        let child = container.firstChild;
        container.removeChild(child);
    }

    container.appendChild(menu.view);

    let timeSceneText = [];
    timeSceneText[0] = new PIXI.Sprite.from('./img/chooseTime.png');
    timeSceneText[0].x = config.width * 0.45;
    timeSceneText[0].y = config.height * 0.2;
    timeSceneText[0].Animation = new TweenMax.to(timeSceneText[0].scale, 1, {
        x: 1.3, 
        y: 1.3, 
        repeat: -1,
        repeatDelay: 0.02,
        ease: "power2.inOut",
        yoyo: true,
    });
    menu.stage.addChild(timeSceneText[0]);

    timeSceneText[1] = new PIXI.Text(`Choose game time\n(seconds)`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF, align: 'center'});
    timeSceneText[1].x = config.width * 0.2;
    timeSceneText[1].y = config.height * 0.35;
    menu.stage.addChild(timeSceneText[1]);

    timeSceneText[2] = new PIXI.Text(`30`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    timeSceneText[2].x = config.width * 0.46;
    timeSceneText[2].y = config.height * 0.53;
    timeSceneText[2].interactive = true;
    timeSceneText[2].on('pointerdown', ()=>{
        gameTime = 30;
        timeSceneText[2].Animation = new TweenMax.to(timeSceneText[2], 0.7, {
            x: timeSceneText[2].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseTime(timeSceneText);
        }, 700); 
    });
    menu.stage.addChild(timeSceneText[2]);

    timeSceneText[3] = new PIXI.Text(`60`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    timeSceneText[3].x = config.width * 0.46;
    timeSceneText[3].y = config.height * 0.63;
    timeSceneText[3].interactive = true;
    timeSceneText[3].on('pointerdown', ()=>{
        gameTime = 60;
        timeSceneText[3].Animation = new TweenMax.to(timeSceneText[3], 0.7, {
            x: timeSceneText[3].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseTime(timeSceneText);
        }, 700); 
    });
    menu.stage.addChild(timeSceneText[3]);

    timeSceneText[4] = new PIXI.Text(`120`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    timeSceneText[4].x = config.width * 0.44;
    timeSceneText[4].y = config.height * 0.73;
    timeSceneText[4].interactive = true;
    timeSceneText[4].on('pointerdown', ()=>{
        gameTime = 120;
        timeSceneText[4].Animation = new TweenMax.to(timeSceneText[4], 0.7, {
            x: timeSceneText[4].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseTime(timeSceneText);
        }, 700); 
    });
    menu.stage.addChild(timeSceneText[4]);
    
}

function clearInitChooseTime(timeSceneText){
    timeSceneText.forEach((el)=>{
        el.Animation = new TweenMax.to(el, 0.700, {
            x: el.x - 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
    });
    setTimeout(initChooseGameSize, 700);
}

function initChooseGameSize(){
    let sizeSceneText = [];
    sizeSceneText[0] = new PIXI.Sprite.from('./img/mapSize.png');
    sizeSceneText[1] = new PIXI.Text(`Choose game map size`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF, align: 'center'});
    sizeSceneText[2] = new PIXI.Text(`6 * 6`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    sizeSceneText[3] = new PIXI.Text(`7 * 7`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    sizeSceneText[4] = new PIXI.Text(`8 * 8`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    // sizeSceneText[5] = new PIXI.Text(`* beta version, has\nproblem with some\n animations`,{fontFamily : 'Arial', fontSize: 32, fill : 0xFFFFFF});
    // sizeSceneText[5].x = config.width * 0.1 - 100;
    // sizeSceneText[5].y = config.height * 0.73;
    // menu.stage.addChild(sizeSceneText[5]);

    sizeSceneText.forEach(el =>{
        el.alpha = 0;
    });
    
    sizeSceneText[0].x = config.width * 0.45 - 100;
    sizeSceneText[0].y = config.height * 0.2;
    sizeSceneText[0].Animation = new TweenMax.to(sizeSceneText[0].scale, 1, {
        x: 1.3, 
        y: 1.3, 
        repeat: -1,
        repeatDelay: 0.02,
        ease: "power2.inOut",
        yoyo: true,
    });
    menu.stage.addChild(sizeSceneText[0]);

    sizeSceneText[1].x = config.width * 0.1 - 100;
    sizeSceneText[1].y = config.height * 0.35;
    menu.stage.addChild(sizeSceneText[1]);

    sizeSceneText[2].x = config.width * 0.43 - 100;
    sizeSceneText[2].y = config.height * 0.43;
    sizeSceneText[2].interactive = true;
    sizeSceneText[2].on('pointerdown', ()=>{
        MAP_SIZE = 6;
        MAP_WIDTH = 410;
        MAP_HEIGHT = 450;
        sizeSceneText[2].Animation = new TweenMax.to(sizeSceneText[2], 0.7, {
            x: sizeSceneText[2].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseGameSize(sizeSceneText);
        }, 700); 
        
    });
    menu.stage.addChild(sizeSceneText[2]);

    sizeSceneText[3].x = config.width * 0.43 - 100;
    sizeSceneText[3].y = config.height * 0.53;
    sizeSceneText[3].interactive = true;
    sizeSceneText[3].on('pointerdown', ()=>{
        MAP_SIZE = 7;
        MAP_WIDTH = 480;
        MAP_HEIGHT = 520;
        sizeSceneText[3].Animation = new TweenMax.to(sizeSceneText[3], 0.7, {
            x: sizeSceneText[3].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseGameSize(sizeSceneText);
        }, 700);
    });
    menu.stage.addChild(sizeSceneText[3]);

    sizeSceneText[4].x = config.width * 0.43 - 100;
    sizeSceneText[4].y = config.height * 0.63;
    sizeSceneText[4].interactive = true;
    sizeSceneText[4].on('pointerdown', ()=>{
        MAP_SIZE = 8;
        MAP_WIDTH = 550;
        MAP_HEIGHT = 590;
        sizeSceneText[4].Animation = new TweenMax.to(sizeSceneText[4], 0.7, {
            x: sizeSceneText[4].x + 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
        setTimeout(()=>{
            clearInitChooseGameSize(sizeSceneText);
        }, 700);
    });

    showChooseGameSize(sizeSceneText);

    menu.stage.addChild(sizeSceneText[4]);
}

function showChooseGameSize(sizeSceneText){
    sizeSceneText.forEach((el) =>{
        el.Animation = new TweenMax.to(el, 0.7, {
            alpha: 1,
            x: el.x + 100, 
            ease: "power2.inOut",
        });
    })
}

function clearInitChooseGameSize(sizeSceneText){
    sizeSceneText.forEach((el)=>{
        el.Animation = new TweenMax.to(el, 0.7, {
            x: el.x - 100, 
            alpha: 0,
            ease: "power2.inOut",
        });
    });
    setTimeout(startGame, 700);
}

// GamePlay
function startGame(){
    let isPlay = true;
    time = gameTime;

    config = {
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        backgroundColor: 0x131317,
    }

    app = new PIXI.Application(config);

    //sound
    if(mainSound == null){
        initSound();
    }

    //soundBtn
    initSoundBtn();

    players = []; //reset players
    //createMap
    createMap(players, colors); 
    
    update();

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

function update(){
    updateInterval =  setInterval(()=>{
        if(isThreeUpdate()){
            setTimeout(()=>{
                console.log("Три на карте!");
                deleteThree(); 
                deadAnimation();
                
                setTimeout(fallAnimationUpdate, 300);
                fallObjs();
                setTimeout(renderMapUpdate, 510);
                
                addScore();
           })
        }else{
            isPlayerClick = false;
        }
    }, 1300);
}


function initRestartBtn(){
    restartBtn = new PIXI.Sprite.from(restart[0]);
    restartBtn.x = config.width * 0.45;
    restartBtn.y = config.height * 0.5;
    restartBtn.interactive = true;
    restartBtn.on('pointerdown', ()=>{
        console.log("GAME OVER INIT TIME");
        isPlayerClick = false;
        initChooseTime();
    });
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
    clearInterval(updateInterval);
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
        x: config.width * 0.5 - 110,
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
              
                let iMinus = tempObj.i - player.i;
                changeIandJ(tempObj, player);
                playAnimationMove(tempObj, player);
                swapObject(tempObj, player);
                
                if(isSoundPlay){
                    goodChoiceSound.play();
                }

                isPlayerClick = true; 
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
            if(isPlayerClick){
                return;
            }

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

function renderMapUpdate(){    
    // console.log('render map')
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
                    if(random == players[i][j-1].id && random == players[i][j-2].id){
                        if(random < colors.length-1){
                            random++;
                        }else{
                            random--;
                        }
                    }
                }
                players[i][j].id = random;
                players[i][j].texture = PIXI.Texture.from(colors[random]);

                gsap.to(players[i][j].scale, 0.5, {
                    x: 1.0, 
                    y: 1.0, 
                    ease: "power2.inOut",
                });
                gsap.from(players[i][j], 
                {
                    y: players[i][j].y-400, ease: "power2.inOut"
                }, 
                {
                    y: players[i][j].y, alpha: 1, ease: "power2.inOut", duration: 0.5
                })
            }else{
                players[i][j].x = 10 + j * 70;
                players[i][j].y = yPos[i];
                players[i][j].alpha = 1;
                players[i][j].texture = PIXI.Texture.from(colors[players[i][j].id]);
            } 
        }
    }

    // let tempPlayersId = players.map(function(arr) {
    //     return arr.map(el =>{
    //         return el.id;
    //     });
    // });
    // console.log(tempPlayersId);
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

function isThreeUpdate(){
    let col = 0;
    let tempPlayersId = players.map(function(arr) {
        return arr.map(el =>{
            return el.id;
        });
    });

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
function fallAnimationUpdate(){
    for(let i = MAP_SIZE - 2; i >= 0; i--){
        for(let j = 0; j < MAP_SIZE; j++){
            let fallTiles = freeSpaceBelow(i, j);
            if(fallTiles > 0){
                gsap.to(players[i][j], 0.5, {
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

function deadAnimation(){
    let tl = new TimelineLite();
    for (let i = 0; i < MAP_SIZE; i++) {
        for (let j = 0; j < MAP_SIZE; j++) {
            if(players[i][j].id == 9 ){
                tl.staggerTo(players[i][j].scale, 0.1, {
                    x: 0.0,
                    y: 0.0,
                    ease: Power3.easeOut, 
               }, 0.05);
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