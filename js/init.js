/* file: /js/init.js */

$(document).ready(function () {
    var isMobile;
    var activeTheme;

    isMobile = $(window).width() <= 768;

    if (!window.jQuery || !jQuery.fn || !jQuery.fn.jscroll) {
        return;
    }

    if ($(".articles").length === 0) {
        return;
    }

    $(".articles").jscroll({
        debug: false,
        contentSelector: "article, .pagination",
        nextSelector: ".pagination a.next, a.next.btn",
        padding: isMobile ? 1200 : 250,
        callback: removeWrap
    });

    activeTheme = localStorage.getItem("theme");
    if (activeTheme == null || activeTheme == "dark") {
        ToggleDarkMode(true);
    }
});

function removeWrap() {
    var activeTheme;
    var forceDarkMode;
    var $newArticles;

    activeTheme = localStorage.getItem("theme");
    forceDarkMode = (activeTheme == null || activeTheme == "dark");

    $newArticles = $(".jscroll-added article");

    $newArticles.each(function () {
        this.classList.toggle("dark-theme", forceDarkMode);
    });

    /* Do not unwrap. It breaks jscroll. */

    /* If we are still near the bottom (common on mobile), re-check immediately */
    $(window).trigger("scroll.jscroll");
}
