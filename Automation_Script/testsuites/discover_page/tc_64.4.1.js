/* 
 Author: Amith
 Description: This is a casperjs automation script for checking that, User can customize the notebook thumbnail image according to his needs
 */


//Begin Tests
casper.test.begin("Customizing the thumbnail image of the notebook", 9, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var fileName = 'SampleFiles/thumb.png'; // File path directory
    var system = require('system')
    var currentFile = require('system').args[4];
    var curFilePath = fs.absolute(currentFile);
    var curFilePath = curFilePath.replace(currentFile, '');
    fileName = curFilePath + fileName;

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
    
    casper.wait(3000);

    functions.create_notebook(casper);
    
    casper.wait(6000);

    //Verifying whether file upload div is open or not
    casper.wait(2000).then(function () {
        if (this.visible(x(".//*[@id='file']"))) {
            this.echo('File Upload pane div is open');
            this.wait(5000);
        }
        else {
            this.echo('File upload div is not open,hence opening it');
            this.wait(6000);
            this.click(x(".//*[@id='accordion-right']/div[2]/div[1]"));
            this.wait(5000);
        }
    });
    
    casper.wait(6000);
    
    //File Upload 
    casper.wait(2000).then(function () {
        this.evaluate(function (fileName) {
            __utils__.findOne('input[type="file"]').setAttribute('value', fileName)
        }, {fileName: fileName});
        this.page.uploadFile('input[type="file"]', fileName);
        console.log('Selecting a file');
    });
    
    casper.wait(4000);

    casper.wait(2000).then(function () {
        this.wait(6000, function () {
            this.click(x(".//*[@id='upload-to-notebook']"));
            console.log("Clicking on Upload to notebook check box");
            this.click(x(".//*[@id='upload-submit']"));
            console.log("Clicking on Submit icon");
        });
    });
    
   
    casper.wait(4000);

    casper.wait(10000).then(function () {
        this.waitUntilVisible(x('//*[contains(text(), "added")]'), function then() {
            console.log("File has been uploaded");
        });
        this.test.assertSelectorHasText(x(".//*[@id='asset-list']/li[3]/a/span[1]"), 'thumb.png', 'Uploaded file is present in assets');
    });
    
    
    casper.wait(6000);
    
    //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("thumbnail");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        
    });
    
    casper.wait(4000);

    casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
    });
    
    casper.wait(4000);
    
    
    casper.then( function () {
		this.wait(10000);
		var temp1 = this.getCurrentUrl();
        notebook_id = temp1.substring(41);
        this.echo("Notebook Id is: " + notebook_id);
        this.thenOpen(temp1);
        this.wait(10000);
	});
    
    casper.wait(4000);
    
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
    
    casper.wait(6000);
    
    casper.wait(4000).then(function(){
       this.test.assertTextExists('thumbnail', 'page body contains notebook'); 
        
    });
    
    casper.wait(6000);
    
    casper.wait(4000).then(function(){
       this.test.assertExists(x(".//*[@id='discovery-app']/div/div/figure[1]/a/img"), 'Thumbnail image is present');
        
    });
    
    casper.wait(4000);
    
    casper.viewport(1024, 768).then(function () {
        this.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebook_id);
        this.wait(8000);
            
    });
    
    casper.wait(4000);
    
     //getting the notebook title and modifying it
    casper.viewport(1024, 768).then(function () {
		this.wait(3000);
        title = functions.notebookname(casper);
        this.echo("Present title of notebook: " + title);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("png20");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        
    });

    casper.viewport(1366, 768).then(function () {
        var newtitle = functions.notebookname(casper);
        this.echo("Modified notebook title: " + newtitle);
        this.test.assertNotEquals(newtitle, title, "the title has been successfully modified");
    });
    
    casper.wait(6000);


    casper.run(function () {
        test.done();
    });
});

