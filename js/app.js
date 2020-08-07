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
            
            players[i][j].on('pointerdown', clickFunction.bind(this, players[i][j]));
            
            x += 70;

            app.stage.addChild(players[i][j]);
        }
        y += 70;
        x  = 10;
    }

    return players;
}

function clickFunction(player){
    
    switch(playerClick){
        case 2:{
            playerClick++;
            console.log(`Выбран второй объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            if(isNear(tempObj, player)){
                
                playAnimationMove(tempObj, player);
            }else{
                console.log("is not near");
                killPlayerAnimation(players[tempObj.i][tempObj.j]);
            }
            
            playerClick = 1;
            break;
        }
        case 1:{
            playerClick++;
            console.log(`Выбран первый объект id = ${player.id}, i = ${player.i}, j = ${player.j}`);
            // tempObj.i = player.i;
            // tempObj.j = player.j;
            tempObj = player;

            playerAnimation(player);
            break;
        }
    } 
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
    
    if((tempObj.j - player.j) == -1){
        console.log("PLAY RIGHT");
        player.Animation = new TweenMax.to(player, 1, {
            x: tempObj.x, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(players[tempObj.i][tempObj.j]);
        players[tempObj.i][tempObj.j].Animation = new TweenMax.to(players[tempObj.i][tempObj.j], 1, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
    }else if((tempObj.j - player.j) == 1){
        console.log("PLAY LEFT");
        player.Animation = new TweenMax.to(player, 1, {
            x: tempObj.x, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(players[tempObj.i][tempObj.j]);
        players[tempObj.i][tempObj.j].Animation = new TweenMax.to(players[tempObj.i][tempObj.j], 1, {
            x: playerLastX, 
            ease: Power3.easeOut
        });
    }else if((tempObj.i - player.i) == 1){
        console.log("PLAY TOP");
        player.Animation = new TweenMax.to(player, 1, {
            y: tempObj.y, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(players[tempObj.i][tempObj.j]);
        players[tempObj.i][tempObj.j].Animation = new TweenMax.to(players[tempObj.i][tempObj.j], 1, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }else if((tempObj.i - player.i) == -1){
        console.log("PLAY BOTTOM");
        player.Animation = new TweenMax.to(player, 1, {
            y: tempObj.y, 
            ease: Power3.easeOut
        });

        killPlayerAnimation(players[tempObj.i][tempObj.j]);
        players[tempObj.i][tempObj.j].Animation = new TweenMax.to(players[tempObj.i][tempObj.j], 1, {
            y: playerLastY, 
            ease: Power3.easeOut
        });
    }
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
    player.Animation.kill();
    player.Animation = new TweenMax.to(player.scale, 0.7, {
        x: 1.0, 
        y: 1.0, 
        pixi: { tint: 0x2196F3 },
        repeatDelay: 0.2,
        ease: "power2.inOut",
        yoyo: true,
    });
}