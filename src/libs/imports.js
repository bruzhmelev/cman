/// IMPORTS

var imports = function (path) {
	debugger;

	if (!path) {
		throw new Error('Argument "path" is empty');
	}

	var route = imports._findRoute(path);
	if (route){
		path = imports._applyRoute(path, route);
	}
	path = imports._combinePathes(imports._root, path);
	return require(path);
};

/// ROUTES

imports.root = function (path){
	imports._root = path;
};

imports.configure = function (config, sectionName){
	if (!config){
		return config;
	}

	if (typeof config === 'string'){
		config = require(config);
	}

	if (!sectionName){
		sectionName = 'imports';
	}

	var section = config[sectionName];
	if (!section){
		return config;
	}

	imports.root(section.root);

	if (section.routes) {
		for (var key in section.routes) {
			imports.route(key, section.routes[key]);
		}
	}

	return config;
};

imports.route = function (path, replaceWithPath) {
	if (!path){
		return;
	}

	imports._routes = imports._routes || [];
	imports._routes.push({
		path: path,
		replaceWithPath: replaceWithPath || ''
	});
};

imports._findRoute = function (path) {
	if (!path) {
		return null;
	}

	if (!imports._routes) {
		return null;
	}

	var maxLength = 0;
	var foundRoute = null;

	for (var i = 0; i < imports._routes.length; i++) {
		var route = imports._routes[i];
		if (path.indexOf(route.path) == 0) {
			if (route.path.length >= maxLength) {
				foundRoute = route;
				maxLength = route.path.length;
			}
		}
	}

	return foundRoute;
};

imports._applyRoute = function (path, route) {
	if (!path) {
		return path;
	}

	if (!route){
		return path;
	}

	return route.replaceWithPath + path.substring(route.path.length);
};

/// INSTANCE

imports.instance = function (path, p0, p1, p2, p3, p4, p5, p6, p7){
	var module = imports(path);
	if (!module){
		return null;
	}

	var instance = new module(p0, p1, p2, p3, p4, p5, p6, p7);
	return instance;
};

/// PATHES

imports._combinePathes = function (path0, path1) {
	if (!path0) {
		return path1;
	}

	if (!path1) {
		return path0;
	}

	if (path0[path0.length - 1] != '/') {
		return path0 + '/' + path1;
	}
	else {
		return path0 + path1;
	}
};

/// SCOPE

imports.scope = function(path){
	return new imports.Scope(path);
};

imports.Scope = function(path){
	this.path = path || '';
};

imports.Scope.prototype.resolve = function(path){
	return imports(imports._combinePathes(this.path, path));
};

imports.Scope.prototype.instance = function(path, p0, p1, p2, p3, p4, p5, p6, p7){
	return imports.instance(imports._combinePathes(this.path, path), p0, p1, p2, p3, p4, p5, p6, p7);
};

/// EXPORTS

// if (typeof module !== 'undefined') {
// 	module.exports = imports;
// }

export { imports };