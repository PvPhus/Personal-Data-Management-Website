// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item => {
    const a = item.parentElement.querySelector('a:first-child');
    a.addEventListener('click', function (e) {
        e.preventDefault();

        if (!this.classList.contains('active')) {
            allDropdown.forEach(i => {
                const aLink = i.parentElement.querySelector('a:first-child');

                aLink.classList.remove('active');
                i.classList.remove('show');
            })
        }

        this.classList.toggle('active');
        item.classList.toggle('show');
    })
})


document.addEventListener('DOMContentLoaded', function () {
    var userDropdown = document.getElementById('userDropdown');
    var functiondrop = document.getElementById('functiondrop');

    userDropdown.addEventListener('click', function () {
        if (functiondrop.style.display === 'none') {
            functiondrop.style.display = 'block';
        } else {
            functiondrop.style.display = 'none';
        }
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.dataGroup > div');
    const links = document.querySelectorAll('.data-link a');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to the clicked tab and corresponding content
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.querySelector(`.${target}`).classList.add('active');
        });
    });

    // Thêm sự kiện click cho mỗi liên kết
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn hành động mặc định (vd: theo liên kết)

            const url = link.getAttribute('href'); // Lấy URL từ thuộc tính href
            window.open(url, '_blank'); // Mở URL trong tab mới
        });
    });
});




