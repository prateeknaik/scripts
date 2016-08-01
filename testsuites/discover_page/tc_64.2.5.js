/* 
 Author: Amith
 Description: This is a casperjs automated test script for showing that, 
 star count is displayed correctly in edit.html and discover.html for respective notebook
 */

//Begin Tests

casper.test.begin("Check and verify for the star counts in edit.html and Discover.html pages", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id
    var title;

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
    
    casper.wait(4000);

    //Create a new Notebook.
    functions.create_notebook(casper);
    
    casper.wait(6000);
    
    //Getting notebookid
    casper.then(function (){
        this.wait(5000);
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });
    
    
    casper.wait(9000);

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("Notebook title : " + title);
        this.wait(2000);

    });
    
    casper.wait(4000);

    //checking if notebook is starred
    functions.checkstarred(casper);
    
    casper.wait(9000);

    casper.wait(4000).then(function(){
          var counter1 = 0;//count the number of notebooks
            var title = this.fetchText({type: 'css', path: '#notebook-title'});
            do
            {
                counter1 = counter1 + 1;
                this.wait(2000);
            } while (casper.visible({
                type: 'css',
                path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + counter1 + ') > div:nth-child(1) > span:nth-child(1)'
            }));
            counter1 = counter1 - 1;
            this.echo("number of notebooks under Notebooks I Starred list:" + counter1);
            var flag = 0;//flag variable to test if the Notebook was found in the div
            var starcount = 0;//checking the starcount of the notebook under this div
            for (var i = 1; i <= counter1; i++) {
                this.wait(2000);
                var temp = this.fetchText({
                    type: 'css',
                    path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(1)'
                });
                if (temp == title) {
                    flag = 1;
                    this.echo("Found notebook " + title + " in Notebooks I Starred list");
                    starcount = this.fetchText({
                        type: 'css',
                        path: 'ul.jqtree_common:nth-child(1) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + i + ') > div:nth-child(1) > span:nth-child(2) > span:nth-child(2) > span:nth-child(1)'
                    });
                    break;
                }
            }
            if (flag == 1) {
                this.test.assertEquals(flag, 1, "Notebook with title " + title + " is PRESENT under Notebooks I Starred list with star count = " + starcount);
            }
            else {
                this.test.assertEquals(flag, 0, "Notebook with title " + title + " is ABSENT under Notebooks I Starred list with star count = " + starcount);
            } 
    });
    
    casper.wait(6000);
    
    casper.viewport(1024, 768).then(function () {
        this.echo("Notebook found under Notebooks I starred list and is starred. Hence checking if it is present under People I Starred");
        functions.peopleIstarred(casper);
        
    });
   
    
    casper.wait(6000);
    
    casper.viewport(1024, 768).then(function(){
       this.echo("Notebook found under Notebooks I starred list and is starred. Hence checking if it is present under All Notebooks");
       functions.allnotebooks(casper); 
    });
    
    casper.wait(3000);
    
    casper.wait(4000).then(function(){
       this.thenOpen('http://127.0.0.1:8080/discover.html');
       console.log('Opening discover page');
    });
    
    
    casper.wait(6000);
    
    casper.wait(4000).then(function(){
        this.click(x(".//*[@id='metric-type']/li[1]/a"));
        console.log('Clicking on recent');
    });
    
    
    casper.wait(6000);
   
    
    casper.viewport(1024, 768).then(function(){
       this.test.assertExists(x(".//*[@id='metric-type']/li[2]/a"),'The element popular exists, hence discover page has got loaded'); 
       
    });
    
    //checking if notebook is starred
    casper.wait(4000).then(function(){
        var starcount = this.fetchText(x(".//*[@id='discovery-app']/div/div/figure[1]/a/div/div/button[2]"));
                if (starcount == 1) {
                    this.echo("Notebook is starred and starcount is = " + starcount);
                }
                else {
                    this.echo("Notebook is unstarred");
                }
        });
    
    
    casper.wait(6000);

    casper.viewport(1366, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid);
        this.wait(8000);

    });

    casper.wait(4000);
    
    casper.run(function () {
        test.done();
    });
});
