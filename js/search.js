// file: /js/search.js

(function () {
    var baseUrl;
    baseUrl = window.SITE_BASEURL || "";

    /* /search/ page widgets (optional) */
    var boxPage;
    var resultsPage;
    var statusPage;
    var tagsOnlyPage;

    boxPage = document.getElementById("searchBoxPage");
    resultsPage = document.getElementById("searchResultsPage");
    statusPage = document.getElementById("searchStatusPage");
    tagsOnlyPage = document.getElementById("searchTagsOnlyPage");

    /* Header widgets (optional) */
    var containerHeader;
    var boxHeader;
    var resultsHeader;
    var statusHeader;
    var backdropHeader;
    var tagsOnlyHeader;

    containerHeader = document.getElementById("headerSearchContainer");
    boxHeader = document.getElementById("searchBox");
    resultsHeader = document.getElementById("searchResults");
    statusHeader = document.getElementById("searchStatus");
    tagsOnlyHeader = document.getElementById("searchTagsOnlyHeader");
    backdropHeader = null;

    if (containerHeader) {
        backdropHeader = containerHeader.querySelector(".header-search__backdrop");
    }

    /* Prefer the /search/ page widgets if they exist */
    var box;
    var results;
    var status;
    var tagsOnly;

    box = boxPage || boxHeader;
    results = resultsPage || resultsHeader;
    status = statusPage || statusHeader;
    tagsOnly = tagsOnlyPage || tagsOnlyHeader;

    if (!box || !results || !status) {
        return;
    }

    /* Optional focus icon (header) */
    var icon;
    icon = document.getElementById("searchFocusIcon");

    if (icon) {
        icon.addEventListener("click", function () {
            box.focus();
        });
    }

    function setStatus(text) {
        status.textContent = text || "";
    }

    function clearResults() {
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }
    }

    function tokenize(q) {
        return (q || "")
            .toLowerCase()
            .split(/\s+/)
            .map(function (s) { return s.trim(); })
            .filter(function (s) { return s.length >= 2; });
    }

    function isTagsOnlyEnabled() {
        if (!tagsOnly) {
            return false;
        }
        return !!tagsOnly.checked;
    }

function scoreItem(item, terms, tagsOnlyMode) {
    var title;
    var tags;
    var cats;
    var excerpt;
    var score;
    var i;
    var t;

    title = (item.title || "").toLowerCase();
    tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
    cats = Array.isArray(item.categories) ? item.categories.join(" ").toLowerCase() : "";
    excerpt = (item.excerpt || "").toLowerCase();

    score = 0;

    for (i = 0; i < terms.length; i += 1) {
        t = terms[i];
        if (!t) {
            continue;
        }

        if (tagsOnlyMode) {
            if (tags.indexOf(t) >= 0) {
                score += 10;
            }
            continue;
        }

        if (title.indexOf(t) >= 0) {
            score += 10;
        }
        if (excerpt.indexOf(t) >= 0) {
            score += 5;
        }
        if (tags.indexOf(t) >= 0) {
            score += 4;
        }
        if (cats.indexOf(t) >= 0) {
            score += 2;
        }
    }

    return score;
}

    /* ------------------------------------------------------------
       Header dropdown UX (only if header container exists)
       ------------------------------------------------------------ */

    function headerHasResults() {
        if (!resultsHeader) {
            return false;
        }
        return !!(resultsHeader.children && resultsHeader.children.length > 0);
    }

    function headerClearActive() {
        if (!resultsHeader) {
            return;
        }

        var active;
        active = resultsHeader.querySelector("li.is-active");
        if (active) {
            active.classList.remove("is-active");
        }
    }

    function headerSetOpen(isOpen) {
        if (!containerHeader || !boxHeader) {
            return;
        }

        if (isOpen) {
            containerHeader.classList.add("search-open");
            boxHeader.setAttribute("aria-expanded", "true");
        } else {
            containerHeader.classList.remove("search-open");
            boxHeader.setAttribute("aria-expanded", "false");
            headerClearActive();
        }
    }

    function headerUpdateOpenState() {
        if (!containerHeader || !boxHeader) {
            return;
        }

        var q;
        q = (boxHeader.value || "").trim();
        headerSetOpen(headerHasResults() && q.length >= 2);
    }

    function headerSetActiveIndex(idx) {
        if (!resultsHeader) {
            return;
        }

        var items;
        items = resultsHeader.querySelectorAll("li");
        if (!items || items.length === 0) {
            return;
        }

        if (idx < 0) {
            idx = items.length - 1;
        }
        if (idx >= items.length) {
            idx = 0;
        }

        headerClearActive();
        items[idx].classList.add("is-active");

        var link;
        link = items[idx].querySelector("a");
        if (link && link.scrollIntoView) {
            link.scrollIntoView({ block: "nearest" });
        }
    }

    function headerGetActiveIndex() {
        if (!resultsHeader) {
            return -1;
        }

        var items;
        var i;

        items = resultsHeader.querySelectorAll("li");
        for (i = 0; i < items.length; i += 1) {
            if (items[i].classList.contains("is-active")) {
                return i;
            }
        }

        return -1;
    }

    function headerBindDropdownUX() {
        if (!containerHeader || !boxHeader || !resultsHeader) {
            return;
        }

        function clickOutsideHandler(ev) {
            if (!containerHeader.contains(ev.target)) {
                headerSetOpen(false);
            }
        }

        function backdropHandler(ev) {
            if (ev.target && ev.target.classList && ev.target.classList.contains("header-search__backdrop")) {
                headerSetOpen(false);
            }
        }

        function escapeHandler(ev) {
            if (ev.key === "Escape") {
                headerSetOpen(false);
                boxHeader.blur();
            }
        }

        function focusSlashHandler(ev) {
            if (ev.key !== "/") {
                return;
            }

            var tag;
            var isEditable;

            tag = (ev.target && ev.target.tagName) ? ev.target.tagName.toLowerCase() : "";
            isEditable =
                tag === "input" ||
                tag === "textarea" ||
                (ev.target && ev.target.isContentEditable);

            if (isEditable) {
                return;
            }

            ev.preventDefault();
            boxHeader.focus();
        }

        boxHeader.addEventListener("focus", function () {
            headerUpdateOpenState();
        });

        boxHeader.addEventListener("keydown", function (ev) {
            if (!containerHeader.classList.contains("search-open")) {
                return;
            }

            if (ev.key === "ArrowDown") {
                ev.preventDefault();
                headerSetActiveIndex(headerGetActiveIndex() + 1);
                return;
            }

            if (ev.key === "ArrowUp") {
                ev.preventDefault();
                headerSetActiveIndex(headerGetActiveIndex() - 1);
                return;
            }

            if (ev.key === "Enter") {
                var active;
                active = resultsHeader.querySelector("li.is-active a");
                if (active) {
                    ev.preventDefault();
                    window.location.href = active.getAttribute("href");
                }
                return;
            }
        });

        document.addEventListener("click", clickOutsideHandler);
        document.addEventListener("click", backdropHandler);
        document.addEventListener("keydown", escapeHandler);
        document.addEventListener("keydown", focusSlashHandler);

        var observer;
        observer = new MutationObserver(function () {
            headerUpdateOpenState();
        });

        observer.observe(resultsHeader, { childList: true });
    }

    /* Bind header dropdown UX once (if present) */
    headerBindDropdownUX();

    /* ------------------------------------------------------------
       Render results
       ------------------------------------------------------------ */

    function normalizeUrl(u) {
        var url;
        url = u || "";

        if (!url) {
            return url;
        }

        /* Absolute URLs */
        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        /* Root-relative URLs */
        if (url.charAt(0) === "/") {
            if (baseUrl && baseUrl !== "" && baseUrl !== "/") {
                return baseUrl + url;
            }
            return url;
        }

        /* Relative URLs */
        if (baseUrl && baseUrl !== "" && baseUrl !== "/") {
            return baseUrl + "/" + url;
        }

        return url;
    }

    function render(items, terms, tagsOnlyMode) {
        clearResults();

        if (!terms.length) {
            setStatus("");
            headerUpdateOpenState();
            return;
        }

        var scored;
        var i;
        var s;

        scored = [];

        for (i = 0; i < items.length; i += 1) {
            s = scoreItem(items[i], terms, tagsOnlyMode);
            if (s > 0) {
                scored.push({ item: items[i], score: s });
            }
        }

        scored.sort(function (a, b) {
            return b.score - a.score;
        });

        if (!scored.length) {
            setStatus("No results.");
            headerUpdateOpenState();
            return;
        }

        setStatus(scored.length + " result(s).");

        var max;
        var j;

        max = Math.min(scored.length, 50);

        for (j = 0; j < max; j += 1) {
            var it;
            var li;
            var a;

            it = scored[j].item;

            li = document.createElement("li");

            if (it.date) {
                var meta;
                meta = document.createElement("span");
                meta.className = "header-search__result-date";
                meta.textContent = it.date;
                li.appendChild(meta);
            }

            a = document.createElement("a");
            a.href = normalizeUrl(it.url);
            a.textContent = it.title || "(untitled)";

            li.appendChild(a);
            results.appendChild(li);
        }

        headerUpdateOpenState();
    }

    function init(data) {
        function runSearch() {
            var q;
            var terms;
            var tagsOnlyMode;

            q = box.value || "";
            terms = tokenize(q);
            tagsOnlyMode = isTagsOnlyEnabled();

            render(data, terms, tagsOnlyMode);
        }

        box.addEventListener("input", runSearch);

        if (tagsOnly) {
            tagsOnly.addEventListener("change", runSearch);
        }

        if ((box.value || "").trim().length >= 2) {
            runSearch();
        } else {
            setStatus("");
            headerUpdateOpenState();
        }
    }

    function fail(err) {
        setStatus("Search failed to load index.");
        if (window.console && window.console.error) {
            window.console.error(err);
        }
    }

    fetch(baseUrl + "/search.json", { cache: "no-cache" })
        .then(function (r) { return r.json(); })
        .then(init)
        .catch(fail);
}());
