/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, another user's notebook is opened in edit.html,
  check that particular notebook is displayed in Discover page's recent tab
 
 */

//Begin Test
casper.test.begin("Another user's notebook gets displayed in Discover page", 5, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var Notebook_ID = 'f02c57f83d68d22df45077d92c1db693 ';//Notebook ID of some other user
    
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
    
    functions.create_notebook(casper);
    
    casper.viewport(1024, 768).then(function () {
        this.wait(4000);
        var url = this.getCurrentUrl();
        this.thenOpen(url);
        this.wait(8000);
        var current_title = functions.notebookname(casper);
        this.echo("Title of currently loaded Notebook : " + current_title);
        this.echo("Notebook owner = " + this.fetchText({type: 'css', path: '#notebook-author'}));
    });
    
    casper.then(function () {
        functions.open_advanceddiv(casper);
		this.echo("Clicking on dropdown");
        this.wait(2999);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter notebook ID or github URL:") {
                return Notebook_ID;
            }
        });
        this.click("#open_from_github");
        this.echo("Opening Notebook using Load Notebook ID");
        this.wait(10000);
    });

    casper.then(function () {
        var url = this.getCurrentUrl();
        this.thenOpen(url);
        this.wait(8000);
        Notebook_id1 = url.substring(41, 73);
        console.log( Notebook_id1);
		var current_title = functions.notebookname(casper);
        this.echo("Title of currently loaded Notebook : " + current_title);
        this.echo("Notebook owner = " + this.fetchText({type: 'css', path: '#notebook-author'}));
        console.log('Using ID of existing notebook of different user is opened using Load notebook id');
	});
    
    casper.wait(6000);
  
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
       this.test.assertTextExists('n3', 'Notebook of other user is present in discover page'); 
       
    });
    
    casper.wait(9000);

    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + Notebook_ID);
        this.wait(8000);        
    });
	
	casper.run(function () {
        test.done();
    });
});
