
function sendUserInfoToServer()
{
	$('#signUpErrorDiv').html("");

	
		var noerr = true;
		var fn = $("#FName").val(); 
		var ln = $("#LName").val(); 
		var em = $("#Email").val();
		//validate password
		var pw = $("#PWord").val();
		var confirmedPassword = $("#PWordAgain").val();
		if (pw == confirmedPassword)
		{
			$("#signupbtnenable").attr('disabled', 'disabled');
				//send to Server and sign up
				//lowercase email address
			em = em.toLowerCase();

			var userData = '{"firstName":"'+fn+'","lastName":"'+ln+'","email":"'+em+'", "password":"'+pw+'"}';
			var myJSON = userData;
			var URL = "/api/user";
			$.ajax({
	 			type: 'POST',
	  			url: URL,
	  			data: myJSON,
	  			contentType: "application/json",
				success: function(data, textStatus, jqXHR){
					sessionStorage.userID = data.id;
				},
				error: function(jqXHR, textStatus, errorThrown){
					var err = jQuery.parseJSON(jqXHR.responseText);
					if(err.validation_errors.firstName)
						showErrorMessage('signup', err.validation_errors.firstName);
					else if(err.validation_errors.lastName)
						showErrorMessage('signup', err.validation_errors.lastName);
					else if(err.validation_errors.email)
						showErrorMessage('signup', err.validation_errors.email);
					noerr = false;
					$("#signupbtnenable").removeAttr('disabled');
				},
	  			complete: function(jdata){
	  				if (noerr == true){
	  					//login();
	  					myJSON = '{"email":"'+em+'", "password":"'+pw+'"}'
	  					$.ajax({
							type: 'POST',
							url: '/login',
							data: myJSON,
							contentType: "application/json",
							success:function(data, textStatus,jqXHR){
								sessionStorage.userID = data.id;
								window.location = "mobileview.html";
							}
						});
						$("#signupbtnenable").removeAttr('disabled');
	  				}
	  				else{
	  					toggleLoginView("login2");
	  				}
					
	  			}
			});
		
		}
		else
		{
			///tell user that passwords do not match
			showErrorMessage('signup', 'Passwords do not match');

		}
		
}