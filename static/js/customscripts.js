var userData = null;
var userList = {};
function canUseStorage()
{
	if(typeof(Storage)!=="undefined")
	{
		return true;
	}
	else
	{
		alert("Your browser does not support local storage.");
		return false;
	}
}
function redirect(id)
{
	var page;
	page = document.getElementById(id).id;
	if (page == "giveGoldStar")
		window.location = "giveGold.html";
	else if (page == "myGoldStars")
		window.location = "myGoldStar.html";
	else if (page == "awardedStars")
		window.location = "awardedStar.html";
	else
		window.location = "mobileview.html";
}
function login()
{
	if(sessionStorage.userID && canUseStorage())
	{
		window.location = "mobileview.html";
	}
	else if (!(sessionStorage.userID) && canUseStorage())
	{
		var em = document.getElementById('txtemail').value;
		em = em.toLowerCase();
		var q = '{"filters": [{"name":"email","op":"eq","val":"'+em+'"}]}';
		var URL = '/api/user?q=' + q;
		$.getJSON(URL, function(jdata){
			if(jdata.objects.length)
			{
				sessionStorage.userID = jdata.objects[0].id;
				window.location = "mobileview.html";
			}
			else
				alert("Email not found.");	
		});
	}
	else
	{
		alert("Update your browser to use this site.");
	}

}
function userLogout()
{
	var r = confirm("Are you sure you want to logout?");
	if (r == true)
	{
		sessionStorage.clear();
		window.location = 'index.html';
	}
}
function toggleLoginView(id)
{
	document.getElementById("index1").style.display = 'none';
	document.getElementById("index2").style.display = 'none';

	e = document.getElementById(id);

	if (e.id == "login1")
		document.getElementById("index2").style.display = 'block';
	if (e.id == "login2")
		document.getElementById("index1").style.display = 'block';
}
function toggleView(id)
{
	document.getElementById("gold1").style.display = 'none';
	document.getElementById("gold2").style.display = 'none';
	document.getElementById("gold3").style.display = 'none';

	e = document.getElementById(id).id;

	if (e == "gg")
	{
		window.location.reload();
		document.getElementById("gold1").style.display = 'block';
	}
	else if (e == "ms")
		document.getElementById("gold2").style.display = 'block';
	else if (e == "as")
		document.getElementById("gold3").style.display = 'block';
	else
		window.location = 'main.html';
}
function toggleInnerView(id)
{
	document.getElementById("tbl1").style.display = 'block';
	document.getElementById("give1").style.display = 'block';
	giveGoldStar(0);
}
function giveGoldStar(id)
{
	
	e = document.getElementById(id);
	//if (e.id == "innergive1")
	document.getElementById("give2").style.display = 'block';
	//if (e.id == "innergive2")
	document.getElementById("give3").style.display = 'block';
	if (e != null && e.id == "innergive3")
	{

		window.location = "main.html";
	}
}
function postJSON(id, num)
{

	if (num == 0)
	{
		var noerr = true;
		var fn = $("#FName").val(); 
		var ln = $("#LName").val(); 
		var em = $("#Email").val();
		var pw = $("#PWord").val();
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
				alert('You have successfully created an account!');
			},
			error: function(jqXHR, textStatus, errorThrown){
				var err = jQuery.parseJSON(jqXHR.responseText);
				if(err.validation_errors.firstName)
					alert(err.validation_errors.firstName);
				else if(err.validation_errors.lastName)
					alert(err.validation_errors.lastName);
				else if(err.validation_errors.email)
					alert(err.validation_errors.email);
				noerr = false;
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
							login();
						}
					});
  				}
  				else{
  					toggleLoginView("login2");
  				}
				
  			}
		});
	}
	else if (num == 1)
	{
		//var e = document.getElementById("select1");
		if(confirm('Are you sure you want to give a star to ' + $('#modalViewUser').val() + '?'))
		{
			//var e1 = e.options[e.selectedIndex].value;
			//starName = e.options[e.selectedIndex].text;
			var e1 = document.getElementById("modalViewUser").name;
			var starName = $('#modalViewUser').val();
			sessionStorage.starName = starName;
			e = document.getElementById("modalViewVerb");
			var e2 = e.options[e.selectedIndex].value;
			//var e3 = document.getElementById("select3").value;
			//var e2 = $('#modalViewVerb').val();
			var e3 = $('#modalViewTextarea').val();
			var e4 = $('#modalViewEvent').val();
			var tweet = false;
			if($("#modalViewTweet").is(':checked'))
				tweet = true;

			var userData = '{"tweet":"'+tweet+'","description":"'+e3+'","category":"'+e2+'","issuer_id":"'+sessionStorage.userID+'","owner_id":"'+e1+'","hashtag":"'+e4+'"}';
			//alert(userData);
			$.ajax({
				type: "POST",
				url: "/api/star",
				data: userData,
				contentType: "application/json",
				success: function(data){
					sessionStorage.starID = data.id;
					alert("You successfully gave a star to "+starName+"!");
				},
				complete: function(){
					window.location = "/";
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert(errorThrown + " " + textStatus + " " + jqXHR);
				}
			});
		}
	}
}
function getJSON(num)
{
	var usersHidden = []
	var usersDisplay = []
	if (num == 0)
	{
		$.getJSON('/api/user', function(jdata)
		{	
			for(var i in jdata.objects){
				var currentUser = jdata.objects[i];
				//userList[currentUser.id] = currentUser;				
				//users.push(currentUser.firstName + " " + currentUser.lastName);
				if (sessionStorage.userID != currentUser.id)
				{
					usersHidden.push(currentUser.id);
					usersDisplay.push(currentUser.firstName + ' ' + currentUser.lastName + ' (' +currentUser.email+')');
				}
				
					
			}
			// ko.applyBindings(jdata,document.getElementById('give1'));			
			$( "#modalViewUser" ).autocomplete({
				source: usersDisplay,
				select: function(event, ui){
					var indexofDisplay =  $.inArray(ui.item.value,usersDisplay);
					for (var i = 0; i <= usersDisplay.length; ++i){
						if (indexofDisplay == i){
							//alert("User: " + ui.item.value +", ID: " + usersHidden[i]);
							document.getElementById("modalViewUser").name = usersHidden[i];
							break;
						}
					}
					//alert(document.getElementById("modalViewUser").name);					
				}
			});
		});
	}
	if (num == 1)
	{
		var userUrl = "/api/user/"+sessionStorage.userID;
		var starMasterList = ko.observableArray();
		$.getJSON(userUrl, function(jdata)
		{
			for(var i in jdata.stars){
					var star = jdata.stars[i];
					var user = userList[star.issuer_id];
					if(user)
						star.issuerfullName = user.firstName + " " + user.lastName;											
					else
						star.issuerfullName = "";
					star.ownerfullName = "You"
					starMasterList.push(star)
			};
			for(var i in jdata.issued){
					var star = jdata.issued[i];
					var user = userList[star.owner_id];
					if(user)
						star.ownerfullName = user.firstName + " " + user.lastName;											
					else
						star.ownerfullName = "";
					star.issuerfullName = "You"
					starMasterList.push(star)
			};
			jdata.stars = starMasterList;
			userData = jdata;
			ko.applyBindings(userData,document.getElementById('userNameNav'));
			ko.applyBindings(userData,document.getElementById('gold2'));
			// ko.applyBindings(userData,document.getElementById('gold3'));
		});

	}
}
function limitText(limitField, limitNum)
{
	e = document.getElementById(limitField);
	if (e.value.length > limitNum)
		e.value = e.value.substring(0, limitNum);
}
function showselect(id)
{
	var e = document.getElementById(id);
	alert(e.options[e.selectedIndex].value);
}
function showDescription(divid)
{
	$('#' + divid).toggle();
}

//modal functionality
function showModal()
{
	$('#myModal').modal('show');
	if(sessionStorage.twitterUser == 'false')
	{
		$('#modalViewTweet').attr("disabled", true);
		$('#modalViewTweet').attr("checked", false);
	}
	else
	{
		$('#modalViewTweet').attr("disabled", false);
	}
}
function resetModalView(){
		$('#modalViewUser').val("");
		$('#modalViewVerb').val("");
		$('#modalViewEvent').val("");
		$('#modalViewTextarea').val("");
		$('#modalViewTweet').attr("disabled", false);
}
function redirectTwitter()
{
	window.location = "../twitterauth";
}