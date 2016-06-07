/*

 Author: Prateek
 Description:This is a casperjs automation script for notebook containing one R cell and one Markdown cell with some code
 which is already executed and Run all button is then clicked and checked whether the R and markdown cell are
 executed or no.

 */
casper.test.begin("Execute pre executed a R cell and Markdown cell using Run All", 9, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "50+50" ;
    var expected_result = "100";

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

    //Added a new R cell and execute contents
    casper.then(function () {
        functions.addnewcell(casper);
        functions.addcontentstocell(casper,input_code);

    });

    //Change the language of prompt cell to Markdown cell . Pass 0 for Markdown
    casper.then(function () {
        this.evaluate(function() {
            var form = document.querySelector('.form-control');
            form.selectedIndex = 0;
            $(form).change();
        });
    });

    //Add a Markdown cell and execute its contents
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys({type:'xpath',path:"/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div"}, input_code);
        functions.runall(casper);
        this.echo("executed contents of the Markdown cell");
    });

    //Verify the output for both the cells
    casper.then(function () {
        this.test.assertVisible('.r-result-div', "Output div is visible which means that cell execution has occured successfully");
        this.wait(4000);
		this.test.assertSelectorHasText({type: 'xpath', path: ".//*[@id='part2.R']/div[3]/div[2]/pre/code"}, expected_result,'The R code has produced the expected output using Run All for the R cell');
		this.wait(4000);
		this.test.assertSelectorHasText({type: 'xpath', path: ".//*[@id='part1.R']/div[3]/div[2]/p"}, input_code,"The R code executed in Markdown cell has produced the expected output using Run All");
    });

    casper.run(function () {
        test.done();
    });
});
