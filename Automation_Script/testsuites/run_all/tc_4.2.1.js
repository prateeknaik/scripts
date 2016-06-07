/*
 Author: Prateek 
 Description:The loaded notebook contains a Rmarkdown cell with some code but is not executed. On clicking the 'Run All' icon present on the top-left
 corner of the page should execute the cell

 */

//Begin Test

casper.test.begin("Execute Rmarkdown cell (not pre-executed) using Run All", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "hello" ;

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

    //changing language in drop down menu
    casper.then(function(){
        this.mouse.click({ type: 'xpath' , path: ".//*[@id='prompt-area']/div[1]/div/select"});//x path for dropdown menu
        this.echo('clicking on dropdown menu');
        this.wait(2000);
    });

    //selecting markdown from the drop down menu
    casper.then(function(){
        this.evaluate(function() {
            var form = document.querySelector('.form-control');
            form.selectedIndex = 0;
            $(form).change();
        });
    });


    //create a new markdown cell with some contents
    casper.then(function () {
        functions.addnewcell(casper);
        casper.then(function(){
            this.sendKeys({type:'xpath', path:'/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[1]/div[2]/div/div[2]/div'}, input_code);
            this.echo("Entered code into the cell but did not execute it yet");
        });
    });

    //to run the code
	casper.then(function(){
		this.click({type:'xpath', path:".//*[@id='run-notebook']"});
		this.wait(9000);
	});
	
    //Verifying the output for the code
	casper.then(function(){
		this.test.assertSelectorHasText({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[2]/p"}, input_code, 'Code has produced expected output under markdown cell');
	});

    casper.run(function () {
        test.done();
    });
});
