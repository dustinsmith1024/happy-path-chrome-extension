/* So in this file we can access background page
vars with .getbackgroundPage.var or just use
localStorage.
There is a shared localStorage between this file
and backgrounds.
*/

function GUID ()
{
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


$(function(){
  var events = JSON.parse(localStorage['events']);
  var $ul = $("<ul/>");
  $.each(events, function(e){
    var text = e + " " + this.event + " " + this.on;
    $ul.append($("<li/>").text(text));
  });
  $("body").append($ul);
});

$(document).on('click', 'a', function(e){
  e.preventDefault();
  $.get('http://localhost:8000/index.html', function(d){
    console.log('did it', d);
  });
});

$(document).on('submit', 'form#save-test', function(e) {
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

$(document).on('submit', 'form#run-test', function(e) {
  e.preventDefault();
  var name = $(this).find("[name='test-name']").val();
  $.post('http://localhost:4567/test/run/' + name, localStorage['events'], function(data){
    $("body").html(data);
  });
});
//console.log(Date.now());

/*
chrome.tabs.getCurrent(function(tab){
  console.log(tab);
});

var active;
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  //console.log(tabs);
  active = tabs[0].id;
  console.log('Active tab: ', active);
});



*/
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


