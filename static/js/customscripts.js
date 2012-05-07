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
		window.location = "main.html";
}
function toggleView(id)
{
	document.getElementById("gold1").style.display = 'none';
	document.getElementById("gold2").style.display = 'none';
	document.getElementById("gold3").style.display = 'none';
	
	e = document.getElementById(id).id;
	
	if (e == "gg")
	{
		document.getElementById("gold1").style.display = 'block';
		resetView();
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
	
	e = document.getElementById(id);
	
	if (e.id == "btnshow1")
	{
		document.getElementById("tbl1").style.display = 'block';
		document.getElementById("give1").style.display = 'block';
	}
	else if (e.id == "btnshow2" || e.id == "btnhide2")
	{
		if (e.id == "btnshow2")
		{
			document.getElementById("btnhide2").style.display = 'block';
			document.getElementById("tbl2").style.display = 'block';
			e.style.display = 'none';
		}
		else
		{
			document.getElementById("btnshow2").style.display = 'block';
			document.getElementById("tbl2").style.display = 'none';
			e.style.display = 'none';
		}	
	}
	else if (e.id == "btnshow3" || e.id == "btnhide3")
	{
		if (e.id == "btnshow3")
		{
			document.getElementById("btnhide3").style.display = 'block';
			document.getElementById("tbl3").style.display = 'block';
			e.style.display = 'none';
		}
		else
		{
			document.getElementById("btnshow3").style.display = 'block';
			document.getElementById("tbl3").style.display = 'none';
			e.style.display = 'none';
		}	
	}
	else
		window.location = 'main.html';
}
function giveGoldStar(id)
{
	e = document.getElementById(id);
	
	if (e.id == "innergive1")
		document.getElementById("give2").style.display = 'block';
	if (e.id == "innergive2")
		document.getElementById("give3").style.display = 'block';
	if (e.id == "innergive3")
	{
		window.location = "results.html";
	}
}
function resetView()
{
	document.getElementById("give3").style.display = 'none';
	document.getElementById("give2").style.display = 'none';
	document.getElementById("give1").style.display = 'none';
	document.getElementById("tbl1").style.display = 'none';
}
function isEmpty(str) 
{
	// Check whether string is empty.
	for (var intLoop = 0; intLoop < str.length; intLoop++)
	   if (" " != str.charAt(intLoop))
		  return false;
	return true;
}

// function checkRequired(id) 
// {
	// alert(id.FName.value);
	// var validChars = "abcdefghijklmnopqrstuvwxyz";
	// validChars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	// var testfn = id.FName.value;
	// var testln = id.LName.value;
	// var teste = id.Email.value;
	
	// var test1isValid = false;
	// var test2isValid = false;
	// var test3isValid = false;
	
	// for (i=0;i<testfn.length;++i)
	// {
		// for (j=0; j<validChars.length;++j)
		// {
			// if testfn.charAt(i) == validChars.charAt(j)
				// test1isValid = true;
			
		// }
	// }
	
	// return false;
// }

function postJSON(id)
{	
	//alert( $("input[name=FName]").val() );
	var fn = $("input[name=FName]").val();
	var ln = $("input[name=LName]").val();
	var em = $("input[name=Email]").val();
	alert(fn+ln+em);
	//var userData = '{"firstName":"Matt","lastName":"Graham","email":"thisemail@aim.com"}';
	var userData = '{"firstName":"'+fn+'","lastName":"'+ln+'","email":"'+em+'"}';
	$.ajax({
		type: "POST",
		url: "/api/user",
		data: userData,
		contentType: "application/json",
		dataType: "json",
		complete: function(data){
			console.log(data);}
		});
		
	alert("made it to postJSON");
}

function getJSON()
{
	$.getJSON('/api/user', function(jdata){
		console.log(jdata);
		console.log(jdata.objects.length);
		console.log(jdata.objects[0]);
		for(i=0;i<jdata.objects.length;++i){
			$('#jsondump').append('First Name: '+jdata.objects[i].firstName+'.');}})
}







