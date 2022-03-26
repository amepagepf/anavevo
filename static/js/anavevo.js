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





