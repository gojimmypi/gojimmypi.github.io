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
var currentMode = "empty_currentMode";
// ToggleDarkMode; forceDarkMode=true to force into dark mode
// Called when the lamp icon is clicked

function ToggleDarkMode(forceDarkMode) {
    var getTheme = "empty_getTheme";
    try {
        localStorage.getItem("theme", getTheme);
    }
    catch (e) {

    }

    /* did we already set the desired theme? */
    if (getTheme == currentMode) {
        return;
    }

    var thisTheme = forceDarkMode ? "dark" : "light";

    var lightModeIcon = document.getElementById("lightModeIcon");
    var darkModeIcon = document.getElementById("darkModeIcon");

    if (lightModeIcon && darkModeIcon) {
        if (forceDarkMode) {
            currentMode = "dark";
            lightModeIcon.style.setProperty("display", "none");
            darkModeIcon.style.setProperty("display", "inline");
        }
        else {
            currentMode = "light";
            lightModeIcon.style.setProperty("display", "inline");
            darkModeIcon.style.setProperty("display", "none");
        }
    }
    else {
        /* missing!*/
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
    }
    catch (e) {

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
