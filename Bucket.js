function Bucket (options) {
    this.IMAGES = options.Images;
    this.Name = options.Name;
    this.State = options.State;
    this.Spawn = options.Spawn;
    this.Transform = options.Spawn;
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
    this.getState = function() {
        return this.State;
    }
    this.setState = function(State) {
        this.State = State;
    }

    this.Update = function (InputController, GameObjectList, player) {
        switch(this.getState()) {
            case "Idle":
            // console.log(this);
            if(Math.hypot(this.Transform.x + this.Renderer.width/2 - player.centerTransform.x, 
                this.Transform.y + this.Renderer.width/2 - player.centerTransform.y) < 30 && !occupato) {
                    this.setState("Trasporto");
                    occupato = true;
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
                        this.Transform.x = player.Transform.x + 64;
                        this.Transform.y = player.Transform.y + 24;
                    }
                    else {
                        this.Transform.x = player.Transform.x - 32;
                        this.Transform.y = player.Transform.y + 24;
                    }
                    this.setState("Idle");
                    occupato = false;
                }
                else if(InputController.getLClick() && Vector2.magnitude(Vector2.minus(InputController.getBeginLine(), InputController.getEndLine())) > THROW_THRESHOLD) {
                    this.setState("In volo");
                    k = 1;
                    occupato = false;
                    vect.x = InputController.getBeginLine().x-InputController.getEndLine().x;
                    vect.y = InputController.getBeginLine().y-InputController.getEndLine().y;
                    flyStart = new Vector2(player.Transform.x+deltaWorldMovement.x, player.Transform.y+deltaWorldMovement.y);
                    flyControl = new Vector2(vect.x/2 + player.Transform.x, vect.y/2/1.2 + player.Transform.y-ARC_HEIGHT);
                    flyEnd = new Vector2(vect.x + player.Transform.x, vect.y/1.2 + player.Transform.y + 30);
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
                if(k < FLY_SPEED){
                    var fly = Bezier3(flyStart, flyControl, flyEnd, k/FLY_SPEED);
                    this.Transform.x = fly.x;
                    this.Transform.y = fly.y;
                    k++;
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
}
