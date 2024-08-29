export const clickSidebar = (): void => {
    const clickDropdown = document.getElementById('clickDropdown');
    const sideDropdown = document.getElementById('sideDropdown');

    if (clickDropdown && sideDropdown) {
        let isDropdownVisible = false;

        const toggleDropdown = () => {  
            if (isDropdownVisible) {
                sideDropdown.style.display = 'none';
                isDropdownVisible = false;
            } else {
                sideDropdown.style.display = 'block';
                isDropdownVisible = true;
            }
        };

        // Bắt sự kiện click vào myGroupsToggle để toggle hiển thị sideDropdown
        clickDropdown.addEventListener('click', toggleDropdown);

        // Bắt sự kiện click ra ngoài để ẩn sideDropdown
        document.addEventListener('click', (event) => {
            const target = event.target as Node;
            if (!clickDropdown.contains(target) && !sideDropdown.contains(target)) {
                sideDropdown.style.display = 'none';
                isDropdownVisible = false;
            }
        });
    } else {
        console.error('Element with id "clickDropdown" or "sideDropdown" not found');
    }
};