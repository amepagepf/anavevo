$(document).ready(function(){
	
	var booDisableButton = false;
	var booIncorrectLastName = false;
	var booIncorrectFirstName = false;	
	var booIncorrectUserName = false;
	var booIncorrectPassword = false;
	var booIncorrectConfirmPassword = false;
	var mapBooleans = {
		"booIncorrectLastName": booIncorrectLastName,
		"booIncorrectFirstName": booIncorrectFirstName,
		"booIncorrectUserName": booIncorrectUserName,
		"booIncorrectPassword": booIncorrectPassword,
		"booIncorrectConfirmPassword": booIncorrectConfirmPassword
	};
	
	checkDisableRegisterButton(mapBooleans);
	
	// JQuery sur le lastname
	$('#lastname-input').focus(function() {
		$('#lastname-info-container').removeClass('show-element-container').addClass('hide-element-container');
		$('#lastname-label-input').removeClass('label-input-error');
		$('#lastname-input').removeClass('style-input-error').addClass('style-input');
		$('#lastname-error-list').children().remove();
	}).focusout(function() {
		
		var strLastnameInput = $(this).val();

		var regexName = /^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
		
		booIncorrectLastName = mapBooleans["booIncorrectLastName"];
		
		if (strLastnameInput == '') {
			booIncorrectLastName = true;			
		} else {
			if (strLastnameInput.match(regexName)) {
				$('#lastname-info-container').removeClass('show-element-container').addClass('hide-element-container');
				booIncorrectLastName = false;
			} else {
				$('#lastname-info-container').removeClass('hide-element-container').addClass('show-element-container');
				booIncorrectLastName = true;
			}
		}
		
		if (booIncorrectLastName == true) {
			$('#lastname-label-input').addClass('label-input-error');
			$('#lastname-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#lastname-label-input').removeClass('label-input-error');
			$('#lastname-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectLastName"] = booIncorrectLastName;
		
		checkDisableRegisterButton(mapBooleans);		
	});
	
	// JQuery sur le firstname
	$('#firstname-input').focus(function() {
		$('#firstname-info-container').removeClass('show-element-container').addClass('hide-element-container');
		$('#firstname-label-input').removeClass('label-input-error');
		$('#firstname-input').removeClass('style-input-error').addClass('style-input');
		$('#firstname-error-list').children().remove();
	}).focusout(function() {
		
		var strFirstNameInput = $(this).val();
		
		var regexName = /^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
		
		booIncorrectFirstName = mapBooleans["booIncorrectFirstName"];
		
		if (strFirstNameInput == '') {
			booIncorrectFirstName = true;			
		} else {
			if (strFirstNameInput.match(regexName)) {
				$('#firstname-info-container').removeClass('show-element-container').addClass('hide-element-container');
				booIncorrectFirstName = false;
			} else {
				$('#firstname-info-container').removeClass('hide-element-container').addClass('show-element-container');
				booIncorrectFirstName = true;
			}
		}
		
		if (booIncorrectFirstName == true) {
			$('#firstname-label-input').addClass('label-input-error');
			$('#firstname-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#firstname-label-input').removeClass('label-input-error');
			$('#firstname-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectFirstName"] = booIncorrectFirstName;
		
		checkDisableRegisterButton(mapBooleans);
	});
	
	// JQuery sur le username (email)
	$('#username-input').focus(function() {
		$('#username-info-container').removeClass('show-element-container').addClass('hide-element-container');
		$('#username-label-input').removeClass('label-input-error');
		$('#username-input').removeClass('style-input-error').addClass('style-input');
		//$('#username-error-list').hide();
		$('#username-error-list').children().remove();
	}).focusout(function() {

		var strUsernameInput = $(this).val();

		var regexName = /([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+/

		booIncorrectUserName = mapBooleans["booIncorrectUserName"];
		
		if (strUsernameInput == '') {
			booIncorrectUserName = true;			
		} else {			
			if (strUsernameInput.match(regexName)) {
				$('#username-info-container').removeClass('show-element-container').addClass('hide-element-container');
				booIncorrectUserName = false;
			} else {
				$('#username-info-container').removeClass('hide-element-container').addClass('show-element-container');
				booIncorrectUserName = true;
			}				
		}

		if (booIncorrectUserName == true) {
			$('#username-label-input').addClass('label-input-error');
			$('#username-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#username-label-input').removeClass('label-input-error');
			$('#username-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectUserName"] = booIncorrectUserName;
		
		checkDisableRegisterButton(mapBooleans);		
	});
	
	// JQuery sur le password
	$('#password-input').keyup(function() {
		var strPasswordInput = $(this).val();
		
		checkPassword(strPasswordInput, mapBooleans);
		
		checkDisableRegisterButton(mapBooleans);		
		
	}).focus(function() {
		$('#password-info-container').removeClass('hide-element-container').addClass('show-element-container');
		$('#password-label-input').removeClass('label-input-error');
		$('#password-input').removeClass('style-input-error').addClass('style-input');
		$('#password-error-list').children().remove();
		
		var strPasswordInput = $(this).val();
		
		checkPassword(strPasswordInput, mapBooleans);
		
		checkDisableRegisterButton(mapBooleans);
		
	}).focusout(function() {
		$('#password-info-container').removeClass('show-element-container').addClass('hide-element-container');
		var strPasswordInput = $(this).val();
		if (strPasswordInput == '') {
			booIncorrectPassword = true;
			mapBooleans["booIncorrectPassword"] = booIncorrectPassword;
		} else booIncorrectPassword = mapBooleans["booIncorrectPassword"];

		if (booIncorrectPassword == true) {
			$('#password-label-input').addClass('label-input-error');
			$('#password-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#password-label-input').removeClass('label-input-error');
			$('#password-input').removeClass('style-input-error').addClass('style-input');
		}

		checkDisableRegisterButton(mapBooleans);		
	});
	
	// JQuery sur le confirmpassword
	$('#confirmpassword-input').focus(function() {
		$('#confirmpassword-info-container').removeClass('show-element-container').addClass('hide-element-container');
		$('#confirmpassword-label-input').removeClass('label-input-error');
		$('#confirmpassword-input').removeClass('style-input-error').addClass('style-input');
		$('#confirmpassword-error-list').children().remove();
	}).focusout(function() {

		var strConfirmPasswordInput = $(this).val();
		var strPassword = $('#password-input').val();
		
		booIncorrectConfirmPassword = mapBooleans["booIncorrectConfirmPassword"]
		
		if (strPassword != '') {

			if (strConfirmPasswordInput != '') {
				if (strPassword != strConfirmPasswordInput) {
					$('#confirmpassword-info-container').removeClass('hide-element-container').addClass('show-element-container');
					booIncorrectConfirmPassword = true;
				} else {
					$('#confirmpassword-info-container').removeClass('show-element-container').addClass('hide-element-container');
					booIncorrectConfirmPassword = false;
				}
			} else {
				booIncorrectConfirmPassword = true;				
			}

		} else {
			if (strConfirmPasswordInput == '') booIncorrectConfirmPassword = true;				
			else booIncorrectConfirmPassword = false;			
		}

		if (booIncorrectConfirmPassword == true) {
			$('#confirmpassword-label-input').addClass('label-input-error');
			$('#confirmpassword-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#confirmpassword-label-input').removeClass('label-input-error');
			$('#confirmpassword-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectConfirmPassword"] = booIncorrectConfirmPassword;
		
		checkDisableRegisterButton(mapBooleans);		
	});
	
});

function checkPassword(strPasswordInput, mapBooleans) {
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
	
	return mapBooleans;
}