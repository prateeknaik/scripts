/*
 Author: Amith
 Description: This is a casperjs automated test script for showning that, opens discover page, on clicking of discover link from edit.html,
  also check whether discover page is displayed with notebooks 
 */

//Begin Tests
casper.test.begin("opens discover page, on clicking of discover link from edit.html, also check whether discover page is displayed with notebooks", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id

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
       this.test.assertExists(x(".//*[@id='discovery-app']/div/div/figure[1]/a/img"),'Discover page is displayed with notebooks');
        
    });
    
    casper.wait(6000);
    
    casper.viewport(1366, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);
            
    });
    
    casper.wait(4000);
    
    casper.run(function () {
        test.done();
    });
});