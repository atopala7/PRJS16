// Javascript functions for spawning resources and managing them.

// Keep a count of all created resources.
var resourceCounter = 0;
var labelCounter = 0;
var variableCounter = 0;
var imageCounter = 0;

var resourceArr = [];
var labelArr = [];
var variableArr = [];
var imageArr = [];

// Main resource management function. 
// Opens up a dialog box for managing resource parameters as well as
// deletion of a resource.
function manageResource(resourceID, resourceDivID){
  
  // Set up a dialog box for editing a resource.
  // Dialog box effects when opening and closing one.
  $( '#resourceControl' ).dialog({
    autoOpen: false,
    show: {
      effect: 'blind',
      duration: 1000
    },
    hide: {
      effect: 'explode',
      duration: 1000
    }
  });

  // Reset the resourceControl div each time a resource is clicked.
  $('#resourceControl').empty();

  // Get the value of the resource
  var resourceValue = document.getElementById(resourceID).textContent;
  if (document.getElementById(resourceID).tagName.toLowerCase() == "img")
	resourceValue = document.getElementById(resourceID).src;

  // Display a resource's ID.
  var id_label = document.createElement('label');
  id_label.innerHTML = 'Resource ID: ';
  var id_input = document.createElement('input');
  id_input.setAttribute('id', 'id_input');
  id_input.setAttribute('readOnly', 'true');
  $(id_input).val(resourceID);

  // Display a resource's value.
  var value_label = document.createElement('label');
  value_label.innerHTML = 'Resource Value: ';
  var value_input = document.createElement('input');
  value_input.id = 'value_input';
  $(value_input).val(resourceValue);
  value_input.addEventListener('change', function(){ setResource(resourceID) });

  // Display a resource's dimensions - width
  var width_label = document.createElement('label');
  width_label.innerHTML = 'Resource Width: ';
  var width_input = document.createElement('input');
  width_input.id = 'width_input';
  $(width_input).val(document.getElementById(resourceID).style.width);
  width_input.addEventListener('change', function(){ setResource(resourceID) });

  // Display a resource's dimensions - height
  var height_label = document.createElement('label');
  height_label.innerHTML = 'Resource Height: ';
  var height_input = document.createElement('input');
  height_input.id = 'height_input';
  $(height_input).val(document.getElementById(resourceID).style.height);
  height_input.addEventListener('change', function(){ setResource(resourceID) });

  var deleteButton = document.createElement('button');
  deleteButton.id = 'deleteButton';
  deleteButton.innerHTML = 'Delete Resource';
  deleteButton.addEventListener('click', function(){ delResource(resourceID,resourceDivID) });

  $( '#resourceControl' ).append(id_label,id_input,'<br>',value_label,value_input,'<br>');
  $( '#resourceControl' ).append(width_label,width_input,'<br>',height_label,height_input,'<br>');
  $( '#resourceControl' ).append(deleteButton);

  $('#resourceControl').dialog('open');
}

function setResource(resourceID){
  var temp = document.getElementById(resourceID);
  var newVal = document.getElementById('value_input');
  console.log('Changing resource: ' + resourceID);
  console.log('Resource type is: ' + temp.getAttribute('resourceType'));

  // Change value
  switch(temp.getAttribute('resourceType')){
    case 'label':
      console.log('Changing a label.');
      $(temp).text($(newVal).val());
      break;
    case 'variable':
      console.log('Changing a variable.');
      temp.setAttribute('resourceValue', $(newVal).val());
      $(temp).val($(newVal).val());
      break;
    case 'image':
      console.log('Changing an image.');
      temp.setAttribute('resourceValue', $(newVal).val());
      // TODO: upload image instead of urls
      $(temp).attr("src", $(newVal).val());
      
      // Load a new image object to get its dimensions
      img = new Image();
      img.src = $(newVal).val();
      // img needs to load before we can access its dimensions
      img.onload = function () {
	var width = img.width;
	var height = img.height;
	// Change our original image's dimensions
	$(temp).width(width);
	$(temp).height(height);
	img.remove();

	// We have to ensure the image size doesn't exceed the container's
	var sheet = document.getElementById('sheetContainer');
	var maxWidth = $(sheet).width();
	var maxHeight= $(sheet).height();
	// We'll need to reduce the image's size while maintaing aspect ratio
	var ratio = Math.min(maxWidth / $(temp).width(), maxHeight / $(temp).height());
	if ($(temp).width() > maxWidth) {
		$(temp).css("width", $(temp).width() * ratio);
		$(temp).css("height", $(temp).height() * ratio);
	}
	if ($(temp).height() > maxHeight) {
		$(temp).css("width", $(temp).width() * ratio);
		$(temp).css("height", $(temp).height() * ratio);
	}

	temp.parentElement.style.width = temp.width + "px"; 
	temp.parentElement.style.height = temp.height + "px"; 
     }
      break;
    default:
      console.log('Nothing changed due to unknown resource type.');
  }

  // Change dimensions
  console.log('Changing dimensions.');
  console.log('Current width: ' + temp.style.width);
  console.log('Current height: ' + temp.style.height);
  temp.style.width = $('width_input').val();
  temp.style.height = $('height_input').val();


}

