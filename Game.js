context.fillStyle = '#FFF';
context.fillRect(0, 0, canvas.width, canvas.height);

var GameObjectList = new Array();
// var Keys = {Space: false, ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};
// var Axis = {Horizontal: 0, Vertical: 0};

// FRECCE
// const ARROW_LEFT = 37;
// const ARROW_UP = 38;
// const ARROW_RIGHT = 39;
// const ARROW_DOWN = 40;

const diagMagn = Math.cos(Math.PI / 4);
// Beatty sequence number
const speed = 5;
const flySpeed = 30;
const arcHeight = 30;
const Versor = [
    [diagMagn, 1, diagMagn],
    [1, 0, 1],
    [diagMagn, 1, diagMagn]
]

var flag_down = false;
var flag = false;

var beginLine;
var endLine;
var draw;
var player;
var background;
var deltaWorldMovement;
var worldMovement;
var collected;
var secchio2;
var vect;
var c;
function Start() {
    InputController.Start();
    secchio2 = GameObjectFactory.create({
        GoClass: "Collectible",
        Name: "Secchio2",
        State: "Idle",
        Renderer: new Renderer("Bucket-Idle.png", 32, 32),
        Spawn: new Vector2(30, 30),
        Animator: new Animator([
            {name: "Idle", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "In volo", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "Trasporto", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "Atterraggio", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)}
        ])
    });
    
    bucket = GameObjectFactory.create({
        GoClass: "Collectible",
        Name: "bucket",
        State: "Idle",
        Renderer: new Renderer("Bucket-Idle.png", 32, 32),
        Spawn: new Vector2(100, 100),
        Animator: new Animator([
            {name: "Idle", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "In volo", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "Trasporto", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)},
            {name: "Atterraggio", animation: new Animation("Bucket-Idle.png", "Bucket-Idle.png", 1, 4, 32, 32)}            
        ])
    });

    littleHay = GameObjectFactory.create({
        GoClass: "Collectible",
        Name: "hay1",
        State: "Idle",
        Renderer: new Renderer("Hay1-Idle.png", 32, 32),
        Spawn: new Vector2(120, 60),
        Animator: new Animator([
            {name: "Idle", animation: new Animation("Hay1-Idle.png", "Hay1-Idle.png", 1, 4, 32, 32)},
            {name: "In volo", animation: new Animation("Hay1-Idle.png", "Hay1-Idle.png", 1, 4, 32, 32)},
            {name: "Atterraggio", animation: new Animation("Hay1-Landing.png", "Hay1-Landing.png", 9, 7, 32, 32)}
        ])
    });
    
    beginLine = new Vector2(0, 0);
    endLine = new Vector2(0, 0);
    draw = false;
    spawn = new Vector2(150, 150);
    vect = new Vector2(0, 0);
    background = new GameObject("Background", "Idle", new Vector2(0, 0), new Renderer("Grass2.png"));

    player = SingletonPlayer.getInstance({
        Name: "Player",
        Spawn: new Vector2(150, 150),
        Renderer: new Renderer("Frog_Idle_COLORv1.png", "Frog_Idle_COLORv1 - Flipped.png", 64, 64),
        Animator: new Animation("Frog_Run_COLORv1.png", "Frog_Run_COLORv1 - Flipped.png", 8, 4, 64, 64)
    });
    
    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }
    GameObjectList.push(background);
    GameObjectList.push(bucket);
    GameObjectList.push(secchio2);
    GameObjectList.push(littleHay);
    deltaWorldMovement = new Vector2(0, 0);
    worldMovement = new Vector2(0, 0);

}
var historyMovement;
var k = 1;
var flyStart;
var flyControl;
var flyEnd;
var occupato = false;
function Update(deltaTime) {
    deltaWorldMovement.x = Math.trunc(InputController.getAxis().Horizontal * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * speed);
    deltaWorldMovement.y = Math.trunc(InputController.getAxis().Vertical * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * speed); 
    
    if(InputController.getAxis().Horizontal || InputController.getAxis().Vertical) {
        worldMovement.x += deltaWorldMovement.x;
        worldMovement.y += deltaWorldMovement.y;
    }
    
    player.Update(deltaWorldMovement);
    
    var CollectibleList = [secchio2, bucket, littleHay];
    CollectibleList.forEach(updateCollectible);

    if(flag)
        flag = false;
}
function Render() {
    context.translate(-deltaWorldMovement.x, -deltaWorldMovement.y);
    context.putImageData(emptyCanvas, 0, 0);

    for(var i = 0; i < GameObjectList.length; i++) {
        var currObj = GameObjectList[i];
        // console.log(currObj);
        if(currObj.Name != "Background") {
            switch(currObj.getState()){
                case "Idle":
                case "Trasporto": 
                    context.drawImage(currObj.Renderer.image, currObj.Transform.x, currObj.Transform.y);
                break;
                case "In volo": 
                    var currObj_Animator = currObj.Animator.getAnimation("In volo");
                    context.drawImage(currObj_Animator.image, 
                        currObj_Animator.next_imageIndex() * currObj_Animator.width, 
                        0, 
                        currObj_Animator.width, 
                        currObj_Animator.height, 
                        currObj.Transform.x, 
                        currObj.Transform.y, 
                        currObj_Animator.width, 
                        currObj_Animator.height);
                break;
                case "Atterraggio": 
                    var currObj_Animator = currObj.Animator.getAnimation("Atterraggio");
                    context.drawImage(currObj_Animator.image, 
                        currObj_Animator.next_imageIndex() * currObj_Animator.width, 
                        0, 
                        currObj_Animator.width, 
                        currObj_Animator.height, 
                        currObj.Transform.x, 
                        currObj.Transform.y, 
                        currObj_Animator.width, 
                        currObj_Animator.height);
                break;
                default: console.log("Render: errore non gestito!"); break;
            }
        }
        else
            context.drawImage(currObj.Renderer.image, currObj.Transform.x, currObj.Transform.y);
    }
    
    player.Render();
    // context.beginPath();
    // context.ellipse(playerCenter.x, playerCenter.y, Math.abs(beginLine.x-mouseX), Math.abs(beginLine.y-mouseY)/2, 0, 0, 2 * Math.PI);
    // context.stroke();

    if(draw) {
        context.beginPath();
        context.moveTo(InputController.getBeginLine().x+player.Transform.x-spawn.x, InputController.getBeginLine().y+player.Transform.y-spawn.y);
        context.lineTo(InputController.getMouseX()+player.Transform.x-spawn.x, InputController.getMouseY()+player.Transform.y-spawn.y);
        context.stroke();
    }
}

