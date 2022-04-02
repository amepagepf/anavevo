$(document).ready(function(){
	
	//^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$
	var booDisableButton = false;
	var booIncorrectLastName = false;
	var booIncorrectFirstName = false;
	var booIncorrectPassword = false;
	var mapBooleans = {
		"booIncorrectLastName": booIncorrectLastName,
		"booIncorrectFirstName": booIncorrectFirstName,
		"booIncorrectPassword": booIncorrectPassword
	};
	
	$('#lastname-input').keyup(function() {
		var strLastnameInput = $(this).val();
		
		console.log(strLastnameInput);
		var regexName = /^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
		
		console.log(strLastnameInput.match(regexName));
		
		booIncorrectLastName = mapBooleans["booIncorrectLastName"];
		
		if (strLastnameInput.match(regexName)) {
			$('#lastname-info-type').removeClass('invalid-info').addClass('valid-info');
			$('#lastname-info-type').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectLastName = false;
		} else {
			$('#lastname-info-type').removeClass('valid-info').addClass('invalid-info');
			$('#lastname-info-type').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectLastName = true;
		}
		
		mapBooleans["booIncorrectLastName"] = booIncorrectLastName;
		
		checkDisableLoginButton(mapBooleans);
		
	}).focus(function() {
		//$('#lastname-info-container').removeClass('hide-element-container').addClass('show-element-container');
	}).blur(function() {
		//$('#lastname-info-container').removeClass('show-element-container').addClass('hide-element-container');
	});
	
	$('#firstname-input').keyup(function() {
		var strFirstnameInput = $(this).val();
		
		var regexName = /^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
		
		booIncorrectFirstName = mapBooleans["booIncorrectFirstName"];
		
		if (strFirstnameInput.match(regexName)) {
			$('#firstname-info-type').removeClass('invalid-info').addClass('valid-info');
			$('#firstname-info-type').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectFirstName = false;
		} else {
			$('#firstname-info-type').removeClass('valid-info').addClass('invalid-info');
			$('#firstname-info-type').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectFirstName = true;
		}
		
		mapBooleans["booIncorrectFirstName"] = booIncorrectFirstName;
		
		checkDisableLoginButton(mapBooleans);
		
	}).focus(function() {
		$('#firstname-info-container').removeClass('hide-element-container').addClass('show-element-container');
	}).blur(function() {
		$('#firstname-info-container').removeClass('show-element-container').addClass('hide-element-container');
	});
	
	$('#username-input').focusout(function() {
		var strEmailInput = $(this).val();
		console.log(strEmailInput);
		var regexName = /([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+/
		
		booIncorrectUserName = mapBooleans["booIncorrectUserName"];
		
		console.log(strEmailInput.match(regexName));
		if (strEmailInput.match(regexName)) {
			$('#username-info-type').removeClass('invalid-info').addClass('valid-info');
			$('#username-info-type').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			$('#username-info-container').removeClass('show-element-container').addClass('hide-element-container');
			booIncorrectUserName = false;
		} else {
			$('#username-info-type').removeClass('valid-info').addClass('invalid-info');
			$('#username-info-type').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			$('#username-info-container').removeClass('hide-element-container').addClass('show-element-container');
			booIncorrectUserName = true;
		}

		mapBooleans["booIncorrectUserName"] = booIncorrectUserName;
		
		checkDisableLoginButton(mapBooleans);
		
	}).focus(function() {
		$('#username-info-container').removeClass('show-element-container').addClass('hide-element-container');
	});
	
	
	$('#password-input').keyup(function() {
		var strPasswordInput = $(this).val();
		
		booIncorrectPassword = mapBooleans["booIncorrectPassword"];
		
		// Password min and max length
		if (strPasswordInput.length < 8) {
			$('#password-info-minlength').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-maxlength').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-minlength').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			$('#password-info-maxlength').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectPassword = true;
		} else {
			$('#password-info-minlength').removeClass('invalid-info').addClass('valid-info');
			$('#password-info-minlength').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectPassword = false;
			
			if (strPasswordInput.length > 32) {
				$('#password-info-maxlength').removeClass('valid-info').addClass('invalid-info');
				$('#password-info-maxlength').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
				booIncorrectPassword = true;
			} else {
				$('#password-info-maxlength').removeClass('invalid-info').addClass('valid-info');
				$('#password-info-maxlength').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
				booIncorrectPassword = false;
			}
		}
		
		// Password minus letter
		if ( strPasswordInput.match(/[a-z]/) ) {
			$('#password-info-minuscule').removeClass('invalid-info').addClass('valid-info');
			$('#password-info-minuscule').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectPassword = false;
		} else {
			$('#password-info-minuscule').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-minuscule').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectPassword = true;
		}
		
		// Password maximus letter
		if ( strPasswordInput.match(/[A-Z]/) ) {
			$('#password-info-majuscule').removeClass('invalid-info').addClass('valid-info');
			$('#password-info-majuscule').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectPassword = false;
		} else {
			$('#password-info-majuscule').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-majuscule').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectPassword = true;
		}
		
		//validate number
		if ( strPasswordInput.match(/\d/) ) {
			$('#password-info-number').removeClass('invalid-info').addClass('valid-info');
			$('#password-info-number').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectPassword = false;
		} else {
			$('#password-info-number').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-number').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectPassword = true;
		}
		
		//validate special character
		if ( strPasswordInput.match(/[#?!@$%^&*-]/) ) {
			$('#password-info-special').removeClass('invalid-info').addClass('valid-info');
			$('#password-info-special').children('i').removeClass('fa-circle-exclamation').addClass('fa-circle-check');
			booIncorrectPassword = false;
		} else {
			$('#password-info-special').removeClass('valid-info').addClass('invalid-info');
			$('#password-info-special').children('i').removeClass('fa-circle-check').addClass('fa-circle-exclamation');
			booIncorrectPassword = true;
		}
		
		mapBooleans["booIncorrectPassword"] = booIncorrectPassword;
		
		checkDisableLoginButton(mapBooleans);		
		
	}).focus(function() {
		$('#password-info-container').removeClass('hide-element-container').addClass('show-element-container');
	}).blur(function() {
		$('#password-info-container').removeClass('show-element-container').addClass('hide-element-container');
	});
	
	checkDisableLoginButton(mapBooleans);
	
});

function checkDisableLoginButton(mapBooleans) {
	
	var booDisableButton = false;
	
	booIncorrectLastName = mapBooleans["booIncorrectLastName"];
	booIncorrectFirstName = mapBooleans["booIncorrectFirstName"];
	booIncorrectPassword = mapBooleans["booIncorrectPassword"];
	booIncorrectUserName = mapBooleans["booIncorrectUserName"];
	
	if (booIncorrectLastName == false && booIncorrectFirstName == false && booIncorrectUserName == false && booIncorrectPassword == false) booDisableButton = false;
	else booDisableButton = true;

	if (booDisableButton == true) $('#login-button').attr('disabled', 'true');
	else $('#login-button').removeAttr('disabled')			
}

/*$(document).ready(function(){
	

	
	$('input[type=password]').keyup(function() {
		var pswd = $(this).val();

		//validate capital letter
		if ( pswd.match(/[A-Z]/) ) {
			$('#capital').removeClass('invalid').addClass('valid');
		} else {
			$('#capital').removeClass('valid').addClass('invalid');
		}

		//validate number
		if ( pswd.match(/\d/) ) {
			$('#number').removeClass('invalid').addClass('valid');
		} else {
			$('#number').removeClass('valid').addClass('invalid');
		}
		
		//validate space
		if ( pswd.match(/[^a-zA-Z0-9\-\/]/) ) {
			$('#space').removeClass('invalid').addClass('valid');
		} else {
			$('#space').removeClass('valid').addClass('invalid');
		}
		
		
		
	}).focus(function() {
		$('#pswd_info').show();
	}).blur(function() {
		$('#pswd_info').hide();
	});
	
});*/



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





