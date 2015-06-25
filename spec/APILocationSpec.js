/**
 * Complete Test of JavaScript Object Manager
 */

/**
 * Test Initialize method
 */
describe("Testing API Location", function(){

  it("should be able to change api location", function() {
    Moback.setAPILocation('http://52.26.174.245:8080/');
    expect(Moback.showAPILocation().url).toBe('http://52.26.174.245:8080/');
  });

});