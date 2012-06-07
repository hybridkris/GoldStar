
//global varibles
var _currentTab;
var userList = {};

//on doc ready for mobile view
function pageInit()
{
	//sets _currentTab to default value
	if (_currentTab == null)
	{
		_currentTab = "myStars";
	}
	//attach event to select
	$("#myFeedFilter").change(displayMyStars);
	
	//load objects
	loadCurrentStars();
	getHashTags('all');
}

function loadCurrentStars()
{
	if (_currentTab == "myStars")
	{
		//console.log("loading myStars");
		loadMyStars("myStarList");	
	}
	else if (_currentTab == "event")
	{
		//console.log("loading event");
		 //RECOMMENT BACK IN TO WORK
		 //loadHashtagStars("eventStarList");	
	}
	if (_currentTab == "leader")
	{
		//console.log("loading leader");
		displayLeaderBoard();
	}
	
	
}
//bind events to tab change
//sets current tab
$('a[data-toggle="tab"]').on('shown', function (e) {
    //console.log(e.target) // activated tab
   // console.log(e.relatedTarget) // previous tab

    var currentTab = e.target.toString();
    if (currentTab.indexOf("myStars")  >= 0 )
    {
    	//console.log("myStars");
    	_currentTab = "myStars";
    }
    else if (currentTab.indexOf("event")  >= 0 )
    {
    	//console.log("event");
    	_currentTab = "event";
    }
    else if (currentTab.indexOf("leader")  >= 0 )
    {
    	//console.log("leader");
    	_currentTab = "leader";
    }
    loadCurrentStars();
});

