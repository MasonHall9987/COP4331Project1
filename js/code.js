const urlBase = 'http://cop4331project.online/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

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
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup()
{
	let firstName = document.getElementById("signupFirstName").value;
	let lastName = document.getElementById("signupLastName").value;
	let login = document.getElementById("signupLogin").value;
	let password = document.getElementById("signupPassword").value;

	document.getElementById("signupResult").innerHTML = "";

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
					document.getElementById("signupResult").innerHTML = jsonObject.error;
					return;
				}

				document.getElementById("signupResult").innerHTML = "Signup successful! Please log in.";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
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

// Tab switching functions for login/register forms
function initializeTabSwitching() {
	loginTab();
}

function loginTab() {
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
	const loginBtn = document.getElementById("loginbtn");
	const registerBtn = document.getElementById("registerbtn");
	const loginForm = document.getElementById("login");
	const registerForm = document.getElementById("register");

	loginForm.className = loginForm.className.replace(/form-hide-left|form-show-left/g, '').trim() + ' form-hide-left';
	registerForm.className = registerForm.className.replace(/form-hide-right|form-show-right/g, '').trim() + ' form-show-right';
	registerBtn.className = registerBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-active';
	loginBtn.className = loginBtn.className.replace(/btn-active|btn-inactive|btn-white|btn/g, '').trim() + ' btn-inactive';
}

/* function for dashboard.html */
    function logout() {
      alert("Logging out...");
      window.location.href = "index.html";
    }

    function addContact() {
      const firstName = document.getElementById("contactFirstName").value;
      const lastName = document.getElementById("contactLastName").value;
      const phone = document.getElementById("contactPhone").value;
      const email = document.getElementById("contactEmail").value;

      if (!firstName || !lastName || !phone || !email) {
        alert("Please fill in all fields.");
        return;
      }

      alert(`Contact added: ${firstName} ${lastName}`);
    }

    function searchContact() {
      const query = document.getElementById("searchInput").value.trim();

      if (!query) {
        alert("Please enter a search term.");
        return;
      }

      const resultsBox = document.getElementById("searchResults");
      resultsBox.innerHTML = `<p>Searching for: <strong>${query}</strong></p>`;
    }

    function showAddContact() {
      hideAllSections();
      document.getElementById("add-contact").classList.remove("hidden");
      document.getElementById("add-contact").scrollIntoView({ behavior: "smooth" });
    }

    function showSearchContact() {
      hideAllSections();
      document.getElementById("search-contact").classList.remove("hidden");
      document.getElementById("search-contact").scrollIntoView({ behavior: "smooth" });
    }

    function showAbout() {
      hideAllSections();
      document.getElementById("about").classList.remove("hidden");
      document.getElementById("about").scrollIntoView({ behavior: "smooth" });
    }

    function hideAllSections() {
      document.getElementById("add-contact").classList.add("hidden");
      document.getElementById("search-contact").classList.add("hidden");
      document.getElementById("about").classList.add("hidden");
    }
 
