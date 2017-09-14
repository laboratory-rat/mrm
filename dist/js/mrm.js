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
        },

        configure: function (options) {
            this.rippleFinish = options.rippleFinish || this.rippleFinish;
            this.useUpdate = options.useUpdate || this.useUpdate;
            this.updateInterval = options.updateInterval || this.updateInterval;

            if(this.useUpdate && this.updateInterval > 0){
                if(this.updateCycle !== null){
                    clearInterval(this.updateCycle);
                }

                this.updateCycle = setInterval(function(){
                    window._mrm.init();
                }, this.updateInterval);
            }
        }
    }
}

function __rippleAnimate(e) {
    const parent = e.target;
    var ripple = null;
    const finished = parent.querySelectorAll('.ripple.finish');

    if(finished.length !== 0){
        ripple = finished[0];
        ripple.classList.remove('finish');
        ripple.classList.add('animate');
    } else{
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