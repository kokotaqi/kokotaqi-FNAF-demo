<?php

//服务器列表信息显示
//官方接口：https//next.huya.com/serverlist_all
//正常获取成功

require_once("utils/Http.php");


$image = imagecreatetruecolor(640, 580);

$bgColor = imagecolorallocate($image, 40, 40, 40);
imagefill($image, 0, 0, $bgColor);

$progressColor = imagecolorallocate($image, 30, 30, 30);
$borderColor = imagecolorallocate($image, 80, 80, 80);
$openBgColor = imagecolorallocate($image, 100, 150, 80);
$tainBgColor = imagecolorallocate($image, 50, 130, 160);
$whiteColor = imagecolorallocate($image, 255, 255, 255);
$font = realpath("res/font.ttf");


$url = "https://next.huya.com/serverlist_all";
$headers = [];
$params = [];
$resp = httpGet($url, $headers, $params);


$max_online_num = 5000;
$i = 0;
$online_num_sum = 0;
$data = json_decode($resp, true);
foreach ($data as $item) {
    $is_show = $item["is_show"];
    $name = $item["name"];
    $online_num = $item["online_num"];
    $status = $item["status"];

    if ($is_show == 1) {
        $i++;

        list($bg_left_top_x, $bg_left_top_y) = array(120, 40 * $i);
        list($bg_right_bottom_x, $bg_right_bottom_y) = array($bg_left_top_x + $max_online_num / 10, $bg_left_top_y + 30);

        imagefilledrectangle($image, $bg_left_top_x, $bg_left_top_y, $bg_right_bottom_x, $bg_right_bottom_y, $progressColor);
        imagerectangle($image, $bg_left_top_x, $bg_left_top_y, $bg_right_bottom_x, $bg_right_bottom_y, $borderColor);
        imagettftext($image, 14, 0, 20, $bg_left_top_y + 22, $whiteColor, $font, $name);

        list($show_left_top_x, $show_left_top_y) = array($bg_left_top_x + 2, $bg_left_top_y + 2);
        list($show_right_bottom_x, $show_right_bottom_y) = array($show_left_top_x - 2 + $online_num / 10, $bg_right_bottom_y - 2);

        if ($status == 1) {
            $online_num_sum += $online_num;
            //绘制开服具体颜色+文本
            imagefilledrectangle($image, $show_left_top_x, $show_left_top_y, $show_right_bottom_x, $show_right_bottom_y, $openBgColor);
            imagettftext($image, 14, 0, 480, $bg_left_top_y + 22, $whiteColor, $font, "在线人数:" . $online_num);
        } else {
            //绘制维护具体颜色+文本
            imagefilledrectangle($image, $show_left_top_x, $show_left_top_y, $show_right_bottom_x, $show_right_bottom_y, $tainBgColor);
            imagettftext($image, 14, 0, 480, $bg_left_top_y + 22, $whiteColor, $font, "停服维护");
        }

    }

}


imagettftext($image, 14, 0, 430, 30, $whiteColor, $font, date("H:i"));
imagettftext($image, 14, 0, 480, 30, $whiteColor, $font, "总计人数:" . $online_num_sum);

$color=imagecolorallocatealpha($image,180,180,180,75);
imagettftext($image, 40, 45, 160, 400, $color, $font, "HD助手 仅供参考");


header("Content-Type: image/png");
imagepng($image);
imagedestroy($image);

?>