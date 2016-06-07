casper.test.begin("Test", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var group = 'EXCELLENCE()';
    var GP;
    var file = "/home/fresh/credentials.csv";
    require('utils').dump(casper.steps.map(function(step) {
        return step.toString();
    }));


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

    casper.wait(5000);///home/fresh/Automation Script/testsuites/credentials.csv

    casper.evaluate(function () {
        var Converter = require("csvtojson").Converter;
        var converter = new Converter({});

        //end_parsed will be emitted once parsing finished
        converter.on("end_parsed", function (jsonArray) {
            console.log(jsonArray); //here is your result jsonarray
        });

        //read from file
        require("fs").createReadStream("./home/fresh/credentials.csv").pipe(converter);


        // $(document).ready(function() {
        //     $.ajax({
        //         type: "GET",
        //         url: file,
        //         dataType: "text",
        //         success: function(data) {processData(data);}
        //      });
        // });

        //     function processData(allText) {
        //         var record_num = 5;  // or however many elements there are in each row
        //         var allTextLines = allText.split(/\r\n|\n/);
        //         var entries = allTextLines[0].split(',');
        //         var lines = [];

        //         var headings = entries.splice(0,record_num);
        //         while (entries.length>0) {
        //             var tarr = [];
        //             for (var j=0; j<record_num; j++) {
        //                 tarr.push(headings[j]+":"+entries.shift());
        //             }
        //             lines.push(tarr);
        //         }
        //         alert(lines);
        //         console.log(lines);
        //     }
        // });
    });

    // // //Creating a group
    // casper.then(function () {
    //     this.click("li.dropdown > a:nth-child(1)");
    //     this.evaluate(function () {
    //         $('#manage_groups').click();
    //     });
    //     this.echo('opened manage group dialog box');
    //     this.wait(2000);
    // });

    // casper.then(function () {
    //     //this.click("select.ng-pristine:nth-child(3)");
    //     this.wait(8000);
    //     GP = this.fetchText("select.ng-pristine:nth-child(3)");
    //     this.echo(GP);

    // });

    // //var casper = require('casper').create();

    // casper.selectOptionByText = function (selector, textToMatch) {
    //     this.evaluate(function (selector, textToMatch) {
    //         var select = document.querySelector(selector),
    //             found = false;
    //         Array.prototype.forEach.call(select.children, function (opt, i) {
    //             if (!found && opt.innerHTML.indexOf(textToMatch) !== -1) {
    //                 select.selectedIndex = i;
    //             }
    //         });
    //     }, selector, textToMatch);
    // };

    // //casper.start('http://stackoverflow.com/contact', function () {
    // casper.then(function () {
    //     this.selectOptionByText("select.ng-pristine:nth-child(3)", "EXE");
    //     console.log("qqqqqqqqqqqqqqqq")
    // });

    casper.then(function () {
        // var fs = require('fs');
        // var f = fs.open('/home/fresh/credentials.xlsx','r');
        // for(i = 0; i < 100; i++) {
        // var a=f.readLine();
        // this.echo(a);
        // }
        // f.close();
        //*************************//
        //var fs = require('fs'),
        //    readline = require('readline');
        //var rd = readline.createInterface({
        //    input: fs.createReadStream('/home/fresh/credentials.csv'),
        //    output: process.stdout,
        //    terminal: false
        //});
        //
        //rd.on('line', function (line) {
        //    console.log(line);
        //});
        //**************************************//
        function my_function() {
            var Excel;
            Excel = new ActiveXObject("Excel.Application");
            Excel.Visible = false;
            return Excel.Workbooks.Open("/home/fresh/credentials.xlsx").ActiveSheet.Cells(l, i).Value;
        }

        //where l is number of rows and i are columns...
        var i = 1;
        var l = 1;

        do
        {
            a = my_function()

            if (a != null) {
                document.write("value is " + a + "  ;  ;  ;  ;");
                i++;
            }
            else {
                l++;
                i = 1;
                document.write("<br />");
            }

            b = my_function()
        } while (a != null || b != null);


    });


    casper.wait(8000);

    casper.run(function () {
        test.done();
    });
});
