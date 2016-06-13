/*
 Auther : Tejas     (tc_32.1.1)
 Description: This is a casperjs automated test script for showing that workspace div will display all the variable that are initialised in code
 */


casper.test.begin("Display all variables in workspace div", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var rcloud_url = "https://rjore.com/athleticu-client/";
    var username = 'patste@d219.org';
    var pass = '123';

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    // casper.wait(10000);

    //login to Github and RCloud
    casper.viewport(1024, 768).then(function () {
        this.test.assertExist(x(".//*[@id='userId']"), "Page has opened");
        this.sendKeys(x(".//*[@id='userId']"), username);
        this.sendKeys(x(".//*[@id='password']"), pass);
    });

    casper.viewport(1024, 768).then(function () {
        this.click(x(".//*[@id='login-form']/button"));
        // this.wait(5000);
    });

    casper.then(function () {
        var url2 = this.getCurrentUrl();
            this.thenOpen(url2);
        console.log("Home page opened")
        this.test.assertExist(x(".//*[@id='sidebar-menu']/div/ul/li[4]/a"));
        this.click(x(".//*[@id='sidebar-menu']/div/ul/li[4]/a"))
        this.click("li.menu_item:nth-child(4) > a:nth-child(1)");
        console.log("Clicking on side panel");

        this.wait(4000).waitUntilVisible("li.menu_item:nth-child(4) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1", function () {
            this.click(x(".//*[@id='sidebar-menu']/div/ul/li[4]/ul/li[1]/a"));
        });
    });

    casper.wait(5000).then(function () {
        this.test.selectorhasText(".whText > h3:nth-child(1)", "All Exercise List");
        this.echo("Page opened");

        this.click("a.paginate_button:nth-child(7)");
        this.click("tr.odd:nth-child(1)");
        this.click("a.btn-xs:nth-child(3)");
    });


    casper.run(function () {
        test.done();
    });
});