/* 
 Author: Arko
 Description:    The div 'All Notebooks' contains only one starred notebook which is loaded. On deleting 
 the notebook,it also gets deleted from "People I Starred" and "Notebooks I Starred".The last notebook (belonging to same/different user,but 
 deleted) gets loaded in the unforked state   
 */

//Begin Tests

casper.test.begin("Delete only one Notebook-starred", 6, function suite(test) {

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

    //Create a new Notebook.
    functions.create_notebook(casper);
    
    casper.then(function(){
		this.click({type:'xpath', path:"/html/body/div[3]/div/div[1]/div[1]/div/div/div[1]/div[2]/div/div/ul/li[3]/div/span[1]"});
		this.echo('clicking on All notebook');
		this.click({type:'xpath', path:"/html/body/div[3]/div/div[1]/div[1]/div/div/div[1]/div[2]/div/div/ul/li[3]/ul/li[1]/div/span[1]"});
	});

    //delete all but one notebook from All Notebooks div
    casper.viewport(1024, 768).then(function () {
        var counter = 0;//counts the number of notebooks
        do
        {
            counter = counter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter + ') > div:nth-child(1) > span:nth-child(1)'}));
        counter = counter - 1;
        this.echo("total number of notebooks under All Notebooks= " + counter);
        this.echo('deleting all but one notebooks from All Notebooks');
        for (var i = 1; i < counter; i++) {
				this.mouse.move('ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)');
					//this.waitUntilVisible('ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)', function () {
				this.click('ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)');
				//});

            //this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(4) > i:nth-child(1)'});
            this.wait(2000);
        }
        this.wait(4000);
    });

    // delete the only existing notebook in All Notebooks
    casper.viewport(1024, 768).then(function () {
        this.echo('checking if the loaded notebook is starred');
        functions.checkstarred(casper);
    });

    casper.viewport(1024, 768).then(function () {
        this.click({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(2) > span:nth-child(4) > i:nth-child(1)'});
        this.echo("deleted the last notebook under All Notebooks");
        this.wait(7000);
    });

    casper.viewport(1024, 768).then(function () {
        this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under Notebooks I starred list");
        this.test.assertNotVisible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > div:nth-child(1) > span:nth-child(1)'}, "No notebooks under People I starred list");
        this.test.assertTextExists("read-only", "The loaded notebook is in read-only and unforked state");
    });

    casper.run(function () {
        test.done();
    });
});
