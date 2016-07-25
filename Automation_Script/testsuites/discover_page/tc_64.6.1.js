/* 
 Author: Amith
 Description: This is a casperjs automated test script for showing that, Check and verify the most popular notebook
 */

//Begin Tests

casper.test.begin("Check and verify the most popular notebook", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var forkcount1;
    var forkcount2;
    
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
   
    casper.wait(4000).then(function(){
       this.thenOpen('http://127.0.0.1:8080/discover.html');
       console.log('Discover page is opened');
    });
    
    casper.wait(4000);
    
    casper.viewport(1024, 768).then(function(){
       this.test.assertExists(x(".//*[@id='metric-type']/li[1]/a"),'The element recent exists, hence discover page has got loaded'); 
       
    });
    
    casper.wait(4000);
    
    casper.wait(4000).then(function(){
        this.click(x(".//*[@id='metric-type']/li[2]/a"));
        console.log('Clicking on popular');
    });
    
    casper.wait(3000);
    
    casper.wait(4000).then(function(){
       var forkcount1 = this.fetchText(x(".//*[@id='discovery-app']/div/div/figure[1]/a/div/div/button[1]")); 
       this.echo("Forkcount is = " + forkcount1);
    });
    
    casper.wait(3000);
    
    casper.wait(4000).then(function(){
       var forkcount2 = this.fetchText(x(".//*[@id='discovery-app']/div/div/figure[2]/a/div/div/button[1]")); 
       this.echo("Forkcount is = " + forkcount2);
    });
    
    casper.wait(6000);
    
    casper.wait(4000).then(function(){
       if(forkcount1 > forkcount2 || forkcount1 == forkcount2 )
           {
               this.echo("Popular notebook is displayed first");
               
           } else {
               
               this.echo("Popular notebook is not displayed");
           }
    });

    casper.wait(4000);
    
    casper.run(function () {
        test.done();
    });
});
