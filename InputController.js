var SingletonInputController = (function(){
    var instance;
    
    function init() {
        var mouseX = 0;
        var mouseY = 0;
        var Axis = {Horizontal: 0, Vertical: 0};
        var Keys = {Space: false, ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false};
        var beginLine = new Vector2(0, 0);
        var endLine = new Vector2(0, 0);
        var rClick = false;
        var lClick = false;

        function KeyDownManager(event) {
            event.preventDefault();
            if(event.keyCode === ARROW_LEFT) {
                Keys.ArrowLeft = true;
                Axis.Horizontal = -1;
            }
            else if(event.keyCode === ARROW_UP) {
                Keys.ArrowUp = true;
                Axis.Vertical = -1;
            }
            else if(event.keyCode === ARROW_RIGHT) {
                Keys.ArrowRight = true;
                Axis.Horizontal = 1;
            }
            else if(event.keyCode === ARROW_DOWN) {
                Keys.ArrowDown = true;
                Axis.Vertical = 1;
            }
            else if(event.keyCode === 32 && !event.repeat) {
                Keys.Space = true;
            }
        }
        
        function KeyUpManager(event) {
            event.preventDefault();
            if(event.keyCode === ARROW_LEFT) {
                Keys.ArrowLeft = false;
                if(!Keys.ArrowRight)
                    Axis.Horizontal = 0;
                else
                    Axis.Horizontal = 1;
            }
            else if(event.keyCode === ARROW_UP) {
                Keys.ArrowUp = false;
                if(!Keys.ArrowDown)        
                    Axis.Vertical = 0;
                else
                    Axis.Vertical = 1;
            }
            else if(event.keyCode === ARROW_RIGHT) {
                Keys.ArrowRight = false;
                if(!Keys.ArrowLeft)        
                    Axis.Horizontal = 0;
                else
                    Axis.Horizontal = -1;
            }
            else if(event.keyCode === ARROW_DOWN) {
                Keys.ArrowDown = false;
                if(!Keys.ArrowUp)        
                    Axis.Vertical = 0;
                else
                    Axis.Vertical = -1;
            }
            else if(event.keyCode === 32 && !event.repeat) {
                Keys.Space = false;
            }
        }
        
        function MouseDownManager(event) {
            if(event.button === 0) {
                beginLine.x = Math.trunc(event.clientX-rect.left);
                beginLine.y = Math.trunc(event.clientY-rect.top);
                draw = true;
            }
        }
        function MouseUpManager(event) {
            if(event.button === 0) {
                endLine.x = Math.trunc(event.clientX-rect.left);
                endLine.y = Math.trunc(event.clientY-rect.top);
                draw = false;
                lClick = true;
            }
            else if(event.button === 2) {
                rClick = true;
            }
        }
        
        function MouseMoveManager(event) {
            mouseX = event.clientX-rect.left;
            mouseY = event.clientY-rect.top;
        }
        function doScroll(event) {
            event.preventDefault();
        }
        
        function RightClickManager(event) {
            event.preventDefault();
        }

        function getMouseX() {
            return mouseX;
        }

        function getMouseY() {
            return mouseY;
        }

        function getBeginLine() {
            return beginLine;
        }

        function getEndLine() {
            return endLine;
        }

        function getAxis() {
            return Axis;
        }

        function getKeys() {
            return Keys;
        }
        function getRClick() {
            return rClick;
        }
        function setRClick(b) {
            rClick = b;
        }
        function getLClick() {
            return lClick;
        }
        function setLClick(b) {
            lClick = b;
        }
        return {
            getMouseX: getMouseX,
            getMouseY: getMouseY,
            getBeginLine: getBeginLine,
            getEndLine: getEndLine,
            getAxis: getAxis,
            getKeys: getKeys,
            getRClick: getRClick,
            setRClick: setRClick,
            getLClick: getLClick,
            setLClick: setLClick,
            Start: function() {
                document.addEventListener('keydown', KeyDownManager, false);
                document.addEventListener('keyup', KeyUpManager, false);
                document.addEventListener('mousedown', MouseDownManager, false);
                document.addEventListener('mouseup', MouseUpManager, false);
                document.addEventListener('mousemove', MouseMoveManager, false);
                document.addEventListener("wheel", doScroll, {passive: false});
                document.addEventListener("contextmenu", RightClickManager, false);
            }
        }
    }

    return {
        getInstance: function() {
            if(!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();


var InputController = SingletonInputController.getInstance();
