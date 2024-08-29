export const clickTopbar = (): void => {
    const userDropdown = document.getElementById('userDropdown');
    const functiondrop = document.getElementById('functiondrop');

    if (userDropdown && functiondrop) {
        let isDropdownVisible = false;

        const toggleDropdown = (event: MouseEvent) => {
            event.stopPropagation(); // Prevent the event from bubbling up to the document
            isDropdownVisible = !isDropdownVisible;
            functiondrop.style.display = isDropdownVisible ? 'block' : 'none';
        };

        const hideDropdown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!userDropdown.contains(target) && !functiondrop.contains(target)) {
                functiondrop.style.display = 'none';
                isDropdownVisible = false;
            }
        };

        userDropdown.addEventListener('click', toggleDropdown);
        document.addEventListener('click', hideDropdown);
    } else {
        console.error('Element with id "userDropdown" or "functiondrop" not found');
    }
};
