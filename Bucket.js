function Bucket (options) {
    this.IMAGES = options.Images;
    this.Name = options.Name;
    this.State = options.State;
    this.Spawn = options.Spawn;
    this.Transform = options.Spawn;
    
    this.flyStart = null;
    this.flyControl = null;
    this.flyEnd = null;

    this.Renderer = new Renderer(this.IMAGES["Bucket-Idle"], this.IMAGES["Bucket-Idle"], 32, 32);
    
    this.Animator = new Animator([
        {name: "Idle",
        animation: new Animation({
            image: this.IMAGES["Bucket-Idle"], 
            mirrorImage: this.IMAGES["Bucket-Idle"], 
            numFrames: 1, 
            speedFrames: 4,
            width: 32, 
            height: 32
        })},
        {name: "In volo", animation: new Animation({
            image: this.IMAGES["Bucket-Idle"], 
            mirrorImage: this.IMAGES["Bucket-Idle"], 
            numFrames: 1, 
            speedFrames: 4,
            width: 32, 
            height: 32
        })},
        {name: "Trasporto", 
        animation: new Animation({
            image: this.IMAGES["Bucket-Idle"], 
            mirrorImage: this.IMAGES["Bucket-Idle"], 
            numFrames: 1, 
            speedFrames: 4,
            width: 32, 
            height: 32
        })},
        {name: "Atterraggio", 
        animation: new Animation({
            image: this.IMAGES["Bucket-Idle"], 
            mirrorImage: this.IMAGES["Bucket-Idle"], 
            numFrames: 1, 
            speedFrames: 4,
            width: 32,
            height: 32
        })}
    ]);
}

Bucket.prototype.getState = function() {
    return this.State;
}

Bucket.prototype.setState = function(State) {
    this.State = State;
}

Bucket.prototype.Update = function (InputController, GameObjectList, player, backShadows) {
    switch(this.getState()) {
        case "Idle":
        // console.log(this);
        if(Math.hypot(this.Transform.x + this.Renderer.width/2 - player.centerTransform.x, 
            this.Transform.y + this.Renderer.width/2 - player.centerTransform.y) < 30 && !player.occupato) {
                this.setState("Trasporto");
                player.occupato = true;
                GameObjectList.splice(GameObjectList.indexOf(this), 1);
                GameObjectList.push(this);
            }
            else {
                this.setState("Idle");
            }
            break;
            case "Trasporto":
            if(InputController.getRClick()) {
                if(player.Animator.orientation) {
                    this.Transform.x += 64;
                    this.Transform.y += Math.abs(this.Renderer.height-player.Renderer.height);
                }
                else {
                    this.Transform.x += -32;
                    this.Transform.y += Math.abs(this.Renderer.height-player.Renderer.height);
                }
                this.setState("Idle");
                player.occupato = false;
            }
            else if(InputController.getLClick() && Vector2.magnitude(Vector2.minus(InputController.getBeginLine(), InputController.getEndLine())) > THROW_THRESHOLD) {
                this.setState("In volo");
                this.k = 1;
                player.occupato = false;
                vect.x = InputController.getBeginLine().x-InputController.getEndLine().x;
                vect.y = InputController.getBeginLine().y-InputController.getEndLine().y;
                this.flyStart = new Vector2(player.Transform.x+deltaWorldMovement.x, player.Transform.y+deltaWorldMovement.y);
                this.flyControl = new Vector2(vect.x/2 + player.Transform.x, vect.y/2/1.2 + player.Transform.y-ARC_HEIGHT);
                this.flyEnd = new Vector2(vect.x + player.Transform.x, vect.y/1.2 + player.Transform.y + 30);
            }
            else {
                this.Transform.x = player.Transform.x;
                this.Transform.y = player.Transform.y;
            }
            break;
        case "In volo":
            var ok = false;
            for(var i = 0; i < CollectibleList.length; i++) {
                if(this !== CollectibleList[i] && isCollide(this, CollectibleList[i])) {
                    ok = true;
                }
            }
            if(ok) {
                this.setState("Atterraggio"); 
            }
            else
            if(this.k < FLY_SPEED){
                var fly = Bezier3(this.flyStart, this.flyControl, this.flyEnd, this.k/FLY_SPEED);
                this.Transform.x = fly.x;
                this.Transform.y = fly.y;
                this.k++;
                this.setState("In volo");
            }
            else {
                this.setState("Atterraggio");
            }
            break;
        case "Atterraggio": 
            if(this.Animator.getAnimation("Atterraggio").x >= this.Animator.getAnimation("Atterraggio").numFrames*this.Animator.getAnimation("Atterraggio").speedFrames-1) {
                this.setState("Idle");
            }
        break; 
        default:
            console.log("NON GESTITO!");
        break;
    }
}

Bucket.prototype.Render = function() {
    var anim = null;
    switch(this.State) {
        case "Idle": 
        case "Trasporto":
        case "Atterraggio": 
            anim = this.Animator.getAnimation(this.State);
        break;
        case "In volo":
            // this.CastShadow();
            anim = this.Animator.getAnimation(this.State);
        break;
        default: 
            console.log("Render: errore non gestito!"); 
        break;
    }
    context.drawImage(anim.image, 
        anim.next_imageIndex() * anim.width, 
        0, 
        anim.width, 
        anim.height, 
        this.Transform.x, 
        this.Transform.y, 
        anim.width, 
        anim.height);
}

Bucket.prototype.CastShadow = function() {
    context.save();
    context.beginPath();
    // console.log((-Math.pow((this.k-FLY_SPEED/2), 2) + Math.pow(FLY_SPEED/2, 2))/(Math.pow(FLY_SPEED/2, 2)/(this.Renderer.height/2)));
    context.ellipse(
        (this.flyEnd.x - this.flyStart.x)*(this.k/FLY_SPEED) + this.flyStart.x + this.Renderer.height/2,
        (this.flyEnd.y - this.flyStart.y)*(this.k/FLY_SPEED) + this.flyStart.y + this.Renderer.height/2,
        (-Math.pow(this.k-FLY_SPEED/2, 2) + Math.pow(FLY_SPEED/2, 2))/(Math.pow(FLY_SPEED/2, 2)/(this.Renderer.height/2)),
        ((-Math.pow(this.k-FLY_SPEED/2, 2) + Math.pow(FLY_SPEED/2, 2))/(Math.pow(FLY_SPEED/2, 2)/(this.Renderer.height/2)))/1.2,
        0, 
        0, 
        Math.PI*2
    );
    context.closePath();
    // context.stroke();
    context.clip();
    context.drawImage(this.IMAGES["Grass3"], 
        0, 0,
        384, 384);
    auxData = context.getImageData(
        (this.flyEnd.x - this.flyStart.x)*(this.k/FLY_SPEED) + this.flyStart.x + this.Renderer.height/2, 
        (this.flyEnd.y - this.flyStart.y)*(this.k/FLY_SPEED) + this.flyStart.y + this.Renderer.height/2, 
        32, 32);
    context.restore();
    context.putImageData(auxData, 
        (this.flyEnd.x - this.flyStart.x)*(this.k/FLY_SPEED) + this.flyStart.x + this.Renderer.height/2, 
        (this.flyEnd.y - this.flyStart.y)*(this.k/FLY_SPEED) + this.flyStart.y + this.Renderer.height/2);
}
