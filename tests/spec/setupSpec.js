describe( 'jQuery Request', function () {

    it( 'should return the jQuery object', function () {
        var $button = $( '<button>click</button>' );
        var obj = $button.request();

        expect( obj ).toBe( $button );
    } );

    it( 'should read the AJAX url from explicit configuration', function () {
        var $button = $( '<button>click</button>' );
        var testUrl = 'http://example.com/api?key=' + Math.random();
        $button.request({
            url: testUrl
        });

        expect( $button.request( 'option', 'url' ) ).toBe( testUrl );
    } );

    it( 'should read the AJAX url from data-* configuration', function () {
        var $button = $( '<button data-url="/test">click</button>' );
        var testUrl = $button.data( 'url' );

        $button.request();

        expect( $button.request( 'option', 'url' ) ).toBe( testUrl );
    } );

    it( 'should overwrite explicit settings with data-* settings', function () {
        var $button = $( '<button data-url="/test">click</button>' );
        var dataUrl = $button.data( 'url' );
        var testUrl = 'http://example.com/api?key=' + Math.random();
        $button.request({
            url: testUrl
        });

        expect( $button.request( 'option', 'url' ) ).toBe( dataUrl );
    } );

    it( 'should have a default AJAX method', function () {
        var $button = $( '<button>click</button>' );

        $button.request();

        expect( $button.request( 'option', 'method' ) ).toBe( 'GET' );
    } );

    it( 'should read the AJAX method from explicit configuration', function () {
        var $button = $( '<button>click</button>' );

        $button.request({
            method: 'POST'
        });

        expect( $button.request( 'option', 'method' ) ).toBe( 'POST' );
    } );

    it( 'should read the AJAX method from data-* configuration', function () {
        var $button = $( '<button data-method="HEAD">click</button>' );
        var testUrl = $button.data( 'method' );

        $button.request();

        expect( $button.request( 'option', 'method' ) ).toBe( 'HEAD' );
    } );

    describe( 'submit', function () {

        beforeEach( function () {
            jasmine.getFixtures().load( 'button-1.html' );
            jasmine.Ajax.install();
        } );

        afterEach( function () {
            jasmine.Ajax.uninstall();
        } );

        it( 'should fail without a target URL', function () {
            var $button = $( '<button>never submit</button>' );
            var fail = jasmine.createSpy( 'fail' );

            $button
                .request()
                .request( 'submit' )
                .fail( fail )
            ;

            expect( $button.request( 'option', 'url' ) ).toBe( false );
            expect( fail ).toHaveBeenCalledWith( 'Missing required AJAX URL.' );
        } );

        it( 'should have set auto-submit disabled by default', function () {
            var $button = $( '#button-1' );

            jasmine.spyOnEvent( '#button-1', 'requestsubmit' );

            $button.request();

            expect( $button.request( 'option', 'autoSubmit' ) ).toBe( false );
            expect( $button.request( 'option', 'url' ) ).toBe( '/test' );
            expect( 'requestsubmit' ).not.toHaveBeenTriggeredOn( '#button-1' );
        } );

        it( 'should emit a submit event before the AJAX request', function () {
            jasmine.spyOnEvent( '#button-1', 'requestsubmit' );

            expect( 'requestsubmit' ).not.toHaveBeenTriggeredOn( '#button-1' );

            $( '#button-1' ).request().request( 'submit' );

            expect( jasmine.Ajax.requests.mostRecent().url ).toBe( '/test?id=42' );

            expect( 'requestsubmit' ).toHaveBeenTriggeredOn( '#button-1' );
        } );

        it( 'should fire on initialisation when auto-submit is set', function () {
            jasmine.spyOnEvent( '#button-1', 'requestsubmit' );

            $( '#button-1' ).request({
                autoSubmit: true
            });

            expect( 'requestsubmit' ).toHaveBeenTriggeredOn( '#button-1' );
        } );

        it( 'should return the jQuery AJAX object', function () {
            var done = jasmine.createSpy( 'done' );

            jasmine.Ajax.stubRequest( '/test?id=42' ).andReturn({
                status: 200,
                contentType: 'text/plain',
                responseText: 'successful response'
            });

            $( '#button-1' )
                .request()
                .request( 'submit' )
                .done( function ( data ) {
                    done( data );
                } )
            ;

            expect( done ).toHaveBeenCalledWith( 'successful response' );
        } );

    } );

    describe( 'response events', function () {

        beforeEach( function () {
            jasmine.getFixtures().load( 'button-1.html' );
            jasmine.Ajax.install();
        } );

        afterEach( function () {
            jasmine.Ajax.uninstall();
        } );

        it( 'should be emitted after the AJAX request succeeds', function () {
            jasmine.spyOnEvent( '#button-1', 'requesterror' );
            jasmine.spyOnEvent( '#button-1', 'requestsuccess' );
            jasmine.spyOnEvent( '#button-1', 'requestcomplete' );

            $( '#button-1' ).request().request( 'submit' );

            expect( 'requestsuccess' ).not.toHaveBeenTriggeredOn( '#button-1' );

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'text/plain',
                responseText: 'successful response'
            });

            expect( 'requestsuccess' ).toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requesterror' ).not.toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requestcomplete' ).toHaveBeenTriggeredOn( '#button-1' );
        } );

        it( 'should be emitted after the AJAX request fails', function () {
            jasmine.spyOnEvent( '#button-1', 'requesterror' );
            jasmine.spyOnEvent( '#button-1', 'requestsuccess' );
            jasmine.spyOnEvent( '#button-1', 'requestcomplete' );

            $( '#button-1' ).request().request( 'submit' );

            expect( 'requesterror' ).not.toHaveBeenTriggeredOn( '#button-1' );

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 400,
                contentType: 'text/plain',
                responseText: 'error message'
            });

            expect( 'requesterror' ).toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requestsuccess' ).not.toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requestcomplete' ).toHaveBeenTriggeredOn( '#button-1' );
        } );

    } );

    describe( 'success event', function () {

        beforeEach( function () {
            jasmine.getFixtures().load( 'button-1.html' );
            jasmine.Ajax.install();
            jasmine.Ajax.stubRequest( '/test?id=42' ).andReturn({
                status: 200,
                contentType: 'text/plain',
                responseText: 'successful response'
            });
        } );

        afterEach( function () {
            jasmine.Ajax.uninstall();
        } );

        it( 'should receive the response data in the event handler', function () {
            var evt = jasmine.createSpy( 'evt' );

            $( '#button-1' )
                .on( 'requestsuccess', function ( event, data ) {
                    evt( data )
                } )
                .request({
                    autoSubmit: true
                })
            ;

            expect( evt ).toHaveBeenCalledWith( 'successful response' );
        } );

        it( 'should receive the AJAX data in the done handler', function () {
            var done = jasmine.createSpy( 'done' );

            $( '#button-1' )
                .request()
                .request( 'submit' )
                .done( function ( data, status, jqXHR ) {
                    done( data );
                } )
            ;

            expect( done ).toHaveBeenCalledWith( 'successful response' );
        } );

        it( 'should not call the fail handler', function () {
            var fail = jasmine.createSpy( 'fail' );

            $( '#button-1' )
                .request()
                .request( 'submit' )
                .fail( function ( jqXHR, status, error ) {
                    fail( jqXHR.responseText );
                } )
            ;

            expect( fail ).not.toHaveBeenCalled();
        } );

    } );

    describe( 'error event', function () {

        beforeEach( function () {
            jasmine.getFixtures().load( 'button-1.html' );
            jasmine.Ajax.install();
            jasmine.Ajax.stubRequest( '/test?id=42' ).andReturn({
                status: 400,
                contentType: 'text/plain',
                responseText: 'error message'
            });
        } );

        afterEach( function () {
            jasmine.Ajax.uninstall();
        } );

        it( 'should receive the error message in the event handler', function () {
            var evt  = jasmine.createSpy( 'evt' );

            $( '#button-1' )
                .on( 'requesterror', function ( event, error ) {
                    evt( error )
                } )
                .request({
                    autoSubmit: true
                })
            ;

            expect( evt ).toHaveBeenCalledWith( 'error message' );
        } );

        it( 'should receive the AJAX object in the fail handler', function () {
            var fail = jasmine.createSpy( 'fail' );

            $( '#button-1' )
                .request()
                .request( 'submit' )
                .fail( function ( jqXHR, status, error ) {
                    fail( jqXHR.responseText );
                } )
            ;

            expect( fail ).toHaveBeenCalledWith( 'error message' );
        } );

        it( 'should not call the done handler', function () {
            var done = jasmine.createSpy( 'done' );

            $( '#button-1' )
                .request()
                .request( 'submit' )
                .done( function ( data, status, jqXHR ) {
                    done( data );
                } )
            ;

            expect( done ).not.toHaveBeenCalled();
        } );

    } );

} );
