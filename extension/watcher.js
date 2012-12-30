var DEBUG = 1;

var events = [];
var last_event;

function getSelector(el){
	var $el = $(el);
  	var selector = $el.parents()
                    .map(function() { return this.tagName; })
                    .get().reverse().join(" ");

	if (selector) {
		selector += " "+ $el[0].nodeName;
	}

	var id = $el.attr("id");
	if (id) {
		selector += "#"+ id;
	}

	if (!id) { //If theres and ID there 'should' only be one on the page and we dont need all this
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
			console.log(index);
			if (index) {
				index = index + 1;
				selector += ":nth-child(" + index + ")";
			}
		}
	}
return selector;
}

if (localStorage['events']){
	var events = JSON.parse(localStorage['events']);
}

$(document).on("click focus blur keyup", function(e){
	if (DEBUG){
		console.log('EVENT', e);
	}
});

$(document).on("click", function(e){
	//Return the name or ID or
	//console.log('Clicked', e.target.name);
	/* NEED TO MAKE THIS PULL DOWN A SELECTOR ALWAYS*/
	var selector = getSelector(e.target);
	//console.log('Selector', selector);
	$(this).trigger("watcher", {"event": "click", "on": selector});
});

//Need to trap focus befor clicks or they will double fire
$(document).on("focus", "input", function(e){
	//console.log('Focused on ', e.target.name);
	var selector = getSelector(e.target);
	$(this).trigger("watcher", {"event":"focus", "on": selector});
});

$(document).on("keyup", "input, textarea", function(e){
	//console.log('Pressed some keys', e.target.name, e.target.value);
	var selector = getSelector(e.target);
	$(this).trigger("watcher", {"event":"keyup",
								"on": selector,
								"input_value": e.target.value});
});

$(document).on("watcher", function(e, message){
	console.log('watcher triggered', message);
	/*$.get('http://localhost:8000/', function(){
		console.log('did it');
	});
	*/
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

/*chrome.extension.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});
*/

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('message');
    if (request.method == "clearLocalStorage"){

		//localStorage.setItem('events', events.push({"click": e.target.name}));
		console.log('clearing locally', request);
		localStorage.removeItem('events');
		events = [];
		sendResponse({status: 'cleared'});
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