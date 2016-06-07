/*
 Author: Prateek
/*
 Author: Prateek 
 Description: This is a casperjs automated test script for showning that, On clicking the GitHub Logout button present in "goodbye.R" page,
 *  the user gets a notification if he/she wants to log out of GitHub, confirming which,
 *  the user gets logged out from GitHub and Sign-In page of github.com opens
 */

//Begin Tests

casper.test.begin(" Logging out of GitHub", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        var title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //logout of RCloud & Github
    casper.then(function () {
        this.click({type: 'xpath', path: ".//*[@id='rcloud-logout']"});
        console.log('Logging out of RCloud');
        this.wait(3000);
    });

    //verifying whether user has logged out of RCloud or not
    casper.then(function () {
        if (this.test.assertSelectorHasText({
                type: 'xpath',
                path: ".//*[@id='main-div']/p[1]/a"
            }, 'Log back in', 'Log back in option is visible')) {
            this.test.pass('User is logged out of RCloud');
        } else {
            this.test.fail('User is not logged out of RCloud');
        }
    });

    //Looging out of GitHub 
    casper.viewport(1366, 768).then(function () {
        this.click({type: 'xpath', path: '/html/body/div[2]/p[2]/a[2]'}, "Logged out of Github");
        console.log('Logging out of Github');
        this.wait(3000);
    });

    casper.viewport(1366, 768).then(function () {
        this.click(".btn");
        console.log('logged out of Github');
        this.wait(2000);
        this.echo("The url after logging out of Github : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that successfully logged out of Github");
	});
    
	casper.run(function () {
        test.done();
    });
});
		
		
		
		
