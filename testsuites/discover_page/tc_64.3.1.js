/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, whether the encrypted notebooks are displayed in discover page or not
 */

//Begin Tests
casper.test.begin(" Visibility of private notebook", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;
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
    
    casper.wait(6000);

    //Create a new Notebook
    functions.create_notebook(casper);
    
    casper.wait(9000);
    
    casper.then(function (){
        before_title = this.fetchText(x(".//*[@id='notebook-title']"));
        this.echo(before_title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Private20");
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
       
    casper.wait(4000);
    
    //Fetch notebook name
    notebook_name = functions.notebookname(casper)
    
    casper.wait(3000);

    //Make notebook private
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(2000)
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)")
        this.then(function () {
            this.wait(3000)
            this.click('.group-link > a:nth-child(1)')
        });
        this.then(function () {
            this.click('#yellowRadio')
            this.wait(4000)

            this.setFilter("page.prompt", function (msg, currentValue) {
                this.echo(msg)
                if (msg === "Are you sure you want to make notebook " + notebook_name + " truly private?") {
                    return TRUE;
                }
            });
            this.click('span.btn:nth-child(3)');
            this.echo('notebook is made private successfully')
        });
    });
    
    casper.wait(3000);

    //validate if notebook has become private
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(4000);
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)");
    });

    casper.then(function (){
        this.then(function () {
            this.wait(3000);
            status = this.fetchText('.group-link > a:nth-child(1)');
            this.echo("notebook is " + status)
            this.wait(3000);
            this.test.assertEquals(status, 'private', "The notebook has been converted to private successfully")
        });
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
       this.test.assertTextDoesntExist('Private20', 'Page body does not contain Private notebook'); 
       
    });
    
    casper.wait(9000);

    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);        
    });
    
    
    casper.wait(8000);
    
    casper.then(function (){
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("Note20");
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

