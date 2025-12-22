// _dark_mode.js
// Loaded early (typically from head.html)

/* Ensure background color is set immediately to prevent white flash */
function SetThemeBackground(theme) {
    if (theme === "dark") {
        document.documentElement.style.backgroundColor = "#111111";
    } else {
        document.documentElement.style.backgroundColor = "#ffffff";
    }
}

/* Initial theme application (runs immediately) */
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

    SetThemeBackground(theme);

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add(theme);

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
// ToggleDarkMode; forceDarkMode=true to force into dark mode
// Called when the lamp icon is clicked

function ToggleDarkMode(forceDarkMode) {
    var thisTheme = forceDarkMode ? "dark" : "light";

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

    SetThemeBackground(thisTheme);

    /* Keep html class in sync with initial load logic */
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add(thisTheme);

    document.documentElement.setAttribute("data-theme", thisTheme);
    document.documentElement.style.setProperty("color-scheme", thisTheme);

    try {
        localStorage.setItem("theme", thisTheme);
    } catch (e) {
    }

    document.body.classList.toggle("dark-theme", forceDarkMode);

    /* Optional: ensure body background matches after toggle */
    if (document.body) {
        document.body.style.backgroundColor = forceDarkMode ? "#111111" : "#ffffff";
    }

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
}
