//Begin Tests
casper.test.begin("Test", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_name, status, url, notebookid;
    var fileName = 'EXE';//'/home/fresh/FileUpload/PHONE.csv'; // File path directory
    var before, after, ID;
    var res;

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

    //create a new notebook
   // functions.create_notebook(casper);

    //Function to generate group names
    casper.then(function () {
        ID = this.evaluate(function () {
            return Math.random().toString(36).substr(2, 9);
        });
        this.echo('New Group name:' + ID);
    });

    //Create a new group
    // casper.then(function () {
    //     this.click("li.dropdown > a:nth-child(1)");
    //     this.evaluate(function () {
    //         $('#manage_groups').click();
    //     });
    //     this.echo('opened manage group dialog box');
    //     this.wait(2000);
    // });

    // casper.then(function () {
    //     this.wait(4000);
    //     casper.setFilter("page.prompt", function (msg, currentValue) {
    //         if (msg === "Enter new group name") {
    //             return ID;
    //         }
    //     });
    //     this.click('span.label:nth-child(1)');
    //     this.echo('Entered Group name');
    // });

    casper.wait(10000);

    //Open manage group option to choose group
    casper.then(function () {
        this.click(x(".//*[@id='rcloud-navbar-menu']/li[3]/a/b"));
        this.echo('clicking on advanced dropdown');
        this.wait(5000);
        this.click(x(".//*[@id='manage_groups']"));
        this.echo('Choosing manage groups option');
    });

    // casper.then(function () {
    //     // // var z = casper.evaluate(function () {
    //     // //             $('select.ng-pristine:nth-child(3)').click();
    //     // //         });
    //     res = this.getElementInfo(x("/html/body/div[4]/div/div/div[2]/div/div/div/div[2]/div[1]/div[1]/select")).tag;
    //     // //res = this.fetchText('select.ng-pristine:nth-child(3)');
    //      this.echo(res);
    //     // // var str = res;
    //     // // var res1 = str.match(/EXCELLENCE/g);
    //     // // this.echo(res1);
    //     this.click(x("//a[contains(text(),'EXE')] "));
    //     // //this.click(x('//*[contains(text(), "EXE")]'));
    //     // this.click(x('//*[text()[contains(.,"EXE")]]'))
    //     // this.wait(10000);
    //     var temp = this.fetchText(x(".//*[@id='group-tab']/div[1]/div[1]"));
    //     this.echo(temp);

    // });
    casper.then(function(){
        this.mouse.click(x(".//*[@id='group-tab']/div[1]/div[1]/select"));//x path for dropdown menu
        this.echo('clicking on dropdown menu');
        this.wait(2000);
    });
    
    //selecting Python from the drop down menu
    casper.then(function(){
        this.evaluate(function() {
            var form = document.querySelector('select.ng-pristine:nth-child(3)');
            form.selectedIndex = 5;'document.getElementsByName('socks');
'
            $(form).change();
        });
        console.log('drop down menu');
    });
    

    casper.wait(10000);

    casper.run(function () {
        test.done();
    });
});

