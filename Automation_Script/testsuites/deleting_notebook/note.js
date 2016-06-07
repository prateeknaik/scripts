casper.test.begin("Import", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var title;
    var notebookID = 'dc1f6321553f25501fcd';

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
    
    casper.then(function(){
		this.click({type:'xpath', path:".//*[@id='rcloud-navbar-menu']/li[3]/a"});
		if(this.test.assertVisible('#import_notebooks'),"Import external notebook is visible")
		{
			this.click('#import_notebooks');
		}else
		{
			console.log('Import external notebook is not visible');
		}
		this.wait(2000);
	});
	
	casper.then(function(){
		this.sendKeys({type:'css',path:"#import-gists"}, notebookID);
		this.click('.btn.btn-primary');
	});
	
	casper.wait(7000);
	
	casper.run(function () {
        test.done();
    });
});
