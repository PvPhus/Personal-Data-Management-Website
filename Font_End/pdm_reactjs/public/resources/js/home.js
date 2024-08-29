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

