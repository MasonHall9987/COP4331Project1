<?php
	$inData = getRequestInfo();

	$firstName = "%" . $inData["firstName"] . "%";
	$lastName = "%" . $inData["lastName"] . "%";
	$phone = "%" . $inData["phone"] . "%";
	$email = "%" . $inData["email"] . "%";
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Search query with LIKE for partial matching
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? AND FirstName LIKE ? AND LastName LIKE ? AND Phone LIKE ? AND Email LIKE ?");
		$stmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);
		$stmt->execute();

		$result = $stmt->get_result();

		$contacts = array();
		while($row = $result->fetch_assoc()) {
			$contacts[] = $row;
		}

		$stmt->close();
		$conn->close();

		echo json_encode(array("results" => $contacts, "error" => ""));
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($err)
	{
		$retValue = '{"results":[], "error":"' . $err . '"}';
		echo $retValue;
	}
?>
