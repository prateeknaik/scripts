/* 
 Author: Sanket 58.5.5
 Description: This casperjs test script test if private notebook of one user can be imported from GitHub by other user
*/
//Begin Tests

casper.test.begin("Importing External private notebook", 11, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_name
    var status
    var url
    var input_code = "a<-100+50\n a";
    var expectedresult = "150"
    var notebookid

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

    //Create a new Notebook.
    functions.create_notebook(casper);
    functions.addnewcell(casper);
    functions.addcontentstocell(casper,input_code);

    //Fetch notebook name
    notebook_name=functions.notebookname(casper)
    
    //Make notebook privet
    casper.then(function(){
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(2000)
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)")
        this.then(function(){
            this.wait(3000)
            this.click('.group-link > a:nth-child(1)')
        });
        this.then(function(){
            this.click('#yellowRadio')
            this.wait(4000)
            
            this.setFilter("page.prompt", function (msg, currentValue) {
                this.echo(msg)
                if (msg === "Are you sure you want to make notebook "+notebook_name+" truly private?") {
                return TRUE;
            }
        });
        this.click('span.btn:nth-child(3)');
        this.echo('notebook is made private successfully')
        });
    });

    //validate if notebook has become private
    casper.then(function(){
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(2000)
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)")
        this.then(function(){
            this.wait(3000)
            status=this.fetchText('.group-link > a:nth-child(1)')
            this.echo("notebook is "+   status)  
            this.wait(3000)
            this.test.assertEquals(status,'private',"The notebook has been converted to private successfully")
        });        
    });

    casper.then(function(){
        url =this.getCurrentUrl()
        this.echo('current url is '+url)
        notebookid = url.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    //loging out of RCloud
    casper.viewport(1366, 768).then(function () {
        this.wait(3000)
        console.log('Logging out of RCloud');        
        this.click({ type : 'css' , path : '#rcloud-navbar-menu > li:nth-child(5) > a:nth-child(1)'});
    });

    casper.then(function(){
        this.wait(3000)
        this.click('#main-div > p:nth-child(2) > a:nth-child(2)')
    })
    casper.then(function(){
        this.wait(3000)
        this.click('.btn')
    })  

    //Logging in RCloud by different username
    casper.thenOpen(rcloud_url, function(){
        this.wait(3000)
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(3000)
        functions.login(casper, 'iPrateek032', 'P12345678k', rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
    });

    functions.open_advanceddiv(casper)
    
    casper.then (function () {      
        console.log("Clicking on dropdown");
        console.log('Clicking on Load notebook ID option');
        casper.setFilter("page.prompt", function(msg, currentValue) {
            if (msg === "Enter notebook ID or github URL:") {
                return notebookid;
            }
        });
        this.wait(5000)
        this.click('#open_from_github')
        
    });
    

    // casper.thenOpen('http://127.0.0.1:8080/edit.html?notebook='+notebookid,function(){
    //     this.wait(5000)

    // });


    //Check for the error message in the session div
    casper.then(function(){
        this.wait(10000)
        this.test.assertExists('.alert','Error message thrown in Session div as the notebook being imported is private')
    });

    casper.run(function () {
        test.done();
    });
});