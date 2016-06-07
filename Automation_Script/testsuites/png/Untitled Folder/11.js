//Begin Tests
casper.test.begin("Test", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var group = 'EXCELLENCE()';
    var GP;

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

    //functions.create_notebook(casper);

    //Function to generate group names 
    casper.then(function () {
        ID = this.evaluate(function () {
            return Math.random().toString(36).substr(2, 9);
        });
    });

    // //Creating a group
    casper.then(function () {
        this.click("li.dropdown > a:nth-child(1)");
        this.evaluate(function () {
            $('#manage_groups').click();
        });
        this.echo('opened manage group dialog box');
        this.wait(2000);
    });

    // casper.then(function () {
    //     this.wait(4000);
    //     casper.setFilter("page.prompt", function (msg, currentValue) {
    //         if (msg === "Enter new group name") {
    //             return ID;
    //         }
    //     });
    // });

    casper.wait(5000);

    casper.then(function (){
        this.click("select.ng-pristine:nth-child(3)");
        this.wait(8000);
        GP = this.fetchText("select.ng-pristine:nth-child(3)");
        this.echo(GP);
        
    });

    // //Creating a group and adding members to it
     casper.then(function () {
        var patt = /EXCELLENCE()/g;
        var result = patt.test(GP);
    //     this.click("li.dropdown > a:nth-child(1)");
    //     this.evaluate(function () {
    //         $('#manage_groups').click();
    //     });
    //     this.echo('opened manage group dialog box');
    //     this.wait(2000);
     });

    // casper.then(function () {
    //     this.wait(4000);
    //     casper.setFilter("page.prompt", function (msg, currentValue) {
    //         if (msg === "Enter new group name") {
    //             return ID;
    //         }
    //     });
    //     this.click('span.label:nth-child(1)');
    //     this.echo('Entered Group name');
    // });

    // casper.then(function (){
    //     this.click(x(".//*[@id='group-tab']/div[3]/div/div/div[1]"));
    //     this.echo('Clicking memeber field');
    //     this.sendKeys(x(".//*[@id='group-tab']/div[3]/div/div/div[1]"), 'sanke');
    //     this.echo('Added memebr');
    //     this.wait(3000);
    //     this.click(x(".//*[@id='group-tab']/div[3]/div/div/div[2]/div/div"), 'sanketd11', {keepFocus: true});
    //     this.echo('Clicking the name from the memebr suggested');
    //     this.wait(4000);       
    // });



    // casper.wait(15000).then(function (){
    //     this.evaluate(function () {
    //         $('span.btn:nth-child(3)').click();
    //     });
    //     this.wait(5000);
    //     this.echo('inserted memebr to the group');
    // });

    
    casper.run(function () {
        test.done();
    });
});