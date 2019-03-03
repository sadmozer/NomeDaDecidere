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

class Vector3 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Renderer {
    constructor(src) {
        this.image = new Image();
        this.image.src = src;
    }
}

class GameObject {
    constructor(Name, Transform, Renderer) {
        this.Name = Name;
        this.Transform = Transform;
        this.Renderer = Renderer;
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
    if(event.keyCode === 37) {
        Keys.ArrowLeft = false;
        if(!Keys.ArrowRight)
            Axis.Horizontal = 0;
        else
            Axis.Horizontal = 1;
    }
    if(event.keyCode === 38) {
        Keys.ArrowUp = false;
        if(!Keys.ArrowDown)        
            Axis.Vertical = 0;
        else
            Axis.Vertical = 1;
    }
    if(event.keyCode === 39) {
        Keys.ArrowRight = false;
        if(!Keys.ArrowLeft)        
            Axis.Horizontal = 0;
        else
            Axis.Horizontal = -1;
    }
    if(event.keyCode === 40) {
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
var img;
const speed = 5;
function Start() {
    background = new GameObject('Background', new Vector3(0, 0), new Renderer("Grass1.png"));
    player = new GameObject('Player', new Vector3(10, 10), new Renderer("Bucket-Idle.png"));
    img = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < img.data.lenght; i++)
        img.data[i] = 0;
    GameObjectList.push(background);
    GameObjectList.push(player);
}

function Update(deltaTime) {
    player.Transform.x += Math.trunc(Axis.Horizontal * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed);   
    player.Transform.y += Math.trunc(Axis.Vertical * Versor[Axis.Horizontal + 1][Axis.Vertical + 1] * speed);    
    console.log(Versor[Axis.Horizontal + 1][Axis.Vertical + 1], Versor[Axis.Horizontal + 1][Axis.Vertical + 1]);
}
    
function Render() {
    context.putImageData(img, 0, 0);
    for(var i = 0; i < GameObjectList.length; i++) {
        var currObj = GameObjectList[i];
        context.drawImage(currObj.Renderer.image, 
            currObj.Transform.x, 
            currObj.Transform.y);
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