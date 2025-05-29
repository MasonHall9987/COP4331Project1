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
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
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

function addContact()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension; // Adjust URL to your PHP endpoint

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let response = JSON.parse(xhr.responseText);
                if(response.error === "")
                    document.getElementById("contactAddResult").innerHTML = "Contact has been added";
                else
                    document.getElementById("contactAddResult").innerHTML = "Error: " + response.error;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search: srch, userId: userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);
				
				if (jsonObject.error && jsonObject.error !== "") {
					document.getElementById("contactSearchResult").innerHTML = "Error: " + jsonObject.error;
					return;
				}

				for (let i = 0; i < jsonObject.results.length; i++) {
					let c = jsonObject.results[i];
					contactList += c.FirstName + " " + c.LastName + " - " + c.Phone + " - " + c.Email;
					if (i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementById("contactSearchResult").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
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

	// Your existing readCookie function (with cookie parsing fix)
function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split("; ");

    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "contact.html"; // redirect to login
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

// Your readContacts function that uses the userId set by readCookie
function readContacts() {
    readCookie(); // ensure userId is set from cookies

    if (userId < 0) {
        return; // user not logged in, no need to continue
    }

    let tmp = { userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/ReadContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            // Handle the contacts display here using jsonObject
            let contactsList = "";
            for (let i = 0; i < jsonObject.results.length; i++) {
                let c = jsonObject.results[i];
                contactsList += `${c.FirstName} ${c.LastName} - ${c.Phone} - ${c.Email}<br>`;
            }
            document.getElementById("contacts").innerHTML = contactsList;
        }
    };

    xhr.send(jsonPayload);


}

function deleteContact(contactId) {
    document.getElementById("deleteResult").innerHTML = "";

    let tmp = { id: contactId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error === "") {
                        document.getElementById("deleteResult").innerHTML = jsonObject.message || "Contact deleted successfully.";
                        // Optionally refresh the contact list here
                    } else {
                        document.getElementById("deleteResult").innerHTML = "Error: " + jsonObject.error;
                    }
                } else {
                    document.getElementById("deleteResult").innerHTML = "Request failed: " + this.statusText;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
}


