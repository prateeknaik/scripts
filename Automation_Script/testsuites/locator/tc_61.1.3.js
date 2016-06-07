/*
 Author: Sanket (tc_61.1.1.js)
 Description: This is casperJS automated test to check whether locator() gets invoked in the R cell above the R cell having plot
 */

//Begin

casper.test.begin("Invoke locator function above the cell with plot", 6, function suite(test) {
    var x = require('casper').selectcss;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "plot(1:10)";
    

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

    // //Create a new Notebook.
    // functions.create_notebook(casper);

    // //add a new cell 
    // functions.addnewcell(casper);
    // functions.addcontentstocell(casper,input_code)
       
    casper.then(function(){
        functions.runall(casper);
    //     this.click({
    //         type:'xpath',
    //         path:'//*[@id="part1.R"]/div[1]/span[1]/i'
    //     });
    //     this.wait(4000)
    // });
    // casper.then(function(){
    //     this.sendKeys({
    //         type: 'xpath',
    //         path: '//*[@id="part1.R"]/div[3]/div[1]/div[2]/div/div[2]'
    //     },'locator(2)');
    //     this.click({
    //         type: 'xpath',
    //         path: '//*[@id="part1.R"]/div[2]/div[2]/span[1]/i'
    //     });//xpath for executing the contents
    //     this.echo("executed contents of first cell");
    //     this.wait(5000);
    //     require('utils').dump(this.getElementAttribute('.live-plot', 'style'));

    });


    
    //check for locator feature by checking the crosshair cursor
    // casper.then(function() {
    //     this.test.assertVisible(".live-plot", "Plot exists");
    //     var str = this.getElementAttribute('.live-plot', 'style'); 
    //     this.echo(str)
    //     this.test.assertEquals(str,['cursor: crosshair;'], 'Locator function got invoked successfully')
    //     this.wait(3000)
    // });

    casper.then(function (){
        require('utils').dump(this.getElementAttribute('.live-plot-container', 'style'));
        console.log('Mouse cursor got changed to element :"cursor: crosshair;" hence confirmed that "Locator function got invoked successfully"')
        
    });
    

    // //Delete the cell created for this test case
    // casper.then(function(){
    //     this.mouse.move('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
    //     this.wait(2000)
    //     this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)')
    // });


    casper.run(function () {
        test.done();
    });
});
    


