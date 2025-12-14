// file: /js/search.js

(function () {
    var baseUrl = window.SITE_BASEURL || "";

    var boxPage = document.getElementById("searchBoxPage");
    var resultsPage = document.getElementById("searchResultsPage");
    var statusPage = document.getElementById("searchStatusPage");

    var boxHeader = document.getElementById("searchBox");
    var resultsHeader = document.getElementById("searchResults");
    var statusHeader = document.getElementById("searchStatus");

    /* Prefer the /search/ page widgets if they exist */
    var box = boxPage || boxHeader;
    var results = resultsPage || resultsHeader;
    var status = statusPage || statusHeader;

    if (!box || !results || !status) {
        return;
    }

    function setStatus(text) {
        if (status) {
            status.textContent = text;
        }
    }

    function clearResults() {
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }
    }

    function scoreItem(item, terms) {
        var title = (item.title || "").toLowerCase();
        var tags = Array.isArray(item.tags) ? item.tags.join(" ").toLowerCase() : "";
        var cats = Array.isArray(item.categories) ? item.categories.join(" ").toLowerCase() : "";
        var excerpt = (item.excerpt || "").toLowerCase();

        var hay = title + " " + tags + " " + cats + " " + excerpt;

        var score = 0;
        for (var i = 0; i < terms.length; i += 1) {
            var t = terms[i];
            if (!t) {
                continue;
            }
            if (title.indexOf(t) >= 0) {
                score += 10;
            }
            if (tags.indexOf(t) >= 0) {
                score += 6;
            }
            if (cats.indexOf(t) >= 0) {
                score += 4;
            }
            if (hay.indexOf(t) >= 0) {
                score += 1;
            }
        }
        return score;
    }

    function render(items, terms) {
        clearResults();

        if (!terms.length) {
            setStatus("");
            return;
        }

        var scored = [];
        for (var i = 0; i < items.length; i += 1) {
            var s = scoreItem(items[i], terms);
            if (s > 0) {
                scored.push({ item: items[i], score: s });
            }
        }

        scored.sort(function (a, b) {
            return b.score - a.score;
        });

        if (!scored.length) {
            setStatus("No results.");
            return;
        }

        setStatus(scored.length + " result(s).");

        var max = Math.min(scored.length, 50);
        for (var j = 0; j < max; j += 1) {
            var it = scored[j].item;

            var li = document.createElement("li");

            if (it.date) {
                var meta = document.createElement("span");
                meta.className = "header-search__result-date";
                meta.textContent = it.date;
                li.appendChild(meta);
            }

            var a = document.createElement("a");
            a.href = it.url;
            a.textContent = it.title;

            li.appendChild(a);

            results.appendChild(li);
        }
    }

    function tokenize(q) {
        return q
            .toLowerCase()
            .split(/\s+/)
            .map(function (s) { return s.trim(); })
            .filter(function (s) { return s.length >= 2; });
    }

    function init(data) {
        function onInput() {
            var q = box.value || "";
            render(data, tokenize(q));
        }

        box.addEventListener("input", onInput);
        if ((box.value || "").trim().length >= 2) {
            onInput();
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
