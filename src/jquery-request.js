$.widget( 'dormilich.request', {

    version: '0.1.0',

    options: {
        url: false,
        method: 'GET',
        autoSubmit: false,
        iconDefault: false,
        iconPending: false,
        iconError: false,
        iconClass: false,
        icons: {
            fa: {
                pending: 'spinner pulse',
                error: 'exclamation-triangle'
            },
            glyphicon: {
                pending: 'hourglass',
                error: 'alert'
            },
            "ui-icon": {
                pending: 'clock',
                error: 'alert'
            }
        }
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

    _initIcons: function () {
        var opt = this.options, set = opt.icons[ opt.iconClass ];

        if ( ! ( opt.iconDefault && set ) ) {
            return false;
        }

        opt.iconDefault = this._transformIcon( opt.iconClass, opt.iconDefault );
        opt.iconPending = this._transformIcon( opt.iconClass, set.pending );
        opt.iconError   = this._transformIcon( opt.iconClass, set.error );
    },

    _transformIcon: function ( prefix, icon ) {
        var re = new RegExp( '( |^)(' + prefix + '-){2,}', 'g' );

        return icon
            .split( ' ' )
            .map( function ( item ) {
                return prefix + '-' + item;
            } )
            .join( ' ' )
            .replace( re, '$2' )
        ;
    },

    submit: function () {
        var plugin = this;

        if ( ! this.options.url ) {
            return $.Deferred( function ( dfr ) {
                dfr.reject( 'Missing required AJAX URL.' );
            } );
        }

        this._initIcons();

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
        var classes, icons, 
            opt = this.options, 
            icon = opt[ 'icon' + type ];

        if ( ! ( opt.iconDefault && icon ) ) {
            return false;
        }

        icons = this._getIcons();
        classes = this._lookupIcon( icons );

        this.element
            .find( classes )
            .addBack()
            .filter( classes )
            .removeClass( icons.join( ' ' ) )
            .addClass( icon )
        ;
    },

    _getIcons: function () {
        var opt = this.options;
        return [
            opt.iconDefault,
            opt.iconPending,
            opt.iconError 
        ]
            .filter( function ( str ) {
                return !! str;
            } )
            .join( ' ' )
            .split( ' ' )
        ;
    },

    _lookupIcon: function ( icons ) {
        if ( this.option.iconClass ) {
            return '.' + this.option.iconClass;
        }

        return icons
            .map( function ( cls ) {
                return '.' + cls;
            } )
            .join( ', ' )
        ;
    }

} );
