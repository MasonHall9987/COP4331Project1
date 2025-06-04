const urlBase = 'http://cop4331project.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = -1;
	firstName = "";
	lastName = "";

	const res = document.getElementById("loginResult");
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	if (login.trim() === "" || password.trim() === "") 
	{
		res.innerHTML("Please fill out all fields.");
		return;
	}


//	var hash = md5( password );
	
	res.innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					res.innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "dashboard.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		res.innerHTML = err.message;
	}

}

function doSignup()
{
	const res = document.getElementById("signupResult");
	res.className = "alert";

	let firstName = document.getElementById("signupFirstName").value;
	let lastName = document.getElementById("signupLastName").value;
	let login = document.getElementById("signupLogin").value;
	let password = document.getElementById("signupPassword").value;

	// Ensure fields are nonempty
	if (firstName.trim() === "" || lastName.trim() === "" || login.trim() === "" ||
		password.trim() === "") 
	{
		res.innerHTML = "Please fill out all fields.";
		return;
	}

	//document.getElementById("signupResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		login: login,
		password: password
	};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Signup.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error !== "")
				{
					res.innerHTML = jsonObject.error;
					return;
				}

				res.className = "alert success";
				res.innerHTML = "Sign up successful! Please log in.";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{	
		res.innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function searchContact(searchTerm = "")
{
	document.getElementById("searchResults").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:searchTerm, userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResults").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName;
					contactList += "<br />Phone: " + jsonObject.results[i].Phone;
					contactList += "<br />Email: " + jsonObject.results[i].Email;
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br /><br />";
					}
				}
				
				document.getElementById("searchResults").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResults").innerHTML = err.message;
	}
}

function handleSearch()
{
	let searchTerm = document.getElementById("searchInput").value;
	searchContact(searchTerm);
}

// Tab switching functions for login/register forms
function initializeTabSwitching() {
	loginTab();
}

function loginTab() {
	setTimeout(() => {
                document.getElementById("signupResult").innerHTML = "";
            }, 500);	

	const loginBtn = document.getElementById("loginbtn");
	const registerBtn = document.getElementById("registerbtn");
	const loginForm = document.getElementById("login");
	const registerForm = document.getElementById("register");

	loginForm.className = loginForm.className.replace(/form-hide-left|form-show-left/g, '').trim() + ' form-show-left';
	registerForm.className = registerForm.className.replace(/form-hide-right|form-show-right/g, '').trim() + ' form-hide-right';
	
	loginBtn.className = loginBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-active';
	registerBtn.className = registerBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-inactive';

}

function registerTab() {
 	// Remove login alert if user switches to sign up tab
	setTimeout(() => {
                document.getElementById("loginResult").innerHTML = "";
            }, 500);
		
	const loginBtn = document.getElementById("loginbtn");
	const registerBtn = document.getElementById("registerbtn");
	const loginForm = document.getElementById("login");
	const registerForm = document.getElementById("register");

	loginForm.className = loginForm.className.replace(/form-hide-left|form-show-left/g, '').trim() + ' form-hide-left';
	registerForm.className = registerForm.className.replace(/form-hide-right|form-show-right/g, '').trim() + ' form-show-right';
	registerBtn.className = registerBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-active';
	loginBtn.className = loginBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-inactive';

}