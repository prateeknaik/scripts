casper.test.begin(" Creating notebook folder with the help of '/' from the notwbook's div ", function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var before_title, after_title;
    var notebook_prefix = '{501*PN}';

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

    functions.create_notebook(casper);

    casper.then(function () {
        before_title = this.fetchText(x(".//*[@id='notebook-title']"));
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery(".jqtree-selected > div:nth-child(1) > span:nth-child(1)").text("PREFIX/Notebook");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery(".jqtree-selected > div:nth-child(1) > span:nth-child(1)").trigger(e);
            return true;
        });
        this.wait(5000);
    })

    casper.then(function(){
        this.click('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
        var after = this.fetchText('.jqtree-selected > div:nth-child(1) > span:nth-child(1)');
        this.echo("Fetching Notebook name from the Noebooks's div : " + after + ". / present so, notebook folder is created from the notebook div");
    });

    functions.delete_notebooksIstarred(casper);

    casper.wait(4000);

    casper.run(function () {
        test.done();
    });
});