function delResource(resourceID,resourceDivID){
 
  function getResourceIndex(resourceID, resourceType){

    tempArr = [];

    switch (resourceType){
      case 'label':
        tempArr = labelArr;
        break;
      case 'variable':
        tempArr = variableArr;
        break;
      default:
        console.log('Unknown resource type. Not finding resource index.');
    }

    for (i = 0; i < tempArr.length; i++){
      if (tempArr[i].id == resourceID){
        console.log('We found it');
      }
    }
  }

  // Reduce the resource counters
  var tempResource = document.getElementById(resourceID);
  switch (tempResource.getAttribute('resourceType')){
    case 'label':
      console.log('reducing labelCounter');
      labelCounter--;
      if (labelCounter < 0) { labelCounter = 0 }
      break;
    case 'variable':
      console.log('reducing variableCounter');
      variableCounter-- ;
      if (variableCounter < 0) { variableCounter = 0 }
      break;
    default:
      console.log('An unknown type was found. Not reducing any counters.');
  } 
  //getResourceIndex(resourceID, tempResource.getAttribute('resourceType'));
  resourceCounter--;

  var tempDiv = document.getElementById(resourceDivID);
  console.log('Removing resource: ' + resourceDivID);
  $(tempDiv).remove()
    
  // Close resourceControl when a resource is deleted
  $('#resourceControl').dialog ('close');
}

function createResourceDiv(){
  
  var newResourceDiv = document.createElement('div');
  newResourceDiv.className = 'resourceDiv block';
  newResourceDiv.id = 'resourceDiv' + resourceCounter;
  newResourceDiv.setAttribute('resourceType', 'resourceDiv');
  newResourceDiv.setAttribute('data-x', 0);
  newResourceDiv.setAttribute('data-y', 0);
  resourceArr.push(newResourceDiv);

  return newResourceDiv;
}

function spawnLabel(){
  
  var newLabel = document.createElement('label');
  newLabel.id = 'label' + labelCounter;
  newLabel.innerHTML = 'Label value';
  newLabel.setAttribute('resourceType', 'label');
  labelArr.push(newLabel);

  var resourceDiv = createResourceDiv();
  resourceDiv.addEventListener('dblclick', function(){ manageResource(newLabel.id, resourceDiv.id) });
  resourceDiv.appendChild(newLabel);

  labelCounter++;
  resourceCounter++;
  document.getElementById('sheetContainer').appendChild(resourceDiv);
}

function spawnVariable(){

  var newVariable = document.createElement('input');
  newVariable.id = 'variable' + variableCounter;
  newVariable.placeholder = 'Variable value';
  newVariable.readOnly = 'true';
  newVariable.setAttribute('resourceType', 'variable');
  newVariable.setAttribute('resourceValue', 0);
  variableArr.push(newVariable);

  var resourceDiv = createResourceDiv();
  resourceDiv.addEventListener('dblclick' , function(){ manageResource(newVariable.id, resourceDiv.id) });
  resourceDiv.appendChild(newVariable);

  variableCounter++;
  resourceCounter++;
  document.getElementById('sheetContainer').appendChild(resourceDiv);
}

function spawnImage() {
  var newImage= document.createElement('img');
    //newImage.className = 'image';
  newImage.id = 'image' + imageCounter;
  newImage.placeholder = 'http://orig09.deviantart.net/fe9c/f/2014/231/5/5/dark_souls_sif_by_zedotagger-d7vvhqh.gif';
  newImage.src = newImage.placeholder;
/*
var img = new Image();
img.src = newImage.placeholder;
/*
img.onload = function() {
	var height = img.height;
        var width = img.width;
          newImage.style.height = height + "px";
          newImage.style.width = width + "px";
          //event.target.innerHTML = "<img src='" + newText + "' />";
  newImage.setAttribute('resourceType', "image");
  newImage.setAttribute('resourceValue', 0);
  imageArr.push(newImage);
*/
  //newImage.style.height = newImage.height + "px";
  //newImage.style.width = newImage.width + "px";
          //event.target.innerHTML = "<img src='" + newText + "' />";
  newImage.setAttribute('resourceType', "image");
  newImage.setAttribute('resourceValue', 0);
  imageArr.push(newImage);

  var resourceDiv = createResourceDiv();
  resourceDiv.addEventListener('dblclick' , function(){ manageResource(newImage.id, resourceDiv.id) });
  resourceDiv.style.height = newImage.height + 'px';
  resourceDiv.style.width = newImage.width + 'px';
  resourceDiv.style.backgroundColor = 'transparent';
  resourceDiv.appendChild(newImage);

  imageCounter++;
  resourceCounter++;
  document.getElementById('sheetContainer').appendChild(resourceDiv);
}
