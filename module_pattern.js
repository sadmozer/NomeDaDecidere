var original_module = (function() {
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
})();

var revealing_module = (function() {
    var private_var = "value";
    var private_method = function() {
        return private_var + " + private_method_return";
    }

    var_public_var = "value";
    var public_method = function() {
        return "public_method_return";
    }
    return {
        var: public_var,
        method: public_method
    };
})();

