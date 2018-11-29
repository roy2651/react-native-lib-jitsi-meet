(global => {
    // jQuery
    if (typeof global.$ === 'undefined') {
        const jQuery = require('jquery');

        jQuery(global);
        global.$ = jQuery;
    }
})(global || window || this); // eslint-disable-line no-invalid-this
