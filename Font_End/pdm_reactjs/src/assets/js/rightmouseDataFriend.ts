export const clickRightMouseFriend = (): void => {
    // Function to show custom context menu
    const showContextMenu = (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;

        // Hide both menus initially
        hideContextMenu();
        hideContextMenuMessage();

        // Check if the right-clicked element is 'mediaContainer'
        if (targetElement.id === 'mediaContainer') {
            event.preventDefault();
            event.stopPropagation();

            const contextMenu = document.getElementById('contextMenuData');
            if (contextMenu) {
                contextMenu.style.top = `${event.pageY}px`;
                contextMenu.style.left = `${event.pageX}px`;
                contextMenu.style.display = 'block';
            }
        }

        if (targetElement.id === 'messageSender') {
            event.preventDefault();
            event.stopPropagation();

            const contextMenuMessage = document.getElementById('contextMenuMessage');
            if (contextMenuMessage) {
                contextMenuMessage.style.top = `${event.pageY}px`;
                contextMenuMessage.style.left = `${event.pageX}px`;
                contextMenuMessage.style.display = 'block';
            }
        }
    };

    // Function to hide custom context menu for 'mediaContainer'
    const hideContextMenu = () => {
        const contextMenu = document.getElementById('contextMenuData');
        if (contextMenu) {
            contextMenu.style.display = 'none';
        }
    };

    //Function to hide custom context menu for 'messageUser'
    const hideContextMenuMessage = () => {
        const contextMenuMessage = document.getElementById('contextMenuMessage');
        if (contextMenuMessage) {
            contextMenuMessage.style.display = 'none';
        }
    };

    // Attach event listener for context menu (right-click) events on the document
    document.addEventListener('contextmenu', showContextMenu);

    // Attach event listener to hide both context menus on any click
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('click', hideContextMenuMessage);
};

// Ensure the function runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', clickRightMouseFriend);