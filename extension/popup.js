/* So in this file we can access background page
vars with .getbackgroundPage.var or just use
localStorage.
There is a shared localStorage between this file
and backgrounds.
*/

var current_test = "";

function GUID ()
{ /* Found on stackoverflow */
    var S4 = function ()
    {
        return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
    };

    return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
}

$(document).on('submit', '#save-test', function(e) {
  e.preventDefault();
  var name = $(this).find("[name='name']").val();
  var description = $(this).find("[name='description']").val();
  var url = $(this).find("[name='url']").val();
  var test = {"guid": GUID(),
              "name": name,
              "url": url,
              "description": description,
              "steps": JSON.parse(localStorage['events'])
            };
  $.post('http://localhost:4567/test/new', test, function(data){
    $("body").html(data);
  });
});

$(document).on('submit', '#run-test', function(e) {
  e.preventDefault();
  var name = $(this).find("[name='test-name']").val();
  $.post('http://localhost:4567/test/run/' + name, localStorage['events'], function(data){
    $("body").html(data);
  });
});

/*
chrome.tabs.getSelected(null, function(tab) {
  console.log('Sending from ' + tab.id);
  chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});

chrome.tabs.getSelected(null, function(tab) {
  console.log('Sending from ' + tab.id);
  chrome.tabs.sendMessage(tab.id, {method: "getLocalStorage", key: "status"}, function(response) {
    console.log(response.data);
  });
});
*/

$(document).on('click', '#clear-test', function(e) {
  e.preventDefault();
  var bkg = chrome.extension.getBackgroundPage();
  bkg.clearContentLocalStorage(function(result) {
    console.log(result);
    refreshEvents();
    fetchEvents();
  });
});

$(document).on('click', '#enable-events', function(e) {
  var bkg = chrome.extension.getBackgroundPage();
  bkg.enableEvents(function(result) {
    console.log('Enable events', result);
    localStorage['events_enabled'] = 'on';
    refreshEvents();
    fetchEvents();
  });
});


$(document).on('click', '#disable-events', function(e) {
  var bkg = chrome.extension.getBackgroundPage();
  bkg.disableEvents(function(result) {
    console.log('Disable events', result);
    localStorage['events_enabled'] = 'off';
    refreshEvents();
    fetchEvents();
  });
});

$(function(){
  if (localStorage['events_enabled'] === 'on') {
    $("#enable-events").click();
  } else {
    $("#disable-events").click();
  }

    //fetchEvents();
    chrome.tabs.getSelected(null, function(tab) {
      syncTestForm(fetchCurrentTest(tab));
    });
    
  //}
});

function fetchCurrentTest(tab){
  if (localStorage['current_test']) {
    return JSON.parse(localStorage['current_test']);
  } else {
    return {"name": "Example Test",
            "description": "Short description of the test.",
            "url": tab.url};
  }
}

function syncTestForm(test){
  $("#url").val(test.url);
  $("#name").val(test.name);
  $("#description").val(test.description);
}

$(document).on("change", "#save-test input", function(e){
  //if the input changes save it localStorage
  var test = {"name": $("#name").val(),
              "description": $("#description").val(),
              "url": $("#url").val()};
  localStorage['current_test'] = JSON.stringify(test);
});

function getCurrentUrl(){
  //Couldnt get this cause its asyncing so not really used now
  var tab = chrome.tabs.getSelected(null, function(tab) {
    return tab.url;
  });
}

function refreshEvents(){
  $("#events-list").html('');
  fetchEvents();
}

function fetchEvents(){
  // Not really sure if the ready wrapper is needed
  var events = JSON.parse(localStorage['events']);
  var html = '';
  $.each(events, function(e){
    var text = this.event + " " + this.on + " " + this.input_value;
    html += "<li>" + text + "</li>";
  });
  $("#events-list").html('').append(html); //Build html then append
}



/*
console.log(Date.now());
chrome.tabs.getCurrent(function(tab){
  console.log(tab);
});

var active;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  //console.log(tabs);
  active = tabs[0].id;
  console.log('Active tab: ', active);
});

$(document).on('click', 'a', function(e){
  e.preventDefault();
  $.get('http://localhost:8000/index.html', function(d){
    console.log('did it', d);
  });
});

*/