
//global varibles
var _currentTab;
var userList = {};
var defaultHashtag;
var usersDisplay  = [];
var usersHidden = [];
var ajaxUpdate;


//on doc ready for mobile view
function pageInit()
{

	//sets _currentTab to default value
	//sets default hashtag in search boxes

	if(localStorage.CheckedIntoConference!="" && localStorage.CheckedIntoConference!= null){
		defaultHashtag = localStorage.CheckedIntoConference;
		sessionStorage.hashtag= localStorage.CheckedIntoConference;
	}
	
	else{
		defaultHashtag = "mLearnCon"
		sessionStorage.hashtag = "mLearnCon"
	}

	$("#EventTextBox").val(defaultHashtag);
	$("#AllStarEventHashTag").val(defaultHashtag);
	if (sessionStorage.currentTab == null || sessionStorage.currentTab =="")
	{
		_currentTab = "myStars";
		$("#EventTextBox").val(defaultHashtag);
		$("#AllStarEventHashTag").val(defaultHashtag);
		loadCurrentStars();
	}
	else
	{ 
		_currentTab = sessionStorage.currentTab;
		if(sessionStorage.currentTab == "myStars")
		{
			loadCurrentStars();
			$('#browserTabs a[href="#myStarsTab"]').tab('show');

		}
		else if(sessionStorage.currentTab == "event")
		{
			if(sessionStorage.hashtag!=defaultHashtag && sessionStorage.hashtag!="" && sessionStorage.hashtag!=null){
				$("#EventTextBox").val(sessionStorage.hashtag);
				$("#AllStarEventHashTag").val(sessionStorage.hashtag);
			}
			
			else{
				$("#EventTextBox").val(defaultHashtag);
			}
			$('#browserTabs a[href="#eventTab"]').tab('show');
		}
		else if(sessionStorage.currentTab=="findPeople")
		{
			$('#browserTabs a[href="#findPeopleTab"]').tab('show')
		}
		else if(sessionStorage.currentTab =="leader")
		{

			if(sessionStorage.hashtag!=defaultHashtag){
				$("#AllStarEventHashTag").val(sessionStorage.hashtag);
				$("#EventTextBox").val(sessionStorage.hashtag);
			}
			else{
				$("#AllStarEventHashTag").val(defaultHashtag);
			}
			$('#browserTabs a[href="#leaderBoardTab"]').tab('show');
		}

	}
	//attach event to select
	$("#myFeedFilter").change(displayMyStars);
	
	//load objects
	suggestedHashtags();
	//set autocomplete for stargazing menu
	//Known duplicate code from customscripts.js, line 217(ish)

	$.each(userList, function(i, val){
			var currentUser = val;
			if (sessionStorage.userID != currentUser.id)
			{
				usersHidden.push(currentUser.id);
				usersDisplay.push(currentUser.firstName + ' ' + currentUser.lastName + ' (' +currentUser.email+')');
			}
	});

	$("#findPeopleSearchBox").autocomplete({
				source: usersDisplay,
				select: function(event, ui){
					var index = $.inArray(ui.item.value,usersDisplay);
					loadOtherUserStars(usersHidden[index], "otherUserStarList", "emptyUserSearchListMessage", "userSearchPageMessageDiv")
				}
			});

	//RECOMMENT IN FOR AJAX UPDATES
	//ajaxUpdate = setInterval(updateData, 10000);

}

//ajax function call
function updateData()
{
	//update user page
	loadMyStars();
	//update hashtag
	loadHashtagStars($("#EventTextBox").val());
}


function onGazeClick()
{
	var index = $.inArray($("#findPeopleSearchBox").val(),usersDisplay);
	loadOtherUserStars(usersHidden[index], "otherUserStarList", "emptyUserSearchListMessage", "userSearchPageMessageDiv")
}


function getSelectableDivId(id)
{
	if (id.indexOf("#") != 0)
	{
		id = "#" + id;
	}
	return id;	
}

function addStarsToDiv(divToAdd, starArray, errorMessage, errorMessageDiv, errorMessageContainer)
{
	//makes sure the div id has a hashtag to be selected by jquery
	divToAdd = getSelectableDivId(divToAdd);
	errorMessageDiv = getSelectableDivId(errorMessageDiv);
	errorMessageContainer = getSelectableDivId(errorMessageContainer);

		//check for length first
 	if (starArray.length == 0 )
 	{
 		$(divToAdd).html("");
 		$(errorMessageDiv).html(errorMessage);
 		$(errorMessageContainer).css("display","block");
 	}
 	else
 	{
 		$(divToAdd).html("");	
 		$(errorMessageContainer).css("display","none");
	 	//loop through array
	 	$.each(starArray, function(i, val)
			{
				var ownerName =  userList[val.owner_id].firstName + ' ' + userList[val.owner_id].lastName;
				var ownerID = val.owner_id
				var verb = val.category;
				var issuerName = userList[val.issuer_id].firstName + ' ' + userList[val.issuer_id].lastName ;
				var issuerID = val.issuer_id;
				var hashtag = (val.hashtag != null) ? val.hashtag : "somewhere";
				var today = new Date(parseDate(val.created));
				var todayFormatted = calculateTimeFromServer(today);
				var star_id = val.id	
				
			
				var itemHTML = getItemHTML(ownerID, ownerName, verb, issuerID, issuerName, hashtag, todayFormatted,star_id);

				$(divToAdd).append(itemHTML);	
			}
	 	);
	 		
 	}
}

