
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
     casper.wait(3000);

    // Getting the title of new Notebook
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo(" Notebook title : " + title);
        this.wait(3000);
    });

	functions.delete_notebooksIstarred(casper);
	casper.then(function(){
		this.echo("Deleted the newly created notebook with title " + title);
	});
	casper.wait(5000);
		
		
        casper.run(function () {
            test.done();
        });
    });
