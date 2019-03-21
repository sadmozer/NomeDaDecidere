var playerCenter;
var SingletonPlayer = (function(){
    var instance;
    function init(options) {
        var ret = GameObjectFactory.create({
                Name: options.Name,
                Renderer: options.Renderer,
                Animator: options.Animator,
                Spawn: options.Spawn,
                Transform: options.Spawn
        });
        ret.centerTransform = new Vector2(ret.Spawn.x + ret.Renderer.width/2, ret.Spawn.y + ret.Renderer.height/2);
        
        ret.Update = function(deltaWorldMovement) {
            this.Transform.x += deltaWorldMovement.x;
            this.Transform.y += deltaWorldMovement.y;
            
            this.centerTransform.x += deltaWorldMovement.x;
            this.centerTransform.y += deltaWorldMovement.y;

            if(draw)
                this.Animator.orientation = (InputController.getBeginLine().x >= spawn.x + this.Renderer.width/2);
            else
                this.Animator.orientation = (InputController.getMouseX() >= spawn.x + this.Renderer.width/2);
        };
        ret.Render = function(deltaWorldMovement) {
            if(InputController.getAxis().Horizontal || InputController.getAxis().Vertical) {
                if(player.Animator.orientation && (InputController.getAxis().Horizontal == 1 || InputController.getAxis().Vertical)) {
                    context.drawImage(player.Animator.image, player.Animator.next_imageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
                }
                else if(!player.Animator.orientation && (InputController.getAxis().Horizontal == 1 || InputController.getAxis().Vertical)){
                    context.drawImage(player.Animator.mirrorImage, player.Animator.next_mirrorImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
                }
                else if(!player.Animator.orientation && (InputController.getAxis().Horizontal == -1)){
                    context.drawImage(player.Animator.mirrorImage, player.Animator.prev_mirrorImageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
                }
                else if(player.Animator.orientation && (InputController.getAxis().Horizontal == -1)){
                    context.drawImage(player.Animator.image, player.Animator.prev_imageIndex() * 64, 0, 64, 64, player.Transform.x, player.Transform.y, 64, 64);
                }
            }
            else {
                if(player.Animator.orientation) {
                    context.drawImage(player.Renderer.image, player.Transform.x, player.Transform.y);
                }
                else {
                    context.drawImage(player.Renderer.mirrorImage, player.Transform.x, player.Transform.y);
                }
            }
        }
        return ret;
    };
    return {
        getInstance: function(options) {
            if(!instance) {
                instance = init(options);
            }
            return instance;
        }
    }
})();
