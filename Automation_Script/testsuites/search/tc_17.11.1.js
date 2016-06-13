/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that For the "Search" option, the text entered in the text box for 'full-text search'
 will consist of notebook id of the notebook to be searched for, like id: <notebook-ID>

 */

//Begin Tests

casper.test.begin(" Notebook ID for Search", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item;//item to be searched
    var title;//get notebook title
    
    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
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

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);
        
    });

    //getting Notebook ID
    var notebookid;
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
        item = "id:" + notebookid;
    });

    //Added a new cell and execute the contents
    functions.addnewcell(casper);

    //Add contents to this cell and then execute it using run option
    functions.addcontentstocell(casper, "'ABCD'");

    casper.then(function(){
		if (this.visible('#search-form > a:nth-child(3)')) {
                console.log('Search div is already opened');
            }
        else {
                var z = casper.evaluate(function () {
                    $('#accordion-left > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > span:nth-child(2)').click();
                });
                this.echo("Opened Search div");
            }
		});
            //entering item to be searched
            casper.then(function () {
                this.sendKeys('#input-text-search', item);
                this.wait(6000);
                this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
            });
            
            casper.wait(5000);
            
            //counting number of Search results
            casper.then(function () {
                var counter = 0;
                do
                {
                    counter = counter + 1;
                    this.wait(2000);
                } while (this.visible(x('/html/body/div[3]/div/div[1]/div[1]/div/div/div[2]/div[2]/div/div/div[2]/div/div/table[' + counter + ']/tbody/tr[1]/td/a')));
                                         
                counter = counter - 1;
                this.echo("number of search results:" + counter);
            
            if (counter >0)
            {
				this.test.pass("search feature is working for incomplete texts");
			}
			else
				{
					this.test.fail("search feature is not working for incomplete texts");
				}
		});

    casper.run(function () {
        test.done();
    });
});
