// Add event listeners to each AddContact field
window.addEventListener("load", function () {
  document.getElementById("contactFirstName").addEventListener("input", function () {
    validateInput(this, "text");
  });

  document.getElementById("contactLastName").addEventListener("input", function () {
    validateInput(this, "text");
  });

  document.getElementById("contactPhone").addEventListener("input", function () {
    validateInput(this, "phoneNum");
  });

  document.getElementById("contactEmail").addEventListener("input", function () {
    validateInput(this, "email");
  });
});

function addContact() { 
    // Ensure all fields are valid
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

                    // element.classList.remove("input-valid", "input-invalid");

                    // Clear all fields
                    resetAddContactFields("contactFirstName");
                    resetAddContactFields("contactLastName");
                    resetAddContactFields("contactPhone");
                    resetAddContactFields("contactEmail");
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

function handleSearch()
{
	let searchTerm = document.getElementById("searchInput").value;
	searchContact(searchTerm);
}

function searchContact(searchTerm = "") {
  document.getElementById("searchResults").innerHTML = "";

  let tmp = { search: searchTerm, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);

        if (!jsonObject.results || jsonObject.results.length === 0) {
          document.getElementById("searchResults").innerHTML = "No contacts found.";
          return;
        }

        let tableHTML = `
          <table class="contact-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
        `;

        for (let i = 0; i < jsonObject.results.length; i++) {
          const contact = jsonObject.results[i];
          tableHTML += `
            <tr>
              <td>${contact.FirstName} ${contact.LastName}</td>
              <td>${contact.Phone}</td>
              <td>${contact.Email}</td>
              <td>
                <button class="edit-btn" onclick="editContact(${contact.ID})">Edit</button>
                <button class="delete-btn" onclick="deleteContact(${contact.ID})">Delete</button>
              </td>
            </tr>
          `;
        }

        tableHTML += `
            </tbody>
          </table>
        `;

        document.getElementById("searchResults").innerHTML = tableHTML;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("searchResults").innerHTML = err.message;
  }
}

function editContact() {

}

function deleteContact() {

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