function loadCurrentStars()
{

	if (_currentTab == "myStars")
	{
		
		loadMyStars("myStarList");	
	}
	else if (_currentTab == "event")
	{
		if (sessionStorage.clickedHashtag != null && sessionStorage.clickedHashtag != "" )
		{
			$("#EventTextBox").val(sessionStorage.clickedHashtag);
			sessionStorage.clickedHashtag = "";
		}

		else if($("#AllStarEventHashTag").val()!=defaultHashtag)
		{
			$("#EventTextBox").val($("#AllStarEventHashTag").val());
			sessionStorage.hashtag =$("#EventTextBox").val();
		}
		else if($("#AllStarEventHashTag").val()==defaultHashtag)
		{
			$("#EventTextBox").val(defaultHashtag);	
			sessionStorage.hashtag =$("#EventTextBox").val();
		}
		else
		{
			$("#EventTextBox").val(defaultHashtag);
			sessionStorage.hashtag =$("#EventTextBox").val();
		}
		//RECOMMENT BACK IN TO WORK
		loadHashtagStars($("#EventTextBox").val());	
	}
	else if (_currentTab == "leader")
	{

		if($("#EventTextBox").val()!=defaultHashtag)
		{
			$("#AllStarEventHashTag").val($("#EventTextBox").val());
			sessionStorage.hashtag =$("#AllStarEventHashTag").val();
		}
		else if($("#EventTextBox").val()==defaultHashtag)
		{
			$("#AllStarEventHashTag").val(defaultHashtag);	
			sessionStorage.hashtag =$("#AllStarEventHashTag").val();
		}
		else
		{
			$("#AllStarEventHashTag").val(defaultHashtag);	
			sessionStorage.hashtag =$("#AllStarEventHashTag").val();
		}
		
		displayLeaderBoard();
	}
}



//bind events to tab change
//sets current tab
$('a[data-toggle="tab"]').on('shown', function (e) {
    var currentTab = e.target.toString();
    if (currentTab.indexOf("myStars")  >= 0 )
    {
    	
    	_currentTab = "myStars";
    }
    else if(currentTab.indexOf("findPeople") >=0 )
    {
    	_currentTab ="findPeople";
    }
    else if (currentTab.indexOf("event")  >= 0 )
    {
    	
    	_currentTab = "event";
    }
    else if (currentTab.indexOf("leader")  >= 0 )
    {
    	
    	_currentTab = "leader";

    }
    else if (currentTab.indexOf("find")  >= 0 )
    {
    	
    	_currentTab = "findPeople";
    }
    sessionStorage.currentTab = _currentTab;
    loadCurrentStars();
});

function displayLeaderBoard()
{
		//getJson of stars here
		var ht = $("#AllStarEventHashTag").val().toLowerCase();
		ht = (ht == "") ? "all" : ht;
		var verb = "all"
		var userUrl = "/leaderboard/filter/"+ht+"/"+verb;
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
		
		 	e = data.leaders;
		 	numberOfUsers = data.leaders.length;
		 	var userArrAll = [];
		 	for(var i = 0; i < numberOfUsers; ++i){
		 		userArrAll[userArrAll.length] = {Name: e[i].firstName + " " + e[i].lastName, numOfStars: e[i].starCount, id: e[i].id};
		 	}

		

		 	var userArrHasStar = [];
		 	//weed out people with 0 stars
		 	for(var j = 0; j < userArrAll.length; ++j){
		 		if (userArrAll[j].numOfStars > 0){
		 			userArrHasStar[userArrHasStar.length] = userArrAll[j];
		 		}
		 	}
		 	
		 	

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
					
					$(divToChange).html("")
				}
				$(divToChange).append(itemHTML);
				userArrAll.pop();	
		 	}
		 	
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

