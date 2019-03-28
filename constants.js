
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');


// let app = new PIXI.Application({ 
//     width: 256,         // default: 800
//     height: 256,        // default: 600
//     antialias: false,    // default: false
//     transparent: false, // default: false
//     resolution: 1       // default: 1
//   }
// );
// document.body.appendChild(app.view);
// // const renderer = new PIXI.Renderer ({
// //     view: canvas
// // });
// PIXI.loader.add([
//     "Frog_Idle_COLORv1 - Flipped.png",
//     "Frog_Idle_COLORv1.png",
//     "Frog_Run_COLORv1 - Flipped.png",
//     "Frog_Run_COLORv1.png",
//     "Grass1.png",
//     "Grass2.png",
//     "Hay1-Flying.png",
//     "Hay1-Idle.png",
//     "Hay1-Landing.png"
// ])
// .load(setup);

// function setup() {
//     let FrogIdle_Flip = new PIXI.Sprite(PIXI.loader.resources["Frog_Idle_COLORv1 - Flipped.png"].texture);
//     let FrogIdle = new PIXI.Sprite(PIXI.loader.resources["Frog_Idle_COLORv1.png"].texture);
//     let FrogRun_Flip = new PIXI.Sprite(PIXI.loader.resources["Frog_Run_COLORv1 - Flipped.png"].texture);
//     let FrogRun = new PIXI.Sprite(PIXI.loader.resources["Frog_Run_COLORv1.png"].texture);
//     let Grass1 = new PIXI.Sprite(PIXI.loader.resources["Grass1.png"].texture);
//     let Grass2 = new PIXI.Sprite(PIXI.loader.resources["Grass2.png"].texture);
//     let HayFlying = new PIXI.Sprite(PIXI.loader.resources["Hay1-Flying.png"].texture);
//     let HayIdle = new PIXI.Sprite(PIXI.loader.resources["Hay1-Idle.png"].texture);
//     let HayLanding = new PIXI.Sprite(PIXI.loader.resources["Hay1-Landing.png"].texture);
//     app.stage.addChild(Grass1);
// }

const rect = canvas.getBoundingClientRect();
// WASD
const ARROW_UP = 87;
const ARROW_LEFT = 65;
const ARROW_RIGHT = 68;
const ARROW_DOWN = 83; 

const THROW_THRESHOLD = 30;
const SPEED = 5;
const FLY_SPEED = 30;
const ARC_HEIGHT = 40;

const IMAGES_N = [
    'Bucket-Idle', 
    'Hay1-Idle', 
    'Hay1-Landing', 
    'Grass1', 
    'Frog_Idle_COLORv1', 
    'Frog_Idle_COLORv1 - Flipped',
    'Frog_Run_COLORv1',
    'Frog_Run_COLORv1 - Flipped',
    'Grass2',
    'Goat1-Idle',
    'Goat2-Idle',
    'Grass3'
];

//     context.webkitImageSmoothingEnabled = false;
    // context.mozImageSmoothingEnabled = false;
    // context.scale(2, 2);
    // context.imageSmoothingEnabled = false;