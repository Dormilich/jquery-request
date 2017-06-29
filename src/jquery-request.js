$.widget( 'dormilich.request', {

    version: '0.1.0',

    options: {
        url: false,
        method: 'GET',
        autoSubmit: false,
        iconDefault: false,
        iconPending: false,
        iconError: false
    },

    _create: function () {
        var key, data = this.element.data();

        for ( key in data ) {
            if ( key in this.options ) {
                this._setOption( key, data[ key ] );
            }
        }
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
            data: this._formData(),
            beforeSend: function () {
                plugin._trigger( 'submit' );
                plugin._setIcon( 'Pending' );
            }
        } ).always( function () {
            plugin._trigger( 'complete' );
        } ).done( function ( data ) {
            plugin._trigger( 'success', null, data );
            plugin._setIcon( 'Default' );
        } ).fail( function ( jqXHR, status, error ) {
            plugin._trigger( 'error', null, jqXHR.responseText || error );
            plugin._setIcon( 'Error' );
        } );
    },

    _formData: function () {
        var data = this._dataSet();

        $.each( this.options, function ( key ) {
            delete data[ key ];
        } );

        return data;
    },

    _dataSet: function () {
        var data = {}, plugin = this;
        // `.dataset` is not supported by IE < 11
        // additional data may have been set through jQuery or DOM
        $.extend( data, this.element[ 0 ].dataset, this.element.data() );
        // remove the property that refers to the widget instance
        // since that interfers with events in jQuery.ajax()
        // this differs between jQuery 2 (dormilich-request)
        // and jQuery 3 (dormilichRequest)
        $.each( data, function ( key ) {
            if ( key.indexOf( plugin.namespace ) === 0 ) {
                delete data[ key ];
            }
        } );

        return data;
    },

    _setIcon: function ( type ) {
        var opt = this.options, classes, icons, icon = opt[ 'icon' + type ];

        if ( ! opt.iconDefault || ! icon ) {
            return false;
        }

        icons = [ opt.iconDefault, opt.iconPending, opt.iconError ].filter( function ( str ) {
            return !! str;
        });

        classes = icons.map( function ( cls ) {
            return '.' + cls;
        } ).join( ', ' );

        this.element
            .find( classes )
            .addBack()
            .filter( classes )
            .removeClass( icons.join( ' ' ) )
            .addClass( icon )
        ;
    }

} );
