// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})

//USER DROPDOWN
document.addEventListener('DOMContentLoaded', function() {
    var userDropdown = document.getElementById('userDropdown');
    var functiondrop = document.getElementById('functiondrop');

    userDropdown.addEventListener('click', function() {
        if (functiondrop.style.display === 'none') {
            functiondrop.style.display = 'block';
        } else {
            functiondrop.style.display = 'none';
        }
    });
});

//Hiển thị loại dữ liệu lên màn hình
document.addEventListener('DOMContentLoaded', function() {
    // Lấy div chứa media
    var mediaContainer = document.getElementById('face-data');

    // Hàm hiển thị hình ảnh
    function showImage(imageUrl) {
        mediaContainer.innerHTML = ''; // Xóa nội dung trước đó (nếu có)
        var img = document.createElement('img');
        img.src = imageUrl;
        mediaContainer.appendChild(img);
    }

    // Hàm hiển thị video
    function showVideo(videoUrl) {
        mediaContainer.innerHTML = ''; // Xóa nội dung trước đó (nếu có)
        var video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        mediaContainer.appendChild(video);
    }

    // Hàm hiển thị tệp
    function showFile(fileUrl) {
        mediaContainer.innerHTML = ''; // Xóa nội dung trước đó (nếu có)
        var fileName = document.createElement('file');
        file.src = fileUrl;
        file.controls = true;
        mediaContainer.appendChild(fileName);
    }

    // Sử dụng các hàm để hiển thị dữ liệu khi được cung cấp
    // Ví dụ: 
    var imageUrl = '../images/background.jpg';
	
    var videoUrl = '../images/Đề 10_Vũ Phong Phú.mp4';
    var fileUrl ='../images/BaoCaoUML.doc';

     //showImage(imageUrl); // Hiển thị hình ảnh
    //showVideo(videoUrl); // Hiển thị video
     showFile(fileUrl); // Hiển thị tệp
});



