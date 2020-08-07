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
    analizHorizontalMap(); //уменьшаем вероятность появления 3 на карте.
}

function clickFunction(player){
    
    switch(playerClick){
        case 2:{
            if(player.i == tempObj.i && player.j == tempObj.j){
                 killPlayerAnimation(tempObj);
            }
            playerClick = 1;
            console.log(`Выбран второй объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            if(isNear(tempObj, player)){
                console.log("Is near")
                playAnimationMove(tempObj, player);
                changeIandJ(tempObj, player);
                // swapObjCoordinats(tempObj, player);

            }else{
                console.log("is not near");
                killPlayerAnimation(tempObj);
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

function playAnimationMove(tempObj, player){
    let playerLastX = player.x;
    let playerLastY = player.y;

    let tempObjLastX = tempObj.x;
    let tempObjLastY = tempObj.y;
    
    if((tempObj.j - player.j) == -1){
        console.log("PLAY RIGHT");
        player.Animation = new TweenMax.to(player, 1, {
            x: tempObjLastX, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 1, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
        
        // killPlayerAnimation(players[player.i][player.j].Animation);
    }else if((tempObj.j - player.j) == 1){
        console.log("PLAY LEFT");
        player.Animation = new TweenMax.to(player, 1, {
            x: tempObj.x, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 1, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
    }else if((tempObj.i - player.i) == 1){
        console.log("PLAY TOP");
        player.Animation = new TweenMax.to(player, 1, {
            y: tempObj.y, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 1, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }else if((tempObj.i - player.i) == -1){
        console.log("PLAY BOTTOM");
        player.Animation = new TweenMax.to(player, 1, {
            y: tempObj.y, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(tempObj);
        tempObj.Animation = new TweenMax.to(tempObj, 1, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }
}

function swapObjCoordinats(tempObj, player){
    console.log('До обмена')
    console.log("tempObj: i = " + tempObj.i + " j = " + tempObj.j);
    console.log("player: i = " + player.i + " j = " + player.j);

    let tempI = players[tempObj.i][tempObj.j].i;
    let tempJ = players[tempObj.i][tempObj.j].j;

    players[tempObj.i][tempObj.j].i = players[player.i][player.j].i;
    players[tempObj.i][tempObj.j].j = players[player.i][player.j].j;


    players[player.i][player.j].i = tempI;
    players[player.i][player.j].j = tempJ;



    console.log('После обмена')
    console.log("tempObj: i = " + tempObj.i + " j = " + tempObj.j);
    console.log("player: i = " + player.i + " j = " + player.j);


}

function playerAnimation(player){
    player.Animation = new TweenMax.to(player.scale, 0.7, {
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