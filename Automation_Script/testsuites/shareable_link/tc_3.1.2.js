/* 
 Author: Ganesh Moorthy
 Description:    This is a casperjs automated test script for showing that on clicking the "Edit Notebook" option, the respected notebook should
 open in the main.html page displaying only the source codes for the notebook
 */

//Begin Tests

casper.test.begin(" Make Notebook Editable in the view.html", 10, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var viewhtmlurl = "http://127.0.0.1:8080/view.html?notebook=8603df2d4b0e1512275e";//view.html link for a notebook containing some codes

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
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
    
    functions.create_notebook(casper);
    
    functions.addnewcell(casper);
    
    functions.addcontentstocell(casper,'a<-12;a');

    //open the view.html link for a notebook
    casper.viewport(1366, 768).thenOpen(viewhtmlurl, function () {
        this.wait(7000);
        this.echo("The view.html link for the notebook is : " + this.getCurrentUrl());
        this.test.assertExists({type: 'css', path: '#edit-notebook > i:nth-child(1)' }, 'the element Edit icon exists. Hence page has got loaded properly in uneditable form');
    });
    
    //clicking on the Edit icon and verifying if the main.html page opens
    casper.viewport(1024, 768).then(function () {
        var z = casper.evaluate(function () {
            $('#edit-notebook').click();
        });
        this.wait(8000);
    });

    casper.viewport(1024, 768).then(function () {
        this.test.assertUrlMatch(/edit.html*/, 'main.html for the notebook has been loaded');
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(25000);
    });

    //validating that only source code is visible and not the output
    casper.viewport(1024, 768).then(function () {
        this.test.assertDoesntExist('r-result-div','output code is not present');
    });

    casper.run(function () {
        test.done();
    });
});

