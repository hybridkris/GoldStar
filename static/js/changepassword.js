function changePassword()
{
	var newPassword = $("#PWord").val();
	var confirmPassword = $("#PWordAgain").val();
	console.log(sessionStorage.userID)
	if(newPassword.length > 6){
		if (newPassword == confirmPassword) {
			var URL = '/api/user/'+sessionStorage.userID;				
			$.getJSON(URL,function(userData){		
				delete userData.stars;
				delete userData.issued;				
				userData['password'] = newPassword;
				console.log(JSON.stringify(userData));
				$.ajax({
					type: 'PATCH',
			  		url: URL,
			  		data: JSON.stringify(userData),
			  		contentType: "application/json",
			  		success: function(data, textStatus, jqXHR){
							console.log(JSON.stringify(data));
						}
				});
			});
		}

	}
}