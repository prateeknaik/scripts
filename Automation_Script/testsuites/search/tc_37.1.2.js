/*
 Auther : Sanket
 Description:    This is a casperjs automated test script for showing that,When search results are displayed in number of pages, 
 * the link for the currently loaded page which is displayed at the bottom of search results should be disabled
 */

casper.test.begin("in search div pagination current page is disabled", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = "a<-12"; // keyword to be searched
    var temp;//to get pagination class attributes

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    casper.wait(10000);

//login to Github and RCloud
    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);
    });

//searching for the keyword
    casper.then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', item);
            this.wait(6000);
            casper.evaluate(function () {
                $('.icon-search').click();
            });
        });
    });

    casper.then(function () {
        this.wait(3000);
        casper.then(function () {
            this.wait(5000);
            temp = this.getElementInfo({
                type: 'xpath',
                path: '/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[3]/div/ul/li[2]'
            }).tag;
            var q = temp.search('disabled');

            if (q > 0) {
                this.test.pass('Current page number is disabled to click');
            }
            else {
                this.test.fail('current page number is not disabled');
            }
        });
    });

    casper.run(function () {
        test.done();
    });
});
