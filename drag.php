<?php
	function array_remove(&$arr,$pos)
	{
		array_splice($arr, $pos ,1);
	}
	$dstPath='public/data/'.$_POST['d'].'.js';
	$srcPath='public/data/'.$_POST['s'].'.js';
	$id=$_POST['id'];
	$srcData=json_decode(file_get_contents($srcPath),true);
	$dstData=json_decode(file_get_contents($dstPath),true);
	$l=count($dstData);
	$dstData['photo'][$l]=$srcData['photo'][$id];
	array_remove($srcData,$id);
	file_put_contents($srcPath, json_encode($srcData));
	file_put_contents($dstPath, json_encode($dstData));
	die('success');	
?>