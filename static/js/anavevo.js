
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





