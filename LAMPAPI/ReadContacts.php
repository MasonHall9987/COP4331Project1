<?php
$inData = getRequestInfo();
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ?");
    $stmt->bind_param("i", $userId);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $contacts = array();

        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
        $stmt->close();
        $conn->close();
        returnWithInfo($contacts);
    } else {
        returnWithError($stmt->error);
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($contacts) {
    $retValue = '{"results":' . json_encode($contacts) . ',"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
