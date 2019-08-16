function uploadFile(){
	
var formData = new FormData();
formData.append('file', $('#file')[0].files[0]);

$.ajax({
       url : 'playback',
       type : 'POST',
       data : formData,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
           console.log(data);
           alert(data);
       }
});
}
function buildHtmlTable(selector,objects) {
  console.log(objects);
  var columns = addAllColumnHeaders(objects, selector);
  for (var i = 0; i < objects.length; i++) {
    var row$ = $('<tr/>');
	for (var j =0; j< columns.length -1; j++){
		if (objects[i][columns[j]] != null)
			var cellValue = objects[i][columns[j]].toString();
		else
			var cellValue = "";
	if (columns[j]=="lastPacketTime"){
				var date = new Date(cellValue*1000);
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	cellValue = date.getDate() + '/' + date.getMonth() + ' ' + date.getHours() + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		}
	if (columns[j]=="lastUpdateTime"){
	var date = new Date(cellValue*1000);
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	cellValue = date.getDate() + '/' + date.getMonth() + ' ' + date.getHours() + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		}
	if (columns[j]=="createTime"){
	var date = new Date(cellValue*1000);
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();

	cellValue = date.getDate() + '/' + date.getMonth() + ' ' + date.getHours() + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		}
		row$.append($('<td/>').html(cellValue));
	}
	if ((selector == '#ListenersTable')&& (objects[i][columns[6]] == 0))
	{
		row$.append($('<td/>').html('<button id="Connect_' + objects[i][columns[3]] +'_' +objects[i][columns[8]]+'" onclick="Connect(this)">Connect</button>'));
	}
	else if (selector == '#ListenersTable')
	{
		row$.append($('<td/>').html('<button id="Disconnect_' + objects[i][columns[3]] +'_' +objects[i][columns[8]]+'" onclick="Disconnect()">Disconnect</button>'));
		
	}
	else
	{
		console.log(objects[i]);
		var cellValue = objects[i][columns[columns.length - 1]];
		row$.append($('<td/>').html(cellValue));
	}
	$(selector).append(row$);
	}
}


// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(objects, selector) {
  var columnSet = [];
  
  var headerTr$ = $('<thead style="background-color:#25a9af; color:white;"/>');
  headerTr$.append($('<tr/>'));

  for (var i = 0; i < objects.length; i++) {
    var rowHash = objects[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  if (selector == '#ListenersTable'){
  columnSet.push('Actions');
  headerTr$.append($('<th/>').html('Actions'));}
  $(selector).append(headerTr$);
  return columnSet;
}

function loadJSON(file,callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
 }
 

 
$(document).ready(function(){
   var $form = $('form');
   $form.submit(function(){
      $.post($(this).attr('action'), $(this).serialize(), function(response){
            // do something here on success
      },'json');
      return false;
   });
});

var listeners="";
var networks="";
loadJSON('js/data/db/sources.json',function(response) {
    listeners = JSON.parse(response);
	loadJSON('js/data/db/networks.json',function(response) {
		networks = JSON.parse(response);
		buildHtmlTable('#ListenersTable',listeners);
		buildHtmlTable('#NetworksTable',networks);
		});
});
function Connect(btn){
	alert('in');
	console.log(btn.id);
    $.post("/api/sensors/" + btn.id.substr(8,17) + "/"+btn.id.substr(26)+"/connect",
    {}//,
    //function(data,status){
    //  alert("Data: " + data + "\nStatus: " + status);}
	);
  };
  
function Disconnect(btn){
	alert('in');
	console.log(btn.id);
    $.post("/api/sensors/" + btn.id.substr(8,17) + "/"+btn.id.substr(26)+ "/guid/disconnect",
    {}//,
    //function(data,status){
      //alert("Data: " + data + "\nStatus: " + status);}
	  );
  };