<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
if(($handle = fopen('./data.csv', 'r')) !== FALSE) {
    $data = array();
    while($row = fgetcsv($handle, null, '|')) {
        array_push($data, $row);
    };
    fclose($handle);
    file_put_contents('./data-json.csv', json_encode($data));
};
