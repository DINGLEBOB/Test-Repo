/*eslint-env node, jasmine */
/*eslint-disable no-unused-vars */

var webdriverio = require("webdriverio");
var options = {
    desiredCapabilities:
    {
        browserName: "phantomjs"
    }
};

var client;

describe("The security ", function()
{
    beforeEach(function(done)
    {
        client = webdriverio
            .remote(options)
            .init()
            .call(done);
    });
    it("Security Failed: Granted access to http://amber/dashboard", function(done)
    {
        client.url("http://amber/dashboard")
            .getUrl().then(function(value)
        {
            expect(value).toEqual("http://amber/login");
            done();
        });
    });
    it("Security Failed: Granted access to http://amber/maps/3", function(done)
    {
        client.url("http://amber/maps/3")
            .getUrl().then(function(value)
        {
            expect(value).toEqual("http://amber/login");
            done();
        });
    });
});

describe("Login Page:", function()
{
    beforeEach(function(done)
    {
        //console.log('jasmine env', jasmine.getEnv());
        client = webdriverio
            .remote(options)
            .init()
            .url("http://amber/login")
            .call(done);
    });

    it("Title does not match", function(done)
    {
        client
            .getTitle().then(function(value)
        {
            expect(value).toEqual("Canvas Technology");
            done();
        });

    });

    it("Username Error", function(done)
    {
        client
            .setValue("#session_username", "jmarohl")
            .getValue("#session_username").then(function(value)
        {
           expect(value).toEqual("jmarohl");
           done();
        });
    });

    it("Password Error", function(done)
    {
        client
            .setValue("#session_password", "temp1234")
            .getValue("#session_password").then(function(value)
        {
            expect(value).toEqual("temp1234");
            done();
        });
    });

    it("Error submitting login or loading dashboard", function(done)
    {
        client
            .setValue("#session_username", "jmarohl")
            .setValue("#session_password", "temp1234")
            .submitForm("#session_password")
            .getUrl().then(function(url)
        {
            expect(url).toEqual("http://amber/dashboard");
            done();
        });
    });
});

describe("Dashboard: ", function()
{
    beforeEach(function(done)
    {
        client = webdriverio
            .remote(options)
            .init()
            .url("http://amber/login")
            .setValue("#session_username", "jmarohl")
            .setValue("#session_password", "temp1234")
            .submitForm("#session_password")
            .url("http://amber/dashboard").then(function(url)
        {
            done();
        });
    }, 20000);
    it("Welcome not found", function(done)
    {
        client
            .getText("h3*=Welcome").then(function(text)
        {
            expect(text).toEqual("Welcome Jake Marohl");
            done();
        });
    });
    it("Fake Map Redirection Failed", function(done)
    {
        client
            .url("http://amber/maps/fakeMap").then(function()
        {
            client
                .getUrl().then(function(url)
            {
                expect(url).not.toEqual("http://amber/maps/fakeMap");
                done();

            });
        });
    });
});

