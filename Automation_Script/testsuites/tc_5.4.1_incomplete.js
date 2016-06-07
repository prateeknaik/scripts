//Begin Tests

casper.test.begin("Delete only one Notebook-starred", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);

    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //delete all but one notebook from All Notebooks div
    casper.viewport(1024, 768).then(function () {
        var count = 0;
        var counter = 1;//counts the number of notebooks
        while (this.exists({
            type: 'css',
            path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter + ') > div:nth-child(1)'
        }) || this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + counter + ") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")) {
            if (this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + counter + ") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")) {

                var counter2 = 0;
                do {
                    counter2 = counter2 + 1;
                    this.wait(2000);
                } while (this.exists({
                    type: 'css',
                    path: "ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + counter + ") > ul:nth-child(2) > li:nth-child(" + counter2 + ") > div:nth-child(1)"
                }))
                count = count + counter2 - 1;
            }
            else {
                count = count + 1;
            }
            counter = counter + 1;
            this.wait(2000);
        }


        this.echo("total number of notebooks under All Notebooks= " + count);


        this.wait(4000);
    });


    casper.viewport(1024, 768).then(function () {
        this.click("ul.jqtree_common:nth-child(1) > li:nth-child(3) > div:nth-child(1) > span:nth-child(2)")
        this.click("ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(2)")
        this.then(function () {
            var p = 1;//counts the number of notebooks
            while (this.visible({
                type: 'css',
                path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + p + ') > div:nth-child(1)'
            }) || this.visible("ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + p + ") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")) {
                if (this.exists("ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + p + ") > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1)")) {
                    this.click("ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + p + ") > div:nth-child(1) > span:nth-child(2)")
                    this.echo('Clicking on');
                    this.wait(3000)
                    this.echo("P=" + p)
                    //this.echo("Q="+q)

                    var q = 1;
                    while (this.visible({
                        type: 'css',
                        path: "ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(" + p + ") > ul:nth-child(2) > li:nth-child(" + q + ") > div:nth-child(1)"
                    })) {
                        this.echo(p)
                        this.echo("q=" + q)

                        this.wait(5000)
                        this.mouse.move('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + p + ') > ul:nth-child(2) > li:nth-child(' + q + ') > div:nth-child(1) > span:nth-child(1)');
                        this.waitUntilVisible('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + p + ') > ul:nth-child(2) > li:nth-child(' + q + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)')
                        this.wait(3000)
                        this.echo('Clicking');
                        this.click({
                            type: "xpath",
                            path: ".//*[@id='editor-book-tree']/ul/li[1]/ul/li/ul/li[" + p + "]/ul/li[" + q + "]/div/span[2]/span[3]/span/span[5]/i"
                        });


                        //~ this.waitUntilVisible('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+ p +') > ul:nth-child(2) > li:nth-child('+ q +') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)', function () {
                        //~ this.click('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+ p +') > ul:nth-child(2) > li:nth-child('+ q +') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)');
                        //~ this.wait(10000)
                        //~ this.echo("notebook deleted")
                        //~ });
                        q = q + 1
                        this.wait(2000)
                    }

                }
                else {


                    this.mouse.move('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + p + ') > div:nth-child(1) > span:nth-child(1)');
                    this.wait(5000)
                    this.click({
                        type: "xpath",
                        path: ".//*[@id='editor-book-tree']/ul/li[1]/ul/li[1]/ul/li[" + p + "]/div/span[2]/span[3]/span/span[5]/i"
                    });
                    //~ this.waitUntilVisible('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+ p +') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)', function () {
                    //~ this.echo("P :"+p)
                    //this.click('ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+ p +') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)');
                    //~ this.echo("notebook deleted")
                    //~ this.wait(10000);
                    //~
                    //~ });
                }
                p = p + 1
                this.wait(2000);
            }
            console.log("All the notebooks under My Notebooks are deleted");
        });
        this.wait(4000);


    });

    functions.create_notebook(casper);


    //~ casper.viewport(1024, 768).then(function () {
    //~ this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under Notebooks I starred list");
    //~ this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under People I starred list");
    //~ this.test.assertTextExists("read-only", "The loaded notebook is in read-only and unforked state");
    //~ });

    casper.run(function () {
        test.done();
    });
});
