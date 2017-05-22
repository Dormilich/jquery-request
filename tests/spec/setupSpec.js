describe( 'jQuery Request', function () {

    it( 'should return the jQuery object', function () {
        var $button = $( '<button>click</button>' );
        var obj = $button.request();

        expect( obj ).toBe( $button );
    });

    it( 'should read the AJAX url from explicit configuration', function () {
        var $button = $( '<button>click</button>' );
        var testUrl = 'http://example.com/api?key=' + Math.random();
        $button.request({
            url: testUrl
        });

        expect( $button.request( 'option', 'url' ) ).toBe( testUrl );
    });

    it( 'should read the AJAX url from data-* configuration', function () {
        var $button = $( '<button data-url="/test">click</button>' );
        var testUrl = $button.data( 'url' );

        $button.request();

        expect( $button.request( 'option', 'url' ) ).toBe( testUrl );
    });

    it( 'should overwrite explicit settings with data-* settings', function () {
        var $button = $( '<button data-url="/test">click</button>' );
        var dataUrl = $button.data( 'url' );
        var testUrl = 'http://example.com/api?key=' + Math.random();
        $button.request({
            url: testUrl
        });

        expect( $button.request( 'option', 'url' ) ).toBe( dataUrl );
    });

    it( 'should have a default AJAX method', function () {
        var $button = $( '<button>click</button>' );

        $button.request();

        expect( $button.request( 'option', 'method' ) ).toBe( 'GET' );
    });

    it( 'should read the AJAX method from explicit configuration', function () {
        var $button = $( '<button>click</button>' );

        $button.request({
            method: 'POST'
        });

        expect( $button.request( 'option', 'method' ) ).toBe( 'POST' );
    });

    it( 'should read the AJAX method from data-* configuration', function () {
        var $button = $( '<button data-method="HEAD">click</button>' );
        var testUrl = $button.data( 'method' );

        $button.request();

        expect( $button.request( 'option', 'method' ) ).toBe( 'HEAD' );
    });

    describe( 'submit', function () {

        beforeEach(function () {
            jasmine.getFixtures().load('button-1.html');
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it( 'should have set auto-submit disabled by default', function () {
            var $button = $( '<button>click</button>' );

            $button.request();

            expect( $button.request( 'option', 'autoSubmit' ) ).toBe( false );
        });

        it( 'should emit a submit event before the AJAX request', function () {
            jasmine.spyOnEvent( '#button-1', 'requestsubmit' );

            var $button = $( '#button-1' ).request();

            expect( 'requestsubmit' ).not.toHaveBeenTriggeredOn( '#button-1' );

            $button.request( 'submit' );

            expect( jasmine.Ajax.requests.mostRecent().url ).toBe( '/test' );

            expect( 'requestsubmit' ).toHaveBeenTriggeredOn( '#button-1' );
        });

        it( 'should emit a success event after the AJAX request', function () {
            jasmine.spyOnEvent( '#button-1', 'requesterror' );
            jasmine.spyOnEvent( '#button-1', 'requestsuccess' );

            $( '#button-1' ).request().request( 'submit' );

            expect( 'requestsuccess' ).not.toHaveBeenTriggeredOn( '#button-1' );

            jasmine.Ajax.requests.mostRecent().response({
                status: 200,
                contentType: 'text/plain',
                responseText: 'successful response'
            });

            expect( 'requestsuccess' ).toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requesterror' ).not.toHaveBeenTriggeredOn( '#button-1' );
        });

        it( 'should receive the AJAX response as the success event', function () {
            var done = jasmine.createSpy( 'done' );
            jasmine.Ajax.stubRequest( '/test' ).andReturn({
                status: 200,
                contentType: 'text/plain',
                responseText: 'successful request'
            });

            $( '#button-1' )
                .on( 'requestsuccess', function ( evt ) {
                    done( evt );
                })
                .request()
                .request( 'submit' )
            ;

            expect( done ).toHaveBeenCalledWith( 'successful response' );
        });

        it( 'should emit an error event when the AJAX request fails', function () {
            jasmine.spyOnEvent( '#button-1', 'requesterror' );
            jasmine.spyOnEvent( '#button-1', 'requestsuccess' );

            $( '#button-1' ).request().request( 'submit' );

            expect( 'requesterror' ).not.toHaveBeenTriggeredOn( '#button-1' );

            jasmine.Ajax.requests.mostRecent().response({
                status: 400,
                contentType: 'text/plain',
                responseText: 'error message'
            });

            expect( 'requesterror' ).toHaveBeenTriggeredOn( '#button-1' );
            expect( 'requestsuccess' ).not.toHaveBeenTriggeredOn( '#button-1' );
        });

        it( 'should receive the AJAX object as the error event', function () {
            var done = jasmine.createSpy( 'done' );
            jasmine.Ajax.stubRequest( '/test' ).andReturn({
                status: 400,
                contentType: 'text/plain',
                responseText: 'error request'
            });

            $( '#button-1' )
                .on( 'requesterror', function ( evt ) {
                    done( evt );
                })
                .request()
                .request( 'submit' )
            ;

            expect( done ).toHaveBeenCalledWith( jasmine.Ajax.requests.mostRecent() );
        });
    });
});
