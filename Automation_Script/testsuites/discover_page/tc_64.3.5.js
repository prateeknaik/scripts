/* 
 Author: Amith
 Description: This is a casperjs automation script for checking that, whether forked notebook gets displyed in Discover page or not
 */


//Begin Tests

casper.test.begin(" Visibility of forked notebook in discover page", 11, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_id = "68169c21a8c728c7f83f";
    var title;

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

    //open notebook belonging to some different user
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/main.html?notebook=' + notebook_id, function () {
        this.wait(10000);
        this.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(3000);
            var author = this.fetchText({type: 'css', path: '#notebook-author'});
            this.echo("Notebook author: " + author);
            this.test.assertNotEquals(author, github_username, "Confirmed that notebook belongs to different user");
        });
    });
    
    casper.wait(3000);

    //fork the notebook
    functions.fork(casper);
    
    casper.wait(4000);

    //get the notebook owner's name and verify that it belongs to local user
    casper.wait(2000).then(function () {
        var author = this.fetchText({type: 'css', path: '#notebook-author'});
        this.echo("Notebook author: " + author);
        this.test.assertEquals(author, github_username, "Confirmed that notebook now belongs to local user after being forked");
    });

    
    casper.wait(3000);
    
    //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Fork notebook");
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
    
    casper.wait(4000);
    
    casper.then( function () {
		this.wait(10000);
		var temp1 = this.getCurrentUrl();
        notebook_id = temp1.substring(41);
        this.echo("Notebook Id is: " + notebook_id);
        this.thenOpen(temp1);
        this.wait(10000);
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
       this.test.assertTextExists('Fork notebook', 'page body contains forked notebook'); 
        
    });
    
    casper.wait(4000);
    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebook_id);
        this.wait(8000);
            
    });
    
    casper.wait(4000);
    
     //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("fork20");
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
