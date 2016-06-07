/*
 Author: Prateek
 Description:To insert a Markdown cell with respect to a R cell i.e, insert a Markdown cell by clicking on the '+' icon
 * present on top of the R Cell and changing the language
 */


//Begin Test
casper.test.begin("Creating a combination of R and Markdown cells ", 8, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
	var input_code = 'a<-25 ; print a';

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

    //Creating a new notebook
    functions.create_notebook(casper);

    //Creating new cells
    functions.addnewcell(casper);
    functions.addnewcell(casper);

    //change the language from R to Markdown
    casper.then(function () {
        this.mouse.click({type: 'xpath', path: ".//*[@id='part2.R']/div[2]/div[2]/select"});//x path for dropdown menu
        this.echo('clicking on dropdown menu');
        this.wait(2000);
    });

    //selecting Markdown from the drop down menu
    casper.then(function () {
        this.evaluate(function () {
            var form = document.querySelector('.form-control.cell-control-select.cell-control');
            form.selectedIndex = 0;
            $(form).change();
        });
    });

    //Creating 3rd  cell
    functions.addnewcell(casper);

    //Adding contents to the cells
    casper.then(function(){
        this.sendKeys({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[3]/div[3]/div[1]/div[2]/div/div[2]/div"}, input_code);//adding contents to the 3rd cell (R cell)
        this.click({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"});//clicking on 1st cell(Marckdown cell)
        this.sendKeys({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"}, input_code);//adding contents to the 1st cell (Markdown cell)
    });

    functions.runall(casper);

    casper.wait(5000);

    casper.then(function(){
        if(this.test.assertVisible({type:'xpath', path:".//*[@id='part3.R']/div[3]/div[2]/pre/code"}))
        {
            this.test.pass('Output div is visible');
        }else
        {
            this.test.fail('Output div is not visible');
        }
    });

    casper.run(function () {
        test.done();
    });
});


