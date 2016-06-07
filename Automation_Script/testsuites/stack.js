// casper.test.begin("Smoke Test case which covers basic features", 38, function suite(test) {

//     var x = require('casper').selectXPath;//required if we detect an element using xpath
//     var github_username = casper.cli.options.username;//user input github username
//     var github_password = casper.cli.options.password;//user input github password
//     var rcloud_url = casper.cli.options.url;//user input RCloud login url
//     var functions = require(fs.absolute('basicfunctions.js'));//invoke the common functions present in basicfunctions.js
//     var notebook_id = '50de72ea14b86aa176c4';//Notebook which consists all the cells like "R, Python, Markdown, Shell"
//     var Notebook_name = "TEST_NOTEBOOK";// Notebook name of the importing/Load Notebook
//     var fileName = '/home/travis/build/iPrateek032/rcloud/tests/PHONE.csv';// File path directory
//     var URL = 'https://www.facebook.com';
//     var URL2 = "https://www.facebook.com/dialog/share?app_id=966242223397117&redirect_uri=http://www.facebook.com/dialog/return/close&display=popup&href=http://www.isearchforjob.com/";
    

//     //Code to display Console errors
//     // casper.on('remote.message', function (msg) {
//     //     console.log('remote message caught: ' + msg);
//     // });

//     //Code to display errors
//     // casper.on('page.error', function (msg, trace) {
//     //     console.log('Error: ' + msg, 'ERROR');
//     // });

//     casper.start(URL, function () {
//         casper.page.injectJs('jquery-1.10.2.js');//inject jquery codes
//     });

//     casper.viewport(1024, 768).then(function () {
//     //     test.comment('⌚️  Logging in to RCloud using GitHub credentials...');
//     //     functions.login(casper, github_username, github_password, rcloud_url);
//     // });

//     // casper.then(function (){
//         this.fill('form#login_form', {
//         email: '420ge420@gmail.com',
//         pass: 'musigma12'
//         }, true);
//     });

//     casper.then(function (){
//         this.thenOpen(URL2);
//         this.wait(5000);
//         this.echo("Openeing 2nd URL")
//     });

//     casper.then(function (){
//         this.click("._55pe > span:nth-child(1)");
//         this.wait(3000);
//         if (this.test.assertVisible("li._54ni:nth-child(3) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)")){
//             this.echo("Selector is visble hence clicking on it")
//             this.click("li._54ni:nth-child(3) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1) > span:nth-child(1)");
//         }
//         else
//         {
//             this.echo("No selector is visible")
//         }
//         this.echo("Now entering group name");
//     });

//     casper.wait(5000);

//     casper.then(function (){
//         this.click("#audience_group");
//         this.sendKeys("#audience_group", 'B');
//         this.wait(5000);
//         this.click(x(".//*[@id='js_9']/div/div[2]/div/div/div/span"), 'B', {keepFocus: true});
//         // this.click(x(""));
//     });

//     casper.wait(15000)


//     casper.run(function () {
//         test.done();
//     });
// });
// var casper1 = require('casper').create();
// var casper2done = false;

// casper1.start("http://www.google.com").then(function(){

//     //casper1.capture("casper1_1.png");

//     var casper2 = require('casper').create();
//     casper2.start("http://stackoverflow.com/contact").then(function(){
//         casper1.echo(casper2.getCurrentUrl(), casper2.getTitle());
//         //casper2.capture("casper2.png");
//     });
//     casper2.run(function(){
//         this.echo("DONE 2");
//         casper2done = true;
//     });
// });

// casper1.waitFor(function check(){
//     return casper2done;
// });
// casper1.then(function(){
//     casper1.echo(casper1.getCurrentUrl(), casper1.getTitle()); // Comment to fix answer (min 6 chars)
//     //casper1.capture("casper1_2.png");
// });

// casper1.run(function(){
//     this.echo("DONE");
//     this.exit();
// });

var casper = require('casper').create({
 verbose: true,
    logLevel: "debug"
});

//1. Open page
casper.start()
    .then(function() {
      casper.evaluate(function() {
        localStorage.clear()
      })
    })
    .thenOpen('http://mca.gov.in/DCAPortalWeb/dca/MyMCALogin.do?method=setDefaultProperty&mode=14', function() {
      // test.assertUrlMatch('http://localhost:3000')
    })
// casper.start('http://mca.gov.in/DCAPortalWeb/dca/MyMCALogin.do?method=setDefaultProperty&mode=14');

//2. Click on 2nd radio button in page
casper.then(function() {
    this.click('tr:nth-child(5) input');
});

//3. Click on #searchCriteria
casper.then(function() {
 this.click('#searchCriteria');
});

//4. Select CONT option in dropdown list and fill up company name as Microsoft
casper.then(function() {
 this.fill('form[name="CompanyCINSRForm"]', {
  'searchCriteria' : 'CONT',
  'companyName' : 'Microsoft'
 }, false);
});
//5. Click the Submit button
casper.then(function() {
 this.click('#Default');
});
/*Utility function to check the URL
casper.then(function() {
    console.log('clicked Submit, new location is ' + this.getCurrentUrl());
});
*/
casper.then(function() {
 //Utility to echo the name of the newly redirected page
 // this.echo(this.getTitle());
  var name_selector = 'table[id="list1"] tbody tr td:nth-of-type(2)';
  var cin_selector = 'table[id="list1"] tbody tr td:nth-of-type(3)';
  var names_info = this.getElementsInfo(name_selector); // an array of object literals
  var cin_info = this.getElementsInfo(cin_selector);

  var names = [];
  var cin = [];
  for (var i = 0; i < names_info.length; i++) {
    names.push(names_info[i].text);
    cin.push(cin_info[i].text);
  }
  // Dump the town_names array to screen
  require('utils').dump(names);
  require('utils').dump(cin);
  var fs = require('fs');
  var myfile = "output.txt"
  fs.write(myfile, cin, 'w');
});

/*Utility to print out a screenshot whenever you're confused about any page
casper.then(function() {
 this.capture("result.png");
});
*/
casper.run();