function displayMyStars(starListDiv, messageDiv, messageContainerDiv )
{
	//get user item from sessionStorage 
	var user = JSON.parse(sessionStorage.getItem("userObject"));

 	// check to see what list item is selected, gets index
 	var myFeedFilterSelectedItem = $("#myFeedFilter").val();

 	//create empty message
 	var emptyMessage = "Oh dear, nothing was found!";

 	//make array of stars
 	var starArray = [];
 	if (myFeedFilterSelectedItem == 0)
 	{

 		starArray = user.issued.concat(user.stars);
 		starArray.sort(compareStarArrayByDate)
 		starArray.reverse();
		emptyMessage = "No stars! You need involvement..."	
 	}
 	else if( myFeedFilterSelectedItem == 1)
 	{
 		starArray = user.issued;
 		emptyMessage = "No stars given, go out and meet some people!"
 	} 
 	else if (myFeedFilterSelectedItem == 2)
 	{
 		starArray = user.stars;
 		emptyMessage = "No stars received, Try to be more awesome ;-)!"
 	}
 	addStarsToDiv(starListDiv, starArray, emptyMessage, messageDiv, messageContainerDiv);
}

function loadOtherUserStars(userID, listDiv, messageDiv, messageContainerDiv){
	var url = '/api/user/' + userID;
	$.getJSON(url, function(data)
		{
			var emptyMessage = "This user does not have any stars.";
			//make array of stars
		 	var starArray = [];
		 	starArray = data.issued.concat(data.stars);
		 	starArray.sort(compareStarArrayByDate)
		 	starArray.reverse();
			addStarsToDiv(listDiv, starArray, emptyMessage, messageDiv, messageContainerDiv)		 	
		}).error(function() {$("#emptyUserSearchListMessage").html("Oops, nothing was found!")});
}

function GoToHashTagPage(hashtag)
{
	//set flag to catch hastag click
	sessionStorage.clickedHashtag = hashtag;
	//switch tabs
	$('#browserTabs a[href="#eventTab"]').tab('show');
	

}


function GoToHashTagPageWithRedirect(hashtag)
{
	//set flag to catch hastag click
	sessionStorage.clickedHashtag = hashtag;
	
	//switch tabs
	sessionStorage.currentTab = "event"
	
	window.location = "/";
	
}

function getItemHTML(ownerID, ownerName, verb, issuerID, issuerName, hashtag, timestamp, star_id)
{
		var itemHTML = '';

		if(ownerID != sessionStorage.userID){
			itemHTML += '<div onclick="goToStarPage('+star_id+')" class="starItemRecieved" style="overflow:hidden;padding:1em;border-bottom:0.1em solid #C0C0C0;font-size:1.2em">'
		}	
		else
		{
			itemHTML += '<div onclick="goToStarPage('+star_id+')" class="starItemGiven" style="overflow:hidden;padding:1em;border-bottom:0.1em solid #C0C0C0;font-size:1.2em">'
		}

		itemHTML += '	<div style="float:left;width:13%;padding:0em 1em 1em 1em;">'
			itemHTML += 	'		<img class="pull-left" width="40" height="30" style="padding-right:1em;" src="../static/img/goldstar.png" />'
		itemHTML += '	</div>'
		itemHTML += '	<div style="float:left;width:60%;">'
		if (issuerID == sessionStorage.userID)
		{
			itemHTML += '		<a href="/users/'+issuerID+'">You</a>'
		}
		else
		{
			itemHTML += '		<a href="/users/'+issuerID+'">'+ issuerName + '</a>'
		}
		
		itemHTML += '		gave a star to '
		if (ownerID == sessionStorage.userID)
		{
			itemHTML += '		<a href="/users/'+ownerID+'">you</a><br/>'
		}
		else
		{
			itemHTML += '		<a href="/users/'+ownerID+'">' + ownerName+ '</a><br/>'
		}
		itemHTML += '		<span style="font-size:0.8em"><button class="hashTagButton" onclick="GoToHashTagPage(\''+ hashtag +'\');"><b><i>#'+ hashtag+'</i></b></button></span><br/>'
		itemHTML += '		<span style="font-size:0.8em">'+timestamp+'</span><br/>'
		itemHTML += '	</div>'
		itemHTML += ''
		itemHTML += '	<div style="float:right;width:auto;display:table-cell;height:3em">'
		itemHTML += '		<i class="icon-chevron-right pull-right" style="vertical-align:middle;margin-top:1.5em"></i>'
		itemHTML += 	'</div>'
		itemHTML += '</div>'
		itemHTML += '<div style="clear:both"></div>'

		return itemHTML;


		

}

function goToStarPage(starID)
{
	window.location = "star/" + starID;
}
function displayEventStars()
{
	//get user item from sessionStorage 
	var hashtagStars = JSON.parse(sessionStorage.getItem("hashtagStars"));

 	
 	hashtagStars.sort(compareStarArrayByDate)
 	hashtagStars.reverse();
 	//create empty message
 	var emptyMessage = "Oh dear! Nothing was found!";
 	addStarsToDiv("eventStarList", hashtagStars, emptyMessage, "emptyHashtagListMessage", "eventHashTagListMessageContainer")
 		

}

