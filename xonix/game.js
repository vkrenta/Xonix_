sprites = {
    background: undefined,
    ball: undefined,
    cell: undefined,
    enemy: undefined,
    tail: undefined,
}

var ctx;
var width = 400;
var height = 188;
var w = Math.floor(width/8);
var h = Math.floor(height/8);

var cells = [];

var enemy = {
    currentFrame: 0,
    w: 16,
    elapsedTime: Date.now(),
    velocity: 7,
    dy: Math.random(),
    dx: undefined,
    x: 50,
    y: 50,
    getFrameXY(){
        var delay = 50;
        if (Date.now() - this.elapsedTime >= delay) {
            this.currentFrame++;
            this.elapsedTime = Date.now();
        }
        if (this.currentFrame > 3) this.currentFrame = 0;
        return {
            x: this.w * this.currentFrame,
            y: 0,
        };
    },
    move(){
        var X = Math.floor(this.x/8);
        var Y = Math.floor(this.y/8);

        if (cells[X+1][Y] == 0 || cells[X-1][Y] == 0) this.dx = -this.dx;
        if (cells[X][Y+1] == 0 || cells[X][Y-1] == 0) this.dy = -this.dy;
    }
}

var enemies = [];
var enemyCount = 0;

var ball = {
    dx: 0,
    dy: 0,
    velocity: 8,
    x: 0,
    y: 0,
}

var game = {

    create(){
        enemyCount = 3;
        for (var i = 0; i<enemyCount; i++){
            enemies.push({
                currentFrame: 0,
                w: 16,
                elapsedTime: Date.now(),
                velocity: Math.random()*8,
                dy: Math.random(),
                dx: undefined,
                x: 50,
                y: 50,
                getFrameXY(){
                    var delay = 50;
                    if (Date.now() - this.elapsedTime >= delay) {
                        this.currentFrame++;
                        this.elapsedTime = Date.now();
                    }
                    if (this.currentFrame > 3) this.currentFrame = 0;
                    return {
                        x: this.w * this.currentFrame,
                        y: 0,
                    };
                },
                move(){
                    var X = Math.floor(this.x/8);
                    var Y = Math.floor(this.y/8);
            
                    if (cells[X+1][Y] == 0 || cells[X-1][Y] == 0) this.dx = -this.dx;
                    if (cells[X][Y+1] == 0 || cells[X][Y-1] == 0) this.dy = -this.dy;
                }
            });
            enemies[i].dx = 1 - enemies[i].dy;
        }
        for (var i = 0; i < w; i++){
            cells.push([]);
            for (var j = 0; j < h; j++){
                cells[i].push(1);
                if (i < 2 || i > w - 3 || j < 2 || j > h - 3) cells[i][j] = 0;
            }
        }

    },

    init(){
        var canvas = document.getElementById("canv");
        ctx = canvas.getContext("2d");
        

        window.addEventListener("keydown", (e) => {
            switch (e.key){
            case ("ArrowRight"): { ball.dx = 1; ball.dy = 0;} break;
            case ("ArrowLeft"): {ball.dx = -1; ball.dy = 0;} break;
            case ("ArrowUp"): {ball.dx = 0; ball.dy = -1;} break;
            case ("ArrowDown"): {ball.dx = 0; ball.dy = 1;} break;
            case ("Right"): { ball.dx = 1; ball.dy = 0;} break;
            case ("Left"): {ball.dx = -1; ball.dy = 0;} break;
            case ("Up"): {ball.dx = 0; ball.dy = -1;} break;
            case ("Down"): {ball.dx = 0; ball.dy = 1;}break;
            default: break;
            }

            var X = Math.floor(ball.x/8);
            var Y = Math.floor(ball.y/8);

            if (!cells[X][Y]) {
                
                ball.x += ball.dx*ball.velocity;
                ball.y += ball.dy*ball.velocity;
            }

            game.update();
			
        }, true);
    },

    move(){
        ball.x += ball.dx*ball.velocity;
        ball.y += ball.dy*ball.velocity;

        for (var i = 0; i<enemyCount; i++){
        
        enemies[i].move();

        enemies[i].x += enemies[i].dx*enemies[i].velocity;
        enemies[i].y += enemies[i].dy*enemies[i].velocity;}
    },

    load(){
        for (var key in sprites){
            sprites[key] = new Image();
            sprites[key].src = "images/" + key + ".png";
        }
    },

    
    update(){
        if (ball.x <= 0) ball.x = 0; if (ball.x >= (w-1)*8) ball.x = (w-1)*8;
        if (ball.y <= 0) ball.y = 0; if (ball.y >= (h-1)*8) ball.y = (h-1)*8;      

        var X = Math.floor(ball.x/8);
        var Y = Math.floor(ball.y/8);

        switch (cells[X][Y]) {
            case 1: 
            cells[X][Y] = 2;
                break;
            case 0:
                    ball.dx = ball.dy = 0;
                    for (var i = 0; i<enemyCount; i++){
                    game.fill(Math.floor(enemies[i].x/8), Math.floor(enemies[i].y/8));
                    }
                    for (var i = 0; i < w; i++){
                        for (var j = 0; j < h; j++){
                            if (cells[i][j]==-1) cells[i][j]=1;
                            else cells[i][j]=0;
                        }}
                    break;
            default:
                break;
        }

    },

    fill(y, x){
        if (cells[y][x] == 1) cells[y][x] = -1;
        if (cells[y-1][x] == 1) this.fill(y-1, x);
        if (cells[y+1][x] == 1) this.fill(y+1, x);
        if (cells[y][x-1] == 1) this.fill(y, x-1);
        if (cells[y][x+1] == 1) this.fill(y, x+1);
    },

    

    render(){
        var radius = 5;
        ctx.clearRect(0,0,width,height);
        ctx.drawImage(sprites.background, 0, 0, 1300, 600, 0, 0, width, height);
        for (var i = 0; i < w; i++){
            for (var j = 0; j < h; j++){

            switch (cells[i][j]) {
                case 0:
                    break;
                case 1: ctx.drawImage(sprites.cell, i*8, j*8); break;
                case 2: ctx.drawImage(sprites.tail, i*8, j*8); break;
                default:
                    break;
            }
            }
        }
        for (var i = 0; i<enemyCount; i++){
        
        ctx.drawImage(sprites.enemy, enemies[i].getFrameXY().x, enemies[i].getFrameXY().y, enemies[i].w, enemies[i].w,
        enemies[i].x-radius, enemies[i].y-radius, enemies[i].w, enemies[i].w);
        }
        ctx.drawImage(sprites.ball, ball.x - radius, ball.y - radius);


    },

    

    run(){
        setInterval(game.update);
        setInterval(game.move, 50);
        
        setInterval(game.render);
    },

    start(){
        this.create();
        this.init();
        this.load();
        this.run();
    },
}

window.addEventListener("load", () => {
    game.start();
})