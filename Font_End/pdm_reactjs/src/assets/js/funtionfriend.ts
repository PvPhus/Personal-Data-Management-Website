export const ClickFunctionFriend = (): void => {
    const toggleContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        const contextMenu = document.getElementById('function-friend');
        if (contextMenu) {
            const isVisible = contextMenu.style.display === 'block';
            contextMenu.style.display = isVisible ? 'none' : 'block';

            contextMenu.style.top = `${event.pageY}px`;
            contextMenu.style.left = `${event.pageX}px`;
        }
    };

    const hideContextMenu = () => {
        const contextMenu = document.getElementById('function-friend');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    };

    const button = document.getElementById('functionfriend');
    if (button) {
        button.addEventListener('click', toggleContextMenu);
    }

    document.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        const contextMenu = document.getElementById('function-friend');
        if (contextMenu && targetElement.id !== 'functionfriend' && !contextMenu.contains(targetElement)) {
            hideContextMenu();
        }
    });
};
