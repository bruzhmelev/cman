Class = (function() {
	function define(mixin, api){
		if (!api){
			api = mixin;
			mixin = null;
		}

		var constructor = createConstructor(mixin, api);
		var cls = deployConstructor(constructor);

		if (mixin) {
			extendPrototype(cls.prototype, mixin.prototype);
		}

		if (api) {
			extendPrototype(cls.prototype, api);
		}

		return cls;
	}

	/// CONSTRUCTORS

	function createConstructor (mixin, api){
		if ((api && api._constructor) || (mixin && mixin.prototype._constructor)){
			return function () {
				this._constructor.apply(this, arguments);
			};
		}
		else {
			return function () {};
		}
	}

	function deployConstructor (constructor){
		if (canCreateGlobal()){
			return createGlobal(constructor);
		}
		else {
			return constructor;
		}
	}

	/// PROTOTYPES

	function extendPrototype(prototype, api){
		if (!api){
			return;
		}

		for (var prop in api){
			if (api.hasOwnProperty(prop)){
				prototype[prop] = api[prop];
			}
		}
	}

	/// GLOBAL

	function canCreateGlobal(){
		return (typeof window !== 'undefined');
	}

	function createGlobal(constructor){
		var url = getCurrentScriptUrl();
		var name = extractClassNameFromUrl(url);
		var body = constructor.toString();
		var code = "Class." + name + " = " + body;

		(new Function('', code))();
		return Class[name];
	}

	function getCurrentScriptUrl(){
		var scripts = window.document.getElementsByTagName('script');
		var lastScript = scripts[scripts.length - 1];
		return lastScript.src;
	}

	function extractClassNameFromUrl(url){
		var parts = url.split('/'); //url like "http://host:port/root/a/b/c"
		parts.splice(0, 1); 		//remove "http:/"
		parts.splice(0, 1); 		//remove "/"
		parts.splice(0, 1); 		//remove "host:port"
		parts.splice(0, 1);			//remove "root"

		var name = parts.join('_');
		name = name.replace(/^(.*)(\.js|\.json)$/, '$1'); //remove file extension
		name = name.replace('.', '_'); //remove dots

		return name;
	}

	return define;

})();

/// EXPORTS

if (typeof module !== 'undefined') {
	module.exports = Class;
}





