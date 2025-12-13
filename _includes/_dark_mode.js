// _dark_mode.js
// typically included in the head.html.

(function () {
    var key = "theme";
    var savedTheme = null;
    var theme = "dark";

    try {
        savedTheme = localStorage.getItem(key);
    } catch (e) {
        savedTheme = null;
    }
    // alert('Saved theme = ' + savedTheme);
    if (savedTheme === "dark" || savedTheme === "light") {
        theme = savedTheme;
    } else if (window.matchMedia) {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        try {
            localStorage.setItem(key, theme);
        } catch (e2) {
        }
    }

    document.documentElement.className = theme;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("color-scheme", theme);
})();

function SafeToggleAll(obj, forceDarkMode) {
    if (!obj || obj === null || obj === undefined) {
        return;
    }

    obj.forEach(function (element) {
        element.classList.toggle("dark-theme", forceDarkMode);
    });
}
//
// get a list of elements for a given .ClassName or ElementName
//
function ToggleDarkModeItem(name, forceDarkMode) {
    var thisElements = document.querySelectorAll(name);
    SafeToggleAll(thisElements, forceDarkMode);
}
//
// ToggleDarkMode; forceDarkMode=true to froce into dark mode
//
function ToggleDarkMode(forceDarkMode) {
    var thisTheme = "dark";

    if (forceDarkMode == null) {
        forceDarkMode = true;
    }

    if (forceDarkMode) {
        thisTheme = "dark";
    } else {
        thisTheme = "light";
    }

    var lightModeIcon = document.getElementById("lightModeIcon");
    var darkModeIcon = document.getElementById("darkModeIcon");

    if (lightModeIcon && darkModeIcon) {
        if (forceDarkMode) {
            lightModeIcon.style.setProperty("display", "none");
            darkModeIcon.style.setProperty("display", "inline");
        } else {
            lightModeIcon.style.setProperty("display", "inline");
            darkModeIcon.style.setProperty("display", "none");
        }
    }

    document.documentElement.setAttribute("data-theme", thisTheme);
    document.documentElement.style.setProperty("color-scheme", thisTheme);

    try {
        localStorage.setItem("theme", thisTheme);
    } catch (e) {
    }

    document.body.classList.toggle("dark-theme", forceDarkMode);

    ToggleDarkModeItem("code", forceDarkMode);
    ToggleDarkModeItem("pre", forceDarkMode);
    ToggleDarkModeItem("nav", forceDarkMode);
    ToggleDarkModeItem("table", forceDarkMode);
    ToggleDarkModeItem(".color-change", forceDarkMode);
    ToggleDarkModeItem(".dropdown-content", forceDarkMode);
    ToggleDarkModeItem(".logo-container", forceDarkMode);
    ToggleDarkModeItem(".sidebar", forceDarkMode);
    ToggleDarkModeItem(".authorbox", forceDarkMode);
    ToggleDarkModeItem("article", forceDarkMode);

    /* Critical: never leave the page hidden after a toggle */
    document.documentElement.style.setProperty("visibility", "visible");
}

/* Hide only until DOMContentLoaded to prevent a flash, then always show */
(function () {
    var hideForChange = null;

    try {
        hideForChange = localStorage.getItem("theme");
    } catch (e) {
        hideForChange = null;
    }

    if (hideForChange == null || hideForChange === "dark") {
        document.documentElement.style.setProperty("visibility", "hidden");
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.documentElement.style.setProperty("visibility", "visible");
    });
})();
