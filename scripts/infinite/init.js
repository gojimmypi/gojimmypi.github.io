$(document).ready(function () {
	$('.articles').jscroll({
		contentSelector: 'article, .pagination',
		nextSelector: '.next',
		padding: 10,
		callback: removeWrap,
	});

	var _TheActiveTheme = localStorage.getItem('theme');
	/* alert(_TheActiveTheme); */
	if (_TheActiveTheme == null || _TheActiveTheme == "dark") {
		ToggleDarkMode(true)
	}

	// TODO find a way to override 0.3seconf transition delay at startup
	setTimeout(function () {
		document.documentElement.style.setProperty("visibility", "visible");
	}, 320); // a complete hack, but the default transition is 0.3sec, so we wait to avoid the blink :/
});

function removeWrap() {
	var thisTheme = document.documentElement.style.getPropertyValue("color-scheme");
	const thisElements = $('.jscroll-added article');
	var forceDarkMode = (thisTheme == 'dark');
	for (i = 0; i < thisElements.length; i++) {
		thisElements[i].classList.toggle("dark-theme", forceDarkMode);
	}

	$('.jscroll-added article').unwrap();
}
