<?php
	$inData = getRequestInfo();

	$searchTerm = isset($inData["search"]) ? "%" . $inData["search"] . "%" : "%%";
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Take in one search param and compare the like to all fields
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts 
			WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)");
		$stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
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
