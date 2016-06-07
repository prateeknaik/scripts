/*
 Author: Sanket (tc_61.2.4.js)
 Description: This is casperJS automated test to check whether locator() gets invoked within the  R cell having plot in view.html
 */

//Begin

casper.test.begin("Invoke locator function within the cell with plot", 6, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "plot(1:10) \n locator(2)";
    

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

    //add a new cell and execute its contents
    functions.addnewcell(casper);
    functions.addcontentstocell(casper,input_code);


    casper.viewport(1024, 768).then(function () {
        var notebook_url = this.getCurrentUrl();
        notebookid = notebook_url.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    casper.viewport(1366, 768).then(function () {
        this.wait(5000);
        this.waitForSelector({type: 'css', path: 'html body div.navbar div div.nav-collapse ul.nav li span a#share-link.btn'}, function () {
            console.log("Shareable link found. Clicking on it");
            casper.viewport(1366, 768).thenOpen('http://127.0.0.1:9090/view.html?notebook=' + notebookid, function () {
                this.wait(7000);
                this.echo("The view.html link for the notebook is : " + this.getCurrentUrl());
            });
        });
    });

    //check for locator feature by checking the crosshair cursor
    casper.then(function() {
        var str = this.getElementsAttribute('.live-plot', 'style'); 
        this.test.assertEquals(str,['cursor: crosshair;'], 'Locator function got invoked successfully')
    });

    


    casper.run(function () {
        test.done();
    });
});
    


