
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();


// WASD
const ARROW_UP = 87;
const ARROW_LEFT = 65;
const ARROW_RIGHT = 68;
const ARROW_DOWN = 83; 

const PASCOLO = 100;
const PASCOLO_SPEED = 0.5;
const IDLE_TIMEWAITING = 500;
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