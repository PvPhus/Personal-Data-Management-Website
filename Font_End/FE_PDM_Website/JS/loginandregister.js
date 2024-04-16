document.addEventListener('DOMContentLoaded', function () {
    // Get the tab elements
    var tabs = document.querySelectorAll('.nav-link');

    // Add click event listener to each tab
    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Remove 'active' class from all tabs
            tabs.forEach(function (t) {
                t.classList.remove('active');
            });

            // Add 'active' class to the clicked tab
            tab.classList.add('active');

            // Show the corresponding tab content
            var target = tab.getAttribute('href');
            document.querySelectorAll('.tab-pane').forEach(function (pane) {
                pane.classList.remove('show', 'active');
            });
            document.querySelector(target).classList.add('show', 'active');
        });
    });
});
