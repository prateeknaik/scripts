/* 
 Author: Prateek
 Description:    This is a casperjs automated test script for showing that Date on which notebook was created/updated is used for Search in quotes
 * for example "date and time stamp"
 */

//Begin Tests

casper.test.begin("Searching with Date and time", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_id = "b337e639fafdb983a064";
    var title;
    var item = '2015-08-28';//item to be searched

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
    
    //open notebook or load a notebook
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/main.html?notebook=' + notebook_id, function () {
        this.wait(10000);
        this.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(3000);
            var author = this.fetchText({type: 'xpath', path: '//*[@id="notebook-author"]'});
            this.echo("Notebook author: " + author);
            this.test.assertNotEquals(author, github_username, "Confirmed that notebook belongs to different user");
        });
    });
    
    functions.fork(casper);
    
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
				this.test.pass("search feature is working fine with date and time stamp ");
			}
			else
				{
					this.test.fail("search feature is not working fine with date and time stamp");
				}
		});

    casper.run(function () {
        test.done();
    });
});

