/* 
 Author: Amith
 Description: This is a casperjs automation script for checking that, whether user is able invoke keyboard shortcuts or not
 */

casper.test.begin("Invoking keyboard shortcuts", 4, function suite(test) {

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
    
    casper.wait(4000).then(function(event){
       if (event.ctrlKey && event.keyCode == 13) {
           console.log('keyboard shortcut is invoked');
           // Ctrl-Enter pressed
       } else {
           console.log('Keyboard shortcut is not invokes');
       }
               
    });
    
    casper.run(function () {
        test.done();
    });
});