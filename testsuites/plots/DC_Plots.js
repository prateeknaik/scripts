casper.test.begin("Test script for DC_Plot", 8, function suite(test) {

    var x = require('casper').selectXPath;//required if we detect an element using xpath
    var github_username = casper.cli.options.username;//user input github username
    var github_password = casper.cli.options.password;//user input github password
    var rcloud_url = casper.cli.options.url;//user input RCloud login url
    var functions = require(fs.absolute('basicfunctions.js'));//invoke the common functions present in basicfunctions.js
    var URL
    var NB_ID = 'ac79c5c43d5ea002bf75'

    //Code to display Console errors
    // casper.on('remote.message', function (msg) {
    //     console.log('remote message caught: ' + msg);
    // });

    //Code to display errors
    // casper.on('page.error', function (msg, trace) {
    //     console.log('Error: ' + msg, 'ERROR');
    // });

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');//inject jquery codes
    });

    casper.viewport(1024, 768).then(function () {
        test.comment('⌚️  Logging in to RCloud using GitHub credentials...');
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.then(function () {
        test.comment('⌚️  Validating page...');
        console.log('validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options');
        functions.validation(casper);
    });

    functions.create_notebook(casper);

    casper.then(function (){
        URL = this.getCurrentUrl();
        this.thenOpen(URL);
    });

    casper.wait(10000);

    //Verifying for Load Notebook ID
    casper.then(function () {
        test.comment('⌚️  opening notebook using Load NOtebook by ID feature...');
        functions.open_advanceddiv(casper);
        console.log("Clicking on advanced dropdown");
        this.wait(2999);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter notebook ID or github URL:") { // message between quotes is the alerts message
                return NB_ID;
            }
        });
        this.click("#open_from_github");
        console.log("Using Load Notebook ID we are opening that particular Notebook");
        this.wait(8000);
    });

    functions.fork(casper);

    casper.then(function () {
        this.waitForSelector('.icon-share', function () {
            this.test.assertExists('.icon-share', 'the element Shareable Link exists after loading Notebook');
        });
        this.waitForSelector('span.cell-selection > span:nth-child(1) > input:nth-child(1)', function () {
            this.test.assertExists('span.cell-selection > span:nth-child(1) > input:nth-child(1)', 'Cell checkbox exists after loading Notebook');
        });
    });

    casper.then(function () {
        console.log("Both the elements are visible hence confirmed that the page is completely gets loaded");
        console.log("⌚️ Now check whether plot has generated or not");
        functions.runall(casper);
    });

    casper.then(function(){
        this.wait(3000);
        this.waitForSelector('._144', function () {
            this.test.assertExists('._144', 'Confirmed that cell has prodeced expected plot using "DC_Plot" library');
        });
    });

    casper.run(function () {
        test.done();
    });
});
