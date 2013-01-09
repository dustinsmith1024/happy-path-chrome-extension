var DEBUG = 1;
var events = [];
var last_event;

function getSelector(el){
	var $el = $(el);

    var id = $el.attr("id");
	if (id) { //"should" only be one of these if theres an ID
		return "#" + id;
	}
  
	var selector = $el.parents()
                    .map(function() { return this.tagName; })
                    .get().reverse().join(" ");

	if (selector) {
		selector += " "+ $el[0].nodeName;
	}

    var classNames = $el.attr("class");
    if (classNames) {
      selector += "." + $.trim(classNames).replace(/\s/gi, ".");
    }
  
    var name = $el.attr('name');
    if (name) {
      selector += "[name='" + name + "']";
    }
    if (!name){
      var index = $el.index();
      if (index) {
        index = index + 1;
        selector += ":nth-child(" + index + ")";
      }
    }
  return selector;
}

if (localStorage['events']){
	var events = JSON.parse(localStorage['events']);
}

function initEvents(){
	$(document).on("click focus blur keyup", function(e){
		if (DEBUG){
			console.log('EVENT', e);
		}
	});

	/*$(document).on("click", function(e){
		//Return the name or ID or
		//console.log('Clicked', e.target.name);
		var selector = getSelector(e.target);
		watcher({"event": "click", "on": selector});
	});*/

	//Need to trap focus before clicks or they will double fire
	$(document).on("focus", "input", function(e){
		var selector = getSelector(e.target);
		watcher({"action": "focus", "what": selector});
	});

	$(document).on("keyup", "input, textarea", function(e){
		var selector = getSelector(e.target);
		watcher({"action":"keyup",
				"what": selector,
				"with": e.target.value});
	});

	$(document).on("mouseup", function(e){
		var selection = getSelectedText();
		var selector = getSelector(e.target);
		if (selection){
			watcher({"action":"check",
					"what": selection,
					"with": selection});
		} else {
			//Just a click event
			watcher({"action": "click", "what": selector});
		}
	});

	/* Might need to init this one a different way*/
	$(document).on('ready', function(e){
		var path = window.location.pathname;
		watcher({"action":"visit",
				"what": path });
	});
}

function disableEvents(){
	$(document).off("click");
	$(document).off("focus", "input");
	$(document).off("keyup", "input, textarea");
	$(document).off('ready');
}

function getSelectedText() {
    return window.getSelection().toString();
}

function watcher(message){
	/* Send an object with
		event:
		on:
		input_value:
	*/
	last_event = message; // Need to track typing events
	if (message.action == "keyup" && message.what == last_event.what) {
		//This is a 'typing' event and we just need to capture what is typed in the box
		// not each individual type
		events.pop();
	}
	events.push(message);
	localStorage['events'] = JSON.stringify(events);
	chrome.extension.sendMessage(message, function(response) {
		console.log('Callback:', response);
	});
	var local = localStorage.getItem('events');
	//Maybe should be updateLocalStorage
	chrome.extension.sendMessage({method: 'setLocalStorage', data: local}, function(response) {
		console.log('Callback:', response);
	});
}

/*
$(document).on("watcher", function(e, message){
	console.log('watcher triggered', message);
	last_event = message; // Need to track typing events
	if (message.event == "keyup" && message.on == last_event.on) {
		//This is a 'typing' event and we just need to capture what is typed in the box
		// not each individual type
		events.pop();
	}
	events.push(message);
	localStorage['events'] = JSON.stringify(events);
	chrome.extension.sendMessage(message, function(response) {
		console.log('Callback:', response);
	});
	var local = localStorage.getItem('events');
	chrome.extension.sendMessage({method: 'setLocalStorage', data: local}, function(response) {
		console.log('Callback:', response);
	});
});
*/

/*chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
*/

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('message');
    if (request.method == "clearLocalStorage"){
		console.log('clearing locally', request);
		localStorage.removeItem('events');
		events = [];
		sendResponse({status: 'cleared'});
	}
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('enable events');
    if (request.method == "enableEvents"){
		console.log('enabling events', request);
		initEvents();
		sendResponse({status: 'initialized'});
	}
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('message');
    if (request.method == "disableEvents"){
		console.log('disabling events', request);
		disableEvents();
		sendResponse({status: 'initialized'});
	}
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content2 script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });

/*chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.message);
});

	chrome.extension.sendMessage(message, function(response) {
		console.log('Callback:', response);
	});

*/