function displayLeaderBoard()
{
		//getJson of stars here
		var userUrl = "/getLeaderboard"
		$.getJSON(userUrl, function(data)
		 {
		 	//reset divs
		 	var defaultDiv = '<div class="well-small" style="background-color:#ffffbb"><i>Nobody is this bright yet, will you be the first?</i></div>	'
		 	$("#tier5").html(defaultDiv);	
		 	$("#tier4").html(defaultDiv);	
		 	$("#tier3").html(defaultDiv);	
		 	$("#tier2").html(defaultDiv);	
		 	$("#tier1").html(defaultDiv);	
		 	$("#tier0").html(defaultDiv);	
		 	
		 	/*----------------------------------matts stuff----------------------------------*/
		 	e = data.leaders;
		 	numberOfUsers = data.leaders.length;
		 	var userArrAll = [];
		 	for(var i = 0; i < numberOfUsers; ++i){
		 		userArrAll[userArrAll.length] = {Name: e[i].firstName + " " + e[i].lastName, numOfStars: e[i].starCount, id: e[i].id};
		 	}

		 //	console.log(userArrAll);

		 	var userArrHasStar = [];
		 	//weed out people with 0 stars
		 	for(var j = 0; j < userArrAll.length; ++j){
		 		if (userArrAll[j].numOfStars > 0){
		 			userArrHasStar[userArrHasStar.length] = userArrAll[j];
		 		}
		 	}
		 	
		 	//	console.log(userArrHasStar);

		 	//sort arrays
		 	userArrAll.sort(function(a,b){
		 	 	return parseInt(a.numOfStars) - parseInt(b.numOfStars);
		 	 });

		 	var tierOnePercent = 0.50;
		 	var tierTwoPercent = 0.25;
		 	var tierThreePercent = 0.1;
		 	var tierFourPercent = 0.05;
		 	var tierFivePercent = 0.01;

		 	var tierOneUsers = Math.ceil(numberOfUsers * tierOnePercent);
		 	var tierTwoUsers = Math.ceil(numberOfUsers * tierTwoPercent);
		 	var tierThreeUsers = Math.ceil(numberOfUsers * tierThreePercent);
		 	var tierFourUsers = Math.ceil(numberOfUsers * tierFourPercent);
		 	var tierFiveUsers = Math.ceil(numberOfUsers * tierFivePercent);

		 	//console.log("1%: "+tierOneUsers+" \b5%: "+tierTwoUsers+" \b10%: "+tierThreeUsers+" \b25%: "+tierFourUsers+" \b50%: "+tierFiveUsers);

		 	for(var i = userArrAll.length - 1; i >= 0; --i){
		 		var divToChange = "#";
		 		var flag = false;
		 		if (userArrAll[i].numOfStars == 0 && flag == false){
		 			divToChange += "tier0";
		 			flag = true;
		 		}
		 		if (tierFiveUsers > 0 && flag == false){
		 			divToChange += "tier5";
		 			tierFiveUsers -= 1;
		 			flag = true;
		 		}
		 		if (tierFourUsers > 0 && flag == false){
		 			divToChange += "tier4";
		 			tierFourUsers -= 1;
		 			flag = true;
		 		}
		 		if (tierThreeUsers > 0 && flag == false){
		 			divToChange += "tier3";
		 			tierThreeUsers -= 1;
		 			flag = true;
		 		}
		 		if (tierTwoUsers > 0 && flag == false){
		 			divToChange += "tier2";
		 			tierTwoUsers -= 1;
		 			flag = true;
		 		}
		 		if (tierOneUsers > 0 && flag == false){
		 			divToChange += "tier1";
		 			tierOneUsers -= 1;
		 			flag = true;
		 		}
		 			

		 		var itemHTML = '';
				itemHTML += '<a href="/users/' + userArrAll[i].id + '"><div class="well" style="height:4em; margin-bottom:0;">'				
				itemHTML += 	'<div style="float:left; width:80%;">'
				itemHTML += 	'	<img class="pull-left" width="40" height="40" style="padding-right:1em;" src="../static/img/goldstar.png" />'
				itemHTML += 		'<span font-size:1.2em;>' + userArrAll[i].Name +' </span> <br/>';
				itemHTML += 		'<span style="font-size:1em"><i>Stars:' + userArrAll[i].numOfStars + '</i> </span> <br/>'
				itemHTML += 	'</div>'
				itemHTML += '</div></a>	'		
				itemHTML += 	'<div style="clear:both"></div>'
				//checks if the empty message is still there
				if ($(divToChange).html().indexOf('<div class="well-small"') >= 0 )
				{
					//if message is still there for the div, it removes it
					//console.log("still has default message")
					$(divToChange).html("")
				}
				$(divToChange).append(itemHTML);
				userArrAll.pop();	
		 	}
		 	/*-------------------------------end of matts stuff------------------------------*/


		 	

		 	 	
		 	/*$.each(data.leaders, function(i, val)
		 		{
		 			var divToChange = "#"
		 			if (val.starCount >= 75)
		 			{
		 				divToChange += "tier5"
		 			}
		 			else if (val.starCount >= 50)
		 			{
		 				divToChange += "tier4"
		 			}
		 			else if (val.starCount >= 30)
		 			{
		 				divToChange += "tier3"
		 			}
		 			else if (val.starCount >= 15)
		 			{
		 				divToChange += "tier2"
		 			}
		 			else if (val.starCount >= 5)
		 			{
		 				divToChange += "tier1"
		 			}
		 			else
		 			{
		 				divToChange += "tier0"
		 			}

			 		var itemHTML = '';
					itemHTML += '<a href="/users/' + val.id + '"><div class="well" style="height:4em; margin-bottom:0;">'				
					itemHTML += 	'<div style="float:left; width:80%;">'
					itemHTML += 	'	<img class="pull-left" width="40" height="40" style="padding-right:1em;" src="../static/img/goldstar.png" />'
					itemHTML += 		'<span font-size:1.2em;>' + val.firstName + ' '+ val.lastName +' </span> <br/>';
					itemHTML += 		'<span style="font-size:1em"><i>Stars:' + val.starCount + '</i> </span> <br/>'
					itemHTML += 	'</div>'
					itemHTML += '</div></a>	'		
					itemHTML += 	'<div style="clear:both"></div>'
					//checks if the empty message is still there
					if ($(divToChange).html().indexOf('<div class="well-small"') >= 0 )
					{
						//if message is still there for the div, it removes it
						console.log("still has default message")
						$(divToChange).html("")
					}
					$(divToChange).append(itemHTML);	
		 		});*/
		 });
}

