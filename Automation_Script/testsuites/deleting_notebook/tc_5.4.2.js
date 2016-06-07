/* 
 Author: Arko
 Description: The div 'All Notebooks' contains only one unstarred notebook which is loaded. On deleting the notebook, it also gets deleted from 
 "People I Starred" .The last notebook (belonging to same/different user,but deleted) gets loaded in the unforked state    
 */

//Begin Tests

casper.test.begin("Delete only one Notebook-unstarred", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
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
    //functions.create_notebook(casper); //to ensure that there is atleast one notebook in each of the divs

    //delete all but one notebook from All Notebooks div
    casper.viewport(1024, 768).then(function () {
		this.click({type:'xpath', path:".//*[@id='editor-book-tree']/ul/li[3]/div/a"});
		this.echo('clicking on All notebook tree');
		this.click({type:'xpath', path:".//*[@id='editor-book-tree']/ul/li[3]/ul/li[1]/div/a"});
		this.echo('clicking on My notebook');
		this.wait(2000);
		
        var counter = 0;//counts the number of notebooks
        do
        {
            counter = counter + 1;
            this.wait(2000);
        } while (this.visible('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+counter+') > div:nth-child(1) > span:nth-child(1)'));
        counter = counter - 1;
        this.echo("total number of notebooks under All Notebooks= " + counter);
        this.echo('deleting all but one notebooks from All Notebooks');
        for (var i = 1; i < counter; i++) {
			casper.then(function(){
			this.mouse.move('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+i+') > div:nth-child(1) > span:nth-child(1)');
                this.waitUntilVisible('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+i+') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)', function () {
                this.mouse.click('ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child('+i+') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)');
                this.echo('deleting');
                });
			});
        }
        //this.wait(4000);
    });

    //Now to delete the only existing notebook in All Notebooks
    /*casper.viewport(1024, 768).then(function () {
        this.echo('checking if the loaded notebook is starred');
        var starcount = this.fetchText({type: 'css', path: '#curr-star-count'});
        if (starcount == 1) {
            this.echo("Notebook is starred, hence unstarring it");
            var z = casper.evaluate(function () {
                $('#star-notebook .icon-star').click();
            });
        }
        else {
            this.echo("Notebook is already unstarred");
        }
    });*/
    functions.checkstarred(casper);

    /*casper.viewport(1024, 768).then(function () {
        this.capture("test37_1.png");
        this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(4) > i:nth-child(1)'});
        this.capture("test37_2.png");
        this.echo("deleted the last notebook under All Notebooks");
        this.wait(7000);
    });

    casper.viewport(1024, 768).then(function () {
        this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under Notebooks I starred list");
        this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under People I starred list");
        this.test.assertTextExists("read-only", "The loaded notebook is in read-only and unforked state");
    });*/

    casper.run(function () {
        test.done();
    });
});
