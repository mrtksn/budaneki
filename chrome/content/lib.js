var budanekilib = {
    loadUI: function () {
        //load the the user interface
        try {
            //budaneki.log('UI loading');
            var uiContainer = document.getElementById("budaneki-ui-container");

            var request = new XMLHttpRequest();
            request.onreadystatechange = function (evt) {
                if (request.readyState == 4) {
                    if (request.status == 200 || request.status == 0) {

                        //load UI			
                        uiContainer.innerHTML = request.responseText;


                        //budaneki.log('UI loaded');
						
						var settingsLink = document.getElementById('budaneki-settings-link');
						if(budanekilib.pref('lang') == 'tr'){
						settingsLink.innerHTML = 'Ayarlar';
						}else{
						settingsLink.innerHTML = 'Settings';
						}

                    } else {
                        //budaneki.log('Error loading icon UI: ' + request.status);

                        return false;
                    }
                }
            };
            var url = 'chrome://budaneki/skin/default/'+budanekilib.pref('lang')+'/ui.htm';

            request.open('GET', url, true);
            request.send(null);

        } catch (err) {
            //budaneki.log('Error loading UI:' + err);
        }



    },
	decodeGoogle: function(text){
	var a = [/\\x3c/gi,/\\x3e/gi,/\\n/gi,/\\t/gi,/\\"/gi,/\\x26/gi,/\\x26quot;/gi,/#39;/gi];
	var b = ['<',      '>',      '',     '',     '"',    "'",      '"',            "'"];
	
	  for(id in a){
	    text = text.replace(a[id],b[id]);
		//budaneki.log('replace '+a[id]);
	  }
	  
	  return text;
	
	},
    translate: function(){
	try{
	
	//create range 
		 var ranges = [];
        var sel = budaneki.anchor.selectedText;
		//budaneki.log('translate selection:' + sel);
         for(var i = 0; i < sel.rangeCount; i++) {
          ranges[i] = sel.getRangeAt(i);
		  //budaneki.log('range found');
         }
	
	        
	        var node = ranges[0].commonAncestorContainer;    
             		
	         if(typeof(node.innerHTML) == 'undefined') {
			 var nodeText = budaneki.anchor.selectedText.toString();
			 var nodeConverted = true;
			 }else{
			 var nodeText =	ranges[0].commonAncestorContainer.innerHTML;   
			 var nodeConverted = false;
			 }
	        var params = 'anno=0&client=te_lib&format=html&v=1.0&tl=' + budanekilib.pref('gtlang')+'&q=' + nodeText;
            var request = new XMLHttpRequest();
            request.onreadystatechange = function (evt) {
                if (request.readyState == 4) {
                    if (request.status == 200 || request.status == 0) {
					try{
			            if(typeof(budaneki.gCount) == 'undefined'){
						budaneki.gCount = 0;
						}else{
						budaneki.gCount++;
						}
					
                   	
						
						var result = budanekilib.decodeGoogle(request.responseText.slice(2, -7));	
						//budaneki.log('RESULT:' + result);
						if(nodeConverted === false){
						
						
						
						var newNode = node.cloneNode(true);
						newNode.innerHTML = result;
						node.parentNode.insertBefore(newNode,node);
						node.style.display = 'none';	
						
                       	
                        						
                        }else{
						//budaneki.log('plain text replace');
                        var newContainerNode = budaneki.anchor.contentDocument.createElement("span");
						
                        ranges[0].surroundContents(newContainerNode);
						
						var oldNode = newContainerNode.cloneNode(true);
						oldNode.style.display = 'none';
						newContainerNode.innerHTML = '';
						newContainerNode.appendChild(oldNode);
						
						var newNode = budaneki.anchor.contentDocument.createElement("span");
						newNode.innerHTML = result;
                        newContainerNode.appendChild(newNode);
						
						node = oldNode;
						//budaneki.log('plain text replaced');
						
						}
						
						
                        						
                        //budaneki.log('translation applied');
				        //add google branding and cancel button
						
						var exactPos = function(obj){
						var curleft = curtop = 0;
						if (obj.offsetParent) {
							do {
			                    curleft += obj.offsetLeft;
			                    curtop += obj.offsetTop;
								} while (obj = obj.offsetParent);
									var result = {"left":curleft,"top": curtop};
									//budaneki.log('positionOK:' + curleft +'--'+ curtop);
									return result;
                               }
							     var result = {"left":obj.offsetLeft,"top": obj.offsetTop};
								 //budaneki.log('position not OK:' + obj.offsetLeft +'--'+ obj.offsetTop);
								 return result;
						
						}
						var position = exactPos(newNode);
						//budaneki.log('The selection is: ' + nodeText.length + 'chr');
                        if(nodeConverted != true || nodeText.length > 100){
						var googleBranding = document.getElementById('poweredbygoogle').cloneNode(true);
						googleBranding.id = 'poweredbygoogle-' + budaneki.gCount;
						googleBranding.style.left = position.left + 'px';
						googleBranding.style.top = position.top - 20 + 'px';
						budaneki.anchor.contentDocument.body.appendChild(googleBranding);
						googleBranding.lastChild.addEventListener('click',function(){
						  //budaneki.log('revert google translate');
						  newNode.style.display = 'none';
						  node.style.display = 'block';
						  this.parentNode.style.display = 'none';
						},false);
						//budaneki.log('google branding added');						
						}

					     budaneki.closeIcon();
					}catch(err){budaneki.log('translate AJAX err:' + err);}



                    } else {
                        //budaneki.log('Error loading translate: ' + request.status);

                        return false;
                    }
                }
            };
            var url = 'http://translate.googleapis.com/translate_a/t?';

            request.open('POST', url, true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.setRequestHeader("Content-length", params.length);
            request.setRequestHeader("Connection", "close");
            request.send(params);		
	
	}catch(err){budaneki.log('translate err: ' + err);}

	
	
	
	
	
	},
	drawIcon: function () {
        try {




            var iconUI = document.getElementById('budaneki-small-icon');
            //Show and Hide main menu on mose over-out
            iconUI = iconUI.cloneNode(true);
            iconUI.id = 'budaneki-small-icon-clonned';
            var budanekiIconContainer = document.getElementById('budaneki-icon-container');
            if (budaneki.iconMode === 2 || budaneki.iconMode === 3) {
                //budaneki.log('icon mode 2');
                budanekilib.addClass(budanekiIconContainer, 'budaneki-icon-container-hidden');
            }
            budanekiIconContainer.appendChild(iconUI);

            //on click open the main window correctly
            iconUI.addEventListener('click', function () {
			try{
			
                if (budaneki.anchor.iconMenuDrawn != true) {
                    //budaneki.log('open from providers');
                    var providers = budanekilib.getProviders('');
                    budaneki.showMainWindow(providers[0], '');
                } else {
                    //budaneki.log('open from the menu');
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    document.getElementById('budaneki-icon-menu-clonned').firstChild.dispatchEvent(evt);
                    //budaneki.log('open from the menu:' + document.getElementById('budaneki-icon-menu-clonned').firstChild.id);

                }			
			
			
			}catch(err){
			//budaneki.log('small icon click err: ' + err);
			}



            }, false);





        } catch (err) {
            //budaneki.log('error drawing icon: ' + err);
        }

    },

    mouseover: function () {
        //display icon on ghostmode 
        if (budaneki.iconMode === 2) {
            budanekilib.removeClass(document.getElementById('budaneki-icon-container'), 'budaneki-icon-container-hidden');
        }
    },
    prepDrawIconMenu: function () {
        //check if already have an order   
        if (budaneki.anchor.iconMenuCountDown == true) {
            return false;
        }

        //don't draw if its on hidden mode
        if (budaneki.iconMode === 3) {
            return false;
        }

        budaneki.anchor.iconMenuCountDown = true;
        setTimeout(function () {
            if (budaneki.anchor.iconMenuDrawAbort != true) {
                try {
                    //budaneki.log("draw icon menu now");
                    budanekilib.drawIconMenu();
                } catch (err) {
                    //budaneki.log('Error Timeout:' + err);
                }

            } else {
                //budaneki.log("Abourt draw icon menu!");
            }
        }, 500);
        budaneki.anchor.iconMenuDrawAbort = false;
        //budaneki.log("set timeout for menu");
    },
    drawIconMenu: function () {
        //check if its already on
        if (budaneki.anchor.iconMenuDrawn == true) {
            //budaneki.log('icon ON, stop drawing');
            return false;
        }

        //view icon if hidden
        budanekilib.removeClass(document.getElementById('budaneki-icon-container'), 'budaneki-icon-container-hidden');

        budaneki.anchor.iconMenuDrawn = true;
        //
        //budaneki.log("draw icon menu");


        var iconMenuSearchBox = document.getElementById('budaneki-icon-searchbox');
        var iconMenuSearchBox = iconMenuSearchBox.cloneNode(true);
        iconMenuSearchBox.id = 'budaneki-icon-searchbox-clonned';
        document.getElementById('budaneki-icon-menu-container').appendChild(iconMenuSearchBox);
        //steal focus 
        iconMenuSearchBox.focus();
        //update providers on change
        iconMenuSearchBox.addEventListener("keyup", function (evt) {
            //budaneki.log("Key UP: " + evt.keyCode);
            if (evt.keyCode != 40 && evt.keyCode != 39 && evt.keyCode != 38 && evt.keyCode != 37 && evt.keyCode != 13) {
                var foundProviders = budanekilib.drawProviders(document.getElementById('budaneki-icon-menu-clonned'), iconMenuSearchBox.value);
                evt.stopPropagation();

                if (foundProviders === false) {
                    //reset search if cant find provider
                    //budaneki.log('No match found');
                    document.getElementById('budaneki-icon-searchbox-clonned').select();
                    return false;


                }

            } else if (evt.keyCode === 13) {
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                document.getElementById('budaneki-icon-menu-clonned').firstChild.dispatchEvent(evt);
            }
        }, false);

        var iconMenuUI = document.getElementById('budaneki-icon-menu');
        var budanekiIconProvidersMenu = iconMenuUI.cloneNode(true);
        budanekiIconProvidersMenu.id = 'budaneki-icon-menu-clonned';
        document.getElementById('budaneki-icon-menu-container').appendChild(budanekiIconProvidersMenu);
        //capture up and down to scroll
        iconMenuSearchBox.addEventListener("keydown", function (evt) {
            //budaneki.log("Key DOWN: " + evt.keyCode);
            budanekilib.scrollItems(document.getElementById('budaneki-icon-menu-clonned'), evt.keyCode);
            evt.stopPropagation();


        }, false);
        //capture mouse scroll 
        var iconContainer = document.getElementById('budaneki-icon-container');
        if (iconContainer.scrolladded != true) {
            iconContainer.addEventListener("DOMMouseScroll", function (evt) {
                //budaneki.log("Scroll: " + evt.detail);
                if (evt.detail > 0) {
                    var direction = 40;
                } else {
                    var direction = 38;
                }
                budanekilib.scrollItems(document.getElementById('budaneki-icon-menu-clonned'), direction);
                evt.stopPropagation();


            }, true);
            iconContainer.scrolladded = true;
        }
        //capture when over the menu
        var iconMenuContainer = document.getElementById('budaneki-icon-menu-clonned');
        if (iconMenuContainer.scrolladded != true) {
            iconMenuContainer.addEventListener("DOMMouseScroll", function (evt) {
                //budaneki.log("Scroll: " + evt.detail);
                if (evt.detail > 0) {
                    var direction = 40;
                } else {
                    var direction = 38;
                }
                budanekilib.scrollItems(document.getElementById('budaneki-icon-menu-clonned'), direction);
                evt.stopPropagation();


            }, true);
            iconMenuContainer.scrolladded = true;
        }



        var iconTranslateBtn = document.getElementById('budaneki-small-icon-outbutton');
        iconTranslateBtn = iconTranslateBtn.cloneNode(true);
        iconTranslateBtn.firstChild.style.background = "url('chrome://budaneki/skin/default/gtout.png')";
        document.getElementById('budaneki-icon-menu-container').appendChild(iconTranslateBtn);
        iconTranslateBtn.addEventListener('click', function () {

		
		//budaneki.log('translate clicked');
		    
            budanekilib.translate();
			
			//budanekilib.social.shareOnFacebook();		
		



        }, false);
        //draw the providers list
        budanekilib.drawProviders(document.getElementById('budaneki-icon-menu-clonned'), '');
        //fix position
        budaneki.budanekiIcon.moveTo(budaneki.anchor.iconLeft, budaneki.anchor.iconTop - document.getElementById('budaneki-icon-menu-container').offsetHeight);


    },
    closeIconMenu: function () {
        //Abort countdown
        budaneki.anchor.iconMenuDrawAbort = true;
        budaneki.anchor.iconMenuCountDown = false;

        //check if its already off
        if (budaneki.anchor.iconMenuDrawn == false) {
            return false;

        }

        //hide icon if on hidden or ghost mode
        if ((budaneki.iconMode === 3 || budaneki.iconMode === 2) && budaneki.anchor.iconDisplay == true) {
            budanekilib.addClass(document.getElementById('budaneki-icon-container'), 'budaneki-icon-container-hidden');
        }


        //restore focus
        budaneki.anchor.focus();
        //close
        budaneki.anchor.iconMenuDrawn = false;
        //budaneki.log('close icon menu');
        var budanekiIconMenu = document.getElementById('budaneki-icon-menu-container');
        budaneki.budanekiIcon.moveTo(budaneki.anchor.iconLeft, budaneki.anchor.iconTop);
        budanekiIconMenu.innerHTML = "";

    },
    drawMainWindow: function () {


    },

    drawMainWindowMenu: function (query) {
        //budaneki.log('draw main window query');

        var foundProviders = budanekilib.drawProviders(document.getElementById('budaneki-mw-left-providers-container'), query, false);
        return foundProviders;

    },

    minMainWindow: function () {
        //budaneki.log('Min win');
        document.getElementById('budaneki-min-container-panel').openPopup(document.getElementById("content").selectedBrowser, "overlap", 10, 10, false, true);
        document.getElementById('budaneki-mw-container').hidePopup();
    },
    restoreMainWindow: function () {
        //budaneki.log('Min win');
        document.getElementById('budaneki-mw-container').openPopup(document.getElementById("content").selectedBrowser, "overlap", 10, 10, false, true);
        document.getElementById('budaneki-min-container-panel').hidePopup();
    },

    resizeMainWindow: function (reset) {
        //budaneki.log('resize main window');
        var maxHeight = budaneki.anchor.clientHeight;
        var maxWidth = budaneki.anchor.clientWidth;
        var minHeight = 322;
        var minWidth = 728;
        var mainWindow = document.getElementById('budaneki-mw-container');

        if (mainWindow.clientWidth === minWidth && reset != true) {
            //budaneki.log('resize main window: max');
            mainWindow.sizeTo(maxWidth, maxHeight);
            document.getElementById('budaneki-mw-browser-container').width = maxWidth - 165;
            document.getElementById('budaneki-mw-left-container').style.height = maxHeight - 25 + 'px';
        } else {
            //budaneki.log('resize main window: min');
            mainWindow.sizeTo(minWidth, minHeight);
            document.getElementById('budaneki-mw-browser-container').width = 570;
            document.getElementById('budaneki-mw-left-container').style.height = 300 + 'px';

        }


    },
	moveMainWindow: function(evt, obj){
	//not working properly, just dont use it
	try{
	//budaneki.log(obj.offsetX +"-"+ obj.offsetLeft + "-" + obj.left);
	var x = evt.screenX - obj.offsetX;
	var y = evt.screenY - obj.offsetY;
	obj.moveTo(x,y);
	}catch(err){
	//budaneki.log('moveMainWindow err:' + err);
	}
	
	},

    drawProviders: function (container, query, highlight) {
        //Draw the list of the providers
        try {
            //var container = document.getElementById('budaneki-icon-menu-clonned');
            container.innerHTML = '';
            var providers = budanekilib.getProviders(query);

            //if no provider found, return false
            if (providers.length < 1) {

                return false;
            }

            for (id in providers) {
                //budaneki.log('adding provider to the menu: ' + providers[id].title);
                var menuButton = document.getElementById('budaneki-small-icon-button');
                menuButton = menuButton.cloneNode(true);
                menuButton.id = 'budaneki-icon-button-' + id;
                menuButton.provider = providers[id];
				menuButton.href = budanekilib.getURL(providers[id].url);
				menuButton.addEventListener('click',function(evt){evt.preventDefault();},false);
                menuButton.addEventListener('mousedown', function (evt) {
				
                    //open main window or new tab
                    //budaneki.log('menu button clicked: ' + evt.which);
                    //bug: middle click not working
				
					
                    if (evt.which === 2) {
                        gBrowser.addTab(this.href);
                    } else {

                        budaneki.showMainWindow(this.provider, query);
                    }
					
					//add to usage counter
					budanekilib.usageCounter(this.provider);
					
                    budaneki.closeIcon();
                }, false);
                menuButton.firstChild.innerHTML = providers[id].title;
                container.appendChild(menuButton);

            }
            //highlight first element
            if (highlight != false) {
                budanekilib.addClass(container.firstChild, "budanekiiconbuttonselected");
            }

            return true;


        } catch (err) {
            //budaneki.log('DrawProviders error: ' + err);
        }




    },
    getProviders: function (query) {
        try {

            //budaneki.log("Looking for providers: " + query);

            var db = budanekilib.dbConn();

            var statement = db.createStatement("SELECT * FROM providers WHERE title LIKE  '%" + query + "%' ORDER BY usagecounter DESC");

            //statement.params.squery = "%"+query+"%"; 
            var providers = [];
            while (statement.executeStep()) {
                providers.push({
                    'id': statement.row.id,
                    'title': statement.row.title,
                    'url': statement.row.url,
                    'type': statement.row.type,
                    'usagecounter': statement.row.usagecounter
                });
            }

            // budaneki.log(JSON.stringify(providers));
            return providers;



        } catch (err) {
            //budaneki.log('getProviders error: ' + err);
        }



    },
	usageCounter: function(provider){
            var db = budanekilib.dbConn();

            provider.usagecounter++;
            var sql = "UPDATE providers SET usagecounter = " + provider.usagecounter + " WHERE id = " + provider.id;
            var statement = db.createStatement(sql);
            statement.execute();			
	
	},

    getURL: function (url) {
        url = url + budaneki.anchor.selectedText;
        return url;
    },

    scrollItems: function (container, direction) {
        //scroll up and down
        try {

            //budaneki.log("Scroll direction: " + direction);

            if (direction === 40) {
                var classRemoved = budanekilib.removeClass(container.firstChild, 'budanekiiconbuttonselected');
                container.appendChild(container.firstChild);
                if (classRemoved === true) {
                    budanekilib.addClass(container.firstChild, 'budanekiiconbuttonselected');
                }
            } else if (direction === 38) {
                var classRemoved = budanekilib.removeClass(container.firstChild, 'budanekiiconbuttonselected');
                container.insertBefore(container.lastChild, container.firstChild);
                if (classRemoved === true) {
                    budanekilib.addClass(container.firstChild, 'budanekiiconbuttonselected');
                }
            }

        } catch (err) {
            //budaneki.log('scroll error: ' + err);
        }


    },
    switchOnTop: function (element) {
        if (budaneki.allwaysOnTop === true) {
            budanekilib.removeClass(element, 'budaneki-ontopbtn-on');
            budaneki.allwaysOnTop = false;
			budaneki.anchor.allwaysOnTop = false;
        } else {
            budanekilib.addClass(element, 'budaneki-ontopbtn-on');
            budaneki.allwaysOnTop = true;
			budaneki.anchor.allwaysOnTop = true;
        }
    },
    doubleCTRL: function () {
        if (budaneki.anchor.doubleCTRL === true) {
            budanekilib.drawIconMenu();
            budaneki.anchor.doubleCTRL = false;
        } else {
            budaneki.anchor.doubleCTRL = true;
        }
        setTimeout(function () {
            budaneki.anchor.doubleCTRL = false;
        }, 500);
    },
    addClass: function (element, className) {
        element.className += " " + className;
        //budaneki.log("class added, now: " + element.className);

    },
    removeClass: function (element, className) {
        //budaneki.log('Remove class: ' + className);
        try {
            if (element.className.search(className) === -1) {
                return false;
            }
            element.className = element.className.replace(className, '', "gi");
            return true;
        } catch (err) {
            'remove class error: ' + err
        }

    },
    makeURI: function (aURL, aOriginCharset, aBaseURI) {
        var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
        return ioService.newURI(aURL, aOriginCharset, aBaseURI);
    },
    dbConn: function () {
        try {

            if (budaneki.dbConnHandle != false) {
                //budaneki.log('dbConn exist:' + budaneki.dbConnHandle);
                return budaneki.dbConnHandle;
            }
            //Running queries on the SQLite DB engine

            var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);


            file.append("budanekidb.sqlite");

            var storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);
            budaneki.dbConnHandle = storageService.openDatabase(file); // Will also create the file if it does not exist
            //budaneki.log('db handle:' + budaneki.dbConnHandle);
            return budaneki.dbConnHandle;

        } catch (err) {
            //budaneki.log('dbConn error: ' + err);
        }

    },
    buildDB: function () {
        try {
            var sql = [ 'INSERT INTO "providers" VALUES(1,\'Sesli Sözlük\',\'http://m.seslisozluk.com/?word=\',0,20);', 'INSERT INTO "providers" VALUES(2,\'Tureng Sözlük\',\'http://tureng.com/search/\',0,7);', 'INSERT INTO "providers" VALUES(3,\'Ekşi Sözlük\',\'http://sozluk.sourtimes.org/show.asp?t=\',0,14);', 'INSERT INTO "providers" VALUES(4,\'İtü Sözlük\',\'http://www.itusozluk.com/goster.php/\',0,0);', 'INSERT INTO "providers" VALUES(5,\'Uludağ Sözlük\',\'http://www.uludagsozluk.com/k/\',0,0);', 'INSERT INTO "providers" VALUES(6,\'Vikipedi\',\'http://tr.wikipedia.org/wiki/\',0,8);', 'INSERT INTO "providers" VALUES(7,\'Etimolojik Sözlük\',\'http://www.nisanyansozluk.com/?k=\',0,6);', 'INSERT INTO "providers" VALUES(8,\'Google\',\'http://www.google.com/search?q=\',0,18);', 'INSERT INTO "providers" VALUES(9,\'Wikipedia\',\'http://wikipedia.org/wiki/\',0,16);', 'INSERT INTO "providers" VALUES(10,\'Google images\',\'http://images.google.com/images?q=\',0,12);', 'INSERT INTO "providers" VALUES(11,\'TDK Sözlüğü\',\'http://www.tdk.gov.tr/TR/Genel/SozBul.aspx?F6E10F8892433CFFAAF6AA849816B2EF4376734BED947CDE&Kelime=\',0,10);', 'INSERT INTO "providers" VALUES(12,\'Flickr\',\'http://www.flickr.com/search/?q=\',0,0);', 'INSERT INTO "providers" VALUES(13,\'FriendFeed\',\'http://friendfeed.com/search?q=\',0,0);', 'INSERT INTO "providers" VALUES(14,\'Youtube\',\'http://www.youtube.com/results?search_query=\',0,0);', 'INSERT INTO "providers" VALUES(15,\'Bing Video\',\'http://www.bing.com/videos/search?q=\',0,0);', 'INSERT INTO "providers" VALUES(16,\'Face photos on Google\',\'http://www.google.com.tr/search?tbm=isch&source=lnt&tbs=itp:face&q=\',0,5);'];
            var dbCreateSql = ['DROP TABLE IF EXISTS "providers";', 'CREATE TABLE "providers" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL , "title" CHAR NOT NULL , "url" CHAR NOT NULL , "type" INTEGER NOT NULL  DEFAULT 0, "usagecounter" INTEGER NOT NULL  DEFAULT 0);'];
			var db = budanekilib.dbConn();
             //first create DB using sync SQL so we can be sure the table is created correctly
            for (id = 0; id < dbCreateSql.length; id++) {
			    //budaneki.log('sync SQL no:' + id + '&statement:' + dbCreateSql[id]);
                
				var statement = db.createStatement(dbCreateSql[id]);
             
                statement.execute();
            }	
            //insert table data, async			
            for (id in sql) {
			    //budaneki.log('SQL no:' + id + '&statement:' + sql[id]);
                
				var statement = db.createStatement(sql[id]);
               
                statement.executeAsync();
            }
        } catch (err) {
            alert('ERROR: Budaneki was not able to install correctly, please re-install');
			budanekilib.pref('firsttimesetup', false);
            //budaneki.log('buildDB err:' + err);
        }
    },
    getPrefService: function () {
        try {
            // Get the branch
            var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
            return prefs.getBranch("extensions.budaneki.");
        } catch (err) {
            //budaneki.log('getPrefService err: ' + err);
        }
    },
    readPref: function (name, att) {
        var prefService = budanekilib.getPrefService();
        try {
            //budaneki.log('reading pref ' + name + 'att:' + att);
            if (att == 0) {
                //budaneki.log('try reading as integer');
                return prefService.getIntPref(name);
            } else if (att == 1) {
                //budaneki.log('try reading as char');
                var result = prefService.getCharPref(name);
                //budaneki.log('reading ok:' + result);
                return result;
            } else if (att == 2) {
                //budaneki.log('try reading as boolean');
                return prefService.getBoolPref(name);
            } else {
                //budaneki.log('readPref cant read');
            }

        } catch (err) {
            att++;
            return budanekilib.readPref(name, att);

        }
    },
    pref: function (name, value) {
        try {
            var prefService = budanekilib.getPrefService();

            if (typeof(value) != 'number' && typeof(value) != 'string' && typeof(value) != 'boolean') {
                //budaneki.log('read pref for:' + name);
                var rp = budanekilib.readPref(name, 0);
                //budaneki.log(name + ' is: ' + rp);
                return rp;


            } else {
                //budaneki.log('set pref for:' + name + ',' + value);

                if (typeof(value) == 'number') {

                    prefService.setIntPref(name, value);
                    return true;

                }
                if (typeof(value) == 'string') {

                    prefService.setCharPref(name, value);
                    return true;

                }
                if (typeof(value) == 'boolean') {

                    prefService.setBoolPref(name, value);
                    return true;

                }


            }

            //budaneki.log("can't set or read pref, return false");
            return false;
        } catch (err) {
            //budaneki.log('pref err: ' + err);
        }

    },
    showSettings: function () {
        try {
            budaneki.closeMainWindow(true);
            document.getElementById('budaneki-settings-panel').openPopup(document.getElementById("content").selectedBrowser, "overlap", 0, 0, false, true);

            var sDocument = document.getElementById('budaneki-settings-window').contentDocument;






            //budaneki.log('settings navigate');

            //prepare
            if (budaneki.settingsPrep != true) {

                //prepare lang
                var langTr = sDocument.getElementById('selectlang').firstChild;
                var langEn = sDocument.getElementById('selectlang').lastChild;
                if (budanekilib.pref('lang') == 'tr') {
                    budanekilib.addClass(langTr, 'option-container-selected');
                } else {
                    budanekilib.addClass(langEn, 'option-container-selected');
                }
                langTr.addEventListener('click', function () {
                    budanekilib.addClass(langTr, 'option-container-selected');
                    budanekilib.removeClass(langEn, 'option-container-selected');
                    budanekilib.pref('lang', 'tr');
					budanekilib.loadUI();
                }, false);
                langEn.addEventListener('click', function () {
                    budanekilib.addClass(langEn, 'option-container-selected');
                    budanekilib.removeClass(langTr, 'option-container-selected');
                    budanekilib.pref('lang', 'en');
					budanekilib.loadUI();
                }, false);


                //prepare icon mode
                budanekilib.addClass(sDocument.getElementById('iconmode-' + budanekilib.pref('iconmode')), 'option-container-selected');
                var iconmodeButtons = sDocument.getElementById('iconmodeselect').getElementsByClassName('iconmode');
                sDocument.getElementById('iconmode-1').addEventListener('click', function () {
                    budanekilib.pref('iconmode', 1);
                    budaneki.iconMode = 1;
                    budanekilib.addClass(this, 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-2'), 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-3'), 'option-container-selected');

                }, false);
                sDocument.getElementById('iconmode-2').addEventListener('click', function () {
                    budanekilib.pref('iconmode', 2);
                    budaneki.iconMode = 2;
                    budanekilib.addClass(this, 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-1'), 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-3'), 'option-container-selected');

                }, false);
                sDocument.getElementById('iconmode-3').addEventListener('click', function () {
                    budanekilib.pref('iconmode', 3);
                    budaneki.iconMode = 3;
                    budanekilib.addClass(this, 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-1'), 'option-container-selected');
                    budanekilib.removeClass(sDocument.getElementById('iconmode-2'), 'option-container-selected');

                }, false);

                //prepare gtlang
                var langlist = budanekilib.getLanguages();
                var gtlang = budanekilib.pref('gtlang');

                for (id in langlist) {


                    var optionBtn = sDocument.getElementById('budaneki-gtlang').firstChild.cloneNode(true);
                    optionBtn.innerHTML = langlist[id].langname;
                    optionBtn.id = 'budaneki-gtlang-' + id;
                    optionBtn.gcode = langlist[id].gcode;


                    if (langlist[id].gcode == gtlang) {
                        budaneki.currgtlang = optionBtn;
                        budanekilib.addClass(optionBtn, 'option-button-selected');
                    }
                    optionBtn.addEventListener('click', function () {
                        budanekilib.addClass(this, 'option-button-selected');
                        budanekilib.removeClass(budaneki.currgtlang, 'option-button-selected');
                        budaneki.currgtlang = this;
                        budanekilib.pref('gtlang', this.gcode);
                        return true;
                    }, false);
                    sDocument.getElementById('budaneki-gtlang').appendChild(optionBtn);
                    optionBtn.addEventListener('click', function () {

                    }, false);
                }
                sDocument.getElementById('budaneki-gtlang').removeChild(sDocument.getElementById('budaneki-gtlang').firstChild);


                //add providers list
                budanekilib.drawProvidersOnSettings();

                sDocument.getElementById('budaneki-addprovider-button').addEventListener('click', function () {
                    var sql = "INSERT INTO providers ('title','url') VALUES ('" + sDocument.getElementById('budaneki-addprovider-title').value + "','" + sDocument.getElementById('budaneki-addprovider-url').value + "')";
                    var db = budanekilib.dbConn();
                    var statement = db.createStatement(sql);
                    statement.execute();
                    budanekilib.drawProvidersOnSettings();


                }, false);



                //settings are ready
                sDocument.getElementById('close-settings-button').addEventListener('click', function () {
                    document.getElementById('budaneki-settings-panel').hidePopup();

                }, false);
                budaneki.settingsPrep = true;
            }


/*

	  

	  
	  var settingsUI = document.getElementById('budanki-settings').cloneNode(true);
	  settingsUI.id = 'budanki-settings-clonned';
	  var settingsContainer = document.getElementById('budaneki-settings-container');
	  settingsContainer.innerHTML = '';
	  settingsContainer.appendChild(settingsUI);
	  
     */
        } catch (err) {
            //budaneki.log('showSettings err: ' + err)
        }
    },
    drawProvidersOnSettings: function () {
        try {
            var sDocument = document.getElementById('budaneki-settings-window').contentDocument;
            var providers = budanekilib.getProviders('');

            sDocument.getElementById('providers-list').innerHTML = '';
            for (id in providers) {
                //budaneki.log('added:' + providers[id].title);
                var providerItem = sDocument.getElementById('provider-item-sample').cloneNode(true);
                providerItem.id = 'provider-item-' + id;
                providerItem.style.display = 'block';
                providerItem.provider = providers[id];
                providerItem.firstChild.innerHTML = providers[id].title;
                providerItem.addEventListener('click', function (evt) {
                    evt.preventDefault();
                }, false);
                providerItem.lastChild.addEventListener('click', function () {
                    var answer = confirm('Delete?');
                    if (answer) {

                        //delete provider
                        var sql = 'DELETE FROM providers WHERE id = ' + this.parentNode.provider.id;
                        //budaneki.log('delete provider: ' + sql);
                        var db = budanekilib.dbConn();
                        var statement = db.createStatement(sql);
                        statement.execute();

                        sDocument.getElementById('providers-list').removeChild(this.parentNode);
                    }
                }, false);
                sDocument.getElementById('providers-list').appendChild(providerItem);

            }

        } catch (err) {
            //budaneki.log('drawProvidersOnSettings err: ' + err);
        }
    },

    getLanguages: function () {
        languages = {
            'TURKISH': {
                'gcode': 'tr',
                'langname': 'Türkçe'
            },
            'ENGLISH': {
                'gcode': 'en',
                'langname': 'English'
            },
            'AFRIKAANS': {
                'gcode': 'af',
                'langname': 'Afrikaans'
            },
            'ALBANIAN': {
                'gcode': 'sq',
                'langname': 'Albanian'
            },
            'ARABIC': {
                'gcode': 'ar',
                'langname': 'Arabic'
            },
            'BELARUSIAN': {
                'gcode': 'be',
                'langname': 'Belarusian'
            },
            'BULGARIAN': {
                'gcode': 'bg',
                'langname': 'Bulgarian'
            },
            'CATALAN': {
                'gcode': 'ca',
                'langname': 'Catalan'
            },
            'CHINESE_SIMPLIFIED': {
                'gcode': 'zh-CN',
                'langname': 'Chinese(Simplified)'
            },
            'CROATIAN': {
                'gcode': 'hr',
                'langname': 'Croatian'
            },
            'CZECH': {
                'gcode': 'cs',
                'langname': 'Czech'
            },
            'DANISH': {
                'gcode': 'da',
                'langname': 'Danish'
            },
            'DUTCH': {
                'gcode': 'nl',
                'langname': 'Dutch'
            },
            'ESPERANTO': {
                'gcode': 'eo',
                'langname': 'Esperanto'
            },
            'ESTONIAN': {
                'gcode': 'et',
                'langname': 'Estonian'
            },
            'FILIPINO': {
                'gcode': 'tl',
                'langname': 'Filipino'
            },
            'FINNISH': {
                'gcode': 'fi',
                'langname': 'Finnish'
            },
            'FRENCH': {
                'gcode': 'fr',
                'langname': 'French'
            },
            'GALICIAN': {
                'gcode': 'gl',
                'langname': 'Galician'
            },
            'GERMAN': {
                'gcode': 'de',
                'langname': 'German'
            },
            'GREEK': {
                'gcode': 'el',
                'langname': 'Greek'
            },
            'HEBREW': {
                'gcode': 'iw',
                'langname': 'Hebrew'
            },
            'HINDI': {
                'gcode': 'hi',
                'langname': 'Hindi'
            },
            'HUNGARIAN': {
                'gcode': 'hu',
                'langname': 'Hungarian'
            },
            'ICELANDIC': {
                'gcode': 'is',
                'langname': 'Icelandic'
            },
            'INDONESIAN': {
                'gcode': 'id',
                'langname': 'Indonesian'
            },
            'IRISH': {
                'gcode': 'ga',
                'langname': 'Irish'
            },
            'ITALIAN': {
                'gcode': 'it',
                'langname': 'Italian'
            },
            'JAPANESE': {
                'gcode': 'ja',
                'langname': 'Japanise'
            },
            'KOREAN': {
                'gcode': 'ko',
                'langname': 'Korean'
            },
            'LATVIAN': {
                'gcode': 'lv',
                'langname': 'Latvian'
            },
            'LITHUANIAN': {
                'gcode': 'lt',
                'langname': 'Lithuanian'
            },
            'MACEDONIAN': {
                'gcode': 'mk',
                'langname': 'Macedonian'
            },
            'MALAY': {
                'gcode': 'ms',
                'langname': 'Malay'
            },
            'MALTESE': {
                'gcode': 'mt',
                'langname': 'Maltese'
            },
            'NORWEGIAN': {
                'gcode': 'no',
                'langname': 'Norwegian'
            },
            'PERSIAN': {
                'gcode': 'fa',
                'langname': 'Persian'
            },
            'POLISH': {
                'gcode': 'pl',
                'langname': 'Polish'
            },
            'PORTUGUESE': {
                'gcode': 'pt-PT',
                'langname': 'Portuguese'
            },
            'ROMANIAN': {
                'gcode': 'ro',
                'langname': 'Romanian'
            },
            'RUSSIAN': {
                'gcode': 'ru',
                'langname': 'Russian'
            },
            'SERBIAN': {
                'gcode': 'sr',
                'langname': 'Serbian'
            },
            'SLOVAK': {
                'gcode': 'sk',
                'langname': 'Slovak'
            },
            'SLOVENIAN': {
                'gcode': 'sl',
                'langname': 'Slovenian'
            },
            'SPANISH': {
                'gcode': 'es',
                'langname': 'Spanish'
            },
            'SWAHILI': {
                'gcode': 'sw',
                'langname': 'Swahili'
            },
            'SWEDISH': {
                'gcode': 'sv',
                'langname': 'Swedish'
            },
            'TAJIK': {
                'gcode': 'tg',
                'langname': 'Tajik'
            },
            'THAI': {
                'gcode': 'th',
                'langname': 'Thai'
            },
            'UKRAINIAN': {
                'gcode': 'uk',
                'langname': 'Ukrainian'
            },
            'VIETNAMESE': {
                'gcode': 'vi',
                'langname': 'Vietnamese'
            },
            'WELSH': {
                'gcode': 'cy',
                'langname': 'Welsh'
            },
            'YIDDISH': {
                'gcode': 'yi',
                'langname': 'Yiddish'
            }
        };
        return languages;

    },
    social: {

        shareOnFacebook: function () {
            try {
                var socialWindow = document.getElementById('budaneki-fb-window');
                var url = 'https://www.facebook.com/sharer.php?u=' + budaneki.shareURL;
                socialWindow.loadURI(url, null, null);

                socialWindow.addEventListener('load', function () {
                    //budaneki.log('Social window loaded:');

                    var buttonClicked = false;
                    var buttonChecked = false;


                    const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
                    const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
                    var myListener = {
                        QueryInterface: function (aIID) {
                            if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this;
                            throw Components.results.NS_NOINTERFACE;
                        },

                        onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {
                            try {

                                // If you use myListener for more than one tab/window, use
                                // aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
                                if (aFlag & STATE_START) {
                                    //budaneki.log('Start loading:' + aRequest.name);
                                    // This fires when the load event is initiated
                                }
                                if (aFlag & STATE_STOP) {
                                    //budaneki.log('loading ok:' + aRequest.name);
                                    var formButtons = socialWindow.contentDocument.getElementsByClassName('UIComposer_FormButtons');
                                    //can't find the button
                                    if (typeof(formButtons[0]) == "undefined" && buttonChecked == false) {
                                        //budaneki.log('cant find the FB button');

                                        buttonChecked = true;
                                        budanekilib.social.FBShareOk(false);

                                        return false;
                                    }

                                    //click share button
                                    if (buttonClicked != true) {
                                        //budaneki.log('Click button');
                                        var evt = document.createEvent("MouseEvents");
                                        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        formButtons[0].firstChild.dispatchEvent(evt);
                                        buttonClicked = true;
                                    } else {
                                        //budaneki.log('Page loaded after click:' + formButtons[0].firstChild);
                                        budanekilib.social.FBShareOk(true);

                                        return true;
                                    }


                                }

                            } catch (err) {
                                'Facebook On State change err: ' + err
                            }

                        },

                        onLocationChange: function (aProgress, aRequest, aURI) {

                            // This fires when the location bar changes; that is load event is confirmed
                            // or when the user switches tabs. If you use myListener for more than one tab/window,
                            // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
                        },

                        // For definitions of the remaining functions see related documentation
                        onProgressChange: function (aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
                        onStatusChange: function (aWebProgress, aRequest, aStatus, aMessage) {},
                        onSecurityChange: function (aWebProgress, aRequest, aState) {}
                    }

                    socialWindow.addProgressListener(myListener);











                }, true);
            } catch (err) {
                //budaneki.log('share on facebook err: ' + err);
            }
        },
        FBShareOk: function (result) {
		if(budaneki.ShareOnFacebookInit != true){
		budaneki.ShareOnFacebookInit = true;
		budanekilib.social.shareOnTwitter();
		 var sDocument = document.getElementById('budaneki-share-browser').contentDocument;  
		   if(result == true){
		    //call true
            //budaneki.log('facebook share OK');
			
			//indicate
			budanekilib.addClass(sDocument.getElementById('fbresult'),'hidden');
			budanekilib.removeClass(sDocument.getElementById('fbresultok'),'hidden');
			
		   }else{
		   //budaneki.log('FB share err');
		   var url = 'https://www.facebook.com/sharer.php?u=' + budaneki.shareURL;

		   gBrowser.addTab(url); 
			budanekilib.addClass(sDocument.getElementById('fbresult'),'hidden');
			budanekilib.removeClass(sDocument.getElementById('fbresulterr'),'hidden');
		   }
		
		  
		}
		
            //indicate result
            //share on twitter
            
            

        },
        shareOnTwitter: function () {
            //budaneki.log('share on twitter called');
            try {

                var socialWindow = document.getElementById('budaneki-tw-window');
				if(budanekilib.pref('lang') == 'tr'){
				var shareText = 'budaneki+sozluk+ve+hizli+arama+eklentisi';
				}else{
				var shareText = 'budaneki+dictionary+and+search+extension';
				}
				
                var url = 'http://twitter.com/intent/tweet?text='+shareText+'&url=' + budaneki.shareURL;
                socialWindow.loadURI(url, null, null);

                 var buttonClicked = false;
                socialWindow.addEventListener('load', function () {
                    //budaneki.log('Social window TW loaded:');

                    

 

                    const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
                    const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
                    var myListener = {
                        QueryInterface: function (aIID) {
                            if (aIID.equals(Components.interfaces.nsIWebProgressListener) || aIID.equals(Components.interfaces.nsISupportsWeakReference) || aIID.equals(Components.interfaces.nsISupports)) return this;
                            throw Components.results.NS_NOINTERFACE;
                        },

                        onStateChange: function (aWebProgress, aRequest, aFlag, aStatus) {
                            try {
                                 
                                // If you use myListener for more than one tab/window, use
                                // aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
                                if (aFlag & STATE_START) {
                                    //budaneki.log('Start loading:' + aRequest.name);
									waiting++;
                                    // This fires when the load event is initiated
                                }
                                if (aFlag & STATE_STOP) {
															
									
                                    //budaneki.log('loading ok:' + aRequest.name);
                                    var formButtons = socialWindow.contentDocument.getElementsByClassName('button submit')[0];
                                    //can't find the button

                                        //budaneki.log('TW Form button:' + formButtons);
											setTimeout(function () {
                                             if (typeof(formButtons) == "undefined"){
											 //click button if ready
											 //budaneki.log(' exit after 2 s');
											 budanekilib.social.TWShareOk(false);
											 }else{
											 //budaneki.log('TW Button found!');
											 if(buttonClicked != true){
											 buttonClicked = true;
                                        //budaneki.log('Twitter Click button');
                                        var evt = document.createEvent("MouseEvents");
                                        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                                        formButtons.dispatchEvent(evt);
                                        		
                                               }else{
											   //budaneki.log('TW button already clicked');
											   setTimeout(function(){
											   
											   if(socialWindow.contentDocument.getElementsByClassName('error').length === 0){
											   budanekilib.social.TWShareOk(true);
											   }else{
											   budanekilib.social.TWShareOk(false);
											   }
											   
											   },1000);
											    
											   }										
											 }
                                           }, 2000);
                                        
                                        return false;



                                }

                            } catch (err) {
                                'Facebook On State change err: ' + err
                            }

                        },

                        onLocationChange: function (aProgress, aRequest, aURI) {

                            // This fires when the location bar changes; that is load event is confirmed
                            // or when the user switches tabs. If you use myListener for more than one tab/window,
                            // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
                        },

                        // For definitions of the remaining functions see related documentation
                        onProgressChange: function (aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
                        onStatusChange: function (aWebProgress, aRequest, aStatus, aMessage) {},
                        onSecurityChange: function (aWebProgress, aRequest, aState) {}
                    }

                    socialWindow.addProgressListener(myListener);











                }, true);
            } catch (err) {
                //budaneki.log('Share on twitter err:' + err);
                budanekilib.social.TWShareOk(false);
            }




        },
        TWShareOk: function (result) {
            //indicate result
			if(budaneki.ShareOnTwitterInit != true){
			budaneki.ShareOnTwitterInit = true;
			var sDocument = document.getElementById('budaneki-share-browser').contentDocument; 
			  if(result === true){
			    //call true
				//budaneki.log('twitter OK');

				
			//indicate
			budanekilib.addClass(sDocument.getElementById('twresult'),'hidden');
			budanekilib.removeClass(sDocument.getElementById('twresultok'),'hidden');

			  }else{
			  //budaneki.log('twitter has a problem, opening an new tab');
			  var url = 'http://twitter.com/intent/tweet?text=budaneki+firefox+icin+sozluk+v.s+eklentisi&url=' + budaneki.shareURL;

			   gBrowser.addTab(url);
			//indicate
			budanekilib.addClass(sDocument.getElementById('twresult'),'hidden');
			budanekilib.removeClass(sDocument.getElementById('twresulterr'),'hidden');			   
			   
			  }
			 
               //changeButton
                budanekilib.addClass(sDocument.getElementById('close'),'active');
			    budanekilib.removeClass(sDocument.getElementById('close'),'passive');				   
			  
			}
            
        }



    },
		firstStart: function(){
		    //budaneki.log('first-time-start');
		   document.getElementById('budaneki-firstrun-browser').addEventListener('load',function(){
		     var sDocument = document.getElementById('budaneki-firstrun-browser').contentDocument;
			 sDocument.getElementById('tr').addEventListener('click',function(){
			 budanekilib.pref('lang', 'tr');
			  budanekilib.pref('gtlang', 'tr');
			 budanekilib.loadUI();
			  document.getElementById('budaneki-firstrun-panel').hidePopup();
			 },false);
			 sDocument.getElementById('en').addEventListener('click',function(){
			 budanekilib.pref('lang', 'en');
			 budanekilib.loadUI();
			  document.getElementById('budaneki-firstrun-panel').hidePopup();
			 },false);			 
			  
		   },true);           
		   document.getElementById('budaneki-firstrun-panel').openPopup(document.getElementById("content").selectedBrowser, "overlap", 10, 10, false, true);
		   document.getElementById('budaneki-firstrun-browser').loadURI('chrome://budaneki/skin/default/firstrun-lang.htm', null, null);

		},
		openShare: function(){
		    //budaneki.log('open share window');
		   document.getElementById('budaneki-share-browser').addEventListener('load',function(){
		     var sDocument = document.getElementById('budaneki-share-browser').contentDocument;
			 sDocument.getElementById('share').addEventListener('click',function(){
			 try{
			 //budaneki.log('sharing clicked');
			 budanekilib.addClass(sDocument.getElementById('sharebuttons'),'hidden');
			 budanekilib.removeClass(sDocument.getElementById('results'),'hidden');
		
			 //budaneki.log('sharing');
			 budanekilib.pref('share', true);
			  budanekilib.social.shareOnFacebook();			 
			 }catch(err){
			 //budaneki.log('Err share click: ' + err);
			 }

			 },false);
			 sDocument.getElementById('cancel').addEventListener('click',function(){
			  document.getElementById('budaneki-share-panel').hidePopup();
			 },false);		
			 sDocument.getElementById('close').addEventListener('click',function(){
			  document.getElementById('budaneki-share-panel').hidePopup();
			 },false);					 
			  
		   },true);           
		   document.getElementById('budaneki-share-panel').openPopup(document.getElementById("content").selectedBrowser, "overlap", 10, 10, false, true);
		   document.getElementById('budaneki-share-browser').loadURI('chrome://budaneki/skin/default/'+budanekilib.pref('lang')+'/share.htm', null, null);
		
		}

}