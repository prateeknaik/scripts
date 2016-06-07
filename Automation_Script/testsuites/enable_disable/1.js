casper.test.begin(" Creating notebook folder with the help of '/' from the notwbook's div ", function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var before_title, after_title;
    var notebook_prefix = '   /Notebook';

    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
    });

    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(2000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and RCLoud logo");
        functions.validation(casper);
        this.wait(2000);
    });

    //functions.create_notebook(casper);

    casper.then(function (){
        this.sendKeys(x(".//*[@id='command-prompt']/div[2]/div"), "'Facebook'", {keepFocus: true});
        this.page.sendEvent(x(".//*[@id='command-prompt']/div[2]/div"), casper.page.event.key.Enter, {keepFocus: true});  

        // this.sendKeys(x(".//*[@id='command-prompt']/div[2]/div"),"R<-12;R", {keepFocus: true});
        // this.page.sendEvent("keypress", casper.page.event.key.Enter);
    });

    casper.then(function (){
            var e = $.Event('keypress')
            e.which = 13
            e.keyCode = 13
            $('form#peopleSearchForm input[name=f_CC][type=text]').trigger(e);

    casper.wait(14000);

    casper.run(function () {
        test.done();
    });
});
