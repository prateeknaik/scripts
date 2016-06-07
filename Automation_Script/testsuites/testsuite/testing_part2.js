console.log('Description :');
console.log('This is an automated testscript to be run on RCloud 1.2 to test if some of the basic features are working properly');
console.log('The features to be tested are : Search a given item,rename a notebook, logout of RCloud and logout of Github ');
casper.test.begin("Automation testing part-2", 9, function suite(test) {

    var x = require('casper').selectXPath;//required if we detect an element using xpath
    var github_username = casper.cli.options.username;//user input github username
    var github_password = casper.cli.options.password;//user input github password
    var rcloud_url = casper.cli.options.url;//user input RCloud login url
    var functions = require(fs.absolute('basicfunctions.js'));//invoke the common functions present in basicfunctions.js
    var combo;//store notebook author + title	
    var input_Rcode = "56+98";//R code to be entered
    var item = 'KANTHI';//item to be searched
    var title;//get notebook title
    var newtitle;//get modified notebook title


    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');//inject jquery codes
    });

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.wait(10000);

    casper.then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);
    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo(" New Notebook title : " + title);
        this.wait(2000);
        combo = github_username + ' / ' + title;
    });

    //getting Notebook ID
    var notebookid;
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
        item = "id:" + notebookid;
    });

    //Added a new cell and execute the contents
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', input_Rcode);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/span[1]/i'});//xpath for executing the contents
		this.wait(6000);
    });

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
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', item);
            this.wait(6000);
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
        });
        var counter = 0;//variable to store number of search results
        casper.wait(5000);
        //counting number of Search results
        casper.then(function () {
            do
            {
                counter = counter + 1;
                this.wait(2000);
            } while (this.visible(x('/html/body/div[3]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a')));
            counter = counter - 1;
            this.echo("number of search results:" + counter);
        });
        //verify that the searched item is found in the local user's div
        casper.viewport(1366, 768).then(function () {
            //this.echo("Combo= "+combo);
            for (var i = 1; i <= counter; i++) {
                this.wait(5000);
                var result = this.fetchText(x('/html/body/div[3]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr/td/a'));
                //this.echo(result);
                this.test.assertEquals(result, combo, 'Notebook with searched id has been found');
                break;

            }//for closes
        });//function closes
    });

    //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Test  Notebook");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        this.wait(4000);
    });

    casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has changed successfully");
    });

    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of RCloud');
        this.click({ type : 'xpath' , path : ".//*[@id='rcloud-navbar-menu']/li[5]/a"});
        this.wait(7000);
    });

    casper.viewport(1366, 768).then(function () {
        this.echo("The url after logging out of RCloud : " + this.getCurrentUrl());
        this.test.assertTextExists(
            'Log back in', "Log Back In option exists"
        );
    });

    casper.viewport(1366, 768).then(function () {
        console.log('Logging out of Github');
        this.test.assertTruthy(this.click({type: 'css', path: '#main-div > p:nth-child(2) > a:nth-child(2)' }), "Logged out of Github");
        this.wait(10000);
    });

    casper.viewport(1366, 768).then(function () {
        this.echo("The url where the user can confirm logging out from Github : " + this.getCurrentUrl());
        this.test.assertTextExists(
            'Are you sure you want to sign out?', "Option to Sign Out of GitHub exists"
        );
    });

    casper.viewport(1366, 768).then(function () {
        this.click("form input[type=submit][value='Sign out']");
        console.log('logged out of Github');
        this.wait(7000);
        this.echo("The url after logging out of Github : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that successfully logged out of Github");

    });

    casper.run(function () {
        test.done();
    });
});
    
    
    
    
    
    
    
    
