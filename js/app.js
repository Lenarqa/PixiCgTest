const MAP_SIZE = 6;
let app;
let player;
let colors = ['./img/beer.png', './img/coffee.png', './img/martini.png'];
let playerClick = 1;
let tempObj = {};
let players = [];

window.onload = function(){
    let container = document.getElementById('container');
    
    app = new PIXI.Application(
        {
            width: 450,
            height: 450,
            backgroundColor: 0x20B2AA,
        }
    );

    

    createMap(players, colors); 

    let idArray = [];

    // document.body.appendChild(app.view);
    container.appendChild(app.view);
}

function createMap(players){
    let x = 10;
    let y = 10;

    for (let i = 0; i < MAP_SIZE; i++) {

        players[i] = [];
        for (let j = 0; j < MAP_SIZE; j++) {
            
            let random = Math.floor(Math.random() * 3); 
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

            console.log(`Выбран второй объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            if(isNear(tempObj, player) && isThree(tempObj, player)){
                console.log("Is near");
                
                playAnimationMove(tempObj, player);
                changeIandJ(tempObj, player);

            }else{
                if(!isNear(tempObj, player)){
                    console.log("is not near");
                    killPlayerAnimation(tempObj);
                }else{
                    console.log("or is not Three");
                    badStepAnimation(tempObj, player);
                }
            }
                      
            break;
        }
        case 1:{
            playerClick++;
            console.log(`Выбран первый объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            tempObj = player;
            playerAnimation(tempObj);
            break;
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
    console.log("tempID "+ tempID)
    
    tempPlayersId[player.i][player.j] = tempPlayersId[tempObj.i][tempObj.j];
    tempPlayersId[tempObj.i][tempObj.j] = tempID;

    return tempPlayersId;
}

function changeIandJ(tempObj, player){
    let i = tempObj.i;
    let j = tempObj.j;

    tempObj.i = player.i;
    tempObj.j = player.j;

    player.i = i;
    player.j = j;
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

// Animations
function playAnimationMove(tempObj, player){
    let playerLastX = player.x;
    let playerLastY = player.y;

    let tempObjLastX = tempObj.x;
    let tempObjLastY = tempObj.y;
    
    if((tempObj.j - player.j) == -1){
        console.log("PLAY RIGHT");
        player.Animation = new TweenMax.to(player, 0.5, {
            x: tempObjLastX, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 0.5, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
        
        // killPlayerAnimation(players[player.i][player.j].Animation);
    }else if((tempObj.j - player.j) == 1){
        console.log("PLAY LEFT");
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
        console.log("PLAY TOP");
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
        console.log("PLAY BOTTOM");
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
        console.log("PLAY RIGHT bad step");
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
        
        // killPlayerAnimation(players[player.i][player.j].Animation);
    }else if((tempObj.j - player.j) == 1){
        console.log("PLAY LEFT bad step");
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
        console.log("PLAY TOP bad step");
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
        console.log("PLAY BOTTOM bad step");
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
        repeatDelay: 0.2,
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