export const clickTopbar = (): void => {
    const userDropdown = document.getElementById('userDropdown');
    const functiondrop = document.getElementById('functiondrop');

    if (userDropdown && functiondrop) {
        let isDropdownVisible = false;

        userDropdown.addEventListener('click', () => {
            if (isDropdownVisible) {
                functiondrop.style.display = 'none';
                isDropdownVisible = false;
            } else {
                functiondrop.style.display = 'block';
                isDropdownVisible = true;
            }
        });

        // Lặp qua từng phần tử có className là dropdown-item và thêm sự kiện click
        const dropdownItems = functiondrop.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                // Ẩn functiondrop khi click vào dropdown-item
                functiondrop.style.display = 'none';
                isDropdownVisible = false;
            });
        });
    } else {
        console.error('Element with id "userDropdown" or "functiondrop" not found');
    }
};