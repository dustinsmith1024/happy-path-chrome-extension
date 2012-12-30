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