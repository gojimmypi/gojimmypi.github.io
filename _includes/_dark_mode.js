// _dark_mode.js
// typically included in the head.html.


//
// runs once at page load time; determines if a theme was saved, and if not, if the user has a preference
//
(function () {
	const savedTheme = localStorage.getItem('theme');
	// alert(savedTheme);
	if (savedTheme) {
		document.documentElement.className = savedTheme;
	} else {
		const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const preferredTheme = userPrefersDarkMode ? 'dark' : 'light';
		document.documentElement.className = preferredTheme;
		localStorage.setItem('theme', preferredTheme);
	}
	// alert('Saved theme = ' + savedTheme);
})();

//
// given a list of elements in [obj], toggle each of their respective darkmode
//
function SafeToggleAll(obj, forceDarkMode) {
	if (!obj || obj === null || obj === undefined) {

	}
	else {
		obj.forEach(element => {
			element.classList.toggle("dark-theme", forceDarkMode);
		});
	}
}

//
// get a list of elements for a given .ClassName or ElementName
//
function ToggleDarkModeItem(name, forceDarkMode) {
	// reminder: stati, not live NodeList, see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
	const thisElements = document.querySelectorAll(name);
	SafeToggleAll(thisElements, forceDarkMode);
}

//
// ToggleDarkMode; forceDarkMode=true to froce into dark mode
// 
function ToggleDarkMode(forceDarkMode) {
	//     if (forceDarkMode === null || forceDarkMode === undefined) {
	//forceDarkMode = false;
	//     }

	//const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	//const thisTheme = userPrefersDarkMode ? 'dark' : 'light';

	if (forceDarkMode == null) {
		forceDarkMode = true;
	}

	const savedTheme = (localStorage.getItem('theme') == 'dark') ? 'dark' : 'light';

	var lightModeIcon = document.getElementById("lightModeIcon");
	var darkModeIcon = document.getElementById("darkModeIcon");

	if (forceDarkMode) {
		thisTheme = 'dark'; // the default when never saved is dark
		lightModeIcon.style.setProperty("display", "none");
		darkModeIcon.style.setProperty("display", "inline");
	}
	else {
		thisTheme = 'light';
		lightModeIcon.style.setProperty("display", "inline");
		darkModeIcon.style.setProperty("display", "none");
    }
	document.documentElement.style.setProperty("color-scheme", thisTheme);
	localStorage.setItem('theme', thisTheme);

	document.body.classList.toggle("dark-theme", forceDarkMode);

	ToggleDarkModeItem('code', forceDarkMode);
	ToggleDarkModeItem('pre', forceDarkMode);
	ToggleDarkModeItem('nav', forceDarkMode);
	ToggleDarkModeItem('table', forceDarkMode);

	//ToggleDarkModeItem('.highlighter-rouge', forceDarkMode);
	ToggleDarkModeItem('.color-change', forceDarkMode);
	ToggleDarkModeItem('.dropdown-content', forceDarkMode);
	ToggleDarkModeItem('.logo-container', forceDarkMode);
	ToggleDarkModeItem('.sidebar', forceDarkMode);
	ToggleDarkModeItem('.authorbox', forceDarkMode); // class="authorbox"
	// ToggleDarkModeItem('.active', forceDarkMode);

	//const divClasses = document.querySelectorAll('logo-container');
	//SafeToggleAll(divClasses, forceDarkMode);

	//if (!divClasses || divClasses === null || divClasses === undefined) {
	//	// alert("No divClasses found! ");
	//}
	//else {
	//	divClasses.forEach(element => {
	//		divClasses.classList.toggle("dark-theme", forceDarkMode);
	//	});
	//}
	// set all custom <element> tages to dark mode
	// since the article element is customer (but does not have a dash in the name), we iterate all <element> tags:
	// see https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define (not used)
	//const articleClasses = document.querySelectorAll('article');
	//SafeToggleAll(articleClasses, forceDarkMode);

	ToggleDarkModeItem('article', forceDarkMode);

	//if (!articleClasses || articleClasses === null || articleClasses === undefined) {

	//}
	//else {
	//	articleClasses.forEach(element => {
	//		element.classList.toggle("dark-theme", forceDarkMode);
	//	});
	//}

	// const sidebarClasses = document.querySelectorAll('sidebar')


	// page should be in dark mode now		
}

var _HideForChange = localStorage.getItem('theme');
if (_HideForChange == null || _HideForChange == "dark") {
	// while we toggle dark mode, hide the page to avoid blinking / flashing
	document.documentElement.style.setProperty("visibility", "hidden");
}


//$(window).on('load', function () {
//	// alert(1);
//	var _TheActiveTheme = localStorage.getItem('theme');
//	/* alert(_TheActiveTheme); */
//	if (_TheActiveTheme == null || _TheActiveTheme == "dark") {
//		ToggleDarkMode(true)
//	}
//	// document.documentElement.style.setProperty("visibility", "visible");
//});
