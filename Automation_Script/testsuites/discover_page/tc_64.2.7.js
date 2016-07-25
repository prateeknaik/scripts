/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, whether notebook rename is visible or not
 */

//Begin Tests

casper.test.begin(" Notebook rename reflection ",5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var before_title, after_title;
    var notebookid;//to get the notebook id
    var title;
    
    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
    });

    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(2000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and RCLoud logo");
        functions.validation(casper);
        this.wait(2000);
    });
    
    casper.wait(6000);

    functions.create_notebook(casper);
    
    casper.wait(6000);

    casper.then(function (){
        before_title = this.fetchText(x(".//*[@id='notebook-title']"));
        this.echo(before_title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Rename");
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
       this.test.assertTextExists('Rename', 'page body contains renamed notebook'); 
       
    });
    
    casper.wait(9000);

    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);        
    });
    
    
    
     casper.wait(7000);
    

    //Making notebook as it was earlier
    casper.then(function (){
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Notebook20");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
    });
    
    casper.wait(6000);

    casper.run(function () {
        test.done();
    });
});
