//Begin Tests
casper.test.begin("Import External Notebooks without Prefix", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_name;

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
    
    functions.create_notebook(casper);
    
    casper.then(function () {
		this.exists(".dropdown-toggle.recent-btn");
		this.echo('Recent option exists');
	});
	
	casper.then(function () {
		notebook_name = this.fetchText('#notebook-title');
		this.echo(notebook_name);
	});
	
	functions.create_notebook(casper);
	
	casper.then(function () {
		this.click({type:'xpath', path:".//*[@id='notebooks-panel-inner']/div/a"}, 'Clicking on Recent option');
		this.wait(8000);
	});
		
	casper.then(function () {		
		for (var i = 1; i <= 20; i++) {
			var temp = this.fetchText({
                    type: 'xpath',
                    path: ".//*[@id='notebooks-panel-inner']/div/ul/li[" + i + "]/a"
                });
                this.echo( temp);
			}
		this.wait(5000);
		this.test.assertSelectorHasText({type: 'xpath',	path: ".//*[@id='notebooks-panel-inner']/div/ul"}, notebook_name, 'The previously created notebook is present under Recent option list');	
	});
		
	casper.wait(10000);
	//~ 
	casper.run(function () {
        test.done();
    });
});
