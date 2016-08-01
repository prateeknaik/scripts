/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, newly created notebook is visible in discover page
 */

//Begin Tests
casper.test.begin("Visibility of newly created Notebook in discover page", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id
    var title;

    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
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
    
    casper.wait(4000);
    
    //create a new notebook
    functions.create_notebook(casper);
    
    
    casper.wait(5000);
    
    //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("xyz");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        
    });

    casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
    });
    
    casper.wait(6000);

    
    //Getting notebookid
    casper.then(function (){
        this.wait(5000);
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
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
       this.test.assertTextExists('xyz', 'page body contains "newtitle"'); 
       console.log('Newly created notebook is present in discover page');
    });
    
    casper.wait(9000);

    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);        
    });
    
    
    
     casper.wait(7000);
    
     //getting the notebook title and modifying it
     casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("ef");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        
    });

     casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
    });
    
     casper.wait(6000);
    
     casper.run(function () {
        test.done();
        
    });
});