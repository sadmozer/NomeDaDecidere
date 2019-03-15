var singleton = (function(){
    var instance;
    var init = function() {
        var private_var = "value";
        var private_method = function() {
            return private_var + " + private_method_return";
        }

        return {
            public_var: "value",
            public_method: function() {
                return "public_method_return";
            }
        };
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

var single = singleton.getInstance();