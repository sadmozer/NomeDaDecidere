function Talk(options) {
    this.IMAGES = options.Images;
    this.Name = options.Name;
    this.State = options.State;
    this.Spawn = options.Spawn;
    this.Transform = options.Spawn;
    this.bindObj = options.bindObj;
    this.Renderer = new Renderer(this.IMAGES["EmptyTalk1"], this.IMAGES["EmptyTalk1"], 32, 32);

    this.Animator = new Animator([
        {name: "Love",
        animation: new Animation({
            image: this.IMAGES["LoveTalk1"],
            mirrorImage: this.IMAGES["LoveTalk1"],
            numFrames: 7,
            speedFrames: 5,
            width: 32,
            height: 32
        })}
    ]);
}

Talk.prototype.Bind = function(Obj) {
    this.bindObj = Obj;
}

Talk.prototype.Update = function(InputController, GameObjectList, player, backShadows) {
    if(this.bindObj) {
        this.Transform.x = this.bindObj.Transform.x + 20;
        this.Transform.y = this.bindObj.Transform.y - 20;
    }
}

Talk.prototype.setState = function(State) {
    this.State = State;
}

Talk.prototype.Render = function() {
    var anim = null;
    switch(this.State) {
        case "Love":
            anim = this.Animator.getAnimation(this.State);
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