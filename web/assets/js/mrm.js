'use strict';
(function () {
    if (window._mrm !== undefined && window._mrm !== null) return;
    window._mrm = __getMrm();
    window._mrm.init();
})();

function __getMrm() {
    return {
        rippleFinish: 700,
        useUpdate: false,
        updateInterval: 100,

        drawer: null,
        drawerButton: null,
        drawerActive: false,

        updateCycle: null,

        init: function () {
            /* configure ripple effect */

            var ripples = document.querySelectorAll('[ripple]:not([ripple-ready])'),
                i = 0,
                len = ripples.length;

            for (; i < len; i++) {
                ripples[i].setAttribute('ripple-ready', '');
                ripples[i].addEventListener('click', __rippleAnimate);
            }

            // color phone toolbar
            var toolbars = document.getElementsByClassName('toolbar');
            if (toolbars.length > 0) {
                var color = '#' + __rgbToHex(__shadeColor(getComputedStyle(toolbars[0]).getPropertyValue("background-color"), .10));
                __setMetaColor(color);
            }

            if (this.drawer === null) {
                var drawerButtonList = document.getElementsByClassName('drawer-icon');
                var drawerList = document.getElementsByClassName('drawer');

                if (drawerButtonList !== null && drawerButtonList.length > 0)
                    this.drawerButton = drawerButtonList[0];

                if (drawerList !== null && drawerList.length > 0)
                    this.drawer = drawerList[0];

                if (this.drawer !== null && this.drawerButton !== null) {
                    this.drawerButton.addEventListener('click', function () {
                        window._mrm.drawerToggle();
                    });

                    this.drawer.addEventListener('click', function (event) {
                        if (event.isTrusted && event.target && event.target === window._mrm.drawer) {
                            window._mrm.drawerAction(false);
                        }
                    });
                }
            }
        },

        configure: function (options) {
            this.rippleFinish = options.rippleFinish || this.rippleFinish;
            this.useUpdate = options.useUpdate || this.useUpdate;
            this.updateInterval = options.updateInterval || this.updateInterval;

            if (this.useUpdate && this.updateInterval > 0) {
                if (this.updateCycle !== null) {
                    clearInterval(this.updateCycle);
                }

                this.updateCycle = setInterval(function () {
                    window._mrm.init();
                }, this.updateInterval);
            }

            if (options.toolbarDark !== undefined && options.toolbarDark !== null) {
                __setMetaColor(options.toolbarDark);
            }
        },

        drawerAction: function (show) {
            if (!this.drawer || !this.drawerButton) return;
            if (show) {
                this.drawer.classList.add('active');
                this.drawer.classList.remove('close');
            } else {
                this.drawer.classList.remove('active');
                this.drawer.classList.add('close');
            }
        },

        drawerToggle: function () {
            this.drawerAction(!this.isDrawerActive());
        },

        isDrawerActive: function () {
            if (!this.drawer) return false;
            return this.drawer.classList.contains('active');
        },

    }
}

function __rippleAnimate(e) {
    const parent = e.target;
    var ripple = null;
    const finished = parent.querySelectorAll('.ripple.finish');

    if (finished.length !== 0) {
        ripple = finished[0];
        ripple.classList.remove('finish');
        ripple.classList.add('animate');
    } else {
        ripple = document.createElement('span');
        ripple.classList.add('ripple', 'animate');
        this.insertBefore(ripple, this.firstChild);
    }

    if (!ripple.offsetHeight && !ripple.offsetWidth) {
        const d = Math.max(this.offsetHeight, this.offsetWidth);
        ripple.style.height = d + 'px';
        ripple.style.width = d + 'px';
    }

    const rect = this.getBoundingClientRect();

    const offset = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }

    const x = e.pageX - offset.left - ripple.offsetWidth / 2;
    const y = e.pageY - offset.top - ripple.offsetHeight / 2;

    ripple.style.top = y + 'px';
    ripple.style.left = x + 'px';

    var timer = setTimeout(function () {
        ripple.classList.remove('animate');
        ripple.classList.add('finish');
        clearTimeout(timer);
    }, window._mrm.rippleFinish);
}

function __setMetaColor(color) {
    var metaAndroid = null,
        metaIOs = null,
        metaWin = null;

    metaAndroid = document.querySelector('meta[name="theme-color"]');
    if (metaAndroid === undefined || metaAndroid === null) {
        var metaAndroid = document.createElement('meta');
        metaAndroid.name = 'theme-color';
        metaAndroid.content = color;
        document.getElementsByTagName('head')[0].appendChild(metaAndroid);
    } else {
        metaAndroid.content = color;
    }

    metaIOs = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaIOs === undefined || metaIOs === null) {
        var metaIOs = document.createElement('meta');
        metaIOs.name = 'apple-mobile-web-app-status-bar-style';
        metaIOs.content = color;
        document.getElementsByTagName('head')[0].appendChild(metaIOs);
    } else {
        metaIOs.content = color;
    }

    metaWin = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (metaWin === undefined || metaWin === null) {
        var metaWin = document.createElement('meta');
        metaWin.name = 'apple-mobile-web-app-status-bar-style';
        metaWin.content = color;
        document.getElementsByTagName('head')[0].appendChild(metaWin);
    } else {
        metaWin.content = color;
    }
}

function __shadeColor(color, percent) {
    var f = color.split(","),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = parseInt(f[0].slice(4)),
        G = parseInt(f[1]),
        B = parseInt(f[2]);
    return "rgb(" + (Math.round((t - R) * p) + R) + "," + (Math.round((t - G) * p) + G) + "," + (Math.round((t - B) * p) + B) + ")";
}

function __rgbToHex(color) {
    color = color.replace(/\s/g, "");
    var aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);
    if (aRGB) {
        color = '';
        for (var i = 1; i <= 3; i++) color += Math.round((aRGB[i][aRGB[i].length - 1] == "%" ? 2.55 : 1) * parseInt(aRGB[i])).toString(16).replace(/^(.)$/, '0$1');
    } else color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');
    return color;
}