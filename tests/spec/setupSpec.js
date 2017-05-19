describe('jQuery Request', function () {

    beforeEach(function () {
        jasmine.getFixtures().load('button-1.html');
    });

    it('should return the jQuery object', function () {
        var $button = $('#button-1');
        var obj = $button.request();

        expect( obj ).toBe( $button );
    });
});
