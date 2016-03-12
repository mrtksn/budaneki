##What is Budaneki?

Budaneki is a **Firefox** extension that I created in *2009* and stopped development in *2011*, therefore new versions of Firefox are no longer supported.  

##O.K. It's a Firefox extension, but what it does?

The idea was to get a definition of any word on any webpage but it's not yet another dictionary extension. 

The motivation here is to quickly look up any information without opening a new tab or a browser window.  

What Budaneki did was to open a small overlay frame over the current website and query the selected text in websites such as **Wikipedia**, **Google Image Search**, **Ekşi Sözlük** and so on.  As soon as you click somewhere else, that frame disappears. 

The latest version of Budaneki also supported on the page translation with Google Translate. You select a text, click a button and that text is instantly replaced with the translated version. 


Today most of these features are default functionality in Google Chrome or Safari but back in the day Budaneki was one of the first to explore these concepts. 

It was especially popuplar among non-native English speakers who are frequent on the English language websites. 

At it's height Budaneki reached almost 100K users and was among the TOP10 most highly rated extensions. 

##Technicalities 

Budaneki is pure JavaScript code, no frameworks such as **JQuery**  were used. This is because I wanted to keep the memory footprint slim as possible. 

The UI lives entirely in the DOM, on the page.  Firefox specific API usage is limited, therefore should be relatively trivial to port it on other browsers but as I said, the modern browsers have good enough tools making Budaneki obsolete.

#Thank you for all the love that Budaneki received.
