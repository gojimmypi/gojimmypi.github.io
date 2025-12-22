$(document).ready(function () {
    $(".articles").jscroll({
        contentSelector: "article, .pagination",
        nextSelector: ".next",
        padding: 10,
        callback: removeWrap
    });

    var activeTheme = localStorage.getItem("theme");
    /* alert(_TheActiveTheme); */
    if (activeTheme == null || activeTheme == "dark") {
        ToggleDarkMode(true);
    }
});

function removeWrap() {
    var activeTheme = localStorage.getItem("theme");
    var forceDarkMode = (activeTheme == null || activeTheme == "dark");

    var $newArticles = $(".jscroll-added article");

    $newArticles.each(function () {
        this.classList.toggle("dark-theme", forceDarkMode);
    });

    $newArticles.unwrap();
}
