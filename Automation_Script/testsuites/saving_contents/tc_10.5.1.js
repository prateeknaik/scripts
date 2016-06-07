/*

 Author: Prateek
 Description:This is a casperjs automation script for checking that The loaded notebook will contain R cell which has been executed. Now, edit the
 content of that cell. The 'save' icon present in the navbar on the top-left corner of the page will be enabled. Click on the icon and
 check whether the changes are saved or not
 */
casper.test.begin("Using save icon present in the navbar - Edit R Cell (pre-executed)", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
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

    //Added a R cell and execute contents
    casper.then(function () {
        functions.addnewcell(casper);
        functions.addcontentstocell(casper, cellcontent);
    });

    //Add another R cell and enter some contents
    functions.addnewcell(casper);
    casper.then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', cellcontent);
        this.echo("entered contents to the second cell");
        this.wait(2000);
    });

    //click on the save icon
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('#save-notebook').click();

        });
        this.wait(10000);
        console.log('Save icon is clicked');

    });

    //Reloading the page
    casper.viewport(1366, 768).then(function () {
        //this.wait(30000);
        this.reload(function () {
            this.echo("Main Page loaded again");
            this.wait(9000);
        });
    });

    //Checking the R cell contents
    casper.viewport(1366, 768).then(function () {
        //execute the topmost cell.this is a workaround as otherwise we currently can't fetch contents of the lower cell
        this.click({
            type: 'xpath',
            path: "/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[1]/pre/code/span[2]"
        });
        this.wait(5000);
    });

    casper.viewport(1366, 768).then(function () {
        //checking whether contents are written on Rcell or not
        var temp = this.fetchText({
            type: 'xpath',
            path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[1]/pre/code/span[2]'
        });
        this.test.assertEquals(temp, cellcontent, "Confirmed that content in the R cell has been saved using Run All feature");
    });


    casper.run(function () {
        test.done();
    });
});
