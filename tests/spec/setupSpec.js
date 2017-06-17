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
            var $button = $( '#button-1' ).request();

            jasmine.spyOnEvent( '#button-1', 'requestsubmit' );

            expect( 'requestsubmit' ).not.toHaveBeenTriggeredOn( '#button-1' );

            $button.request( 'submit' );

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

    } );

} );
