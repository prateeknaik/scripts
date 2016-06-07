/*

 Author: Kunal
 Description:This is a casperjs automation script for the checkbox for "show source" is unselected for hiding the source code for a notebook
 */
casper.test.begin("Show source Checkbox selected", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
        
    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
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

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get notebook title
    casper.then(function () {
        var title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //Now clicking on the advanced div
    functions.open_advanceddiv(casper);

    //Un-selecting the Show Source div
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('#show-source').click();

        });
        this.wait(4000);
    });

    functions.open_advanceddiv(casper);//advanced div needs to be opened again because on clicking the Show source option, the advanced div closes

    //verify that notebook has been published successfully
    casper.then(function () {
        this.test.assertVisible({type: 'css', path: '#show-source .icon-check-empty'}, "Show Source option has been un-selected successfully");
        this.test.assertNotVisible({type: 'css', path: '#show-source .icon-check'}, "Confirmed that Show source box is not checked");

    });


    casper.run(function () {
        test.done();
    });
});
