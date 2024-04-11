<?php
function MaHoaAnh($imagePath){
    $encodedImage = "";
    // Đọc nội dung file ảnh
    $imageData = file_get_contents($imagePath);
    // Mã hóa dữ liệu thành chuỗi Base64
    $encodedImage = base64_encode($imageData);
    // Trả ra giá trị mã hóa
    return $encodedImage;
}
// Đường dẫn đến file ảnh
$imagePath = 'D:\Personal Data Management Website\Font_End\FE_PDM_Website\images\thungdunglego.webp';
$result1 = MaHoaAnh($imagePath);
// Hiển thị chuỗi mã hóa
echo $result1;
// Hiển thị ảnh mã hóa
echo '<img src="data:image/jpeg;base64,' . $result1 . '" alt="Encoded Image">';





// // Đường dẫn đến file Word hoặc Excel
// $filePath = 'D:\Apps\Tài Liệu\TA1.docx';

// // Đọc nội dung của file
// $fileData = file_get_contents($filePath);

// // Mã hóa dữ liệu thành chuỗi Base64
// $encodedFile = base64_encode($fileData);

// // Lưu trữ hoặc truyền chuỗi mã hóa
// // Ví dụ: Lưu chuỗi mã hóa vào cơ sở dữ liệu
// // $encodedFile có thể lưu vào cơ sở dữ liệu hoặc truyền qua mạng, tùy thuộc vào nhu cầu của bạn.

// // Giải mã và lưu vào file mới
// // $decodedFile = base64_decode($encodedFile);
// // file_put_contents('D:\Apps\Tài Liệu\decoded_TA1.docx', $decodedFile);

// // Hoặc nếu bạn muốn trực tiếp hiển thị tệp trên trang web
// echo '<iframe src="data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' . $encodedFile . '" width="100%" height="600"></iframe>';
?>