function Bezier3(start, control, end, t) {
    var ret = new Vector2(Math.trunc(((1 - t)*(1 - t) * start.x) + (2 * t * (1 - t) * control.x) + (t * t * end.x)),
    Math.trunc(((1 - t)*(1 - t) * start.y) + (2 * t * (1 - t) * control.y) + (t * t * end.y)));
    return ret;
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

function updateCollectible(element) {
    switch(element.getState()) {
        case "Idle":
        if(Math.hypot(element.Transform.x + element.Renderer.width/2 - player.centerTransform.x, 
            element.Transform.y + element.Renderer.width/2 - player.centerTransform.y) < 30 && !occupato) {
                element.setState("Trasporto");
                occupato = true;
            }
            else {
                element.setState("Idle");
            }
            break;
        case "Trasporto":
            if(flag && Math.sqrt(Math.pow(InputController.getBeginLine().x-endLine.x, 2) + Math.pow(InputController.getBeginLine().y-InputController.getEndLine().y, 2))>20) {
                element.setState("In volo");
                k = 1;
                occupato = false;
                vect.x = InputController.getBeginLine().x-InputController.getEndLine().x;
                vect.y = InputController.getBeginLine().y-InputController.getEndLine().y;
                flyStart = new Vector2(player.Transform.x+deltaWorldMovement.x, player.Transform.y+deltaWorldMovement.y);
                flyControl = new Vector2(vect.x/2 + player.Transform.x, vect.y/2/1.2 + player.Transform.y-arcHeight);
                flyEnd = new Vector2(vect.x + player.Transform.x, vect.y/1.2 + player.Transform.y + 30);
                console.log(flyStart, flyControl, flyEnd);
            }
            else {
                element.Transform.x = player.Transform.x;
                element.Transform.y = player.Transform.y;
            }
            break;
        case "In volo":
            if(k < flySpeed){
                var fly = Bezier3(flyStart, flyControl, flyEnd, k/flySpeed);
                element.Transform.x = fly.x;
                element.Transform.y = fly.y;
                k++;
                element.setState("In volo");
            }
            else {
                element.setState("Atterraggio");
            }
            break;
        case "Atterraggio": 
            console.log(element.Animator.getAnimation("Atterraggio").x);
            if(element.Animator.getAnimation("Atterraggio").x >= element.Animator.getAnimation("Atterraggio").numFrames*element.Animator.getAnimation("Atterraggio").speedFrames-1) {
                element.setState("Idle");
            }
        break; 
        default:
            console.log("NON GESTITO!");
            break;
    }
}