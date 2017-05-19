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
});