function loadMyStars()
{
			//getJson of stars here
			var userUrl = "/api/user/" + sessionStorage.userID;
			$.getJSON(userUrl, function(jdata)
			 {
			 	sessionStorage.setItem("userObject", JSON.stringify(jdata));
			 	displayMyStars("myStarList", "emptyListMessage", "emptyListMessageContainer");				
			 });
}

function loadHashtagStars(needle)
{
	//getJson of stars here
	var userUrl = "/starsbyhashtag/" + needle.replace("#","").toLowerCase();
	$.getJSON(userUrl, function(jdata)
	{
		sessionStorage.setItem("hashtagStars", JSON.stringify(jdata.stars));
	 	displayEventStars();				
	});
}
function checkIntoConference(checkingIntoHashtag)
{
	localStorage.CheckedIntoConference = checkingIntoHashtag;
}
//returns the hashtags
function  getHashTags(whatTags)
{
	var hashlist
	
	var hashurl = "/Hashtags";
	$.getJSON(hashurl, function(data)
	{
		
		$( "#EventTextBox" ).autocomplete({
				datatype: "json",
				source: data.hashtags,
				select: function(event, ui){
					loadHashtagStars(ui.item.label);

				}
			});	
		$( "#AllStarEventHashTag" ).autocomplete({
				datatype: "json",
				source: data.hashtags,
				select: function(event, ui){
					displayLeaderBoard();

				}
			});	
	});

}


function parseDate(wholeDate)
	{
		var dateYear = wholeDate.substr(0,4);
		var dateMonth = wholeDate.substr(5,2);
		var dateDay = wholeDate.substr(8,2);
		var dateHour = wholeDate.substr(11,2);
		var dateMinute = wholeDate.substr(14,2);
		var dateSecond = wholeDate.substr(17,2);
		var dateString = dateMonth+"/"+dateDay+"/"+dateYear+" "+dateHour+":"+dateMinute+":"+dateSecond
		return dateString;
	}

function logoutFunction(){
	sessionStorage.clear();
}

function calculateTimeFromServer(serverTime){
	// Set the unit values in milliseconds.
	var msecPerMinute = 1000 * 60;
	var msecPerHour = msecPerMinute * 60;
	var msecPerDay = msecPerHour * 24;

	// Determine the current date and time.
	var today = new Date();
	

	// Determine the difference in milliseconds.
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
function suggestedHashtags(){
	var suggestedHashurl = "/hashtagSuggestions";
	var suggestedHashList = [];

	$.getJSON(suggestedHashurl, function(data)
	{
		if(data.hashtags[0].hashtag != null){
			$("#hashLink1").html("#"+data.hashtags[0].hashtag)
			$("#hashLink1").css("display","inline")
			$("#LeadHashLink1").html("#"+data.hashtags[0].hashtag)
			$("#LeadHashLink1").css("display","inline")
			$("#inStarHashLink1").html("#"+data.hashtags[0].hashtag)
			$("#inStarHashLink1").css("display","inline")
		}
		if (data.hashtags.length > 2){
			if(data.hashtags[1].hashtag != null && data.hashtags[0].hashtag != data.hashtags[1].hashtag){
				$("#hashLink2").html("#"+data.hashtags[1].hashtag)
				$("#hashLink2").css("display","inline")
				$("#LeadHashLink2").html("#"+data.hashtags[1].hashtag)
				$("#LeadHashLink2").css("display","inline")
				$("#inStarHashLink2").html("#"+data.hashtags[1].hashtag)
				$("#inStarHashLink2").css("display","inline")
			}
		}
		if (data.hashtags.length > 3){
			if(data.hashtags[2].hashtag != null && data.hashtags[2].hashtag != data.hashtags[0].hashtag && data.hashtags[2].hashtag != data.hashtags[1].hashtag ){
				$("#hashLink3").html("#"+data.hashtags[2].hashtag)
				$("#hashLink3").css("display","inline")
				$("#LeadHashLink3").html("#"+data.hashtags[2].hashtag)
				$("#LeadHashLink3").css("display","inline")
				$("#inStarHashLink3").html("#"+data.hashtags[2].hashtag)
				$("#inStarHashLink3").css("display","inline")
			}
		}
	});
}


///KnockOut stuff//////
/*
TODO: Implement Knock with an observable array of objects

function StarListViewModal()
{
	this.myStars = ko.observable([
		{Issuer: "Person 1", Receiver: "Person 2"},
		{Issuer: "Person 3", Receiver: "Person 1"},
		{Issuer: "Person 4", Receiver: "Person 3"},
		{Issuer: "Person 2", Receiver: "Person 4"}
	]);
}

ko.applyBindings(new StarListViewModal());

*/
