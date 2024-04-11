<?php
// MÃ HÓA TEXT

// Chuỗi cần kiểm tra
$textToCheck = "HelloWorld";

// Mã hóa chuỗi
$hashedText = password_hash($textToCheck, PASSWORD_DEFAULT);

// Hiển thị chuỗi đã mã hóa
echo "Chuỗi đã mã hóa: " . $hashedText;

// Chuỗi đã mã hóa (lấy từ cơ sở dữ liệu hoặc nguồn khác)
$hashedTextFromDatabase = $hashedText;

// Loại bỏ khoảng trắng ở đầu và cuối chuỗi
$hashedTextFromDatabase = trim($hashedTextFromDatabase);

// Kiểm tra chuỗi có khớp hay không
if (password_verify($textToCheck, $hashedTextFromDatabase)) {
    echo "<br>Chuỗi khớp!";
} else {
    echo "<br>Chuỗi không khớp!";
}
?>