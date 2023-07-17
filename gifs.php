<?php
$directory = 'gifs/';
$gifFiles = array_diff(scandir($directory), array('..', '.'));

$response = array();
foreach ($gifFiles as $gifFile) {
    $response[] = $directory . $gifFile;
}

header('Content-Type: application/json');
echo json_encode(array('gifs' => $response));
exit();
?>
