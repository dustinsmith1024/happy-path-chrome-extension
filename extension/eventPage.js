/*
Communicate with content scripts (watcher.js)
to get localStorage of the page.
*/

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.event) {
      sendResponse({event: request['event']});
	}

  });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "setLocalStorage")
		//localStorage.setItem('events', events.push({"click": e.target.name}));
		console.log('saving locally', request);
		localStorage.setItem('events', request.data);
		sendResponse({status: 'saved'});
});

function clearContentLocalStorage(){
	var message = {method: 'clearLocalStorage'};
	/*chrome.extension.sendMessage(message, function(response) {
		console.log('Callback:', response);
		
	});*/
	chrome.tabs.getSelected(null, function(tab) {
		console.log('Sending from ' + tab.id);
		chrome.tabs.sendMessage(tab.id, message, function(response) {
			console.log(response.status);
			localStorage.removeItem('events');
		});
	});
}

/*chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.event) {
		var xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = function() {
			//sendResponse({event: xhr.readyState});
			if (xhr.readyState == 4) {
				// JSON.parse does not evaluate the attacker's scripts.
				//var resp = JSON.parse(xhr.responseText);
				sendResponse({event: 'success'});
			}
		};
		xhr.open("GET", "http://localhost:8000/", true);
		xhr.send();
	}
  });*/