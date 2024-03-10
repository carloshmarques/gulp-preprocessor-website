/**
 * jQuery Smooth Scroll Plugin
 * By Paweł Galias pawgalias@gmail.com
 * Copyright (c)
 *
 * Version: 2.0.0
 * Last update: 31 Aug 2016
 *
 * Usage:
 * $(selector).smoothScroll([options]);
 *
 * Available options:
 * @param {string} parent - Reference (class, id, etc) to parent the scroll should be done on
 * @param {number|string} speed - Time of scrolling in *ms* (number) or slow/fast (string)
 * @param {boolean} mobile - Allow swipe events
 * @param {boolean} keyboard - Allow keyboard arrow keys scrolling
 *
 * Changelog:
 * 2.0.0
 *   + changed plain js to ts
 *   + added swipe event
 *   + added possibility to smoothly scrolling inside scrollable div
 * 1.0.0
 *   + initial release
 */

var SmoothScroll;
(function (SmoothScroll) {
    var SmoothScrollOptions = (function () {
        function SmoothScrollOptions(parent, speed, swipe, keyboard) {
            this.parent = parent;
            this.speed = speed;
            this.swipe = swipe;
            this.keyboard = keyboard;
        }
        return SmoothScrollOptions;
    }());
    SmoothScroll.SmoothScrollOptions = SmoothScrollOptions;
})(SmoothScroll || (SmoothScroll = {}));
var SmoothScroll;
(function (SmoothScroll_1) {
    var SmoothScroll = (function () {
        function SmoothScroll(element, options) {
            var _this = this;
            this.mousedown = function (event) {
                event.button == 1 && event.preventDefault();
            };
            //TODO: Prevent MS Edge firing event two times
            //TODO: Handler for touchpad
            this.scroll = function (event) {
                var $this = _this.currentSection, $type = event.type, $key = event.which, $direction = ($type == 'mousewheel' || $type == 'DOMMouseScroll') ? _this.getDirection(event.originalEvent) : null, next = $this.next().length !== 0 ? $this.next() : _this.element.first(), prev = $this.prev().length !== 0 ? $this.prev() : _this.element.last();
                if ((($type == 'mousewheel' || $type == 'DOMMouseScroll') && $direction == 'down') ||
                    $type == 'swipedown' ||
                    ($type == 'keydown' && $key == 40)) {
                    _this.section = next;
                }
                else if ((($type == 'mousewheel' || $type == 'DOMMouseScroll') && $direction == 'up') ||
                    $type == 'swipeup' ||
                    ($type == 'keydown' && $key == 38)) {
                    _this.section = prev;
                }
            };
            this.element = element;
            this.options = $.extend(SmoothScroll.defaultOptions, options);
            this.currentSection = this.element.first();
            // prevent middle mouse button click
            this.element.on('mousedown', this.mousedown);
            // mouse scroll / swipe / keyboard event
            var events = "mousewheel DOMMouseScroll" + (this.options.swipe ? ' swipeup swipedown' : '');
            this.element.on(events, this.scroll);
            this.options.keyboard && $('body').on('keydown', this.scroll);
        }
        Object.defineProperty(SmoothScroll.prototype, "section", {
            get: function () {
                return this.currentSection;
            },
            set: function (section) {
                $(this.options.parent).animate({
                    scrollTop: section.get(0).offsetTop - $(this.options.parent).position().top
                }, this.options.speed);
                this.currentSection = section;
            },
            enumerable: true,
            configurable: true
        });
        SmoothScroll.prototype.getDirection = function (evt) {
            return (evt.detail < 0 || evt.wheelDelta > 0) ? 'up' : 'down';
        };
        SmoothScroll.defaultOptions = {
            parent: 'html,body',
            speed: 'slow',
            swipe: true,
            keyboard: true
        };
        return SmoothScroll;
    }());
    SmoothScroll_1.SmoothScroll = SmoothScroll;
})(SmoothScroll || (SmoothScroll = {}));

(function ($) {
    $.fn.SmoothScroll = function (options) {
        return new SmoothScroll.SmoothScroll(this, options);
    };
})(jQuery);

//# sourceMappingURL=smoothScroll.js.map
