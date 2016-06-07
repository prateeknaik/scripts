console.log('Description :');
console.log('This is an automated testscript to be run on RCloud 1.2 to test if some of the basic features are working properly');
console.log('The features to be tested are : Login to RCloud, creating a new notebook, entering valid and invalid R and python codes and adding comments ');
casper.test.begin("Automation testing part-1", 17, function suite(test) {

    var x = require('casper').selectXPath;//required if we detect an element using xpath
    var github_username = casper.cli.options.username;//user input github username
    var github_password = casper.cli.options.password;//user input github password
    var rcloud_url = casper.cli.options.url;//user input RCloud login url
    var functions = require(fs.absolute('basicfunctions.js'));//invoke the common functions present in basicfunctions.js
    var initialcounter = 0;//store initial count of notebooks
    var newcounter = 0;//store initial count of notebooks
    var input_Rcode = "a<-50+50\n a";//sample valid R code
    var expectedresult_R = "100"//expected result for the above R code to be used for validation
    var invalid_Rcode = "a->50+50";//sample invalid R code
    var comment = "Sample comment";//the comment to be entered
    var cm_cnt = 0; // count of detected comments
    var notebookid = 'c9a89e7406786866ce1a'; //  Loading the python notebook with the ID 


    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');//inject jquery codes
    });

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.wait(10000);

    casper.then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);

    });

    //Get initial count of notebooks
    casper.then(function () {
        do
        {
            initialcounter = initialcounter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + initialcounter + ') > div:nth-child(1) > span:nth-child(1)'}));
        initialcounter = initialcounter - 1;
        this.echo("Initial count of notebooks = " + initialcounter);
    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Get new count of notebooks
    casper.then(function () {
        do
        {
            newcounter = newcounter + 1;
            this.wait(2000);
        } while (this.visible({type: 'css', path: 'ul.jqtree_common:nth-child(1) > li:nth-child(3) > ul:nth-child(2) > li:nth-child(1) > ul:nth-child(2) > li:nth-child(' + newcounter + ') > div:nth-child(1) > span:nth-child(1)'}));
        newcounter = newcounter - 1;
        this.echo("New count of notebooks = " + newcounter);
        this.test.assertNotEquals(newcounter, initialcounter, "Confirmed that new notebook has been created");
    });

    //Add an R cell and execute its contents using a valid R code
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', input_Rcode);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/span[1]/i'});//xpath for executing the contents
        this.wait(5000);
        this.echo("executed contents of the R cell by entering a valid R code");

    });

    //fetch the output text and compare
    casper.then(function () {
		console.log('Testing if The R code has produced the expected output');
		test.assertSelectorHasText({ type : 'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[2]/pre/code' }, '100','100 is the expected output for valid R code');
		this.echo('100 is the expected output for valid R code');
    });

    //Create a new Notebook.
    functions.create_notebook(casper);

    //Add an R cell and execute its contents using an invalid R code
    functions.addnewcell(casper);
    casper.viewport(1366, 768).then(function () {
        this.sendKeys('div.ace-chrome:nth-child(1) > textarea:nth-child(1)', invalid_Rcode);
        this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[2]/span[1]/i'});//xpath for executing the contents
        this.wait(5000);
        this.echo("executed contents of the R cell by entering an invalid R code");

    });

    //fetch the output text and compare
    casper.then(function () {
		/*console.log('Testing if The R code has produced the unexpected output');
		test.assertSelectorHasText({ type : 'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[2]/pre/code' }, '10');*/
        var result = this.fetchText({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div/div/div[3]/div[2]/pre[2]/code'});//fetch the output after execution
        var res = result.substring(7);//remove the unwanted characters
        this.echo("The output of the R code is: " + res);
        this.test.assertSelectorHasText({ type : 'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[2]/pre/code'},"Error");

    });

    //Load the python notebook with ID
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid, function () {
        this.wait(10000);
        this.test.assertUrlMatch(/c9a89e7406786866ce1a/, 'Testing notebook is opened');
        this.wait(10000);
    });
                
    casper.then(function(){
        casper.evaluate(function () {
			$('#fork-notebook').click();
		});                   
                         
        this.wait(10000);
        console.log('clicked forked icon');   
        this.wait(10000);  
    });
    
    
    casper.then(function(){
        this.wait(15000);
        casper.evaluate(function () {
			$('#run-notebook').click();
		});
        this.wait(10000);
    });
    
	casper.then(function(){
        console.log('Testing if expected output for valid python code');
        this.test.assertSelectorHasText({ type : 'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[2]' }, '3');
                });

		
	casper.then(function(){
		console.log('Testing if error is shown for invalid python code');
        this.test.assertSelectorHasText({ type : 'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[2]' }, 'NameError','error is shown for invalid python code');
    });


	casper.then(function(){
		functions.create_notebook(casper); 
		this.wait(2000);
		functions.addnewcell(casper);
		this.wait(2000);
		functions.addcontentstocell(casper, input_Rcode);
	});
	
    // Adding 3 comments
    casper.then(function () {
        for (var i = 1; i <= 3; i++) {
            functions.comments(casper, comment);
            this.wait(2000);
        }// for loop closed
    });

    casper.then(function () {
        do
        {
            cm_cnt = cm_cnt + 1;
            this.wait(2000);
        } while (this.visible(x('/html/body/div[3]/div/div[3]/div/div/div/div[5]/div[2]/div/div/div/div/div[' + cm_cnt + ']/div[2]/div')));
        cm_cnt = cm_cnt - 1;
        this.echo("number of comments results:" + cm_cnt);
        this.test.assertEquals(cm_cnt, 3, 'Verified that user has entered 3 comments successfully');
    });

    casper.run(function () {
        test.done();
    });
});
    
    
    
    
    
    
    
    
