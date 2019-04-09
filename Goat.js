function Goat (options) {
    this.IMAGES = options.Images;
    this.Name = options.Name;
    this.State = options.State;
    this.Spawn = options.Spawn;
    this.Transform = options.Spawn;

    this.flyStart = null;
    this.flyControl = null;
    this.flyEnd = null;
    this.talk = null;
    this.timer = 0;
    this.timer_idle = Math.random() * IDLE_TIMEWAITING;
    this.targetPascolo = null;
    this.Renderer = new Renderer(this.IMAGES["Goat1-Idle"], this.IMAGES["Goat1-Idle"], 48, 48);
    this.Collider = new Collider({
        Shape: "Ellipse",
        CenterX: 24,
        CenterY: 30,
        RadiusX: 22,
        RadiusY: 12
    });
    this.Shadow = new Shadow({
        CenterX: 24,
        CenterY: 40,
        RadiusX: 22,
        RadiusY: 12
    });
    this.isHayColliding = false;
    this.Animator = new Animator([
        {name: "Idle",
        animation: new Animation({
            image: this.IMAGES["Goat1-Idle"], 
            mirrorImage: this.IMAGES["Goat1-Idle"], 
            numFrames: 4, 
            speedFrames: 9,
            width: 48, 
            height: 48
        })},
        {name: "In volo", animation: new Animation({
            image: this.IMAGES["Goat1-Idle"], 
            mirrorImage: this.IMAGES["Goat1-Idle"], 
            numFrames: 4, 
            speedFrames: 9,
            width: 48, 
            height: 48
        })},
        {name: "Trasporto", 
        animation: new Animation({
            image: this.IMAGES["Goat1-Idle"], 
            mirrorImage: this.IMAGES["Goat1-Idle"], 
            numFrames: 4, 
            speedFrames: 9,
            width: 48, 
            height: 48
        })},
        {name: "Atterraggio", 
        animation: new Animation({
            image: this.IMAGES["Goat1-Idle"], 
            mirrorImage: this.IMAGES["Goat1-Idle"], 
            numFrames: 4, 
            speedFrames: 9,
            width: 48,
            height: 48
        })},
        {name: "Pascolo", 
        animation: new Animation({
            image: this.IMAGES["Goat1-Idle"], 
            mirrorImage: this.IMAGES["Goat1-Idle"], 
            numFrames: 4, 
            speedFrames: 9,
            width: 48,
            height: 48
        })},
        {name: "Masticazione1",
        animation: new Animation({
            image: this.IMAGES["Goat1-Sit3Chewing"],
            mirrorImage: this.IMAGES["Goat1-Sit3Chewing"],
            numFrames: 5,
            speedFrames: 11,
            width: 48,
            height: 48
        })},
        {name: "Masticazione2",
        animation: new Animation({
            image: this.IMAGES["Goat1-Sit2Chewing"],
            mirrorImage: this.IMAGES["Goat1-Sit2Chewing"],
            numFrames: 4,
            speedFrames: 11,
            width: 48,
            height: 48
        })},
        {name: "Talk",
        animation: new Animation({
            image: this.IMAGES["Goat1-Talk"],
            mirrorImage: this.IMAGES["Goat1-Sit3Chewing"],
            numFrames: 8,
            speedFrames: 9,
            width: 48,
            height: 48
        })}
    ]);
}

Goat.prototype.getState = function() {
    return this.State;
}

Goat.prototype.setState = function(State) {
    this.State = State;
}
Goat.prototype.DistanceFromPlayer = function() {
    return Math.hypot(this.Transform.x + this.Renderer.width/2 - player.centerTransform.x, 
        this.Transform.y + this.Renderer.width/2 - player.centerTransform.y);
}

