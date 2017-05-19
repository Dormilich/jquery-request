describe( 'jQuery Request', function () {

    beforeEach(function () {
        jasmine.getFixtures().load( 'button-1.html' );
    });

    it( 'should return the jQuery object', function () {
        var $button = $( '#button-1' );
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
        var $button = $( '#button-1' );
        var testUrl = $button.data( 'url' );

        $button.request();

        expect( $button.request( 'option', 'url' ) ).toBe( testUrl );
    });

    it( 'should overwrite explicit settings with data-* settings', function () {
        var $button = $( '#button-1' );
        var dataUrl = $button.data( 'url' );
        var testUrl = 'http://example.com/api?key=' + Math.random();
        $button.request({
            url: testUrl
        });

        expect( $button.request( 'option', 'url' ) ).toBe( dataUrl );
    });
});
