<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	if (!isset($userId)) {
		returnWithError("Missing required parameter: userId");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
		exit();
	} 

	// Base query
	$query = "SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ?";
	$params = array();
$types = "i"; // userId is always required, integer type
$params[] = $userId;

	// Optional filters
	if (!empty($inData["firstName"])) {
		$query .= " AND FirstName LIKE ?";
		$types .= "s";
		$params[] = "%" . $inData["firstName"] . "%";
	}
	if (!empty($inData["lastName"])) {
		$query .= " AND LastName LIKE ?";
		$types .= "s";
		$params[] = "%" . $inData["lastName"] . "%";
	}
	if (!empty($inData["phone"])) {
		$query .= " AND Phone LIKE ?";
		$types .= "s";
		$params[] = "%" . $inData["phone"] . "%";
	}
	if (!empty($inData["email"])) {
		$query .= " AND Email LIKE ?";
		$types .= "s";
		$params[] = "%" . $inData["email"] . "%";
	}

	// Prepare and bind
	$stmt = $conn->prepare($query);
	if ($stmt === false) {
		returnWithError("SQL Prepare failed: " . $conn->error);
		exit();
	}

	$stmt->bind_param($types, ...$params);
	$stmt->execute();
	$result = $stmt->get_result();

	$contacts = array();
	while($row = $result->fetch_assoc()) {
		$contacts[] = $row;
	}

	$stmt->close();
	$conn->close();

	echo json_encode(array("results" => $contacts, "error" => ""));

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError($err)
	{
		echo json_encode(array("results" => [], "error" => $err));
	}
?>
