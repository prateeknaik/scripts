/*

 Author: Prateek
 Description:This is a casperjs automation script for checking The loaded notebook will contain R cell which has been executed.
 Now, edit the content of that cell and execute it using the 'run' or 'result' icon present on the side of the cell
 or using 'ctrl+enter' option from keyboard. Check whether the changes are saved or not.
 */
casper.test.begin("Edit R Cell (one R cell pre-executed)", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var initialcontent;//stores initial content of the cell
    var cellcontent = "654";//content to be added while modifying the cell

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

    //Added a new cell and execute the contents
    functions.addnewcell(casper);

    //functions.addcontentstocell(casper);
    //Add contents to this cell and then execute it using run option
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', cellcontent);
        this.wait(3000);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/span[1]/i'});//css for executing the contents
        this.echo("executed contents of First cell");
        this.wait(6000);
    });

    //Clicking on the Edit button and make changes to the earlier executed code
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.wait(2000);
        this.echo("modify the contents of the cell");
    });
    //modify contents of the cell
    functions.addcontentstocell(casper, cellcontent);

    //storing the modified content of the cell
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        this.wait(4000);
        initialcontent = this.fetchText({
            type: 'css',
            path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'
        });
    });

    //Reloading the page
    casper.viewport(1366, 768).then(function () {
        //this.wait(30000);
        this.reload(function () {
            this.echo("Main Page loaded again");
            this.wait(8000);
        });
    });

    //Checking the R cell contents
    casper.viewport(1366, 768).then(function () {
        //checking whether contents are written on Rcell or not
        var temp = this.fetchText({
            type: 'css',
            path: 'div.ace-chrome:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1)'
        });
        this.test.assertNotEquals(temp, initialcontent, "Confirmed that content in the R cell has been saved after execution");
    });

    
    casper.run(function () {
        test.done();
    });
});
