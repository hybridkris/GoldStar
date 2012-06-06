
//global varibles
var _currentTab;

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

	var hashtags = getHashTags("all");
	$( "#EventTextBox" ).autocomplete({
				source: hashtags
			});	
	$( "#AllStarEventHashTag" ).autocomplete({
				source: hashtags
			});	
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
		 		userArrAll[userArrAll.length] = {Name: e[i].firstName + " " + e[i].lastName, numOfStars: e[i].starCount};
		 	}

		 	console.log(userArrAll);

		 	var userArrHasStar = [];
		 	//weed out people with 0 stars
		 	for(var j = 0; j < userArrAll.length; ++j){
		 		if (userArrAll[j].numOfStars > 0){
		 			userArrHasStar[userArrHasStar.length] = userArrAll[j];
		 		}
		 	}
		 	
		 	console.log(userArrHasStar);

		 	/*-------------------------------end of matts stuff------------------------------*/


		 	
		 	$.each(data.leaders, function(i, val)
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
		 		});
		 });
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
		emptyMessage = "No stars! You need involvement..."	
 	}
 	else if( myFeedFilterSelectedItem == "Given")
 	{
 		//console.log("displaying Given");
 		starArray = user.stars;
 		emptyMessage = "No stars given, go out and meet some people!"
 	}
 	else if (myFeedFilterSelectedItem == "Received")
 	{
 		//console.log("displaying received");
 		starArray = user.issued;
 		emptyMessage = "No stars received, Try to be more awesome ;-)!"
 	}
 	//check for length first
 	if (starArray.length == 0 )
 	{
 		$("#myStarList").html("");
 		$("#emptyListMessage").html(emptyMessage);
 	}
 	else
 	{
	 	//loop through array
	 	$.each(starArray, function(i, val)
			{
				console.log(val);
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
				$("#myStarList").append(itemHTML);	
			}
	 	);
	 		
 	}
 		

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
				console.log(val);
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
			console.log("loading stars-1")
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
			console.log("loading events")
			$.getJSON(userUrl, function(jdata)
			 {
			 	sessionStorage.setItem("hashtagStars", JSON.stringify(jdata));
			 	displayEventStars();				
			 });
}

//returns the hashtags
function  getHashTags(whatTags)
{
	console.log(whatTags);
	//get hashtags here
	rv = ['ape','bear','cat', 'dog'];
	return rv;

}
