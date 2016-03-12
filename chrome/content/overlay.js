/*share button on mw, translations*/
/*BUG: Non-Standart latin characters are causing problems on some websites*/
/*BUG: always on top does not reset after closing the window on some situations*/

/*SORRY for the shitty code, it was developed as a javascript and firefox API playground without anny planning*/
/*Sharing automation function can bi called only after user permition*/

var budaneki = { 
/*Debugging tool*/
    version: '2.0',
    logcounter: 0,

    log: function (text) {
       return false;
        if (document.getElementById('budaneki-log-container').state != 'open' || 'showing') {
            document.getElementById('budaneki-log-container').openPopup(document.getElementById("content").selectedBrowser, "overlap", 900, 300, false, true);
            document.getElementById('budaneki-log-container').addEventListener('click',function(){
			document.getElementById('budaneki-log-container').hidePopup();
			},false);
        }

        try {
            budaneki.logcounter++;
            var log = document.getElementById('debug-log');
            var newline = document.createElementNS("http://www.w3.org/1999/xhtml", "html:div");
            var textnode = document.createTextNode(budaneki.logcounter + ':' + text);
            newline.appendChild(textnode);
            log.appendChild(newline);
            var objDiv = document.getElementById("divExample");
            log.scrollTop = log.scrollHeight;
        } catch (err) {
            alert('Budaneki error:' + err)
        }


    },
    cleanLog: function () {
        //budaneki.log('cleaning debug log');

        document.getElementById('debug-log').innerHTML = '<span>Budaneki Debug LOG:</span>';
        budaneki.logcounter = 0;
        return true;
    },
    /*Debugging tool*/



    onWindowLoad: function () {
        //budaneki.log("Budaneki loading");	
	try{
	
        budanekilib.loadUI();
        //Load settings
        budaneki.loadSettings();
        //add log event listener
        document.getElementById('budaneki-log-container').addEventListener("click", function () {
            budaneki.cleanLog();
        }, false);
        //budaneki.log("log handler loaded");
        window.addEventListener("mouseover", function (evt) {



            budanekilib.closeIconMenu();
            evt.stopPropagation();



        }, false);

        //close icon if already displayed
        window.addEventListener("mousedown", function (evt) {
            budaneki.closeIcon();
        }, false);
        this.budanekiIcon = document.getElementById('budaneki-icon-panel');
        
        budaneki.loadOnThisWindow();
        var container = gBrowser.tabContainer;
        container.addEventListener("TabSelect", function () {

              budaneki.closeIcon();

           
            budaneki.loadOnThisWindow();
			//minimize if on top
            if (budaneki.allwaysOnTop === true) {
                budanekilib.minMainWindow();
				if(budaneki.anchor.allwaysOnTop === true){
				   budanekilib.restoreMainWindow();
				}
            }else{
		     	budaneki.closeMainWindow();
			}

        }, false);
		
		/*moving the main widow - currently not working, just dont use it
		window.addEventListener('mousemove',function(evt){
		
		budanekilib.moveMainWindow(evt,document.getElementById('budaneki-mw-container'));
		},false);	*/
	    budanekilib.pref('counter', budanekilib.pref('counter') + 1);
	}catch(err){budaneki.log('error onwindowload') + err}


    },
    loadSettings: function () {
        try {
		     budaneki.anchor = gBrowser.selectedBrowser;
		    
   			 budaneki.shareURL = 'https://addons.mozilla.org/en-US/firefox/addon/budaneki/';
		     budaneki.dbConnHandle = false;
			 budaneki.anchor.iconDisplay = false;
            //check if this is the first run ever
            if (budanekilib.pref('firsttimesetup') != true) {
			    budanekilib.pref('firsttimesetup', true);
                budanekilib.pref('lang', 'tr');
                budanekilib.pref('gtlang', 'tr');
                budanekilib.pref('iconmode', 1);
				budanekilib.pref('counter', 1);
                budanekilib.buildDB();
                budanekilib.firstStart();
                
				
				
            }
			//budaneki.log('loading settings');
             
			 var c = budanekilib.pref('counter');
			 if( (c == 5 || c == 15 || c == 50 || c == 150) && budanekilib.pref('share') != true){
			 // Ask for sharing the extension 
			 budanekilib.openShare();
			 }
			 
            //load settings window
            document.getElementById('budaneki-settings-window').loadURI('chrome://budaneki/skin/default/'+budanekilib.pref('lang')+'/settings.htm', null, null);
            
            //1 normal, 2 ghost 3 hidden
            budaneki.iconMode = budanekilib.pref('iconmode');
            budaneki.allwaysOnTop = 0;
        } catch (err) {
            //budaneki.log('loadSettings err:' + err);
        }
    },

    loadOnThisWindow: function () {
        budaneki.anchor = gBrowser.selectedBrowser;
        if (budaneki.anchor.budanekiLoadedOnPage !== true) {

            budaneki.anchor.addEventListener("mouseup", function (evt) {
                budaneki.initSelection(evt);
            }, false);
            budaneki.anchor.addEventListener("mousedown", function (evt) {
                budaneki.closeIcon();
                //don't close if 'always on top' selected
                if (budaneki.mainWindowOnTop !== true) {
                    budaneki.closeMainWindow();
                }

            }, false);
            budaneki.anchor.addEventListener("keyup", function (evt) {

                //open the menu on double CTRL
                if (evt.keyCode == 17 && budaneki.anchor.iconDisplay == true) {
                    budanekilib.doubleCTRL();
                }
            }, false);
            //budaneki.log('mouseup,down and keydown event lisener added');
            budaneki.anchor.budanekiLoadedOnPage = true;
        }
		

       		  setTimeout(function () {
              document.getElementById('urlbar').focus();
          
        }, 100);
    },

    initSelection: function (evt) {
        try {
            if (budaneki.mainWindowDisplay === true) {
                return false;
            }
            var selectedText = document.commandDispatcher.focusedWindow.getSelection();
            budaneki.anchor.selectedText = selectedText;
            //budaneki.log("Budaneki clicked. init selection for: " + selectedText);
            //prepare the selected text
            if (selectedText.toString().length >= 3) {
                //if the selection is valid, find the position and show the event (could need to be rewritten for other platforms) (firefox specific)
                budaneki.showIcon(selectedText, evt.screenX - 11, evt.screenY - 30);
            }
        } catch (err) {
            //budaneki.log(err);
        }



    },

    showIcon: function (selectedText, x, y) {
        if (budaneki.anchor.iconDisplay == true) {
            return false;
        }

        //budaneki.log("Budaneki show icon at: " + x + '-' + y);
        budanekilib.drawIcon();
        //This is firefox specific. Should be rewritten for another platforms (firefox specific)
        this.budanekiIcon.openPopupAtScreen(x, y);
        budaneki.anchor.iconLeft = x;
        budaneki.anchor.iconTop = y;

        //budaneki.log("icon ready");
        budaneki.anchor.iconDisplay = true;
    },

    closeIcon: function () {
        if (budaneki.anchor.iconDisplay == false) {
            return false;
        }
        //budaneki.log('Hiding icon');
        this.budanekiIcon.hidePopup();
        var iconUI = document.getElementById('budaneki-icon-container');
        iconUI.innerHTML = '';
        budaneki.anchor.iconDisplay = false;
        return false;
    },
    showMainWindow: function (provider, query) {
        try {
            //close icon
            budaneki.closeIcon();
            document.getElementById('budaneki-min-container-panel').hidePopup();
            //set browser src
            var url = budanekilib.getURL(provider.url);
            //add usage statistics
      

            var budanekiBrowserWin = document.getElementById('budaneki-mw-browser');

            //show loading idicator
            var loadinIndicator = document.getElementById('loading-indicator').cloneNode(true);
            loadinIndicator.id = 'loading-indicator-clonned';
            budanekiBrowserWin.contentDocument.body.insertBefore(loadinIndicator, budanekiBrowserWin.contentDocument.body.firstChild);

            budanekiBrowserWin.loadURI(url, null, null); // should edit the 2.nd argument to change refferer
            if (budanekiBrowserWin.loadlistener !== true) {
                budanekiBrowserWin.addEventListener("load", function () {
                    //budaneki.log('Budaneki Browser Loaded');
                    //focus on the searchbox
                    document.getElementById('budaneki-mw-searchbox-clonned').focus();
                    //Open in new tab on middle click
                    if (budanekiBrowserWin.contentDocument.budanekiClickListenerAdded !== true) {
                        budanekiBrowserWin.contentDocument.addEventListener("click", function (evt) {
                            if (evt.originalTarget.tagName == "A" && evt.which === 2) {
                                gBrowser.addTab(evt.originalTarget);
                            }
                        }, false);
                        budanekiBrowserWin.contentDocument.budanekiClickListenerAdded = true;
                    }

                }, true);
                budanekiBrowserWin.loadlistener = true;
            }
            //draw searchbox
            var mwSearchboxContainer = document.getElementById('budaneki-searchbox-container');
            mwSearchboxContainer.innerHTML = "";
            var MenuSearchBox = document.getElementById('budaneki-mw-searchbox').cloneNode(true);
            MenuSearchBox.id = 'budaneki-mw-searchbox-clonned';
            MenuSearchBox.value = query;
            mwSearchboxContainer.appendChild(MenuSearchBox);

            //don't draw providers if already displayed
            if (budaneki.mainWindowDisplay === true) {
                return false;
            }
            budaneki.mainWindowDisplay = true;
            document.getElementById('budaneki-mw-container').openPopup(document.getElementById("content").selectedBrowser, "overlap", 10, 10, false, true);
            budanekilib.drawMainWindowMenu(query);

            //searchbox functions

            //steal focus 
            MenuSearchBox.focus();
            //update providers on change
            MenuSearchBox.addEventListener("keyup", function (evt) {
                //budaneki.log("Key UP: " + evt.keyCode);
                if (evt.keyCode != 40 && evt.keyCode != 39 && evt.keyCode != 38 && evt.keyCode != 37) {
                    var foundProviders = budanekilib.drawMainWindowMenu(MenuSearchBox.value);
                    evt.stopPropagation();

                    if (foundProviders === false) {
                        //reset search if cant find provider
                        //budaneki.log('No match found');
                        MenuSearchBox.select();
                        return false;


                    }

                } else {
                    //budaneki.log('scroll');
                    budanekilib.scrollItems(document.getElementById('budaneki-mw-left-providers-container'), evt.keyCode);
                }
            }, false);

            //capture mouse scroll 
            var menuContainer = document.getElementById('budaneki-mw-left-providers-container');

            menuContainer.addEventListener("DOMMouseScroll", function (evt) {
                //budaneki.log("Scroll now: " + evt.detail);
                if (evt.detail > 0) {
                    var direction = 40;
                } else {
                    var direction = 38;
                }
                budanekilib.scrollItems(document.getElementById('budaneki-mw-left-providers-container'), direction);
                evt.stopPropagation();


            }, true);
            menuContainer.scrolladded = true;




        } catch (err) {
            //budaneki.log('ShowMainWindow error: ' + err);
        }

    },
    closeMainWindow: function (force) {

        if ((budaneki.mainWindowDisplay == false && force != true) || (budaneki.allwaysOnTop === true && force != true)) {
            return false;
        }
        //budaneki.log('hide main window');

        document.getElementById('budaneki-mw-container').hidePopup();
        budaneki.mainWindowDisplay = false;

		budanekilib.resizeMainWindow(true);

    },
    openNewTab: function (evt) {
        //budaneki.log(evt.originalTarget);
    }
};




window.addEventListener("load", function () {
    budaneki.onWindowLoad();
}, false);