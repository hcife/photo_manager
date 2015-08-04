<?php
	function array_remove(&$arr, $offset) 
	{ 
		array_splice($arr, $offset, 1); 
	} 
	if(isset($_POST['d'])) {
	$dstPath='public/data/'.$_POST['d'].'.js';
	$srcPath='public/data/'.$_POST['s'].'.js';
	$id=$_POST['id'];
	$srcData=json_decode(file_get_contents($srcPath),true);
	$dstData=json_decode(file_get_contents($dstPath),true);
	$l=count($dstData['photo']);
	$dstData['photo'][$l]=$srcData['photo'][$id];
	array_remove($srcData['photo'],$id);
	file_put_contents($srcPath, json_encode($srcData));
	file_put_contents($dstPath, json_encode($dstData));
	}
	elseif (isset($_POST['order'])) {
		file_put_contents('public/data/list.js', json_encode($_POST));
	}
	echo('success');
	die(0);	
?>