
/*function activateElement(objElement) {
	
	var objSearchInputValue = objElement.value;
	var elm = document.getElementById('delete-search');
	if (objSearchInputValue == null || objSearchInputValue == '') {
		console.log("null");
		elm.classList.remove('delete-search-show');
		elm.classList.add('delete-search-hide');
	} else {
		console.log("not null");
		elm.classList.remove('delete-search-hide');
		elm.classList.add('delete-search-show');
	}
}

function desactivateElement(objElement) {
	
	console.log(objElement);
}

function deleteSearchInput(objElement) {
	
	var objSearchInput = objElement.previousElementSibling.previousElementSibling;
	objSearchInput.value = null;
	var elm = document.getElementById('delete-search');
	elm.classList.remove('delete-search-show');
	elm.classList.add('delete-search-hide');
	activateElement(objSearchInput);
}*/

// Fonction pour la page register.html
function checkDisableRegisterButton(mapBooleans) {
	
	var booDisableButton = false;
	
	booIncorrectLastName = mapBooleans["booIncorrectLastName"];
	booIncorrectFirstName = mapBooleans["booIncorrectFirstName"];
	booIncorrectUserName = mapBooleans["booIncorrectUserName"];
	booIncorrectPassword = mapBooleans["booIncorrectPassword"];
	booIncorrectConfirmPassword = mapBooleans["booIncorrectConfirmPassword"];

	if (booIncorrectLastName == false && booIncorrectFirstName == false && booIncorrectUserName == false && booIncorrectPassword == false && booIncorrectConfirmPassword == false) booDisableButton = false;
	else booDisableButton = true;

	if (booDisableButton == true) $('#login-button').attr('disabled', 'true');
	else $('#login-button').removeAttr('disabled')			
}

// Fonction pour la page login.html
function checkDisableLoginButton(mapBooleans) {
	
	var booDisableButton = false;

	booIncorrectUserName = mapBooleans["booIncorrectUserName"];
	booIncorrectPassword = mapBooleans["booIncorrectPassword"];

	if (booIncorrectUserName == false && booIncorrectPassword == false) booDisableButton = false;
	else booDisableButton = true;

	if (booDisableButton == true) $('#login-button').attr('disabled', 'true');
	else $('#login-button').removeAttr('disabled')			
}

// Fonction pour la page library.html
function showArborescence(ieElement) {
	
	var strClassName = ieElement.className;
	var objParentElement = ieElement.parentElement;
	
	var objUlElement = objParentElement.nextElementSibling;
	
	while (objUlElement != null && objUlElement.nodeName == "UL") {
		
		var objSubElement = objUlElement.firstElementChild;
		
		var strObjSubElementClassName = objSubElement.className;
			
		var intIndexOf = 0;
		var strNewClassName = null;
		// Il faut show la sous-classe
		if (strClassName == "arrow-right") {
			intIndexOf = strObjSubElementClassName.indexOf("hide");
			strNewClassName= strObjSubElementClassName.substring(0, intIndexOf) + "show";
			ieElement.className = ieElement.className.replace(strClassName, "arrow-down");
			objSubElement.className = objSubElement.className.replace(strObjSubElementClassName, strNewClassName);		
		} else {
			intIndexOf = strObjSubElementClassName.indexOf("show");
			strNewClassName= strObjSubElementClassName.substring(0, intIndexOf) + "hide";
			ieElement.className = ieElement.className.replace(strClassName, "arrow-right");
			objSubElement.className = objSubElement.className.replace(strObjSubElementClassName, strNewClassName);		
		}
		
		objUlElement = objUlElement.nextElementSibling;
	}
}

// Fonction pour la page home.html
function showSearchArborescence(ieElement) {
	
	var strClassName = ieElement.className;
	var objParentElement = ieElement.parentElement.parentElement;
	
	var objUlElement = objParentElement.lastElementChild;
	
	while (objUlElement != null && objUlElement.nodeName == "UL") {
		
		var objSubElement = objUlElement.firstElementChild;
		
		var strObjSubElementClassName = objSubElement.className;
			
		var intIndexOf = 0;
		var strNewClassName = null;
		// Il faut show la sous-classe
		if (strClassName == "arrow-right") {
			intIndexOf = strObjSubElementClassName.indexOf("hide");
			strNewClassName= strObjSubElementClassName.substring(0, intIndexOf) + "show";
			ieElement.className = ieElement.className.replace(strClassName, "arrow-down");
			objSubElement.className = objSubElement.className.replace(strObjSubElementClassName, strNewClassName);		
		} else {
			intIndexOf = strObjSubElementClassName.indexOf("show");
			strNewClassName= strObjSubElementClassName.substring(0, intIndexOf) + "hide";
			ieElement.className = ieElement.className.replace(strClassName, "arrow-right");
			objSubElement.className = objSubElement.className.replace(strObjSubElementClassName, strNewClassName);		
		}
		
		objUlElement = objUlElement.nextElementSibling;
	}
}

function toggleEye(ieElement) {

	var objInputPassword = ieElement.previousElementSibling;

	if (objInputPassword.type == "password") {
		objInputPassword.type = "text";
		ieElement.className = "fa-solid fa-eye toggle-eye";
	} else {
		objInputPassword.type = "password";
		ieElement.className = "fa-solid fa-eye-slash toggle-eye";		
	}
}

var serverName = 'https://v-anavevo.upf.pf/sound';
//var serverName = 'C:/Projets/anavevo/sound';
function readFile(strJson){

	strJson = strJson.replace(/&quot;/g, "\"");

	var jsonObj = JSON.parse(""+strJson);

  var date = Date.parse(jsonObj.date);
  jsonObj.date=jsonObj.date.replace('T',' ');
  jsonObj.offset=0;
  var url = serverName + '/read_file.php?action=read_file&infos='+encodeURIComponent(JSON.stringify(jsonObj));
  console.log(url);
  if(jsonObj.ogg ==null || jsonObj.ogg==undefined || jsonObj.ogg=='true') {

    //var audioTag = $('#audio_file');
    var sourceTag = $('<source></source>');
    sourceTag.attr('id','source_audio');
    sourceTag.attr('src',url);
    sourceTag.attr('type','audio/ogg');
	
	var audiotg = $('<audio></audio>');
	audiotg.attr("id", "audio-file");
	audiotg.attr('controls', '');
	audiotg.attr('preload', 'metadata');
	audiotg.attr('controlsList', 'nodownload');

	audiotg.append(sourceTag);
	
	console.log(audiotg);
	
	$('#test').append(audiotg);
	
    //loadingImg();
  } else {
    $.ajax({
      url:url,
      type:'POST',
      error: function(err) {

      },
      success: function(data_base64) {
        var data = Base64.decode(data_base64);
        $('#fileContent').html(data);
      }
    })
  }
}

function loadingImg() {
  var img = document.getElementById('spinner_audio_img');
  if(!img) {
    img = document.createElement('img');
    img.src = "ducky/resources/images/loading.gif";
    img.style.height = "16px";
    img.style.margin = "20px 10px";
    img.id = "spinner_audio_img";

    $('#audio_file').bind('waiting loadstart', function() {
      img.style.display ='inline-block';
    });

    $('#audio_file').bind('play playing canplay canplaythrough loadedstart', function() {
      img.style.display ='none';
    });

    var audioTag = document.getElementById('audio_file');
    audioTag.parentElement.appendChild(img);
  }
}

