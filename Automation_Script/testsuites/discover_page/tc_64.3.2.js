/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, whether the encrypted notebooks are displayed in discover page or not
 */


//Begin Tests
casper.test.begin("Visibility of notebook assigned to group", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var GroupName, GroupName1, Title, URL, after, before;
    var notebookid;//to get the notebook id
    var before_title, after_title;
    var notebook_name;
    var status;
    

    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
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

    //Create 1st Group
    casper.then(function () {
        GroupName = this.evaluate(function () {
            return Math.random().toString(36).substr(2, 3);
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

    //Create one notebook
    functions.create_notebook(casper);
    
    casper.wait(9000);
    
    casper.then(function (){
        before_title = this.fetchText(x(".//*[@id='notebook-title']"));
        this.echo(before_title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Group20");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        this.wait(5000);
        var i = this.fetchText(x(".//*[@id='notebook-title']"));
        this.echo('After rename notebook name is:' + i);
    });
    
    
    casper.wait(6000);
    
    //Getting notebookid
    casper.then(function (){
        this.wait(5000);
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });
    
    casper.wait(3000);
    
    casper.then(function () {
        Title = this.fetchText("#notebook-title");
        this.echo("Notebook title is : " + Title);
        console.log(URL = this.getCurrentUrl());
    });

    casper.then(function () {
        this.thenOpen(URL);
        this.wait(8000);
    });

    //Click on notebook info icon
    casper.wait(5000).then(function () {
        this.then(function () {
            this.mouse.move('.jqtree-selected > div:nth-child(1)');
            this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
                this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
                console.log('Clicking notebook info');
            });
        });
    });

    //Click on Public/Group link
    casper.wait(5000).then(function () {
        this.click(".group-link > a:nth-child(1)");
    });

    //Select group radio button
    casper.wait(5000).then(function () {
        this.click('#greenRadio');
    });

    //select the group and click ok
    casper.wait(5000).selectOptionByText = function (selector, textToMatch) {
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

    casper.wait(5000).then(function () {
        this.selectOptionByText("select.ng-pristine:nth-child(2)", GroupName);
        console.log("Selecting 1st " + GroupName + "from the drop down menu");
    });

    casper.wait(10000).then(function () {
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Are you sure you want to move notebook") {
                return true;
            }
        });
        this.click("span.btn:nth-child(3)")
        console.log("Notebook added to the 1st group");
    });
    
    casper.wait(5000);

    //Validate the group name
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
            this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
            console.log('Clicking notebook info');
        });
    });

    casper.wait(5000);

    casper.then(function () {
        before = this.fetchText(".group-link > a:nth-child(1)");
    });
    
    //Click on notebook info icon
    casper.then(function () {
        this.thenOpen(URL);
        this.wait(10000)
    });
    

    casper.wait(5000);

    //Click on notebook info icon
    casper.then(function () {
        this.then(function () {
            this.mouse.move('.jqtree-selected > div:nth-child(1)');
            this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
                this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
                console.log('Clicking notebook info');
            });
        });
    });

    casper.wait(5000);

    //Click on Public/Group link
    casper.then(function () {
        this.click(".group-link > a:nth-child(1)");
    });
    casper.wait(5000);
    //Select group radio button
    casper.then(function () {
        this.click('#greenRadio');
    });

    casper.wait(2000);

    //select the group and click ok
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
        this.wait(2999);
        this.selectOptionByText("select.ng-pristine:nth-child(2)", GroupName1);
        console.log("Selecting 1st " + GroupName1 + "from the drop down menu");
    });

    casper.wait(5000);

    casper.then(function () {
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Are you sure you want to move notebook") {
                return true;
            }
        });
        this.click("span.btn:nth-child(3)")
        console.log("Notebook added to the 2nd group");
    });


    //casper.wait(2000);

    //Validate the group name
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.waitUntilVisible('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)', function () {
            this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)');
            console.log('Clicking notebook info');
        });
    });

    casper.wait(2000);

    casper.then(function () {
        before = this.fetchText(".group-link > a:nth-child(1)");
        this.test.assertNotEquals(after, before, "Confirmed that Notebook is assigned to existing group");
    });
    
    
    casper.wait(4000);
  
    casper.wait(4000).then(function(){
       this.thenOpen('http://127.0.0.1:8080/discover.html');
       console.log('Opening discover page');
    });
    
    
    casper.wait(6000);
    
    casper.wait(4000).then(function(){
        this.click(x(".//*[@id='metric-type']/li[1]/a"));
        console.log('Clicking on recent');
    });
    
    
    casper.wait(6000);
   
    
    casper.viewport(1024, 768).then(function(){
       this.test.assertExists(x(".//*[@id='metric-type']/li[2]/a"),'The element popular exists, hence discover page has got loaded'); 
        
    });
    
    casper.wait(6000);
    
    
    casper.wait(4000).then(function(){
       this.test.assertTextDoesntExist('Group20', 'Page body does not contain grouped notebook'); 
       
    });
    
    casper.wait(9000);

    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);        
    });
    
    
    casper.wait(8000);
    
    casper.then(function (){
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("grp20");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
    });
    
    casper.wait(4000);
      
    casper.run(function () {
        test.done();
    });
});
