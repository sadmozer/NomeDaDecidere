const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

context.fillStyle = '#FFF';
context.fillRect(0, 0, canvas.width, canvas.height);

var GameObjectList = new Array();
var Keys = {Space: false, ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};
var Axis = {Horizontal: 0, Vertical: 0};

// const ARROW_LEFT = 37;
// const ARROW_UP = 38;
// const ARROW_RIGHT = 39;
// const ARROW_DOWN = 40;

const ARROW_UP = 87;
const ARROW_LEFT = 65;
const ARROW_RIGHT = 68;
const ARROW_DOWN = 83; 

const diagMagn = Math.cos(Math.PI / 4);
// Beatty sequence number
const speed = 7;
const s = speed / (Math.sqrt(2)*Math.trunc(speed/Math.sqrt(2)))
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
            return (Math.trunc(this.x++/4)) % 8;
        }
        else {
            if(Math.trunc(this.y/4) >= 8) {
                this.y -= 8*4;
            }
            return (8-Math.trunc(this.y++/4)) % 8
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

var flag = false;
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
    if(event.keyCode === 32 && !event.repeat) {
        Keys.Space = true;
        flag = true;
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
    if(event.keyCode === 32 && !event.repeat) {
        Keys.Space = false;
        console.log("yee");
    }
}

var rect = canvas.getBoundingClientRect();
function MouseDownManager(event) {
    beginLine.x = event.clientX-rect.left;
    beginLine.y = event.clientY-rect.top;
    draw = true;
}
function MouseUpManager(event) {
    endLine.x = event.clientX-rect.left;
    endLine.y = event.clientY-rect.top;
    draw = false;
}

var mouseX;
var mouseY;
function MouseMoveManager(event) {
    mouseX = event.clientX-rect.left;
    mouseY = event.clientY-rect.top;
}
function doScroll(event) {
    event.preventDefault();
}
document.addEventListener('keydown', KeyDownManager, false);
document.addEventListener('keyup', KeyUpManager, false);
document.addEventListener('mousedown', MouseDownManager, false);
document.addEventListener('mouseup', MouseUpManager, false);
document.addEventListener('mousemove', MouseMoveManager, false);
document.addEventListener("wheel", doScroll, false);

var beginLine;
var endLine;
var draw;
var player;
var background;
var target;
var worldMovement;
var collected;
function Start() {
    beginLine = new Vector2(0, 0);
    endLine = new Vector2(0, 0);
    draw = false;
    target = new GameObject("Target", new Vector2(0, 0), new Renderer("Target1.png"));
    background = new GameObject('Background', new Vector2(0, 0), new Renderer("Grass2.png"));
    bucket = new GameObject("Bucket", new Vector2(100, 100), new Renderer("Bucket-Idle.png"));
    player = new GameObject("Player", new Vector2(150, 150));
    player.addComponent("Renderer", new Renderer("Frog_Idle_COLORv1.png", "Frog_Idle_COLORv1 - Flipped.png"));
    player.addComponent("Animator", new Animator("Frog_Run_COLORv1.png", "Frog_Run_COLORv1 - Flipped.png", 8, 64, 64));
    
    bucketCenter = new Vector2(100 + bucket.Renderer.image.width/2, 100 + bucket.Renderer.image.height/2);
    playerCenter = new Vector2(150 + player.Renderer.image.width/2, 150 + player.Renderer.image.height/2)

    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }

    GameObjectList.push(background);
    GameObjectList.push(bucket);
    GameObjectList.push(target);
    collected = false;
    // console.log(canvas., canvas.height);
}
var historyMovement;
function Update(deltaTime) {
    worldMovement = new Vector2(Math.trunc(Axis.Horizontal * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed ), Math.trunc(Axis.Vertical * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed)); 
    // historyMovement = new Vector2(Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed, Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed);
    // console.log(mouseX, mouseY);
    // console.log(historyMovement);
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
    console.log(worldMovement);
    target.Transform.x = Math.trunc(mouseX)+player.Transform.x-150;
    target.Transform.y = Math.trunc(mouseY)+player.Transform.y-150;
    bucketCenter.x = bucket.Transform.x + bucket.Renderer.image.width/2;
    bucketCenter.y = bucket.Transform.y + bucket.Renderer.image.height/2;

    playerCenter.x = player.Transform.x + player.Renderer.image.width/2;
    playerCenter.y = player.Transform.y + player.Renderer.image.height/2

    if(flag) {
        if(!collected && Math.hypot(bucketCenter.x-playerCenter.x, bucketCenter.y-playerCenter.y) < 30) {
            collected = true;
        }
        else if(collected) {
            collected = false;
        }
        flag = false;
    }
    if(collected) {
        bucket.Transform.x = player.Transform.x;
        bucket.Transform.y = player.Transform.y;
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
        if(mouseX >= 150 + player.Renderer.image.width/2) {
        // if(player.Animator.orientations) {
            context.drawImage(player.Animator.image, player.Animator.nextImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
        }
        else {
            context.drawImage(player.Animator.mirrorImage, player.Animator.nextImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
        }
    }
    else {
        if(mouseX >= 150 + player.Renderer.image.width/2) {
        // if(player.Renderer.orientation) {  
            context.drawImage(player.Renderer.image, player.Transform.x, player.Transform.y);
        }
        else {
        // else if(!player.Renderer.orientation) {
            context.drawImage(player.Renderer.mirrorImage, player.Transform.x, player.Transform.y);
        }
    }
    context.beginPath();
    context.ellipse(playerCenter.x, playerCenter.y, 32, 32, 0, 0, 2 * Math.PI);
    context.stroke();

    if(draw) {
        console.log(endLine.x, endLine.y);
        context.beginPath();
        context.moveTo(beginLine.x, beginLine.y);
        context.lineTo(mouseX+player.Transform.x-150, mouseY+player.Transform.y-150);
        context.stroke();
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