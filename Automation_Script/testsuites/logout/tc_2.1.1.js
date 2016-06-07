/*
 Author: Prateek
 Description:    This is a casperjs automated test script for showning thatOn clicking the "logout" link present on the top-right corner of 
 * the main page, "goodbye.R" page is loaded with a message "You are now logged out of Rcloud" and a link for "Log back in"
 */

//Begin Tests

casper.test.begin(" Logging out of RCLoud", 5, function suite(test) {

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
		if (this.test.assertSelectorHasText({type: 'xpath', path: ".//*[@id='main-div']/p[1]/a"}, 'Log back in','Log back in option is visible')) {
			this.test.pass('User is logged out of RCloud');
		} else {
			this.test.fail('User is not logged out of RCloud');
		}
	});

	casper.run(function () {
		test.done();
	});
});
		
		
		
		