Goat.prototype.DrawCollider = function() {
    switch(this.Collider.Shape) {
        case "Rect":
            context.beginPath();
            context.rect(this.Transform.x + this.Collider.OffsetX, 
                this.Transform.y + this.Collider.OffsetY,
                this.Collider.Width, this.Collider.Height);
            context.stroke();
            context.closePath();
            break;
        case "Circle":
            context.beginPath();
            context.ellipse(this.Transform.x + this.Collider.CenterX,
                this.Transform.y + this.Collider.CenterY,
                this.Collider.Radius,
                this.Collider.Radius,
                0,
                0,
                Math.PI*2);
            context.stroke();
            context.closePath();
            break;
        case "Ellipse":
            context.beginPath();
            context.ellipse(this.Transform.x + this.Collider.CenterX,
                this.Transform.y + this.Collider.CenterY,
                this.Collider.RadiusX,
                this.Collider.RadiusY,
                0,
                0,
                Math.PI*2);
            context.strokeStyle = 'rgba(0, 0, 255, 0.5)';
            context.stroke();
            context.closePath();
            context.strokeStyle = 'black';
            break;
        default:
    }
}

Goat.prototype.Update = function (InputController, GameObjectList, player) {
    switch(this.getState()) 
    {
        case "Idle": 
            if(this.isHayColliding) {
                this.setState("Masticazione1");
                this.mastic_timer = Math.random() * MASTIC_TIMER;
            }
            else if(this.DistanceFromPlayer() < 30 
                && !player.occupato
                && (InputController.getAxis().Horizontal != 0 || InputController.getAxis().Vertical != 0)) {
                    this.setState("Trasporto");
                    player.occupato = true;
                    GameObjectList.splice(GameObjectList.indexOf(this), 1);
                    GameObjectList.push(this);
            }
            else if(this.timer_idle > IDLE_TIMEWAITING) {
                this.randVect = new Vector2((Math.random() * (PASCOLO*2) - PASCOLO), (Math.random() * (PASCOLO*2) - PASCOLO));
                this.targetPascolo = new Vector2(this.Transform.x + this.randVect.x, 
                    this.Transform.y + this.randVect.y);
                this.setState("Pascolo");
                this.timer = 0;
                this.randVect_mgn = Vector2.magnitude(this.randVect);
                this.auxVect = new Vector2(0, 0);
                this.startPascolo = new Vector2(this.Transform.x, this.Transform.y);
            }
            else {
                this.timer_idle++;
                this.setState("Idle");
            }
            break;
        case "Trasporto": 
            if(InputController.getRClick()) {
                if(player.Animator.orientation) {
                    this.Transform.x = player.Transform.x + 64;
                    this.Transform.y = player.Transform.y + 24;
                }
                else {
                    this.Transform.x = player.Transform.x - 32;
                    this.Transform.y = player.Transform.y + 24;
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
            var ok = null;
            for(var i = 0; i < CollectibleList.length; i++) {
                if(this !== CollectibleList[i] && isCollide(this, CollectibleList[i])) {
                    ok = CollectibleList[i];
                }
            }
            if(ok) {
                if(ok.constructor.name === "Goat") {
                    GameObjectList.push(GameObjectFactory.create({
                        GoClass: "Goat",
                        State: "Idle",
                        Images: IMAGES,
                        Name: "G",
                        Spawn: new Vector2(this.Transform.x + 50, this.Transform.y)
                    }));
                    ok = null;
                }
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
            if(this.isHayColliding) {
                this.setState("Masticazione1");
                this.mastic_timer = Math.random() * MASTIC_TIMER;
            }
            else if(this.Animator.getAnimation("Atterraggio").x >= this.Animator.getAnimation("Atterraggio").numFrames*this.Animator.getAnimation("Atterraggio").speedFrames-1) {
                this.randVect = new Vector2((Math.random() * (PASCOLO*2) - PASCOLO), (Math.random() * (PASCOLO*2) - PASCOLO));
                this.targetPascolo = new Vector2(this.Transform.x + this.randVect.x, 
                    this.Transform.y + this.randVect.y);
                this.setState("Pascolo");
                this.timer = 0;
                this.randVect_mgn = Vector2.magnitude(this.randVect);
                this.auxVect = new Vector2(0, 0);
                this.startPascolo = new Vector2(this.Transform.x, this.Transform.y);
            }
            break;
        case "Pascolo": 
            if(this.isHayColliding) {
                this.setState("Masticazione1");
                this.mastic_timer = Math.random() * MASTIC_TIMER;
            }
            else if(Math.hypot(this.Transform.x + this.Renderer.width/2 - player.centerTransform.x, 
                this.Transform.y + this.Renderer.width/2 - player.centerTransform.y) < 30 
                && !player.occupato
                && (InputController.getAxis().Horizontal != 0 || InputController.getAxis().Vertical != 0)) {
                    this.setState("Trasporto");
                    player.occupato = true;
                    GameObjectList.splice(GameObjectList.indexOf(this), 1);
                    GameObjectList.push(this);
            }
            else if(Vector2.magnitude(this.auxVect) > this.randVect_mgn) {
                this.setState("Talk");
                this.timer_idle = Math.random() * IDLE_TIMEWAITING;
            }
            else {
                this.auxVect.x = this.randVect.x / this.randVect_mgn * this.timer * PASCOLO_SPEED;
                this.auxVect.y = this.randVect.y / this.randVect_mgn * this.timer * PASCOLO_SPEED;
                this.Transform.x = Math.round(this.startPascolo.x + this.auxVect.x);
                this.Transform.y = Math.round(this.startPascolo.y + this.auxVect.y); 
                this.timer++;
                this.setState("Pascolo");
            }
            break;
        case "Masticazione1":
            if(this.Animator.getAnimation("Masticazione1").IsNowLastFrame()) {
                this.setState("Masticazione2");
            }
            break;
        case "Masticazione2":
            if(this.mastic_timer > MASTIC_TIMER) {
            // if(this.Animator.getAnimation("Masticazione").x >= this.Animator.getAnimation("Masticazione").numFrames * this.Animator.getAnimation("Masticazione").speedFrames-1) {
                this.setState("Idle");
                this.isHayColliding = false;
                this.timer_idle = Math.random() * IDLE_TIMEWAITING;
                if(!this.talk) {
                    this.talk = GameObjectFactory.create({
                        GoClass: "Talk",
                        State: "Love",
                        Images: this.IMAGES,
                        Name: "talk",
                        bindObj: this,
                        Spawn: new Vector2(this.Transform.x, this.Transform.y)
                    });
                    GameObjectList.push(this.talk);
                }
            }
            else {
                // console.log(this.Animator.getAnimation("Masticazione").x , this.Animator.getAnimation("Masticazione").numFrames * this.Animator.getAnimation("Masticazione").speedFrames);
                this.setState("Masticazione2");
                this.mastic_timer++;
            }
            break;
        case "Talk":
            if(this.Animator.getAnimation("Talk").x >= this.Animator.getAnimation("Talk").numFrames * this.Animator.getAnimation("Talk").speedFrames-1) {
                this.setState("Idle");
            }
            break;
        default:
            console.log("NON GESTITO!");
        break;
    }
}

Goat.prototype.Render = function() {
    this.State;
    var anim = null;
    var a;
    
    switch(this.State) {
        case "Idle": 
        case "Trasporto":
        case "Atterraggio":
        case "Pascolo":
        case "Masticazione1":
        case "Masticazione2":
        case "Talk":
            anim = this.Animator.getAnimation(this.State);
        break;
        case "In volo":
            anim = this.Animator.getAnimation(this.State);
        break;
        default: 
            console.log("Render: errore non gestito!"); 
        break;
    }
    // this.CastShadow();

    // console.log(a, this.prototype.CastShadow);
    context.drawImage(anim.image, 
        anim.next_imageIndex() * anim.width, 
        0, 
        anim.width, 
        anim.height, 
        this.Transform.x, 
        this.Transform.y, 
        anim.width, 
        anim.height);

    if(this.Collider) {
        // console.log(this.Collider);
        this.DrawCollider();
    }
}

Goat.prototype.CastShadow = function() {
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