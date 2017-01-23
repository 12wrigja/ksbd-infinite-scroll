var source = function(){
  var baseElement = document.getElementsByClassName('comic-table')[0];
  var sidebarElement = document.getElementById('sidebar-under-comic');
	var containerElement = document.createElement('div');
	containerElement.className = 'infinite-scroll-container';
	baseElement.parentElement.insertBefore(containerElement, baseElement);
	baseElement.parentElement.removeChild(baseElement);
	containerElement.appendChild(baseElement);

  // Gets the next page from the sidebar part of the DOM
  var nextPageURLFn = function(element){
    // First try and get the 'Next Page' link.
		var nextLinkElement = element.getElementsByTagName('a')
		if(nextLinkElement.length > 1){
		  console.log('WTF multiple links available. What do?\nChoices:');
		  for(var i=0; i<nextLinkElement.length; i++){
		    console.log(nextLinkElement[i].href);
		  }
		  return null;
		} else if (nextLinkElement.length === 1) {
		  return nextLinkElement[0].href;
		} else {
		  return null;
		}
	}
  
	var nextPageRequest = new XMLHttpRequest();
  
	var isLoadingNextImage = false;
	var mostRecentImageElement = baseElement;
	var nextImageURL = nextPageURLFn(document.getElementsByClassName(''));
	console.log('Should have called the function for next url.');
	
	window.onscroll = function() {
		if(!isLoadingNextImage && mostRecentImageElement.getBoundingClientRect().bottom - window.scrollY <= 0.0){
			isLoadingNextImage = true;
			if(nextImageURL !== null){
         console.log('Should load next image.!');
		     nextPageRequest.open('GET',nextImageURL);
				 nextPageRequest.send();
			} else {
						 console.log('Want to load next image but no url!');
			}
		}
	}
  nextPageRequest.onload = function(){
		if(nextPageRequest.status != 200){
						console.log('Error retrieving page for url: '+nextImageURL);
						return;
		}
		
		//Create temporary DOM and load in response for parsing.
    var tempDom = document.createElement('div');
    tempDom.innerHTML = nextPageRequest.responseText;
    
    // Find the next panel from the comic
    var nextComicPanel = tempDom.getElementsByClassName('comic-table')[0];
    var imageEle = nextComicPanel.getElementsByTagName('img')[0];
    var sidebarEle = nextComicPanel.getElementById('sidebar-under-comic')[0];
    
    // Get the next page URL from the DOM.
    nextImageURL = nextPageURLFn(sidebarEle);
    imageEle.removeAttribute('href');
    imageEle.setAttribute('old_href',nextImageURL);
    
    // Remove from old DOM
    nextComicPanel.parentElement.removeChild(nextComicPanel);
    containerElement.insertBefore(imageEle, null);
    mostRecentImageElement = imageEle;
    
    // Update the nav-bar
    //refresh navigation bar
    var navBarElem = document.getElementsByClassName('comic_navi')[0]
    sidebarElement.parentElement.replaceChild(tempDom.getElementsByClassName('comic_navi')[0], sidebarElement);
    sidebarElement = navBarElem;
    
		isLoadingNextImage = false;
  } 


  return 'Injection complete.';
};

source();
