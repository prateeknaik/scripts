/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showning that For the "Search" option, the text entered in the text box for
 'full-text search' will consist of Special Characters like Ex: !@#$%^&*()_+= etc. only

 */

//Begin Tests

casper.test.begin(" Special Characters Ex: !@#$%^&*()_+= ", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = "!@#$%^&*()_+= ";//item to be searched
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

    //Create a new Notebook.
    functions.create_notebook(casper);

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        
    });

    //Added a new cell and execute the contents
    casper.then(function() {
		functions.addnewcell(casper);
		this.echo("created new cell");
	});

    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', item);
        this.wait(3000);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/span[1]/i'});//xpath for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    casper.then(function(){
		if (this.visible('#input-text-search')) {
                console.log('Search div is already opened');
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
            
            casper.then(function(){
				this.test.assertSelectorHasText({ type: 'xpath', path:'//*[@id="search-results-scroller"]'}, 'error');
				this.echo("search item doesnot parse special charaters");
			});

    casper.run(function () {
        test.done();
    });
});
