// Vector2
function Vector2 (x, y) {
    this.x = x;
    this.y = y;
}
Vector2.plus = function(v1, v2) {
    return new Vector2(v1.x+v2.x, v1.y+v2.y);
}
Vector2.minus = function(v1, v2) {
    return new Vector2(v1.x-v2.x, v1.y-v2.y);
}
Vector2.magnitude = function(vect) {
    return Math.sqrt(Math.pow(vect.x, 2) + Math.pow(vect.y, 2));
}

// Renderer
function Renderer(src, mirrorsrc, width, height) {
    this.orientation = true;
    this.width = width;
    this.height = height;
    this.image = src;
    this.mirrorImage = mirrorsrc;
}

// Animator
function Animator(animations) {
    this.animations = animations;
}
Animator.prototype.getAnimation = function(name) {
    return this.animations.find(o => o.name === name).animation;
}

// Animation
function Animation(options) {
    this.orientation = true;
    this.image = options.image;
    this.mirrorImage = options.mirrorImage;
    this.numFrames = options.numFrames;
    this.width = options.width;
    this.height = options.height;
    this.x = 0;
    this.y = 0;
    this.speedFrames = options.speedFrames;
}
Animation.prototype.next_imageIndex = function () {
    var ret = Math.trunc(this.x/this.speedFrames) % this.numFrames;
    this.x++;
    if(Math.trunc(this.x/this.speedFrames) >= this.numFrames)
        this.x = 0;
    return ret;
}
Animation.prototype.next_mirrorImageIndex = function () {
    var ret = Math.trunc(this.y/this.speedFrames) % this.numFrames;
    this.y++;
    return ret;
}
Animation.prototype.prev_imageIndex = function () {
    this.x--;
    if(this.x < 0) {
        this.x += this.numFrames*this.speedFrames;
    }
    return Math.trunc((this.x+1)/this.speedFrames) % this.numFrames;
}
Animation.prototype.prev_mirrorImageIndex = function () {
    this.y--;
    if(this.y < 0) {
        this.y += this.numFrames*this.speedFrames;
    }
    return Math.trunc((this.y+1)/this.speedFrames) % this.numFrames;
}

function Collectible(options) {
    this.Name = options.Name || "Collectible";
    this.State = options.State || "Idle";
    this.Spawn = options.Spawn || new Vector2(0,0);
    this.Transform = options.Spawn;
    this.Renderer = options.Renderer || null;
    this.Animator = options.Animator || null;
    this.getState = function(){
        return this.State;
    }
    this.setState = function(State){
        this.State = State;
    }
}

function GameObjectFactory() {};

GameObjectFactory.prototype.create = function(options) {
    switch(options.GoClass) {
        case "Bucket":
            this.GoClass = Bucket;
        break;
        case "LittleHay":
            this.GoClass = LittleHay;
        break;
        case "Goat":
            this.GoClass = Goat;
        break;
        default: 
            this.GoClass = Collectible;
        break;
    }
    return new this.GoClass(options);
}

var GameObjectFactory = new GameObjectFactory();

function Bezier3(start, control, end, t) {
    var ret = new Vector2(Math.trunc(((1 - t)*(1 - t) * start.x) + (2 * t * (1 - t) * control.x) + (t * t * end.x)),
    Math.trunc(((1 - t)*(1 - t) * start.y) + (2 * t * (1 - t) * control.y) + (t * t * end.y)));
    return ret;
}

function isCollide(a, b) {
    // console.log(a.Transform.y + a.Renderer.height);
    return !(
        ((a.Transform.y + a.Renderer.height) < (b.Transform.y)) ||
        (a.Transform.y > (b.Transform.y + b.Renderer.height)) ||
        ((a.Transform.x + a.Renderer.width) < b.Transform.x) ||
        (a.Transform.x > (b.Transform.x + b.Renderer.width))
    );
}