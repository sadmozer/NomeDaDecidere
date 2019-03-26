

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

const Versor = [
    [diagMagn, 1, diagMagn],
    [1, 0, 1],
    [diagMagn, 1, diagMagn]
]

var flag_down = false;


var beginLine;
var endLine;
var draw;
var player;
var background;
var deltaWorldMovement;
var worldMovement;
var collected;
var secchio2;
var goat1;
var vect;
var c;

var result = {};
function Loading(names, callback) {
    var n;
    var name;
    var count = names.length;
    var onload = function() {
        console.log("Loading: " + names[names.length-count]);
        if(--count == 0) {
            callback(result);
        }
    }
    for(n = 0; n < names.length; n++) {
        name = names[n];
        result[name] = new Image();
        result[name].onload = onload;
        result[name].src = name + ".png";
    }
}

function Start(IMAGES) {
    InputController.Start();
    secchio2 = GameObjectFactory.create({
        GoClass: "Bucket",
        State: "Idle",
        Images: IMAGES,
        Name: "Secchio2",
        Spawn: new Vector2(30, 30)
    });
    
    bucket = GameObjectFactory.create({
        GoClass: "Bucket",
        State: "Idle",
        Images: IMAGES,
        Name: "bucket",
        // Renderer: new Renderer(IMAGES["Bucket-Idle"], IMAGES["Bucket-Idle"], 32, 32),
        Spawn: new Vector2(100, 100)
        // Animator: new Animator([
        //     {name: "Idle", animation: new Animation(IMAGES["Bucket-Idle"], IMAGES["Bucket-Idle"], 1, 4, 32, 32)},
        //     {name: "In volo", animation: new Animation(IMAGES["Bucket-Idle"], IMAGES["Bucket-Idle"], 1, 4, 32, 32)},
        //     {name: "Trasporto", animation: new Animation(IMAGES["Bucket-Idle"], IMAGES["Bucket-Idle"], 1, 4, 32, 32)},
        //     {name: "Atterraggio", animation: new Animation(IMAGES["Bucket-Idle"], IMAGES["Bucket-Idle"], 1, 4, 32, 32)}            
        // ])
    });

    littleHay = GameObjectFactory.create({
        GoClass: "LittleHay",
        State: "Idle",
        Images: IMAGES,
        Name: "hay1",
        // Renderer: new Renderer(IMAGES["Hay1-Idle"], IMAGES["Hay1-Idle"], 32, 32),
        Spawn: new Vector2(120, 60)
        // Animator: new Animator([
        //     {name: "Idle", animation: new Animation(IMAGES["Hay1-Idle"], IMAGES["Hay1-Idle"], 1, 4, 32, 32)},
        //     {name: "In volo", animation: new Animation(IMAGES["Hay1-Idle"], IMAGES["Hay1-Idle"], 1, 4, 32, 32)},
        //     {name: "Atterraggio", animation: new Animation(IMAGES["Hay1-Landing"], IMAGES["Hay1-Landing"], 9, 7, 32, 32)}
        // ])
    });
    
    goat1 = GameObjectFactory.create({
        GoClass: "Goat",
        State: "Idle",
        Images: IMAGES,
        Name: "G1",
        Spawn: new Vector2(70, 100)
    });
    beginLine = new Vector2(0, 0);
    endLine = new Vector2(0, 0);
    draw = false;
    vect = new Vector2(0, 0);

    background = GameObjectFactory.create({
        GoClass: "Environment",
        Name: "Background",
        State: "Idle",
        Renderer: new Renderer(IMAGES["Grass2"], IMAGES["Grass2"], 384, 384),
        Spawn: new Vector2(0, 0)
    });
    player = SingletonPlayer.getInstance({
        Name: "Player",
        Spawn: new Vector2(150, 150),
        Renderer: new Renderer(IMAGES["Frog_Idle_COLORv1"], IMAGES["Frog_Idle_COLORv1 - Flipped"], 64, 64),
        Animator: new Animation({
            image: IMAGES["Frog_Run_COLORv1"], 
            mirrorImage: IMAGES["Frog_Run_COLORv1 - Flipped"], 
            numFrames: 8, 
            speedFrames:4, 
            height:64, 
            width: 64
        })
    });
    
    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }
    GameObjectList.push(background);
    GameObjectList.push(goat1);
    GameObjectList.push(bucket);
    GameObjectList.push(secchio2);
    GameObjectList.push(littleHay);
    deltaWorldMovement = new Vector2(0, 0);
    worldMovement = new Vector2(0, 0);
    CollectibleList = [secchio2, bucket, littleHay, goat1];
    console.log(player);
}
var historyMovement;
var k = 1;
var flyStart;
var flyControl;
var flyEnd;
var occupato = false;
var CollectibleList
function Update(deltaTime) {
    deltaWorldMovement.x = Math.trunc(InputController.getAxis().Horizontal * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * SPEED);
    deltaWorldMovement.y = Math.trunc(InputController.getAxis().Vertical * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * SPEED); 
    
    if(InputController.getAxis().Horizontal || InputController.getAxis().Vertical) {
        worldMovement.x += deltaWorldMovement.x;
        worldMovement.y += deltaWorldMovement.y;
    }
    
    player.Update(deltaWorldMovement);
    
    for (let i = 0; i < CollectibleList.length; i++) {
        CollectibleList[i].Update(InputController, GameObjectList, player);
    }
    // CollectibleList.forEach(updateCollectible);
    
    if(InputController.getLClick())
        InputController.setLClick(false);
    if(InputController.getRClick())
        InputController.setRClick(false);
}
function Render() {
    context.translate(-deltaWorldMovement.x, -deltaWorldMovement.y);
    context.putImageData(emptyCanvas, 0, 0);
    
    context.drawImage(background.Renderer.image, background.Transform.x, background.Transform.y);


    for(var i = 0; i < CollectibleList.length; i++) {
        var currObj = CollectibleList[i];
        // console.log(currObj);
        switch(currObj.getState()){
            case "Idle": 
            var currObj_Animator = currObj.Animator.getAnimation("Idle");
                // console.log(curkrObj);
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
            case "Trasporto": 
                var currObj_Animator = currObj.Animator.getAnimation("Trasporto");
                // console.log(curkrObj);
                context.drawImage(currObj_Animator.image, 
                    currObj_Animator.next_imageIndex() * currObj_Animator.width, 
                    0, 
                    currObj_Animator.width, 
                    currObj_Animator.height, 
                    currObj.Transform.x, 
                    currObj.Transform.y, 
                    currObj_Animator.width, 
                    currObj_Animator.height);
                // context.drawImage(currObj.Renderer.image, currObj.Transform.x, currObj.Transform.y);
            break;
            case "In volo":
                var currObj_Animator = currObj.Animator.getAnimation("In volo");
                // console.log(curkrObj);
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
    player.Render();
    
    if(draw) {
        context.beginPath();
        // context.moveTo(InputController.getBeginLine().x+player.Transform.x-player.Spawn.x, InputController.getBeginLine().y+player.Transform.y-player.Spawn.y);
        // context.lineTo(InputController.getMouseX()+player.Transform.x-player.Spawn.x, InputController.getMouseY()+player.Transform.y-player.Spawn.y);
        context.moveTo(InputController.getBeginLine().x+worldMovement.x, InputController.getBeginLine().y+worldMovement.y);
        context.lineTo(InputController.getMouseX()+worldMovement.x, InputController.getMouseY()+worldMovement.y);
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

function RunGame(IMAGES) {
    console.log("Done!");
    Start(IMAGES);
    GameLoop();
}


console.log("Loading..");
Loading(IMAGES_N, RunGame);