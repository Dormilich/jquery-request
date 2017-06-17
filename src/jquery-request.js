$.widget( 'dormilich.request', {

    version: '0.1.0',

    options: {
        url: false,
        method: 'GET',
        autoSubmit: false
    },

    _create: function () {
        this._setOptions( this.element.data() );
    },

    _init: function () {
        if ( this.options.autoSubmit ) {
            this.submit();
        }
    },

    submit: function () {
        var plugin = this;

        if ( ! this.options.url ) {
            return $.Deferred( function ( dfr ) {
                dfr.reject( 'Missing required AJAX URL.' );
            } );
        }

        return $.ajax( this.options.url, {
            method: this.options.method.toUpperCase(), // jQuery >= 1.9.0
            data: this._data(),
            beforeSend: function () {
                plugin._trigger( 'submit' );
            }
        } );
    },

    _data: function () {
        var data, plugin = this;
        // unfortunately, `.dataset` is not supported by IE < 11
        // otherwise I could spare me the widget removal
        data = $.extend( {}, this.element.data() );
        // filter off the widget options
        $.each( this.options, function ( key ) {
            delete data[ key ];
        } );
        // remove the property that refers to the widget instance
        // since that interfers with events in jQuery.ajax()
        // this differs between jQuery 2 (namespace-name)
        // and jQuery 3 (namespaceName)
        $.each( data, function ( key ) {
            if ( key.indexOf( plugin.namespace ) === 0 ) {
                delete data[ key ];
            }
        } );

        return data;
    }

} );
