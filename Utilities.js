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
Animation.prototype.IsNowLastFrame = function() {
    return (this.x >= this.numFrames * this.speedFrames-1);
}

function Collider(options) {
    this.Shape = options.Shape;
    switch(this.Shape) {
        case "Rect":
            this.OffsetX = options.OffsetX;
            this.OffsetY = options.OffsetY;
            this.Height = options.Height;
            this.Width = options.Width;
            break;
        case "Circle":
            this.CenterX = options.CenterX;
            this.CenterY = options.CenterY;
            this.Radius = options.Radius;
            break;
        case "Ellipse":
            this.CenterX = options.CenterX;
            this.CenterY = options.CenterY;
            this.RadiusX = options.RadiusX;
            this.RadiusY = options.RadiusY;
            break;
        default:
            console.log("Errore collider");
    }
}

function Shadow(options) {
    this.CenterX = options.CenterX;
    this.CenterY = options.CenterY;
    this.RadiusX = options.RadiusX;
    this.RadiusY = options.RadiusY;
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
        case "Talk":
            this.GoClass = Talk;
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

function compare(a, b) {
    return a.Transform.y >= b.Transform.y
}

function CastShadows(IMAGES, GameObjectList) {

    // console.log((-Math.pow((this.k-FLY_SPEED/2), 2) + Math.pow(FLY_SPEED/2, 2))/(Math.pow(FLY_SPEED/2, 2)/(this.Renderer.height/2)));
    for(i = 0; i < GameObjectList.length; i++) {
        curr = GameObjectList[i];
        if(curr.Shadow) {
            context.beginPath(); 
            switch(curr.State) {
            case "In volo":
                context.ellipse(
                    (curr.flyEnd.x - curr.flyStart.x)*(curr.k/FLY_SPEED) + curr.flyStart.x + curr.Renderer.height/2,
                    (curr.flyEnd.y - curr.flyStart.y)*(curr.k/FLY_SPEED) + curr.flyStart.y + curr.Renderer.height/2,
                    curr.Renderer.height/2,
                    curr.Renderer.height/4,
                    0, 
                    0, 
                    Math.PI*2
                );
                break;
            default:
                context.ellipse(
                    curr.Transform.x + curr.Shadow.CenterX,
                    curr.Transform.y + curr.Shadow.CenterY,
                    curr.Shadow.RadiusX,
                    curr.Shadow.RadiusY,
                    0, 
                    0, 
                    Math.PI*2
                    );
                break;
            }
            context.fill();
            context.closePath();
        }
    }
    context.globalCompositeOperation='source-atop';
    context.drawImage(IMAGES["Grass3"], 
        0, 0,
        384, 384);
    // context.clip();
    context.globalCompositeOperation='destination-over';
    context.drawImage(IMAGES["Grass2"], 
    0, 0,
    384, 384);
    context.globalCompositeOperation='source-over';
        // 0,0);
    // var auxData = [];
    // for(i = 0; i < GameObjectList.length; i++) {
    //     var curr = GameObjectList[i];
    //     auxData.push(context.getImageData(
    //         curr.Transform.x + curr.Renderer.height/2, 
    //         curr.Transform.y + curr.Renderer.width/2, 
    //         curr.Renderer.height, curr.Renderer.height));
    // }
    // context.restore();

    // for(i = 0; i < GameObjectList.length; i++) {
    //     var curr = GameObjectList[i];
    //     context.putImageData(auxData[i], 
    //         curr.Transform.x + curr.Renderer.height/2, 
    //         curr.Transform.y + curr.Renderer.width/2);
    // }
}


function Quadtree (Max, StartX, StartY, Width, Height, Lvl) {
    this.Nodes = [];
    this.ObjectList = [];
    this.Lvl = Lvl;
    this.MAX_OBJECTS = Max;
    this.StartX = StartX;
    this.StartY = StartY;
    this.Width = Width;
    this.Height = Height;
}

Quadtree.prototype.Contains = function(Obj) {
    var ax = this.StartX;
    var ay = this.StartY;
    var aw = this.Width;
    var ah = this.Height;
    // console.log(this, Obj);
    var bx = Obj.StartX;
    var by = Obj.StartY;
    var bw = Obj.Width;
    var bh = Obj.Height;
    return (
        (Obj.StartX > this.StartX) &&
        (Obj.StartX < this.StartX + this.Width) &&
        (Obj.StartY > this.StartY) &&
        (Obj.StartY < this.StartY + this.Height)
    );
}

Quadtree.prototype.Insert = function(Obj) {
    if(this.Nodes.length > 0) {
        var j = 0;
        var trovato = false;
        while(j < 4 && !trovato) {
            if(this.Nodes[j].Contains(Obj)) {
                this.Nodes[j].Insert(Obj);
                trovato = true;
            }
            else {
                j++;
            }
        }
    }
    else {
        if(this.ObjectList.length >= this.MAX_OBJECTS) {
            this.Nodes.push(new Quadtree(this.MAX_OBJECTS, this.StartX, this.StartY, this.Width/2, this.Height/2, this.Lvl+1));
            this.Nodes.push(new Quadtree(this.MAX_OBJECTS, this.StartX + this.Width/2, this.StartY, this.Width/2, this.Height/2, this.Lvl+1));
            this.Nodes.push(new Quadtree(this.MAX_OBJECTS, this.StartX, this.StartY + this.Height/2, this.Width/2, this.Height/2, this.Lvl+1));
            this.Nodes.push(new Quadtree(this.MAX_OBJECTS, this.StartX + this.Width/2, this.StartY + this.Height/2, this.Width/2, this.Height/2, this.Lvl+1));
            for(let i = 0; i < this.ObjectList.length; i++) {
                var j = 0;
                var trovato = false;
                while(j < 4 && !trovato) {
                    var ok = this.Nodes[j];
                    if(this.Nodes[j].Contains(this.ObjectList[i])) {
                        // console.log("L'oggetto " + i + " interseca il quadrante " + j);
                        trovato = true;
                        this.Nodes[j].Insert(this.ObjectList[i]);
                    }
                    else {
                        // console.log("L'oggetto " + i + " non interseca il quadrante " + j);
                        j++;
                    }
                }
            }
            j = 0;
            trovato = false;
            while(j < 4 && !trovato) {
                if(this.Nodes[j].Contains(Obj)) {
                    // console.log("L'oggetto " + i + " interseca il quadrante " + j);
                    trovato = true;
                    this.Nodes[j].Insert(Obj);
                }
                else {
                    // console.log("L'oggetto " + i + " non interseca il quadrante " + j);
                    j++;
                }
            }
            this.ObjectList = [];
        }
        else {
            this.ObjectList.push(Obj);
        }
    }
}
Quadtree.prototype.Print = function() {
    // console.log("Livello "+ this.Lvl);
    if(this.Nodes.length <= 0) {
        for(let i = 0; i < this.ObjectList.length; i++) {
            // console.log("Oggetto " + i);
        }
    }
    else {
        context.beginPath();
        context.moveTo(this.StartX + this.Width/2, this.StartY);
        context.lineTo(this.StartX + this.Width/2, this.StartY + this.Height);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(this.StartX, this.StartY + this.Height/2);
        context.lineTo(this.StartX + this.Width, this.StartY + this.Height/2);
        context.stroke();
        context.closePath();
        for(let i = 0; i < 4; i++) {
            this.Nodes[i].Print();
        }
    }
}