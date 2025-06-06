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
    // Store only numerical portion of phone number
    const phone = document.getElementById("contactPhone").value.replace(/\D/g, "");;
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

function resetAddContactFields(id) {
    const temp = document.getElementById(id);
    temp.value = "";
    temp.classList.remove("input-valid", "input-invalid");
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

            // Attempt to format the phone number 
            const digits = contact.Phone.replace(/\D/g, "");
            const formattedPhone = digits.length === 10
                ? `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`
                : contact.Phone; 

            // Make display fields disabled input boxes for editing
            tableHTML += `
            <tr id="row-${contact.ID}">
              <td>
                <div class="name-fields">
                  <input id="firstName-${contact.ID}" value="${contact.FirstName}" disabled />
                  <input id="lastName-${contact.ID}" value="${contact.LastName}" disabled />
                </div>
              </td>

                <td>
                  <input id="phone-${contact.ID}" value="${formattedPhone}" disabled />
                </td>

                <td>
                  <input id="email-${contact.ID}" value="${contact.Email}" disabled />
                </td>

                <td id="manage-${contact.ID}">
                  <button class="edit-btn" onclick="editContact(${contact.ID})">Edit</button>
                  <button class="delete-btn" onclick="deleteContact(${contact.ID}, 
                    '${contact.FirstName}', '${contact.LastName}')">Delete</button>
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

// Global object to store contact being currently edited
const editCache = {};

function editContact(id) {
  // Store contact in the cache
  editCache[id] = {
    FirstName: document.getElementById(`firstName-${id}`).value,
    LastName: document.getElementById(`lastName-${id}`).value,
    Phone: document.getElementById(`phone-${id}`).value,
    Email: document.getElementById(`email-${id}`).value,
  };

  // Enable input fields for in-place editing
  document.getElementById(`firstName-${id}`).disabled = false;
  document.getElementById(`lastName-${id}`).disabled = false;
  document.getElementById(`phone-${id}`).disabled = false;
  document.getElementById(`email-${id}`).disabled = false;

  // Replace buttons with confirm and cancel
  const td = document.getElementById(`manage-${id}`);

  td.innerHTML = `
    <button onclick="confirmEdit(${id})">Confirm</button>
    <button onclick="cancelEdit(${id})">Cancel</button>
  `;
}

function confirmEdit(id) {
  // Fetch user's input
  const firstName = document.getElementById(`firstName-${id}`).value.trim();
  const lastName = document.getElementById(`lastName-${id}`).value.trim();
  const phone = document.getElementById(`phone-${id}`).value.replace(/\D/g, "");
  const email = document.getElementById(`email-${id}`).value.trim();

  /* To do: validate input */

  const tmp = {
    id,
    firstName,
    lastName,
    phone,
    email
  }

  const payload = JSON.stringify(tmp);
  const url = urlBase + "/EditContact." + extension;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        
        const res = JSON.parse(xhr.responseText);
        if (res.error === "") {
          alert("Successfully updated contact!");
          // Remove deleted contact info from the cache
          delete editCache[id];
          // Preserve the user's current search term
          const currentTerm = document.getElementById("searchInput").value;
          searchContact(currentTerm);
        }
        else 
          alert("Error: " + res.error);
      }
    };
  }
  catch (error) {
    alert("Error editing contact: " + error.message);
  }
}

function cancelEdit(id) {

 const record = editCache[id];

  if (!record) {
    console.warn(`Unable to restore info for contact ID ${id}`);
    return;
  }

  // Restore the contact's info in case user had modified it
  document.getElementById(`firstName-${id}`).value = record.FirstName;
  document.getElementById(`lastName-${id}`).value = record.LastName;
  document.getElementById(`phone-${id}`).value = record.Phone;
  document.getElementById(`email-${id}`).value = record.Email;

  // Delete stored contact info
  delete editCache[id];

  // Disable the input fields
  document.getElementById(`firstName-${id}`).disabled = true;
  document.getElementById(`lastName-${id}`).disabled = true;
  document.getElementById(`phone-${id}`).disabled = true;
  document.getElementById(`email-${id}`).disabled = true;

  // Restore the action buttons (Edit / Delete)
  const td = document.getElementById(`manage-${id}`);
  td.innerHTML = `
    <button class="edit-btn" onclick="editContact(${id})">Edit</button>
    <button class="delete-btn" onclick="deleteContact(${id})">Delete</button>
  `;

}

function deleteContact(contactId, fName, lName) {
  // Prompt user to confirm deletion
  let txt = "Are you sure you want to delete " + fName + " " + lName + "?";
  if (!confirm(txt)) 
    return;

  // Prepare API call
  let tmp = {id : contactId};
  let payload = JSON.stringify(tmp);
  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
      
        let res = JSON.parse(xhr.responseText);
        // Refresh contacts after deletion
        if (res.error === "") {
          // Preserve the user's current search term
          const currentTerm = document.getElementById("searchInput").value;
          searchContact(currentTerm);
        }

        else 
          alert("Error deleting contact: " + res.error);

      }
    };

    xhr.send(payload);
  }
  catch (error) {
    alert("Error deleting contact: " + error.message);
  }
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