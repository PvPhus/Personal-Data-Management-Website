export const clickTabData = (): void => {
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
            const targetContent = document.querySelector(`.${target}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Thêm sự kiện click cho mỗi liên kết
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn hành động mặc định (vd: theo liên kết)

            const url = link.getAttribute('href'); // Lấy URL từ thuộc tính href
            if (url) {
                window.open(url, '_blank'); // Mở URL trong tab mới
            }
        });
    });
};
