

context.fillStyle = '#FFF';
context.fillRect(0, 0, canvas.width, canvas.height);

// var GameObjectList = new Array();

const diagMagn = Math.cos(Math.PI / 4);

const Versor = [
    [diagMagn, 1, diagMagn],
    [1, 0, 1],
    [diagMagn, 1, diagMagn]
]

var flag_down = false;
var draw;
var player;
var background;
var deltaWorldMovement;
var worldMovement;
var collected;
var secchio2;
var goat1;
var goat2;
var vect;
var c;
var prova;
const IMAGES = {};
function Loading(names, callback) {
    var n;
    var name;
    var count = names.length;
    var onload = function() {
        console.log("Loading: " + names[names.length-count]);
        if(--count == 0) {
            callback();
        }
    }
    for(n = 0; n < names.length; n++) {
        name = names[n];
        IMAGES[name] = new Image();
        IMAGES[name].onload = onload;
        IMAGES[name].src = name + ".png";
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
        Spawn: new Vector2(100, 100)
    });

    littleHay = GameObjectFactory.create({
        GoClass: "LittleHay",
        State: "Idle",
        Images: IMAGES,
        Name: "hay1",
        Spawn: new Vector2(120, 60)
    });
    
    goat1 = GameObjectFactory.create({
        GoClass: "Goat",
        State: "Idle",
        Images: IMAGES,
        Name: "G1",
        Spawn: new Vector2(70, 100)
    });

    goat2 = GameObjectFactory.create({
        GoClass: "Goat",
        State: "Idle",
        Images: IMAGES,
        Name: "G",
        Spawn: new Vector2(150, 100)
    });
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
            height: 64, 
            width: 64
        })
    });
    
    emptyCanvas = context.createImageData(canvas.width, canvas.height);
    for (var i = 0; i < emptyCanvas.data.lenght; i++) {
        emptyCanvas.data[i] = 0;
    }

    deltaWorldMovement = new Vector2(0, 0);
    worldMovement = new Vector2(0, 0);
    CollectibleList = [secchio2, bucket, littleHay, goat1, goat2];

    prova = new Quadtree(1, 0, 0, 348, 348, 0);
    // debugger;
    for(let i = 0; i < CollectibleList.length; i++) {
        var curr = CollectibleList[i];
        // console.log(curr);
        prova.Insert({StartX: curr.Transform.x, StartY: curr.Transform.y, Width: curr.Renderer.width, Height: curr.Renderer.height});
        // console.log(prova);
        // prova.Print();
    }
}
var CollectibleList;
function Update(deltaTime, IMAGES) {
    deltaWorldMovement.x = Math.trunc(InputController.getAxis().Horizontal * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * SPEED);
    deltaWorldMovement.y = Math.trunc(InputController.getAxis().Vertical * Versor[InputController.getAxis().Horizontal + 1][InputController.getAxis().Vertical + 1] * SPEED); 
    
    if(InputController.getAxis().Horizontal || InputController.getAxis().Vertical) {
        worldMovement.x += deltaWorldMovement.x;
        worldMovement.y += deltaWorldMovement.y;
    }
    
    player.Update(deltaWorldMovement);
    
    if(InputController.getLClick() && !player.occupato) {
        CollectibleList.push(GameObjectFactory.create({
            GoClass: "LittleHay",
            State: "Trasporto",
            Images: IMAGES,
            Name: "hay1",
            Spawn: new Vector2(player.Transform.x, player.Transform.y)
        }))
    }

    for (let i = 0; i < CollectibleList.length; i++) {
        CollectibleList[i].Update(InputController, CollectibleList, player);
    }

    
    if(InputController.getLClick())
    InputController.setLClick(false);
    if(InputController.getRClick())
    InputController.setRClick(false);
}
function Render(IMAGES) {
    context.translate(-deltaWorldMovement.x, -deltaWorldMovement.y);
    context.putImageData(emptyCanvas, 0, 0);
    
    // context.drawImage(background.Renderer.image, background.Transform.x, background.Transform.y);
    
    var auxList = [];
    auxList = auxList.concat(CollectibleList);
    auxList.push(player);
    auxList.sort(function(a, b) {
        return (a.Transform.y + a.Renderer.height) - (b.Transform.y + b.Renderer.height);
    });
    CastShadows(IMAGES, CollectibleList);
    prova = new Quadtree(2, 0, 0, canvas.width, canvas.height, 0);
    for(let i = 0; i < CollectibleList.length; i++) {
        var curr = CollectibleList[i];
        // console.log(curr);
        prova.Insert({StartX: curr.Transform.x, StartY: curr.Transform.y, Width: curr.Renderer.width, Height: curr.Renderer.height});
        prova.Print();
        // console.log(prova);
    }
    // prova.Insert({StartX: secchio2.Transform.x, StartY: secchio2.Transform.y, Width: 32, Height: 32});
    // prova.Insert({StartX: goat1.Transform.x, StartY: goat1.Transform.y, Width: 32, Height: 32});
    // prova.Insert({StartX: goat2.Transform.x, StartY: goat2.Transform.y, Width: 32, Height: 32});

    for(var i = 0; i < auxList.length; i++) {
        auxList[i].Render();
    }
    
    // player.Render();
    
    if(draw) {
        context.beginPath();
        context.moveTo(InputController.getBeginLine().x+worldMovement.x, InputController.getBeginLine().y+worldMovement.y);
        context.lineTo(InputController.getMouseX()+worldMovement.x, InputController.getMouseY()+worldMovement.y);
        context.stroke();
    }
}

var lastTime = 0;
function GameLoop(time) {
    deltaTime = time - lastTime;
    lastTime = time;
    Update(deltaTime, IMAGES);
    Render(IMAGES);
    requestAnimationFrame(GameLoop);
}

function RunGame() {
    console.log("Done!");
    Start(IMAGES);
    GameLoop(0);
}


console.log("Loading..");
Loading(IMAGES_N, RunGame);