/* 
 Author: Ganesh Moorthy
 Description:    This is a casperjs automated test script for showing that on clicking the Shareable Link present on top left
 corner of the Main page,the view.html page for the currently loaded notebook should open
 */

//Begin Tests
casper.test.begin("Loading view.html using Shareable Link", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id
    var input = '"Welcome to RCloud"';

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

    //getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        this.click("#new-notebook > span:nth-child(1) > i:nth-child(1)");
        this.wait(5000);
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    functions.addnewcell(casper);
    functions.addcontentstocell(casper, input);

    casper.viewport(1366, 768).then(function () {
        this.then(function () {
            this.thenOpen('http://127.0.0.1:8080/view.html?notebook=' + notebookid);
            this.wait(8000)
            this.waitForSelector(".r-result-div > pre:nth-child(1) > code:nth-child(1)", function (){
                this.test.assertExists('#edit-notebook > i:nth-child(1)', 'the element Edit icon exists. Hence page has got loaded properly');
            });
            
         });
    });

    casper.run(function () {
        test.done();
    });
});

