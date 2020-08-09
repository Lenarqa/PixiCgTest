const MAP_SIZE = 8;
let app;
let player;
let colors = ['./img/beer.png', './img/coffee.png', './img/martini.png', './img/coffee-mug.png', './img/teapot.png'];
let playerClick = 1;
let tempObj = {};
let players = [];
let container

window.onload = function(){
    container = document.getElementById('container');
    
    app = new PIXI.Application(
        {
            // width: 450,
            // height: 450,
            width: 600,
            height: 600,
            backgroundColor: 0x131317,
        }
    );

    createMap(players, colors); 
    let tempIDs = [];
    for (let i = 0; i < MAP_SIZE; i++) {
        tempIDs[i] = [];
       for (let j = 0; j < MAP_SIZE; j++) {
           tempIDs[i][j] = players[i][j].id;
       }
    }
    console.log(tempIDs)
    container.appendChild(app.view);

}

function createMap(players){
    let x = 10;
    let y = 10;

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

            console.log(`Выбран второй объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            
            if(isNear(tempObj, player) && isThree(tempObj, player)){
                console.log("Is near");
                
                changeIandJ(tempObj, player);
                // changeId(tempObj, player);
                playAnimationMove(tempObj, player);
                swapObject(tempObj, player);
                // swapId(tempObj, player);
                deleteThree();
                
                 setTimeout(deadAnimation(tempObj, player), 510);
                fallAnimation();
                fallObjs();
                setTimeout(renderMap, 510);

                // setTimeout(sechNine, 600);
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
            console.log(`Выбран первый объект id = ${player.id}, i = ${player.i}, j = ${player.j} x = ${player.x}, y = ${player.y}`);
            tempObj = player;
            playerAnimation(tempObj);
            break;
        }
    } 
}

function renderMap(){
    console.log("render");
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


                // players[i][j].Animation = new TweenMax.to(players[i][j].scale, 0.1, {
                //     y: 0.8,
                //     ease: "power2.inOut",
                //     yoyo: true,
                // });

                // players[i][j].Animation = new TweenMax.to(players[i][j].scale, 0.1, {
                //     y: 1,
                //     ease: "power2.inOut",
                //     yoyo: true,
                // });

                // setTimeout(()=>{
                //     players[i][j].Animation = new TweenMax.to(players[i][j], 0.4, {
                //         // alpha: 1,
                //         y: yPos[i],
                //         ease: "power2.inOut",
                //         yoyo: true,
                //     });
                // }, 450);
            } 
            
            // players[i][j].Animation = new TweenMax.to(players[i][j], 0.4, {
            //     alpha: 0,
            //     y: yPos[i] - 30,
            //     ease: "power2.inOut",
            //     yoyo: true,
            // });

            // setTimeout(()=>{
            //     players[i][j].Animation = new TweenMax.to(players[i][j], 0.5, {
            //         alpha: 1,
            //         y: yPos[i],
            //         ease: "power2.inOut",
            //         yoyo: true,
            //     });

            //     players[i][j].Animation = new TweenMax.to(players[i][j].scale, 0.5, {
            //         x: 1.0, 
            //         y: 1.0, 
            //         ease: "power2.inOut",
            //         // ease: Power3.easeOut,
            //         yoyo: true,
            //     });
              
            // });
        }
    }

    let tempIDs = players.map(function(arr) {
        return arr.map(el =>{
            return el.id;
        });
    });
    console.log(tempIDs);
}

function sechNine(){
    console.log("Sech Nine");
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
    
    /*
    for (let j = 0; j < MAP_SIZE; j++) {
        if(players[0][j].id == 9){
            players[0][j].x = 10 + j * 70;
            players[0][j].y = 10;
            let random = Math.floor(Math.random() * 3); 
            players[0][j].id = random;
            players[0][j].texture = PIXI.Texture.from(colors[random]);
        }
    }
    */
}

function fallObjs(){
    let pos = players.length - 1;
    for (let i = 0; i < players.length; i++) {
        pos = players.length-1;
        for (let j = players.length-1; j >= 0; j--) {
            if(players[j][i].id != 9){
                // players[pos][i] = players[j][i];
                changeIandJ(players[pos][i], players[j][i]);
                swapObject(players[pos][i], players[j][i]);
                // fallAnimation(players[j][i], players[pos][i]);
                pos--;
            }
        }
        while(pos > -1){
            players[pos--][i].id = 9;
        }
    }

    let tempIDs = players.map(function(arr) {
        return arr.map(el =>{
            return el.id;
        });
    });
    console.log(tempIDs);
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
    
    // players[tempObj.i][tempObj.j].id = player.id;
    // players[player.i][player.j].id = tempID;

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
    // tempObj.i = player.i;
    // tempObj.j = player.j;

    // player.i = i;
    // player.j = j;
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
function fallAnimation(){
    for(let i = MAP_SIZE - 2; i >= 0; i --){
        for(let j = 0; j < MAP_SIZE; j ++){
            //if(!this.gameArray[i][j].isEmpty){
                let fallTiles = holesBelow(i, j);
                if(fallTiles > 0){
                    players[i][j].Animation = new TweenMax.to(players[i][j], 0.5, {
                        y: players[i][j].y + fallTiles * 70,//70px = размер картинки + отступ  
                        ease: "power2.inOut",
                    });
                    // for(let z = i + 1; z < MAP_SIZE; z ++){
                    //     if(players[z][i].id == 9){
                    //         players[z][j].Animation = new TweenMax.to(players[z][j], 0.75, {
                    //             y: players[z][j].y - fallTiles * 65,//70px = размер картинки + отступ  
                    //             ease: Power3.easeOut
                    //         });
                    //     }
                    // }
                }
            //}
        }
    }
}

function holesBelow(row, col){
    let result = 0;
    for(let i = row + 1; i < MAP_SIZE; i ++){
        if(players[i][col].id == 9){
            result ++;
        }
    }
    return result;
}

function deadAnimation(tempObj, player){
    // let tempIDs = [];
    
    // for (let i = 0; i < MAP_SIZE; i++) {
    //     tempIDs[i] = [];
    //    for (let j = 0; j < MAP_SIZE; j++) {
    //        tempIDs[i][j] = players[i][j].id;
    //    }
    // }

    // // console.log(tempObj);
    // // console.log(player)
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
    
    // let tempIDs = [];
    // for (let i = 0; i < MAP_SIZE; i++) {
    //     tempIDs[i] = [];
    //    for (let j = 0; j < MAP_SIZE; j++) {
    //        tempIDs[i][j] = players[i][j].id;
    //    }
    // }
    // console.log("dead animation")
    // console.log(tempIDs);
}

function playAnimationMove(tempObj, player){
    let playerLastX = player.x;
    let playerLastY = player.y;

    let tempObjLastX = tempObj.x;
    let tempObjLastY = tempObj.y;
    
    if((tempObj.j - player.j) == -1){
        console.log("PLAY LEFT");
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
        console.log("PLAY RIGHT");
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
    }else if((tempObj.i - player.i) == -1){
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