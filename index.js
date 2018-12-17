var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _jsxFileName="/Users/bhauman/workspace/figwheel/react-native-figwheel-bridge/figwheel-bridge.js";var debugEnabled=false;var React=require('react');var createReactClass=require('create-react-class');var ReactNative=require('react-native');var WebSocket=require('WebSocket');var self;var evaluate=eval;var externalModules={};var evalListeners={};var asyncImportChain=new Promise(function(succ,fail){succ(true);});function fireEvalListenters(url){Object.values(evalListeners).forEach(function(listener){listener(url);});}function listenForReload(cb){if(cljsNamespaceToObject("figwheel.core.event_target")){figwheel.core.event_target.addEventListener("figwheel.after-load",cb);}}var figwheelApp=function figwheelApp(config){return createReactClass({getInitialState:function getInitialState(){return{loaded:false};},render:function render(){if(!this.state.loaded){var plainStyle={flex:1,alignItems:'center',justifyContent:'center'};return React.createElement(ReactNative.View,{style:plainStyle,__source:{fileName:_jsxFileName,lineNumber:40}},React.createElement(ReactNative.Text,{__source:{fileName:_jsxFileName,lineNumber:41}},"Waiting for Figwheel to load files."));}return this.state.root();},componentDidMount:function componentDidMount(){var app=this;if(typeof goog==="undefined"){loadApp(config,function(appRoot){app.setState({root:appRoot,loaded:true});listenForReload(function(e){app.forceUpdate();});});}}});};function logDebug(msg){if(debugEnabled){console.log(msg);}}var isChrome=function isChrome(){return typeof importScripts==="function";};function asyncImportScripts(url,transform,success,error){logDebug('(asyncImportScripts) Importing: '+url);asyncImportChain=asyncImportChain.then(function(v){return fetch(url);}).then(function(response){if(response.ok)return response.text();throw new Error("Failed to Fetch: "+url+" - Perhaps your project was cleaned and you haven't recompiled?");}).then(function(responseText){evaluate(transform(responseText));fireEvalListenters(url);success();return true;}).catch(function(e){console.error(e);error();return true;});}function syncImportScripts(url,success,error){try{importScripts(url);logDebug('Evaluated: '+url);fireEvalListenters(url);success();}catch(e){console.error(e);error();}}function importJs(src,success,error){var noop=function noop(){};var identity=function identity(arg){return arg;};var successCb=typeof success=='function'?success:noop;var errorCb=typeof error=='function'?error:noop;logDebug('(importJs) Importing: '+src);if(isChrome()){syncImportScripts(src,successCb,errorCb);}else{asyncImportScripts(src,identity,successCb,errorCb);}}function interceptRequire(){var oldRequire=window.require;console.info("Shimming require");window.require=function(id){console.info("Requiring: "+id);if(externalModules[id]){return externalModules[id];}return oldRequire(id);};}function importIndexJs(fileBasePath){var src=fileBasePath+'/index.js';var transformFn=function transformFn(code){var defines=code.match(new RegExp("goog.global.CLOSURE_UNCOMPILED_DEFINES.*?;"));var deps=code.match(/goog.require\(.*?\);/g);var transformedCode=defines.concat(deps).join('');logDebug('transformed index.js: ',transformedCode);return transformedCode;};logDebug('(importIndexJs) Importing: '+src);asyncImportScripts(src,transformFn,function(){},function(){});}function cljsNamespaceParts(ns){return ns.replace(/\-/,"_").split(/\./);}function cljsNamespaceToPath(ns){return cljsNamespaceParts(ns).join("/")+".js";}function cljsNamespaceToObject(ns){return cljsNamespaceParts(ns).reduce(function(base,arg){return base?base[arg]:base;},goog.global);}function serverBaseUrl(config){var host=isChrome()?"localhost":config.devHost;return"http://"+host+":"+config.serverPort+"/"+config.outputTo;}function assert(predVal,message){if(!predVal){throw new Error(message);}}function loadApp(config,onLoadCb){var fileBasePath=serverBaseUrl(config);var mainJs=cljsNamespaceToPath(config.cljsNs);evalListeners.waitForFinalEval=function(url){if(url.indexOf(mainJs)>-1){var mainNsObject=cljsNamespaceToObject(config.cljsNs);assert(mainNsObject,"ClojureScript Namespace "+config.cljsNs+" not found.");assert(mainNsObject[config.renderFn],"Render function "+config.renderFn+" not found.");onLoadCb(mainNsObject[config.renderFn]);console.info('Done loading Clojure app');delete evalListeners.waitForFinalEval;}};if(typeof goog==="undefined"){console.info('Loading Closure base.');interceptRequire();importJs(fileBasePath+'/goog/base.js',function(){shimBaseGoog(fileBasePath,config.googBasePath);importJs(fileBasePath+'/cljs_deps.js',function(){importJs(fileBasePath+'/goog/deps.js',function(){importIndexJs(fileBasePath);});});});}}function assertKeyType(obj,k,type){assert(typeof obj[k]==type,k+" must be a "+type);}function validateOptions(options){assertKeyType(options,"googBasePath","string");assertKeyType(options,"serverPort","number");assertKeyType(options,"appName","string");assertKeyType(options,"outputTo","string");assertKeyType(options,"cljsNs","string");assertKeyType(options,"devHost","string");assertKeyType(options,"renderFn","string");}function startApp(options){var config=(0,_extends2.default)({googBasePath:'goog/',serverPort:8081,devHost:'localhost',renderFn:'figwheel_rn_root'},options);validateOptions(config);ReactNative.AppRegistry.registerComponent(config.appName,function(){return figwheelApp(config);});}function withModules(moduleById){externalModules=moduleById;return self;}function figwheelImportScript(uri,callback){importJs(uri.toString(),function(){callback(true);},function(){callback(false);});}function shimBaseGoog(basePath,googBasePath){console.info('Shimming goog functions.');goog.basePath=basePath+'/'+googBasePath;goog.global.FIGWHEEL_WEBSOCKET_CLASS=WebSocket;goog.global.FIGWHEEL_IMPORT_SCRIPT=figwheelImportScript;goog.writeScriptSrcNode=importJs;goog.writeScriptTag_=function(src,optSourceText){importJs(src);return true;};}self={withModules:withModules,start:startApp};module.exports=self;

