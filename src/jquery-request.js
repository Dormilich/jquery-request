jQuery.widget( 'dormilich.request', {

    version: '0.1.0',

    options: {
        url: false,
        method: 'GET'
    },

    _setOption: function ( key, value ) {
        if ( key in this.options ) {
            this._super( key, value );
        }
    },

    _create: function () {
        this._setOptions( this.element.data() );
    }
});