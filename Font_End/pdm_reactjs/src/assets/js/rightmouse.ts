export const clickRightMouse = (): void => {
    // Function to show custom context menu
    const showContextMenu = (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        // Check if the right-clicked element is img, video, or iframe
        if (targetElement.id === 'mediaContainer') {
            event.preventDefault();

            const contextMenu = document.getElementById('contextMenu');
            if (contextMenu) {
                contextMenu.style.top = `${event.pageY}px`;
                contextMenu.style.left = `${event.pageX}px`;
                contextMenu.style.display = 'block';
            }
        }
    };

    // Function to hide custom context menu
    const hideContextMenu = () => {
        const contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    };

    // Attach event listener for context menu (right-click) events on the document
    document.addEventListener('contextmenu', showContextMenu);

    // Attach event listener to hide context menu on any click
    document.addEventListener('click', hideContextMenu);
};

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', clickRightMouse);
