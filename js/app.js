const MAP_SIZE = 6;
let app;
let player;
let colors = ['./img/beer.png', './img/coffee.png', './img/martini.png'];

window.onload = function(){
    let container = document.getElementById('container');
    
    app = new PIXI.Application(
        {
            width: 450,
            height: 450,
            backgroundColor: 0x20B2AA,
        }
    );

    let players = [];

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
            // players[i][j].tint = 0x33CCFF;

            players[i][j].id = random;
            
            players[i][j].on('pointerdown', ()=>{
                console.log(players[i][j].id);

                TweenMax.to(players[i][j].scale, 1, {
                    x: 1.3, 
                    y: 1.3, 
                    repeat: -1,
                    pixi: { tint: 0x2196F3 },
                    repeatDelay: 0.2,
                    ease: "power2.inOut",
                    yoyo: true,
                });
            })

            

            x += 70;

            app.stage.addChild(players[i][j]);
        }
        y += 70;
        x  = 10;
    }

    return players;
}