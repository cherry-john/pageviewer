<?php
if (!isset($_POST['url'])){
    die(json_encode(["status" => 404]));
}
$page = file_get_contents($_POST['url']);

die(json_encode(["status" => 200, "data" => $page]));