function compareStarArrayByDate(a,b)
{
	a = new Date(a.created);
	b = new Date(b.created);
	return (
            isFinite(a.valueOf()) &&
            isFinite(b.valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
}

function displayMyStars()
{
	//get user item from sessionStorage 
	var user = JSON.parse(sessionStorage.getItem("userObject"));


 	// check to see what list item is selected
 	var myFeedFilterSelectedItem = $("#myFeedFilter").val();

 	//create empty message
 	var emptyMessage = "Oops! something went wrong!";

 	//make array of stars
 	var starArray = []
 	if (myFeedFilterSelectedItem == "All")
 	{
 		//console.log("displaying all");
 		//create starArray
 		starArray = user.issued.concat(user.stars);
 		//console.log(user.issued)
 		starArray.sort(compareStarArrayByDate)
 		starArray.reverse();
 		//console.log(starArray)
 		//sort array


		emptyMessage = "No stars! You need involvement..."	
 	}
 	else if( myFeedFilterSelectedItem == "Given")
 	{
 		//console.log("displaying Given");
 		starArray = user.issued;
 		emptyMessage = "No stars given, go out and meet some people!"
 	} 
 	else if (myFeedFilterSelectedItem == "Received")
 	{
 		//console.log("displaying received");
 		starArray = user.stars;
 		emptyMessage = "No stars received, Try to be more awesome ;-)!"
 	}
 	//check for length first
 	if (starArray.length == 0 )
 	{
 		$("#myStarList").html("");
 		$("#emptyListMessage").html(emptyMessage);
 		$("#emptyListMessageContainer").css("display","block");
 	}
 	else
 	{
 		$("#myStarList").html("");	
 		$("#emptyListMessageContainer").css("display","none");
	 	//loop through array
	 	$.each(starArray, function(i, val)
			{
				var ownerName =  userList[val.owner_id].firstName + ' ' + userList[val.owner_id].lastName;
				var ownerID = val.owner_id
				var verb = val.category;
				var issuerName = userList[val.issuer_id].firstName + ' ' + userList[val.issuer_id].lastName ;
				var issuerID = val.issuer_id;
				var hashtag = (val.hashtag != null) ? val.hashtag : "somewhere";
				var timestamp = new Date(val.created);
				var today = new Date(val.created);
				var todayFormatted = calculateTimeFromServer(today);
				var star_id = val.id	
				/*var currentTime = new Date();
				alert(today + " " + currentTime);
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				
				var atTime = today.getHours() +":"+today.getMinutes() ;
				var today = mm+' / '+dd+' / '+yyyy + " @" +atTime;*/
			
				var itemHTML = getItemHTML(ownerID, ownerName, verb, issuerID, issuerName, hashtag, todayFormatted,star_id);
				$("#myStarList").append(itemHTML);	
			}
	 	);
	 		
 	}
 		

}

function getItemHTML(ownerID, ownerName, verb, issuerID, issuerName, hashtag, timestamp, star_id)
{
		var itemHTML = '';
		itemHTML += '<div class="well" style="height:4em; margin-bottom:0;">'				
		itemHTML += 	'<div style="float:left; width:80%;">'
		itemHTML += 	'	<img class="pull-left" width="40" height="40" style="padding-right:1em;" src="../static/img/goldstar.png" />'
		itemHTML += 		'<span font-size:1.2em;><a href="/users/'+ownerID+'">' + ownerName+ '</a> '+verb+' <a href="/users/'+issuerID+'">'+ issuerName + '</a></span> <br/>'
		//itemHTML += 		'<span style="font-size:1.0em;">at <a href="#" >' + hashtag + '</a></span><br/>'
		itemHTML += 		'<span style="font-size:1.0em;">at ' + hashtag + '</span><br/>'
		itemHTML += 		'<span style="font-size:0.8em">'+timestamp+' </span> <br/>'
		itemHTML += 	'</div>'
		console.log('<a href="/star/' + star_id + '">')
		itemHTML += 	'<a href="/star/' + star_id + '">'
		itemHTML += 		'<div style="float:right; height:90%; width:20%;position:relative; padding-top:1.5em;">'
		itemHTML += 				'<div class="iconDiv">'
		itemHTML += 				'	<i class="icon-chevron-right pull-right"></i>'
		itemHTML += 			'	</div>	'					
		itemHTML += 		'</div>	'	
		itemHTML += 	'</a>'
		itemHTML += '</div>	'		
		itemHTML += 	'<div style="clear:both"></div>'
		return itemHTML;

}
function displayEventStars()
{
	//get user item from sessionStorage 
	var hashtagStars = JSON.parse(sessionStorage.getItem("hashtagStars"));

 	
 	//create empty message
 	var emptyMessage = "Oops! something went wrong!";

 	//check for length first
 	if (hashtagsStars.length == 0 )
 	{
 		$("#eventStarList").html("");
 		$("#emptyHashtagListMessage").html(emptyMessage);
 	}
 	else
 	{
	 	//loop through array
	 	$.each(hashtagStars, function(i, val)
			{
				//console.log(val);
				var itemHTML = '';
				itemHTML += '<div class="well" style="height:4em; margin-bottom:0;">'				
				itemHTML += 	'<div style="float:left; width:80%;">'
				itemHTML += 	'	<img class="pull-left" width="40" height="40" style="padding-right:1em;" src="../static/img/goldstar.png" />'
				itemHTML += 		'<span font-size:1.2em;><a href="#">Person One</a> Influenced <a href="#" >Person Two</a></span> <br/>'
				itemHTML += 		'<span style="font-size:1.0em;">at <a href="#" >#MosEisley</a></span><br/>'
				itemHTML += 		'<span style="font-size:0.8em">13 minutes ago </span> <br/>'
				itemHTML += 	'</div>'
				itemHTML += 	'<a href="#">'
				itemHTML += 		'<div style="float:right; height:90%; width:20%;position:relative; padding-top:1.5em;">'
				itemHTML += 				'<div class="iconDiv">'
				itemHTML += 				'	<i class="icon-chevron-right pull-right"></i>'
				itemHTML += 			'	</div>	'					
				itemHTML += 		'</div>	'	
				itemHTML += 	'</a>'
				itemHTML += '</div>	'		
				itemHTML += 	'<div style="clear:both"></div>'
				$("#eventStarList").append(itemHTML);	
			}
	 	);
	 		
 	}
 		

}

function loadMyStars()
{
			//getJson of stars here
			var userUrl = "/api/user/" + sessionStorage.userID;
			//console.log("loading stars-1")
			$.getJSON(userUrl, function(jdata)
			 {
			 	sessionStorage.setItem("userObject", JSON.stringify(jdata));
			 	displayMyStars();				
			 });
}

function loadHashtagStars()
{
			//getJson of stars here
			var userUrl = "/api/user/1";
			//console.log("loading events")
			$.getJSON(userUrl, function(jdata)
			 {
			 	sessionStorage.setItem("hashtagStars", JSON.stringify(jdata));
			 	displayEventStars();				
			 });
}

//returns the hashtags
function  getHashTags(whatTags)
{
	var hashlist
	//console.log(whatTags);
	var hashurl = "/Hashtags"
	$.getJSON(hashurl, function(data)
	{
		//console.log(data);
		$( "#EventTextBox" ).autocomplete({
				datatype: "json",
				source: data.hashtags
			});	
		$( "#AllStarEventHashTag" ).autocomplete({
				datatype: "json",
				source: data.hashtags
			});	
	});

}
function calculateTimeFromServer(serverTime){
	// Set the unit values in milliseconds.
	var msecPerMinute = 1000 * 60;
	var msecPerHour = msecPerMinute * 60;
	var msecPerDay = msecPerHour * 24;

	// Determine the current date and time.
	var today = new Date();
	//alert (today.getTime());

	// Determine January 1, at midnight, of the current year.
	/*var january = 0;
	var startOfYear = new Date();
	startOfYear.setMonth(january);
	startOfYear.setDate(1);
	startOfYear.setHours(0, 0, 0, 0);*/

	// Determine the difference in milliseconds.
	console.log(typeof(serverTime))
	var interval = today.getTime() - serverTime.getTime();
	if (interval < 0){
		interval = 0;
	}

	// Calculate how many days the interval contains. Subtract that
	// many days from the interval to determine the remainder.
	var days = Math.floor(interval / msecPerDay );
	interval = interval - (days * msecPerDay );

	// Calculate the hours, minutes, and seconds.
	var hours = Math.floor(interval / msecPerHour );
	interval = interval - (hours * msecPerHour );

	var minutes = Math.floor(interval / msecPerMinute );
	interval = interval - (minutes * msecPerMinute );

	var seconds = Math.floor(interval / 1000 );

	// Format time.
	var msg = "";
	 /*+ minutes + " minutes, " + seconds + " seconds.";
	alert(msg);*/
	if (seconds >= 0){
		if (seconds == 1){
			msg = seconds + " second ago";
		}
		else{
			msg = seconds + " seconds ago";
		}
	}

	if (minutes > 0){
		if (minutes == 1){
			msg = minutes + " minute ago";
		}
		else{
			msg = minutes + " minutes ago";
		}
	}

	if (hours > 0){
		if (hours == 1){
			msg = hours + " hour ago";
		}
		else{
			msg = hours + " hours ago";
		}
	}

	if (days > 0){
		if (days == 1){
			msg = days + " day ago";
		}
		else{
			msg = days + " days ago";
		}
	}
	return msg;

}
