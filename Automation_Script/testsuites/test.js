casper.test.begin("Overwrite a File to Notebook",  function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var fileName = '/home/fresh/FileUpload/PHONE.csv'; // File path directory  
    var URL = 'http://127.0.0.1:8080/edit.html?notebook=50a11c01d2cae7956467'; 
    //var casper.page.settings.webSecurityEnabled = false;
    var webPage = require('webpage');
    var page = webPage.create();

    page.onResourceReceived = function(response) {
      console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
    };


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

//    casper.thenOpen(URL);#export_notebook_gist

    casper.wait(8000);

    
    casper.then(function (){
        this.click(x(".//*[@id='rcloud-navbar-menu']/li[3]/a/b"));
        console.log('advance');
        this.wait(3000);
    });

    

    // casper.then(function (){
    //     this.click(x(".//*[@id='export_notebook_gist']"));
    //     console.log('export_notebook_gist');
    //     this.wait(3000);
    // });

    // casper.then(function () {
    //     // functions.open_advanceddiv(casper)
    //     // this.echo("Clicking on dropdown");
    //     this.wait(2999);
    //     casper.setFilter("page.prompt", function (msg, currentValue) {
    //         if (msg === "You have choosen to open:") {
    //             return true;
    //         }
    //     });
    //     this.wait(10000);
    //     this.click(x(".//*[@id='export_notebook_gist']"));
    //     this.echo("Opening Notebook");
    //     this.wait(10000);
    // });


//     casper.thenClick(x(".//*[@id='export_notebook_gist']"));
//     casper.then(function(){
//     var parameters = this.evaluate(function(){
//         // from http://stackoverflow.com/a/2403206
//         var paramObj = {};
//         $.each($('#export_notebook_gist').serializeArray(), function(_, kv) {
//             paramObj[kv.name] = kv.value;
//         });
//         return paramObj;
//     });
//     var url = this.getElementAttribute('#export_notebook_gist', 'action');
//     this.download(url, 'aapuiuil.csv', 'POST', parameters);
// });
    // casper.then(function() {    
    //  this.click('#export_notebook_gist');
    // });

    casper.then(function (){
        this.evaluate(function (fileName) {
                __utils__.findOne('input[id="export_notebook_gist"]').getAttribute('value')//, fileName)
            });
            this.click('input[id="export_notebook_gist"]');
            console.log('Selecting a file');
    })

    

    // casper.then(function (){
    //     this.download("#export_notebook_gist");
    // });

    casper.wait(8000);

     casper.run(function () {
        test.done();
    });
});
