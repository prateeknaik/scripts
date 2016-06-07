/*
 Author: Prateek
 Description:This test describes, Check whether user/admin can add one more members to the that group or not
 */

//Begin Tests
casper.test.begin("Adding 2 member to the group", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var GP = '5ro9';
    var GroupName, GroupName1, url, url1;

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

    casper.then(function (){
        url = this.getCurrentUrl();
    });

    //Function to generate group names
    casper.then(function () {
        GroupName = this.evaluate(function () {
            return Math.random().toString(36).substr(2, 7);
        });
        console.log('1st group name is :' + GroupName);
    });

    //Open manage group window
    casper.then(function () {
        this.click("li.dropdown > a:nth-child(1)");
        console.log('Opening advanced drop down menu');
        this.evaluate(function () {
            $('#manage_groups').click();
        });
        this.echo('opened manage group dialog box');
        this.wait(2000);
    });

    //Creating 1st group
    casper.then(function () {
        console.log("Clicking on create new group")
        this.wait(4000);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter new group name") {
                return GroupName;
            }
        });
        this.click("span.label:nth-child(1)");
        console.log("Create 1st group")
        this.evaluate(function () {
            $('span.btn:nth-child(3)').click();
        });
    });

    casper.then(function (){
        // this.mouse.move('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
        // this.wait(2000)
        // this.click("..jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)");
        this.then(function () {
                this.mouse.move('.jqtree-selected > div:nth-child(1)');
                this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
                    this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
                });
        });

        console.log('Clicking on info icon');
        this.then(function(){
            this.wait(3000)
            this.click('.group-link > a:nth-child(1)')
        });
        this.then(function(){
            this.wait(4000)
            this.click('#greenRadio')    
        });
    });

    //Assigning to 1st group
    casper.selectOptionByText = function (selector, textToMatch) {
        this.evaluate(function (selector, textToMatch) {
            var select = document.querySelector(selector),
                found = false;
            Array.prototype.forEach.call(select.children, function (opt, i) {
                if (!found && opt.innerHTML.indexOf(textToMatch) !== -1) {
                    select.selectedIndex = i;
                }
            });
        }, selector, textToMatch);
    };

    casper.then(function () {
        this.selectOptionByText("select.ng-pristine:nth-child(2)", GroupName);
        console.log("Selecting 1st " + GroupName + "from the drop down menu");
        this.click("span.btn:nth-child(3)")
        console.log("adding to 1st group");
    });


    casper.wait(5000);

    functions.create_notebook(casper);

    casper.then(function(){
        this.thenOpen(url);
        this.wait(8000);
    });

    casper.then(function (){
         GroupName1 = this.evaluate(function () {
            return Math.random().toString(36).substr(2, 7);
        });
        console.log('2nd  group name is :' + GroupName1);
    });

    //Open manage group window
    casper.then(function () {
        this.click("li.dropdown > a:nth-child(1)");
        console.log('Opening advanced drop down menu');
        this.evaluate(function () {
            $('#manage_groups').click();
        });
        this.echo('opened manage group dialog box');
        this.wait(2000);
    });

    //Creating 2nd group
    casper.then(function () {
        console.log("Clicking on create new group")
        this.wait(4000);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter new group name") {
                return GroupName1;
            }
        });
        this.click("span.label:nth-child(1)");
        console.log("Create 2nd  group")
        this.evaluate(function () {
            $('span.btn:nth-child(3)').click();
        });
    });


    casper.then(function (){
        // this.mouse.move('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
        // this.wait(2000)
        // this.click("..jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)");
        this.then(function () {
                this.mouse.move('.jqtree-selected > div:nth-child(1)');
                this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
                    this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
                });
        });
        
        console.log('Clicking on info icon');
        this.then(function(){
            this.wait(3000)
            this.click('.group-link > a:nth-child(1)')
        });
        this.then(function(){
            this.wait(4000)
            this.click('#greenRadio')    
        });
    });

    //Assigning to 1st group
    casper.selectOptionByText = function (selector, textToMatch) {
        this.evaluate(function (selector, textToMatch) {
            var select = document.querySelector(selector),
                found = false;
            Array.prototype.forEach.call(select.children, function (opt, i) {
                if (!found && opt.innerHTML.indexOf(textToMatch) !== -1) {
                    select.selectedIndex = i;
                }
            });
        }, selector, textToMatch);
    };

    casper.then(function () {
        this.selectOptionByText("select.ng-pristine:nth-child(2)", GroupName1);
        console.log("Selecting 2ndcreated " + GroupName1 + "from the drop down menu");
        this.click("span.btn:nth-child(3)")
        console.log("OKAY");
    });

    casper.then(function (){
        this.mouse.move('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)');
        this.wait(2000)
        this.click("ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)")
        this.wait(2000);
        var text = this.fetchText(".group-link");
        this.echo(text);
        this.test.assertEquals(text, GroupName1);
    });

    

    casper.wait(9000);

    casper.run(function () {
        test.done();
    });
});