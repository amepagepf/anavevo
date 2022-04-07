$(document).ready(function(){
	
	var booIncorrectUserName = false;
	var booIncorrectPassword = false;

	var mapBooleans = {
		"booIncorrectUserName": booIncorrectUserName,
		"booIncorrectPassword": booIncorrectPassword
	};
	
	checkDisableLoginButton(mapBooleans);
	
	// JQuery sur le username (email)
	$('#username-input').focus(function() {
		$('#username-label-input').removeClass('label-input-error');
		$('#username-input').removeClass('style-input-error').addClass('style-input');
		$('#error-list').children().remove();
	}).focusout(function() {

		var strUsernameInput = $(this).val();

		booIncorrectUserName = mapBooleans["booIncorrectUserName"];
		
		if (strUsernameInput == '') booIncorrectUserName = true;			
		else booIncorrectUserName = false;

		if (booIncorrectUserName == true) {
			$('#username-label-input').addClass('label-input-error');
			$('#username-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#username-label-input').removeClass('label-input-error');
			$('#username-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectUserName"] = booIncorrectUserName;
		
		checkDisableLoginButton(mapBooleans);		
	});
	
	// JQuery sur le confirmpassword
	$('#password-input').focus(function() {
		$('#password-label-input').removeClass('label-input-error');
		$('#password-input').removeClass('style-input-error').addClass('style-input');
		$('#error-list').children().remove();
	}).focusout(function() {

		var strPasswordInput = $(this).val();

		booIncorrectPassword = mapBooleans["booIncorrectPassword"];
		
		if (strPasswordInput == '') booIncorrectPassword = true;			
		else booIncorrectPassword = false;

		if (booIncorrectPassword == true) {
			$('#password-label-input').addClass('label-input-error');
			$('#password-input').removeClass('style-input').addClass('style-input-error');
		} else {
			$('#password-label-input').removeClass('label-input-error');
			$('#password-input').removeClass('style-input-error').addClass('style-input');
		}
		
		mapBooleans["booIncorrectPassword"] = booIncorrectPassword;
		
		checkDisableLoginButton(mapBooleans);		
	});
	
});