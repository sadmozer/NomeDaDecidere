const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

context.fillStyle = '#FFF';
context.fillRect(0, 0, canvas.width, canvas.height);

var GameObjectList = new Array();
var Keys = {Space: false, ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};
var Axis = {Horizontal: 0, Vertical: 0};

// FRECCE
// const ARROW_LEFT = 37;
// const ARROW_UP = 38;
// const ARROW_RIGHT = 39;
// const ARROW_DOWN = 40;

// WASD
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

    this.nextImageIndex = function () {
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
    this.name = Name;
    this.Transform = Transform || null;
    this.Renderer = Renderer || null;
    this.Animator = Animator || null;

    this.addComponent = function(CmpName, Cmp) {
        switch(CmpName) {
            case "Transform": this.Transform = Cmp;
                break;
            case "Renderer": this.Renderer = Cmp;
                break;
            case "Animator": this.Animator = Cmp;
        }
    };

    this.getState = function() {
        return this.state;
    };

    this.setState = function(NewState) {
       this.state = NewState;
    };
}

var flag_down = false;
var flag = false;
function KeyDownManager(event) {
    event.preventDefault();
    if(event.keyCode === ARROW_LEFT) {
        Keys.ArrowLeft = true;
        Axis.Horizontal = -1;
    }
    else if(event.keyCode === ARROW_UP) {
        Keys.ArrowUp = true;
        Axis.Vertical = -1;
    }
    else if(event.keyCode === ARROW_RIGHT) {
        Keys.ArrowRight = true;
        Axis.Horizontal = 1;
    }
    else if(event.keyCode === ARROW_DOWN) {
        Keys.ArrowDown = true;
        Axis.Vertical = 1;
    }
    else if(event.keyCode === 32 && !event.repeat) {
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
    else if(event.keyCode === ARROW_UP) {
        Keys.ArrowUp = false;
        if(!Keys.ArrowDown)        
            Axis.Vertical = 0;
        else
            Axis.Vertical = 1;
    }
    else if(event.keyCode === ARROW_RIGHT) {
        Keys.ArrowRight = false;
        if(!Keys.ArrowLeft)        
            Axis.Horizontal = 0;
        else
            Axis.Horizontal = -1;
    }
    else if(event.keyCode === ARROW_DOWN) {
        Keys.ArrowDown = false;
        if(!Keys.ArrowUp)        
            Axis.Vertical = 0;
        else
            Axis.Vertical = -1;
    }
    else if(event.keyCode === 32 && !event.repeat) {
        Keys.Space = false;
    }
}

var rect = canvas.getBoundingClientRect();
function MouseDownManager(event) {
    beginLine.x = Math.trunc(event.clientX-rect.left);
    beginLine.y = Math.trunc(event.clientY-rect.top);
    draw = true;
}
function MouseUpManager(event) {
    endLine.x = Math.trunc(event.clientX-rect.left);
    endLine.y = Math.trunc(event.clientY-rect.top);
    draw = false;
    flag = true;
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

function contextmenu(event) {
    event.preventDefault();
}
document.addEventListener('keydown', KeyDownManager, false);
document.addEventListener('keyup', KeyUpManager, false);
document.addEventListener('mousedown', MouseDownManager, false);
document.addEventListener('mouseup', MouseUpManager, false);
document.addEventListener('mousemove', MouseMoveManager, false);
document.addEventListener("wheel", doScroll, false);
// document.addEventListener("contextmenu", RightClickManager, false);

function GameObjectFactory() {};

function Collectible(options) {
    this.name = options.name || "Collectible";
    this.state = options.state || "Idle";
    this.spawn = options.spawn || new Vector2(0,0);
    this.Transform = this.spawn;
    this.Renderer = options.renderer || null;
    this.Animator = options.animator || null;

    this.getState = function(){
        return this.state;
    }
    this.setState = function(state){
        this.state = state;
    }
}
function Environment(options) {

}
GameObjectFactory.prototype.create = function(options) {
    switch(options.type) {
        case "Collectible":
            this.goClass = Collectible;
            break;
        case "Environment":
            this.goClass = Environment;
            break;
        default:
            this.goClass = Collectible;
            break;
    }
    return new this.goClass(options);
}

var beginLine;
var endLine;
var draw;
var player;
var background;
var target;
var deltaWorldMovement;
var worldMovement;
var collected;
var CollectibleFactory;
var secchio2;
function Start() {
    CollectibleFactory = new GameObjectFactory();

    secchio2 = CollectibleFactory.create({
        goClass: "Collectible",
        name: "Secchio2",
        state: "Idle",
        renderer: new Renderer("Bucket-Idle.png"),
        spawn: new Vector2(30, 30)
    });
    
    beginLine = new Vector2(0, 0);
    endLine = new Vector2(0, 0);
    draw = false;
    spawn = new Vector2(150, 150);
    target = new GameObject("Target", new Vector2(0, 0), new Renderer("Target1.png"));
    background = new GameObject('Background', new Vector2(0, 0), new Renderer("Grass2.png"));
    bucket = new GameObject("Bucket", new Vector2(100, 100), new Renderer("Bucket-Idle.png"));
    player = new GameObject("Player", new Vector2(spawn.x, spawn.y));
    player.addComponent("Renderer", new Renderer("Frog_Idle_COLORv1.png", "Frog_Idle_COLORv1 - Flipped.png"));
    player.addComponent("Animator", new Animator("Frog_Run_COLORv1.png", "Frog_Run_COLORv1 - Flipped.png", 8, 64, 64));
    
    bucketCenter = new Vector2(100 + bucket.Renderer.image.width/2, 100 + bucket.Renderer.image.height/2);
    playerCenter = new Vector2(150 + player.Renderer.image.width/2, 150 + player.Renderer.image.height/2)
    
    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }
    bucket.setState("Idle");
    GameObjectList.push(background);
    GameObjectList.push(bucket);
    GameObjectList.push(secchio2);
    deltaWorldMovement = new Vector2(0, 0);
    worldMovement = new Vector2(0, 0);
}
var historyMovement;
var k = 1;
function Update(deltaTime) {
    deltaWorldMovement.x = Math.trunc(Axis.Horizontal * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed);
    deltaWorldMovement.y = Math.trunc(Axis.Vertical * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed); 
    
    if(Axis.Horizontal || Axis.Vertical) {
        worldMovement.x += deltaWorldMovement.x;
        worldMovement.y += deltaWorldMovement.y;
    }

    player.Transform.x += deltaWorldMovement.x;
    player.Transform.y += deltaWorldMovement.y;
    
    target.Transform.x = Math.trunc(mouseX)+player.Transform.x-spawn.x;
    target.Transform.y = Math.trunc(mouseY)+player.Transform.y-spawn.y;
    
    bucketCenter.x = bucket.Transform.x + bucket.Renderer.image.width/2;
    bucketCenter.y = bucket.Transform.y + bucket.Renderer.image.height/2;
    
    playerCenter.x = player.Transform.x + player.Renderer.image.width/2;
    playerCenter.y = player.Transform.y + player.Renderer.image.height/2

    player.Animator.orientation = (mouseX >= spawn.x + player.Renderer.image.width/2);
    // console.log(bucket.getState());
    var CollectibleList = [secchio2, bucket];
    CollectibleList.forEach(function(element) {
    
    switch(element.getState()) {
        case "Idle": 
            if(Math.hypot(element.Transform.x + element.Renderer.image.width/2 - playerCenter.x, 
                        element.Transform.y + element.Renderer.image.width/2 - playerCenter.y) < 30) {
                element.setState("Trasporto");
            }
            else {
                element.setState("Idle");
                // if(flag)
                //     flag = false;
            }
            break;
        case "Trasporto":
            if(flag && Math.sqrt(Math.pow(beginLine.x-endLine.x, 2) + Math.pow(beginLine.y-endLine.y, 2))>20) {
                element.setState("In volo");
                k = 1;
                flag = false;
            }
            else {
                element.Transform.x = player.Transform.x;
                element.Transform.y = player.Transform.y;
            }
            break;
        case "In volo":
            if(k < 20){
                element.Transform.x = (Math.trunc(k*(beginLine.x - endLine.x)/20) + player.Transform.x);
                element.Transform.y = (Math.trunc(k*(beginLine.y - endLine.y)/20) + player.Transform.y);
                k++;
                element.setState("In volo");
            }
            else {
                element.setState("Idle");
            }
            break;
        default:
            console.log("NON GESTITO!");
            break;
    }
    });
}
function Render() {
    context.translate(-deltaWorldMovement.x, -deltaWorldMovement.y);
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
        if(player.Animator.orientation) {
            context.drawImage(player.Renderer.image, player.Transform.x, player.Transform.y);
        }
        else {
            context.drawImage(player.Renderer.mirrorImage, player.Transform.x, player.Transform.y);
        }
    }
    context.beginPath();
    context.ellipse(playerCenter.x, playerCenter.y, 32, 32, 0, 0, 2 * Math.PI);
    context.stroke();

    if(draw) {
        context.beginPath();
        context.moveTo(beginLine.x+player.Transform.x-spawn.x, beginLine.y+player.Transform.y-spawn.y);
        context.lineTo(mouseX+player.Transform.x-spawn.x, mouseY+player.Transform.y-spawn.y);
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