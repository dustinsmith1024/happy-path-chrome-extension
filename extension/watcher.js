var DEBUG = 1;

var events = [];

if (localStorage['events']){
	var events = JSON.parse(localStorage['events']);
}

$(document).on("click focus blur keypress", function(e){
	if (DEBUG){
		console.log('EVENT', e);
	}
});

$(document).on("click", function(e){
	//Return the name or ID or
	//console.log('Clicked', e.target.name);
	$(this).trigger("watcher", {"event": "click", "on": e.target.name});
});

//Need to trap focus befor clicks or they will double fire
$(document).on("focus", "input", function(e){
	//console.log('Focused on ', e.target.name);
	$(this).trigger("watcher", {"event":"focus", "on": e.target.name});
});

$(document).on("keypress", "input", function(e){
	//console.log('Pressed some keys', e.target.name, e.target.value);
	$(this).trigger("watcher", {"event":"keypress", "on": e.target.name});
});

$(document).on("watcher", function(e, message){
	console.log('watcher triggered', message);
	/*$.get('http://localhost:8000/', function(){
		console.log('did it');
	});
	*/
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