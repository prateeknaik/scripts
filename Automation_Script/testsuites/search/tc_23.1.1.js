/*
 Author: Prateek
 Description: This is a casperjs automated test script for showing that,The text box for search results
 *  should display the full-text searched in the text box for "Search For" 
*/

//Begin Tests
casper.test.begin("Display Text under 'Search For' text box", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = '"MC-BC"';//item to be searched
    var title;//get notebook title

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

    functions.create_notebook(casper);
    functions.addnewcell(casper);
    functions.addcontentstocell(casper, item);

    //function to search the entered item
    casper.viewport(1024, 768).then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
    });

    //Checking for search div
    casper.then(function () {
        if (this.visible('#input-text-search')) {
            console.log('Search text field is visible');
        }
        else {
            var z = casper.evaluate(function () {
                $(' .icon-search').click();
            });
            this.echo("Opened Search div");
        }
    });

    //entering item to be searched
    casper.then(function () {
        this.sendKeys('#input-text-search', item);
        this.wait(6000);
        this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
    });

    casper.wait(5000);

    casper.then(function () {
        var temp = this.fetchText({
            type: 'xpath',
            path: '//*[@id="input-text-search"]'
        }, item);
        if (temp == item) {
            this.test.pass("The text searched in search bar is:" + temp);
        } else {
            this.test.fail("The text searched in search bar is not displayed");
        }
    });

    casper.then(function () {
        this.click(x(".//*[@id='selection-bar']/div/div/input"));
        this.click(x(".//*[@id='selection-bar-delete']"))
        console.log('Deleting a cell from 1st notebook');
    });

    casper.run(function () {
        test.done();
    });
});
