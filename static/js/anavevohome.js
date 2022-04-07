$(document).ready(function(){

	// Partie sur la page Home pour la recherche plein texte
	$('#search-input').keyup(function() {
		
		var strSearchInput = $(this).val();
		
		if (strSearchInput == null || strSearchInput == '') {
			$('#delete-search').removeClass('delete-search-show').addClass('delete-search-hide');		
		} else {
			$('#delete-search').removeClass('delete-search-hide').addClass('delete-search-show');
		}
	}).focus(function() {
		var strSearchInput = $(this).val();
		if (strSearchInput == null || strSearchInput == '') {
			$('#delete-search').removeClass('delete-search-show').addClass('delete-search-hide');
		} else {
			$('#delete-search').removeClass('delete-search-hide').addClass('delete-search-show');
			//$("#delete-search").focus();
		}
		
	})/*.blur(function() {
		console.log("coucou");
		 setTimeout(function() { $("#search-input").focus(); }, 0);
	})*/.focusout(function() {
		//$('#delete-search').removeClass('delete-search-show').addClass('delete-search-hide');
	})/*.mouseenter(function() {
		$('#delete-search').removeClass('delete-search-hide').addClass('delete-search-show');
	}).mouseleave(function() {
		$('#delete-search').removeClass('delete-search-show').addClass('delete-search-hide');
	})*/;
	
	$('#delete-search').click(function() {
		
		var objSearchInput = $('#search-input').val();
		if (objSearchInput == null || objSearchInput == '') {
			
		} else {
			$('#search-input').val('');
			$("#search-input").focus();
			//setTimeout(function() { $("#search-input").focus(); }, 0);
		}		
	});
	
});