describe("Map 4: ", function()
{
    beforeEach(function(done)
    {
        client = webdriverio
            .remote(options)
            .init()
            .url("http://amber/login")
            .setValue("#session_username", "jmarohl")
            .setValue("#session_password", "temp1234")
            .submitForm("#session_password")
            .url("http://amber/maps/4").then(function(url)
        {
            done();
        });
    });
    it("Waypoints not found", function(done)
    {
        client
            .click("[title='Waypoints']").then(function()
        {
            client
                .elements(".cart-entry").then(function(elements)
            {
                expect(elements).toBeDefined();
                for(var i = 0; i < elements.value.length; i++)
                {
                    expect(elements.value[i]).toBeDefined();
                }
                done();
            });
        });
    });
    it("Waypoint was not added",function(done)
    {
        client
            .click("[title='Waypoints']")
            .click(".pull-left.add-waypoint").then(function()
            {
                client
                    .windowHandleSize({width: 1024, height: 768})
                    //.saveScreenshot("screenshot")
                    .setValue("[data-reactid='.0.0.1.2.0.1.1.1']", "Temporary_Waypoint")
                    //.saveScreenshot("screenshot1")
                    .setValue("[data-reactid='.0.0.1.2.0.1.1.3']", "0")
                    //.saveScreenshot("screenshot2")
                    .setValue("[data-reactid='.0.0.1.2.0.1.1.5']", "0")
                    //.saveScreenshot("screenshot3")
                    /*.setValue('[data-reactid=".0.0.1.2.0.1.1.6.0"]', true)
                    .saveScreenshot("screenshot4")*/
                    .click("#image-map")
                    .click("[data-reactid='.0.0.1.2.0.1.1.8']")
                    .setValue("[data-reactid='.0.0.1.2.0.2.0.1']", "Temporary_Waypoint").then(function()
                    {
                        client.
                            element(".cart-name").then(function(element)
                        {
                            expect(element.value).toBeDefined();
                        });
                    })
                    //.saveScreenshot("screenshot5")
                    .call(done);


            });
    });
    it("Waypoint not removed", function(done)
    {
        client
            .windowHandleSize({width: 1024, height: 768})
            .click("[title=Waypoints]")
            .setValue("[data-reactid='.0.0.1.2.0.2.0.1']", "Temporary_Waypoint")
            //.saveScreenshot("screenshot1.jpg")
            /*.element('.cart-name').then(function(element)
            {
                console.log(element);
            })*/
            .leftClick(".cart-name")
            //.saveScreenshot("screenshot2.jpg")
            .click(".waypoint-add-button.pull-left")
            .setValue("[data-reactid='.0.0.1.2.0.2.0.1']", "Temporary_Waypoint").then(function()
            {
                client.
                    element(".cart-name").then(function(element)
                {
                    expect(element.value).toEqual(null);
                });
            })
            //.saveScreenshot("screenshot3.jpg")
            .call(done);
    });
    it("Routes not found", function(done)
    {
        client
            .click("[title='Routes']").then(function()
        {
            client
                .elements(".route-canvas").then(function(elements)
            {
                expect(elements).not.toEqual(null);
                for(var i = 0; i < elements.value.length; i++)
                {
                    expect(elements.value[i]).not.toEqual(null);
                }
                done();
            });

        });
    });
    it("Route not added", function(done)
    {
        client
            .click(".add-waypoint.pull-left").then(function()
        {
            client
                .windowHandleSize({width: 1024, height: 768})
                //.saveScreenshot("screenshot.jpg")
                /*.elements('.waypoint-selectable').then(function(elements)
                {
                    for(var i = 0; i < elements.value.length; i++)
                    {
                        client.
                            click('#' + elements[i].id);
                    }
                    
                })*/
                .click("div=W1")
                .click("div=W2")
                .click(".add-route-button")
                //.saveScreenshot("screenshot1.jpg")
                .click(".add-route-button")
                //.saveScreenshot("screenshot2.jpg")
                .click(".add-route-button")
                //.saveScreenshot("screenshot3.jpg")
                .setValue("[data-reactid='.0.0.1.1.1.1.1.1.1']", "Temporary_Route")
                //.saveScreenshot("screenshot4.jpg")
                .click(".add-route-button")
                //.saveScreenshot("screenshot5.jpg")
                //.saveScreenshot("screenshot5")
                .setValue("[data-reactid='.0.0.1.1.3.0.1']", "Temporary_Route").then(function()
                {
                    client.
                        element(".route-entry").then(function(element)
                    {
                        expect(element.value).toBeDefined();
                    });
                })
                .call(done);
        });
    });
    it("Route not removed", function(done)
    {
        client
            .windowHandleSize({width: 1024, height: 768})
            .setValue("[data-reactid='.0.0.1.1.3.0.1']", "Temporary_Route")
            //.saveScreenshot("screenshot1.jpg")
            /*.element('.cart-name').then(function(element)
            {
                console.log(element);
            })*/
            .leftClick(".route-entry")
            //.saveScreenshot("screenshot2.jpg")
            .click("button*=Delete")
            //.saveScreenshot("screenshot3.jpg")
            .setValue("[data-reactid='.0.0.1.1.3.0.1']", "Temporary_Route").then(function()
            {
                client.
                    element(".route-entry").then(function(element)
                {
                    expect(element.value).toEqual(null);
                });
            })
            .call(done);
    });
    it("Zones not found", function(done)
    {
        client
            .click("[title='Zones']").then(function()
        {
            client
                .elements(".zone-entry").then(function(elements)
            {
                expect(elements).not.toEqual(null);
                for(var i = 0; i < elements.value.length; i++)
                {
                    expect(elements.value[i]).not.toEqual(null);
                }
                done();
            });
        });
    });
    it("Zone not added", function(done)//                     TO BE FINISHED
    {
        client
            .click("[title='Zones']")
            .click(".add-waypoint.pull-left").then(function()
        {
            client
                .windowHandleSize({width: 1024, height: 768})
                //.saveScreenshot("screenshot.jpg")
                /*.elements('.waypoint-selectable').then(function(elements)
                {
                    for(var i = 0; i < elements.value.length; i++)
                    {
                        client.
                            click('#' + elements[i].id);
                    }
                    
                })*/
                .click("[data-reactid='.0.0.1.3.1.1.1.0.1']")
                .click(".add-button.full-button")
                //.saveScreenshot("screenshot1.jpg")
                .setValue("[data-reactid='.0.0.1.3.1.1.1.0.1']", "Temporary_Zone")
                //.saveScreenshot("screenshot2.jpg")
                .click(".edit-button.full-button")
                .moveToObject("#image-map")
                .buttonPress(0)
                //.saveScreenshot("screenshot3.jpg")
                .moveToObject("#image-map", 10, 5)
                .buttonPress(0)
                //.saveScreenshot("screenshot4.jpg")
                .moveToObject("#image-map", 5, 35)
                .buttonPress(0)
                //.saveScreenshot("screenshot5.jpg")
                .moveToObject("#image-map")
                .buttonPress(0)
                .click(".add-route-button")
                //.saveScreenshot("screenshot6.jpg")
                //.saveScreenshot("screenshot5")
                /*.setValue('[data-reactid=".0.0.1.1.3.0.1"]', "Temporary_Route").then(function()
                {
                    client.
                        element('.route-entry').then(function(element)
                    {
                        expect(element.value).toBeDefined();
                    })
                })*/
                .call(done);
        });
    });
    it("Zone not removed", function(done)
    {
        client
            .windowHandleSize({width: 1024, height: 768})
            .click("[title=Zones]")
            .setValue("[data-reactid='.0.0.1.3.2.0.1']", "Temporary_Zone")
            //.saveScreenshot("screenshot.jpg")
            /*.element('.cart-name').then(function(element)
            {
                console.log(element);
            })*/
            .leftClick(".zone-entry")
            //.saveScreenshot("screenshot1.jpg")
            .click(".remove-button.full-button")
            .setValue("[data-reactid='.0.0.1.3.2.0.1']", "Temporary_Zone").then(function()
            {
                client.
                    element(".zone-entry").then(function(element)
                {
                    expect(element.value).toEqual(null);
                });
            })
            //.saveScreenshot("screenshot3.jpg")
            .call(done);
    });
    it("Carts not found", function(done)
    {
        client
            .click("[title='Carts']")
                .elements(".cart-entry").then(function(elements)
            {
                expect(elements).toBeDefined();
                for(var i = 0; i < elements.value.length; i++)
                {
                    expect(elements.value[i]).not.toEqual(null);
                }
                done();
            });
    });
    it("Map Images not found", function(done)
    {
        client
            .elements(".leaflet-marker-icon").then(function(elements)
        {
            expect(elements).toBeDefined();
            for(var i = 0; i < elements.value.length; i++)
            {
                expect(elements.value[i]).not.toEqual(null);
            }
            done();
        });
    });
});

describe("Cart Click: ", function()
{
    var cartName;
    beforeEach(function(done)
    {
        client = webdriverio
            .remote(options)
            .init()
            .url("http://amber/login")
            .setValue("#session_username", "jmarohl")
            .setValue("#session_password", "temp1234")
            .submitForm("#session_password")
            .url("http://amber/maps/4")
            .windowHandleSize({width: 1024, height: 768})
            .leftClick("img[src*='/cart']")
            //.saveScreenshot("screenshot.jpg")
            .call(done);


    }, 20000);

    it("Cart Pop-Up not occuring or Info Panel not changing", function(done)
    {
        client
            .windowHandleSize({width: 1024, height: 768})
            .isVisible(".cart-popup")
            .getText(".cart-popup-name").then(function(text)
        {
            cartName=text;
        })
            //.saveScreenshot("screenshot1.jpg")
            .click(".cart-popup-details")
            //.saveScreenshot("screenshot2.jpg")
            .getText(".item-name").then(function(text)
        {
            expect(cartName).toEqual(text);
        })
            .call(done);
    });
});
    