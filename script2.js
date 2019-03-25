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
    // if(mirrorsrc) {
    //     this.mirrorImage = new Image();
        // this.mirrorImage.src = mirrorsrc;
    // }
    // else {
    //     this.mirrorImage = null;
    // }
    // this.image.src = src;
}

// Animator
function Animator(animations) {
    this.animations = animations;
}
Animator.prototype.getAnimation = function(name) {
    return this.animations.find(o => o.name === name).animation;
}

// Animation
function Animation(src, mirrorsrc, numFrames, speedFrames, width, height) {
    this.orientation = true;
    this.image = src;
    this.mirrorImage = mirrorsrc;
    this.numFrames = numFrames;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.speedFrames = speedFrames;
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

// Gameobject
function GameObject(Name, State,Transform, Renderer, Animator) {
    this.Name = Name;
    this.State = State;
    this.Transform = Transform || null;
    this.Renderer = Renderer || null;
    this.Animator = Animator || null;
}
GameObject.prototype.getState = function() {
    return this.state;
};
GameObject.prototype.setState = function(NewState) {
    this.state = NewState;
};
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
        default: 
            this.GoClass = Collectible;
        break;
    }
    return new this.GoClass(options);
}

var GameObjectFactory = new GameObjectFactory();
