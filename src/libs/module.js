module = {
	_emptyArray: [],
	_modules: {},

	_export: function(obj){
		var currentPath = this._getCurrentModulePath();
		this._modules[currentPath] = obj;
	},

	_getCurrentModulePath: function(){
		var url = this._getCurrentScriptUrl();

		var parts = url.split('/'); //url like "http://host:port/a/b/c"
		parts.splice(0, 1); 		//remove "http:/"
		parts.splice(0, 1); 		//remove "/"
		parts.splice(0, 1); 		//remove "host:port"

		var path = this._removeFileExtension(parts.join('/')); //get "a/b/c"
		return path;
	},

	_removeFileExtension: function(path){
		return path.replace(/^(.*)(\.js|\.json)$/, '$1');
	},

	_getCurrentScriptUrl: function(){
		var scripts = document.getElementsByTagName('script');
		var lastScript = scripts[scripts.length - 1];
		return lastScript.src;
	}
};

require = function(path){
	var mod = module._modules[path];
	if (!mod) {
		throw new Error('Module "' + path + '" not found');
	}

	return mod;
};

Object.defineProperty(module, 'exports', {
	get: function(){return null},
	set: function(instance){module._export(instance)}
});
