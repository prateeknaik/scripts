casper.test.begin("Automation Smoke Test", 36, function suite(test) {

    var x = require('casper').selectXPath;//required if we detect an element using xpath
    var github_username = casper.cli.options.username;//user input github username
    var github_password = casper.cli.options.password;//user input github password
    var rcloud_url = casper.cli.options.url;//user input RCloud login url
    var functions = require(fs.absolute('basicfunctions.js'));//invoke the common functions present in basicfunctions.js
    var initialcounter = 0;//store initial count of notebooks
    var newcounter = 0;//store initial count of notebooks
    var notebook_id = '50de72ea14b86aa176c4';//Notebook which consists all the cells like "R, Python, Markdown, Shell"
    var Notebook_name = "TEST_NOTEBOOK";
    var fileName = '/home/fresh/FileUpload/PHONE.csv'; // File path directory
    //Notebook ID to check for sharable links
    var Notebook_R = 'http://127.0.0.1:8080/notebook.R/c3d97ea6ef0200bd0cf3';
    var Mini = "http://127.0.0.1:8080/mini.html?notebook=185d414f1fac3c04f73d";
    var Shiny = "http://127.0.0.1:8080/shiny.html?notebook=1adbca5f54c0bc87dce7";
    var View = "http://127.0.0.1:8080/view.html?notebook=c6e907a8d01b3b022220";
    var url, url1, NB, id, afterFork, viewID;

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');//inject jquery codes
    });

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.then(function () {
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        var t = this.getCurrentUrl();
        this.thenOpen(t);
        this.wait(5000);
    });

    //Verifying for Load Notebook ID
    casper.then(function () {
        console.log(" Load Notebook by ID ");
        functions.open_advanceddiv(casper);
        this.echo("Clicking on advanced dropdown");
        this.wait(2999);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter notebook ID or github URL:") { // message between quoutes is the alerts message
                return notebook_id;
            }
        });
        this.click("#open_from_github");
        this.echo("Using Load Notebook ID we are opening that perticular Notebook");
        this.wait(8000);
    });

    casper.waitForSelector(x(".//*[@id='notebook-title']"), function () {
        functions.validation(casper);
        var title = this.fetchText(".jqtree-selected > div:nth-child(1) > span:nth-child(1)");
        this.echo(title);
        this.test.assertEquals(title, Notebook_name, "Confirmed that User can load Notebook by ID");
    });

    casper.then(function () {
        url = this.getCurrentUrl();
        //this.echo(url);
        this.thenOpen(url);
        this.wait(5000);
    });

    //********************************************************************************//

    //Click on RunAll and verify the output
    casper.then(function () {
        console.log(" Executing cell contents ('R, Shell, Markdown and Python) ");
        //NB = this.getCurrentUrl();
        //afterFork = NB.substring(41);
        //console.log('after forking Notebook ID is : ' + afterFork);
        this.then(function () {
            this.click(x(".//*[@id='run-notebook']"));
            this.wait(5000);
        })
    });

    //verifying output for the each and ever single cell
    casper.then(function () {
        this.wait(10000);
        this.then(function () {
            console.log(" Output of various cells ");
            this.wait(5000);
            this.test.assertExists(x(".//*[@id='part1.R']/div[3]/div[2]/pre/code"), "R Cell has been executed and below is the corresponding output");
            var r = this.fetchText(x(".//*[@id='part1.R']/div[3]/div[2]/pre/code"));
            console.log("Output of R cell : " + r);
        });

        this.then(function () {
            this.wait(5000);
            this.test.assertExists(x(".//*[@id='part2.md']/div[3]/div[2]/blockquote/p"), "Markdown Cell has been executed and below is the corresponding output");
            var m = this.fetchText(x(".//*[@id='part2.md']/div[3]/div[2]/blockquote/p"));
            console.log("Output of Markdown cell : " + m);
        });

        this.then(function () {
            this.wait(5000);
            this.test.assertExists(x(".//*[@id='part3.sh']/div[3]/div[2]/pre/code"), "Shell Cell has been executed and below is the corresponding output");
            var s = this.fetchText(x(".//*[@id='part3.sh']/div[3]/div[2]/pre/code"));
            console.log("Output of Shell cell : " + s);
        });

        this.then(function () {
            this.wait(5000);
            this.test.assertExists(x(".//*[@id='part4.py']/div[3]/div[2]"), "Python Cell has been executed and below is the corresponding output");
            var p = this.fetchText(x("#part4\.R > div:nth-child(3) > div:nth-child(2) > span:nth-child(1)"));
            console.log("Output of R cell" + p);
        });
    });

    //*****************************************************************************************************************
    //Verifying for workspace div
    casper.then(function () {
        casper.evaluate(function () {
            $('#accordion-right .icon-sun').click();
        });
        this.wait(2000);
        var data = this.fetchText("#enviewer-body-wrapper");
        console.log("Workspace has produced following Dataframe : " + data);
    });

    //Verify for dataframe div
    casper.then(function () {
        console.log("clicking on dataframe, from the workspace div");
        var z = casper.evaluate(function () {
            $('#enviewer-body>table>tr>td>a').click();//clicking dataframe link
            this.echo('clicking on dataframe');
        });
        this.wait(2000);
        this.then(function () {
            var df = this.fetchText("#viewer-body");
            console.log("Contents of Dataframe: " + df);
        });

    });

    //*******************************************************************************************************************
    //Verifying for Create Notebook
    casper.then(function () {
        functions.create_notebook(casper);
        console.log("Verified that new notebook can be created");
    });

    //********************************************************************************************************************
    //Verifying for the posting and deleting Comments
    casper.then(function () {
        url1 = this.getCurrentUrl();
        //this.echo(url);
        viewID = url1.substring(41);
        this.echo("Notebook ID of newly created Notebook:" + viewID);
        this.thenOpen(url1);
        this.wait(5000);

        // console.log(" Posting and deleting comment ");
        // functions.comments(casper, Notebook_name);
        // //delete the comment
        // casper.then(function () {
        //     this.wait(4000);
        //     if (this.assertExists(".comment-body-text")) {
        //         this.mouse.move(".comment-body-text");
        //         this.click({type: 'css', path: 'i.icon-remove:nth-child(2)'});
        //         console.log("Deleting Comment");
        //     } else {
        //         console.log("there is no comment to delete");
        //     }
        // });

        // casper.wait(4000);

        // casper.then(function () {
        //     this.test.assertDoesntExist(x(".//*[@id='comments-container']/div/div[2]/div/div"), Notebook_name, 'Confirmed that entered commment is deleted');
        // });
    });

    //*********************************************************************************************************************
    //Now uploading a binary file to the Notebook
    casper.then(function () {
        console.log(" Uploading file to the Notebook ");
        //Verifying whether file upload div is open or not
        casper.then(function () {
            if (this.visible(x(".//*[@id='collapse-file-upload']/div"))) {
                this.echo('File Upload pane div is open');
                this.wait(5000);
            }
            else {
                this.echo('File upload div is not open,hence opening it');
                this.click(x(".//*[@id='accordion-right']/div[2]/div[1]"));
                this.wait(5000);
            }
        });

        //File Upload
        casper.then(function () {
            this.evaluate(function (fileName) {
                __utils__.findOne('input[type="file"]').setAttribute('value', fileName)
            }, {fileName: fileName});
            this.page.uploadFile('input[type="file"]', fileName);
            console.log('Selecting a file');
        });
        casper.evaluate(function () {
            $('#upload-to-notebook').click();
        });

        casper.then(function () {
            this.wait(1000);
            console.log("Clicking on Upload to notebook check box");
            this.click(x(".//*[@id='upload-submit']"));
            console.log("Clicking on Submit icon");
        });

    });

    casper.wait(8000);

    casper.then(function () {
        console.log(" Verifying file has been uploaded to Notebook or not ");
        this.then(function () {
            this.test.assertSelectorHasText(x(".//*[@id='asset-list']"), 'PHONE.csv', 'Uploaded file is present in assets');
            console.log("Verified that files can be uploaded to the Notebook");
        });

        this.then(function () {
            this.echo("Deleting Uploaded asset from the Notebook");
            this.click(x(".//*[@id='asset-list']/li[3]/a/span[2]/i"));
            this.test.assertSelectorDoesntHaveText(x(".//*[@id='asset-list']"), "PHONE.csv");
            this.echo("Confirmed that Asset has been successfully removed")
        });
    });

    functions.addnewcell(casper);
    functions.addcontentstocell(casper, "a<-50; b<-50; c <-a+b; c ");

    casper.wait(5000);

    //Making notebook  as private
    casper.then(function () {
        console.log(" Making notebook Private ");
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(7000);
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)")
        this.then(function () {
            this.wait(4000);
            this.click('.group-link > a:nth-child(1)')
        });
        this.then(function () {
            this.click('#yellowRadio');
            this.wait(4000)

            this.setFilter("page.prompt", function (msg, currentValue) {
                this.echo(msg);
                if (msg === "Are you sure you want to make notebook " + Notebook_name + " truly private?") {
                    return TRUE;
                }
            });
            this.click('span.btn:nth-child(3)');
            this.echo('notebook is made private successfully')
        });
        //this.wait(2000);

    });

    casper.wait(5000);

    //File Upload  
    casper.then(function () {
        this.wait(1000);
        //console.log("Clicking on Upload to notebook check box");
        this.click(x(".//*[@id='upload-submit']"));
        console.log("Clicking on Submit icon");
    });

    casper.wait(8000);

    casper.then(function () {
        console.log(" Verifying file has been uploaded to Notebook or not ");
        this.then(function () {
            this.test.assertSelectorHasText(x(".//*[@id='asset-list']"), 'PHONE.csv', 'Uploaded file is present in assets');
            console.log("Verified that files can be uploaded to the Notebook");
        });
        this.reload();
    });

    casper.wait(5000);

    //validate if notebook has become private
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(2000);
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(1) > i:nth-child(1)");
        this.then(function () {
            status = this.fetchText('.group-link > a:nth-child(1)');
            //stauts = this.fetchText(".group-link");
            this.echo("notebook is " + status);
            this.wait(3000);
            this.test.assertEquals(status, 'private', "The notebook has been converted to private successfully")
        });
    });

    //Open Notebook in GitHub
    casper.viewport(1366, 768).then(function () {

        this.waitForSelector({type: 'css', path: '#open_in_github'}, function () {
            console.log("Link for opening notebook in github found. Clicking on it");
            if (this.click({type: 'css', path: '#open_in_github'})) {
                this.wait(11000);
                this.viewport(1366, 768).withPopup(/gist.github.com/, function () {
                    this.wait(4000);
                    console.log(this.getCurrentUrl());
                    this.test.assertUrlMatch(/gist.github.com*/, 'Notebook opened in github');
                    //verifying that the gist opened belongs to local user
                    this.wait(8000);
                    var gist_user = this.fetchText({type: 'css', path: '.url > span:nth-child(1)'});
                    this.echo("Gist owner is " + gist_user);
                    this.test.assertEquals(gist_user, github_username, 'verified that the gist belongs to the local user');
                });
            }//if ends
            else {
                console.log('Notebook could not be opened in github');
            }
        });
    });

    //verifying for Shareable links
    casper.then(function () {
        console.log(" Opening Notebook.R, Mini.html, Shiny.html and view.html through Shareable links ");
        casper.thenOpen(Notebook_R);
    });

    casper.wait(5000);

    casper.then(function () {
        this.test.assertExists("body > form:nth-child(1)", "Confirmed that User is able to open Notebook.R");
    });

    casper.wait(5000);

    casper.then(function () {
        this.thenOpen(Mini);
    });

    casper.wait(5000);

    casper.then(function () {
        this.test.assertExists("#SWvL_0_0 > div:nth-child(1) > strong:nth-child(1)", "Confirmed that User is able to open Mini Notebook");
    });

    casper.then(function () {
        casper.thenOpen(Shiny);
    });

    casper.wait(5000);

    casper.then(function () {
        this.test.assertExists("body > div > div:nth-child(2) > div.col-sm-4 > form > div:nth-child(1) > div > div > div.selectize-input.items.full.has-options.has-items", "Confirmed that User is able to open Shiny Notebook");
    });


    casper.then(function () {
        this.thenOpen(View);
    });

    casper.wait(5000);

    casper.then(function () {
        this.test.assertExists(x(".//*[@id='part1.R']/div[2]/div[2]/pre/code"), "Confirmed that User is able to open view.html");
    });

    //Now Open the Mini, Shiny.html, Notebook.R and view.html Notebook as Anonymous user
    casper.then(function () {
        console.log(" Open the Mini, Shiny.html, Notebook.R and view.html Notebook as Anonymous user")

        casper.then(function () {
            this.thenOpen(url1);
            this.wait(3000);
            functions.validation(casper);
        });

        //Publishing Notebook to check view.html for anonymous user
        casper.then(function () {
            functions.open_advanceddiv(casper);

            casper.evaluate(function () {
                $('#publish_notebook').click();
            });
            console.log("Published Notebook")
        });

        //Logout from the RCloud
        casper.then(function () {
            this.click("#rcloud-navbar-menu > li:nth-child(7) > a:nth-child(1)");
            console.log('Logging out from the RCloud');
            this.echo(this.getTitle());
            var log = this.fetchText("#main-div > p:nth-child(2) > a:nth-child(1))");
            this.echo(log);
        });


        casper.wait(4000);

        //Load the Mini.html, Notebook.R, Shiny.html
        casper.then(function () {
            console.log(" Opening Notebook.R, Mini.html, Shiny.html and view.html through Shareable links ");
            casper.thenOpen(Notebook_R);
        });

        casper.wait(5000);

        casper.then(function () {
            this.test.assertExists("body > form:nth-child(1)", "Confirmed that User is able to open Notebook.R");
        });

        casper.wait(5000);

        casper.then(function () {
            this.thenOpen(Mini);
        });

        casper.wait(5000);

        casper.then(function () {
            this.test.assertExists("#SWvL_0_0 > div:nth-child(1) > strong:nth-child(1)", "Confirmed that User is able to open Mini Notebook");
        });


        casper.then(function () {
            this.thenOpen("http://127.0.0.1:8080/edit.html?notebook=" + viewID);
        });

        casper.wait(5000);

        casper.then(function () {
            this.test.assertExists(x(".//*[@id='part1.R']/div[2]/div[2]/pre/code"), "Confirmed that User is able to open view.html");
        });

        casper.then(function () {
            casper.thenOpen(Shiny);
        });

        casper.wait(5000);

        casper.then(function () {
            this.test.assertExists("body > div > div:nth-child(2) > div.col-sm-4 > form > div:nth-child(1) > div > div > div.selectize-input.items.full.has-options.has-items", "Confirmed that User is able to open Shiny Notebook");
        });
    });

    casper.then(function () {
        this.thenOpen("http://127.0.0.1:8080/login.R");
    });

    casper.wait(10000);

    functions.fork(casper);

    //Deleting the Notebook
    casper.then(function () {
        this.mouse.move('.jqtree-selected > div:nth-child(1)');
        this.wait(2000);
        this.click(".jqtree-selected > div:nth-child(1) > span:nth-child(2) > span:nth-child(3) > span:nth-child(1) > span:nth-child(5) > i:nth-child(1)");
        this.wait(4000);
        this.test.assertExists("#readonly-notebook", "Confirmed that Notebook is deleted");

    });

    casper.run(function () {
        test.done();
    });
});