/* 
 Author: Amith
 Description: This is a casperjs automation script for checking that, deleted notebook shouldn't be displayed under discover page
 */

//Begin Tests

casper.test.begin("Visibility of deleted notebook", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;
    var initial_title;

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
    
    casper.wait(4000);

    //Get title of currently loaded notebook
    casper.viewport(1366, 768).then(function () {
        initial_title = functions.notebookname(casper);
        this.echo("Title of initially loaded Notebook : " + initial_title);
        this.wait(3000);
    });
    
    casper.wait(4000);
    
    //Create a new Notebook.
    functions.create_notebook(casper);
    
    casper.wait(3000);
    
    //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Delete notebook");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        
    });
    
    casper.wait(4000);

    casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
    });
    
    casper.wait(6000);

    functions.checkstarred(casper);
    
    casper.wait(4000);
    
    //deleting the newly created notebook
    functions.delete_notebooksIstarred(casper);
    
    casper.wait(10000);

    //checking if the previously loaded notebook has got loaded
    casper.viewport(1024, 768).then(function () {
        this.wait(4000);
        var current_title = functions.notebookname(casper);
        this.echo("Title of currently loaded Notebook : " + current_title);
        this.wait(3000);
        this.test.assertEquals(current_title, initial_title, "Previously loaded notebook has got loaded");
        this.echo("Notebook owner = " + this.fetchText({type: 'css', path: '#notebook-author'}));
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
       this.test.assertTextDoesntExist('Delete notebook', 'Page body does not contain deleted notebook'); 
       
    });
    
    casper.wait(3000);

    casper.run(function () {
        test.done();
    });
});
