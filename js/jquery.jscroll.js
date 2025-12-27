/*!
 * jScroll - jQuery Plugin for Infinite Scrolling / Auto-Paging
 * @see @link{https://jscroll.com}
 *
 * @copyright Philip Klauzinski
 * @license Dual licensed under the MIT and GPL Version 2 licenses
 * @author Philip Klauzinski (https://webtopian.com)
 * @version 2.4.1
 * @requires jQuery v1.8.0+
 * @preserve
 */
(function ($) {

    "use strict";

    // Define the jscroll namespace and default settings
    $.jscroll = {
        defaults: {
            debug: false,
            autoTrigger: true,
            autoTriggerUntil: false,
            loadingHtml: "<small>Loading...</small>",
            loadingFunction: false,
            padding: 0,
            nextSelector: "a:next",
            contentSelector: "",
            pagingSelector: "",
            callback: false
        }
    };

    // Constructor
    var jScroll = function ($e, options) {

        // Private vars and methods
        var _data = $e.data("jscroll");
        var _userOptions = (typeof options === "function") ? { callback: options } : options;
        var _options = $.extend({}, $.jscroll.defaults, _userOptions, _data || {});

        // Treat as window scrolling unless the element is explicitly scrollable
        var overflowY = $e.css("overflow-y");
        var _isWindow = !(overflowY === "auto" || overflowY === "scroll");

        var _$next = $e.find(_options.nextSelector).first();
        var _$window = $(window);
        var _$document = $(document);
        var _$body = $("body");
        var _$scroll = _isWindow ? _$window : $e;

        // jQuery.load supports "url selector" syntax. This is intentional.
        var _nextHref = $.trim(_$next.prop("href") + " " + _options.contentSelector);

        // Check if a loading image is defined and preload
        var _preloadImage = function () {
            var src = $(_options.loadingHtml).filter("img").attr("src");
            if (src) {
                var image = new Image();
                image.src = src;
            }
        };

        // Wrap inner content, if it is not already
        var _wrapInnerContent = function () {
            if (!$e.find(".jscroll-inner").length) {
                $e.contents().wrapAll("<div class=\"jscroll-inner\" />");
            }
        };

        // Find the next link parent, or add one, and hide it
        var _nextWrap = function ($next) {
            var $parent;
            if (_options.pagingSelector) {
                $next.closest(_options.pagingSelector).hide();
            } else {
                $parent = $next.parent().not(".jscroll-inner,.jscroll-added").addClass("jscroll-next-parent").hide();
                if (!$parent.length) {
                    $next.wrap("<div class=\"jscroll-next-parent\" />").parent().hide();
                }
            }
        };

        // Remove the jscroll behavior and data from an element
        var _destroy = function () {
            return _$scroll.unbind(".jscroll")
                .removeData("jscroll")
                .find(".jscroll-inner").children().unwrap()
                .filter(".jscroll-added").children().unwrap();
        };

        // Observe scroll event for when to trigger the next load
        var _observe = function () {
            if (!$e.is(":visible")) {
                return;
            }

            _wrapInnerContent();

            var $inner = $e.find("div.jscroll-inner").first();
            var data = $e.data("jscroll");

            if (!data || data.waiting) {
                return;
            }

            // Robust bottom detection:
            // - For window scrolling: compare against document height
            // - For element scrolling: compare against inner content height
            if (_isWindow) {
                var winBottom = _$window.scrollTop() + _$window.height() + _options.padding;
                var docHeight = _$document.height();
                if (winBottom >= docHeight) {
                    _debug("info", "jScroll: near document bottom. Loading next request...");
                    return _load();
                }
            } else {
                var elBottom = $e.scrollTop() + $e.height() + _options.padding;
                if (elBottom >= $inner.outerHeight()) {
                    _debug("info", "jScroll: near element bottom. Loading next request...");
                    return _load();
                }
            }
        };

        // Check if the href for the next set of content has been set
        var _checkNextHref = function (data) {
            var d = data || $e.data("jscroll");
            if (!d || !d.nextHref) {
                _debug("warn", "jScroll: nextSelector not found - destroying");
                _destroy();
                return false;
            }
            _setBindings();
            return true;
        };

        var _setBindings = function () {
            var $next = $e.find(_options.nextSelector).first();
            if (!$next.length) {
                return;
            }

            if (_options.autoTrigger && (_options.autoTriggerUntil === false || _options.autoTriggerUntil > 0)) {
                _nextWrap($next);

                // If there is not enough content to scroll, immediately observe once.
                var scrollingBodyHeight = _$body.height() - $e.offset().top;
                var scrollingHeight = ($e.height() < scrollingBodyHeight) ? $e.height() : scrollingBodyHeight;

                var windowHeight;
                if ($e.offset().top - _$window.scrollTop() > 0) {
                    windowHeight = _$window.height() - ($e.offset().top - _$window.scrollTop());
                } else {
                    windowHeight = _$window.height();
                }

                if (scrollingHeight <= windowHeight) {
                    _observe();
                }

                _$scroll.unbind(".jscroll").bind("scroll.jscroll", function () {
                    return _observe();
                });

                if (_options.autoTriggerUntil > 0) {
                    _options.autoTriggerUntil--;
                }
            } else {
                _$scroll.unbind(".jscroll");
                $next.bind("click.jscroll", function () {
                    _nextWrap($next);
                    _load();
                    return false;
                });
            }
        };

        // Load the next set of content, if available
        var _load = function () {
            var $inner = $e.find("div.jscroll-inner").first();
            var data = $e.data("jscroll");

            if (!data || !data.nextHref) {
                return;
            }

            data.waiting = true;

            $inner.append("<div class=\"jscroll-added\" />")
                .children(".jscroll-added").last()
                .html("<div class=\"jscroll-loading\" id=\"jscroll-loading\">" + _options.loadingHtml + "</div>")
                .promise()
                .done(function () {
                    if (_options.loadingFunction) {
                        _options.loadingFunction();
                    }
                });

            return $e.animate({ scrollTop: $inner.outerHeight() }, 0, function () {
                var nextHref = data.nextHref;

                $inner.find("div.jscroll-added").last().load(nextHref, function (r, status) {
                    if (status === "error") {
                        return _destroy();
                    }

                    var $next = $(this).find(_options.nextSelector).first();

                    data.waiting = false;
                    data.nextHref = $next.prop("href") ? $.trim($next.prop("href") + " " + _options.contentSelector) : false;

                    $(".jscroll-next-parent", $e).remove();

                    _checkNextHref();

                    if (_options.callback) {
                        _options.callback.call(this, nextHref);
                    }

                    _debug("dir", data);
                });
            });
        };

        // Safe console debug
        var _debug = function (m) {
            if (_options.debug && typeof console === "object" && (typeof m === "object" || typeof console[m] === "function")) {
                if (typeof m === "object") {
                    var args = [];
                    var sMethod;
                    for (sMethod in m) {
                        if (typeof console[sMethod] === "function") {
                            args = (m[sMethod].length) ? m[sMethod] : [m[sMethod]];
                            console[sMethod].apply(console, args);
                        } else {
                            console.log.apply(console, args);
                        }
                    }
                } else {
                    console[m].apply(console, Array.prototype.slice.call(arguments, 1));
                }
            }
        };

        // Initialization
        $e.data("jscroll", $.extend({}, _data, { initialized: true, waiting: false, nextHref: _nextHref }));
        _wrapInnerContent();
        _preloadImage();
        _setBindings();

        // Expose API methods via the jQuery.jscroll namespace, e.g. $("sel").jscroll.method()
        $.extend($e.jscroll, {
            destroy: _destroy
        });

        return $e;
    };

    // Define the jscroll plugin method and loop
    $.fn.jscroll = function (m) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data("jscroll");

            // Instantiate jScroll on this element if it has not been already
            if (data && data.initialized) {
                return;
            }
            jScroll($this, m);
        });
    };

})(jQuery);
