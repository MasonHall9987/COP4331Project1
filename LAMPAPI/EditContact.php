<?php
	$inData = getRequestInfo();

	$id = $inData["id"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];

	// Check if all required parameters are provided
	if (empty($id) || empty($firstName) || empty($lastName) || empty($phone) || empty($email)) {
		returnWithError("Missing required parameters");
		return;
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// First check if the contact exists
		$checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ?");
		$checkStmt->bind_param("i", $id);
		$checkStmt->execute();
		$checkResult = $checkStmt->get_result();
		
		if ($checkResult->num_rows == 0) {
			$checkStmt->close();
			$conn->close();
			returnWithError("Contact not found");
			return;
		}
		$checkStmt->close();

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $id);
		
		if ($stmt->execute()) {
			if ($stmt->affected_rows > 0) {
				echo json_encode(array("error" => "", "message" => "Contact updated successfully"));
			} else {
				returnWithError("No changes made to contact");
			}
		} else {
			returnWithError("Failed to update contact");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		echo $retValue;
	}
?> 