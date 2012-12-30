var DEBUG = 1;
var events = [];
$(document).on("click focus blur keypress", function(e){
	if (DEBUG){
		console.log('EVENT', e);
	}
	//Return the name or ID or 
});

$(document).on("click", function(e){
	//Return the name or ID or 
	console.log('Clicked', e.target.name);
	events.push({"click": e.target.name});
});

//Need to trap focus befor clicks or they will double fire
$(document).on("focus", "input", function(e){
	console.log('Focused on ', e.target.name);
	events.push({"focus": e.target.name});
});

$(document).on("keypress", "input", function(e){
	console.log('Pressed some keys', e.target.name, e.target.value);
	events.push({"keypress": e.target.name});
})