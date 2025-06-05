function addContact() {
    // // Load userId from cookie
    // readCookie();

    const isValid =
        validateInput(document.getElementById("contactFirstName"), "text") &&
        validateInput(document.getElementById("contactLastName"), "text") &&
        validateInput(document.getElementById("contactPhone"), "phoneNum") &&
        validateInput(document.getElementById("contactEmail"), "email");

    if (!isValid) {
        alert("Unable to add new contact. Please correct invalid input.");
        return;
    }

    // Fetch user's input
    const firstName = document.getElementById("contactFirstName").value;
    const lastName = document.getElementById("contactLastName").value;
    const phone = document.getElementById("contactPhone").value;
    const email = document.getElementById("contactEmail").value;


    // // Reject empty fields
    // if (!firstName || !lastName || !phone || !email) {
    //     alert("Please fill in all fields.");
    //     return;
    // }

    // Prepare API call
    let tmp = {
        firstName : firstName,
        lastName : lastName,
        phone : phone,
        email : email,
        userId : userId
    };

    let payload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) {

                let obj = JSON.parse(xhr.responseText);

                if (obj.error) {
                    alert("Error adding contact: " + obj.error);
                }

                else {
                    alert("'" + firstName + " " + lastName + "' added to contacts!");

                    // Clear all fields
                    document.getElementById("contactFirstName").value = "";
                    document.getElementById("contactLastName").value = "";
                    document.getElementById("contactPhone").value = "";
                    document.getElementById("contactEmail").value = "";
                }
            }
        };

        xhr.send(payload);
    }

    catch (error) {
        alert("Failed request: " + error.message);
    }
}

function validateInput(element, type) {

    // Store user's input
    const content = element.value.trim();

    // Assume invalid input
    let validity = false;



    if (type === "text") {
        validity = content.length >= 2;
    }
    else if (type === "phoneNum") {
        // Remove non-numeric portion of phone numbers
        const digits = content.replace(/\D/g, "");
        validity = digits.length === 10;
    }
    else if (type === "email") {
        // Ensure emails follow {text}@{text}.{text}
        const validPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validity = validPattern.test(content);
    }

    element.classList.remove("input-valid", "input-invalid");

    if (content !== "") {
        // Assign the element a class based on its validity
        element.classList.add(validity ? "input-valid" : "input-invalid");
    }

    return validity;
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
    // Run initial search when showing the search section
    searchContact();
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