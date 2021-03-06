var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'test_app'
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
        });

        describe("when the user starts a session", function() {
            it("should show them the menu", function() {
                return tester
                    .start()
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Welcome to COFFEE! (or tea):',
                            '1. Brew a cup',
                            '2. Is it ready?',
                            '3. Preferences',
                            '4. Exit'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user is at the main menu", function() {
            it("should brew a cup on 1", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('1')
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Brewing!',
                        ].join('\n')
                    })
                    .run();
            });

            it("should check status on 2", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('2')
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Status pending.'
                        ].join('\n')
                    })
                    .run();
            });

            it("should set preferences on 3", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('3')
                    .check.interaction({
                        state: 'states:prefs',
                        reply: [
                            'What is your beverage of choice?',
                            '1. Coffee',
                            '2. Tea'
                        ].join('\n')
                    })
                    .run();
            });

            it("should exit on 4", function() {
                return tester
                    .setup.user.state('states:start')
                    .input('4')
                    .check.interaction({
                        state: 'states:start',
                        reply: [
                            'Bye!'
                        ].join('\n')
                    })
                    .run();
            });
        });
    });
});
