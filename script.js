const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

context.fillStyle = '#FFF';
context.fillRect(0, 0, canvas.width, canvas.height);

var GameObjectList = new Array();
var Keys = {Space: false, ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};
var Axis = {Horizontal: 0, Vertical: 0};

const ARROW_LEFT = 37;
const ARROW_UP = 38;
const ARROW_RIGHT = 39;
const ARROW_DOWN = 40;

const diagMagn = Math.cos(Math.PI / 4);
const Versor = [
    [diagMagn, 1, diagMagn],
    [1, 0, 1],
    [diagMagn, 1, diagMagn]
]

function Vector2 (x, y) {
    this.x = x;
    this.y = y;
}

function Renderer(src, mirrorsrc) {
    this.orientation = true;
    this.image = new Image();
    if(mirrorsrc) {
        this.mirrorImage = new Image();
        this.mirrorImage.src = mirrorsrc;
    }
    else {
        this.mirrorImage = null;
    }
    this.image.src = src;
} 

function Animator(src, mirrorsrc, frames, width, height) {
    this.orientation = true;
    this.image = new Image();
    this.mirrorImage = new Image();
    this.mirrorImage.src = mirrorsrc;
    this.image.src = src;
    this.frames = frames;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
}

Animator.prototype = {
    nextImageIndex: function () {
        if(this.orientation) {
            return (Math.trunc(x++/4)) % 8;
        }
        else {
            if(Math.trunc(y/4) >= 8) {
                y -= 8*4;
            }
            return (8-Math.trunc(y++/4)) % 8
        }
    }
}

function GameObject(Name, Transform, Renderer, Animator) {
    this.Name = Name;
    this.Transform = Transform || null;
    this.Renderer = Renderer || null;
    this.Animator = Animator || null;
}

GameObject.prototype = {
    addComponent: function(CmpName, Cmp) {
        switch(CmpName) {
            case "Transform": this.Transform = Cmp;
                break;
            case "Renderer": this.Renderer = Cmp;
                break;
            case "Animator": this.Animator = Cmp;
        }
    }
}


function KeyDownManager(event) {
    event.preventDefault();
    if(event.keyCode === ARROW_LEFT) {
        Keys.ArrowLeft = true;
        Axis.Horizontal = -1;
    }
    if(event.keyCode === ARROW_UP) {
        Keys.ArrowUp = true;
        Axis.Vertical = -1;
    }
    if(event.keyCode === ARROW_RIGHT) {
        Keys.ArrowRight = true;
        Axis.Horizontal = 1;
    }
    if(event.keyCode === ARROW_DOWN) {
        Keys.ArrowDown = true;
        Axis.Vertical = 1;
    }
    if(event.keyCode === 32) {
        Keys.Space = true;
    }
}

function KeyUpManager(event) {
    event.preventDefault();
    if(event.keyCode === ARROW_LEFT) {
        Keys.ArrowLeft = false;
        if(!Keys.ArrowRight)
            Axis.Horizontal = 0;
        else
            Axis.Horizontal = 1;
    }
    if(event.keyCode === ARROW_UP) {
        Keys.ArrowUp = false;
        if(!Keys.ArrowDown)        
            Axis.Vertical = 0;
        else
            Axis.Vertical = 1;
    }
    if(event.keyCode === ARROW_RIGHT) {
        Keys.ArrowRight = false;
        if(!Keys.ArrowLeft)        
            Axis.Horizontal = 0;
        else
            Axis.Horizontal = -1;
    }
    if(event.keyCode === ARROW_DOWN) {
        Keys.ArrowDown = false;
        if(!Keys.ArrowUp)        
            Axis.Vertical = 0;
        else
            Axis.Vertical = -1;
    }
    if(event.keyCode === 32) {
        Keys.Space = false;
    }
}

document.addEventListener('keydown', KeyDownManager, false);
document.addEventListener('keyup', KeyUpManager, false);

var player;
var x = 0;
var y = 0;
var background;
const speed = 4.5;
var worldMovement;

function Start() {
    background = new GameObject('Background', new Vector2(0, 0), new Renderer("Grass2.png", null));
    
    player = new GameObject("Player", new Vector2(150, 150));
    player.addComponent("Renderer", new Renderer("Frog_Idle_COLORv1.png", "Frog_Idle_COLORv1 - Flipped.png"));
    player.addComponent("Animator", new Animator("Frog_Run_COLORv1.png", "Frog_Run_COLORv1 - Flipped.png", 8, 64, 64));

    goat = new GameObject("Goat", new Vector2(100, 100), new Renderer("Bucket-Idle.png"));
    
    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }

    GameObjectList.push(background);
    GameObjectList.push(goat);
}

function Update(deltaTime) {
    worldMovement = new Vector2(Math.trunc(Axis.Horizontal * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed ), Math.trunc(Axis.Vertical * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed)); 

    player.Transform.x += worldMovement.x;
    player.Transform.y += worldMovement.y;
    
    if((player.Animator.orientation && Axis.Horizontal == -1)) {
        player.Animator.orientation = false;
        player.Renderer.orientation = false;
    }
    else if ((!player.Animator.orientation && Axis.Horizontal == 1)){
        player.Animator.orientation = true;
        player.Renderer.orientation = true;
    }
}
function Render() {
    context.translate(-worldMovement.x, -worldMovement.y);
    context.putImageData(emptyCanvas, 0, 0);
    for(var i = 0; i < GameObjectList.length; i++) {
        var currObj = GameObjectList[i];
        context.drawImage(currObj.Renderer.image, currObj.Transform.x, currObj.Transform.y);
    }
    if(Axis.Horizontal || Axis.Vertical) {
        if(player.Animator.orientation) {
            context.drawImage(player.Animator.image, player.Animator.nextImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
        }
        else {
            context.drawImage(player.Animator.mirrorImage, player.Animator.nextImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
        }
    }
    else {
        if(player.Renderer.orientation) {  
            context.drawImage(player.Renderer.image, player.Transform.x, player.Transform.y);
        }
        else if(!player.Renderer.orientation) {
            context.drawImage(player.Renderer.mirrorImage, player.Transform.x, player.Transform.y);
        }
    }
}

var lastTime = 0;
function GameLoop(time = 0) {
    deltaTime = time - lastTime;
    lastTime = time;
    Update(deltaTime);
    Render();
    requestAnimationFrame(GameLoop);
}

Start();
GameLoop();