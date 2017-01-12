var source = function(){
  var baseElement = document.getElementsByClassName('comic-table')[0];
	var containerElement = document.createElement('div');
	containerElement.className = 'infinite-scroll-container';
	baseElement.parentElement.insertBefore(containerElement, baseElement);
	baseElement.parentElement.removeChild(baseElement);
	containerElement.appendChild(baseElement);

  var nextImageURLFN = function(element){
		var links = element.getElementsByTagName('a');
		if(links.length > 1){
						console.log('Too many links on latest element.');
						return null;
		} else if (links.length == 0){
						console.log('No links on latest element');
						return null;
		} else {
						var linkToReturn = links[0].href;
						links[0].setAttribute('old_href', linkToReturn);
						links[0].removeAttribute('href');
						return linkToReturn;
		}
	};
  
	var nextPageRequest = new XMLHttpRequest();
  
	var isLoadingNextImage = false;
	var mostRecentImageElement = baseElement;
	var nextImageURL = nextImageURLFN(mostRecentImageElement);
	console.log('Should have called the function thing for next url.');
	document.body.onscroll = function() {
		if(!isLoadingNextImage && mostRecentImageElement.getBoundingClientRect().bottom - window.scrollY <= 0.0){
			isLoadingNextImage = true;
			if(nextImageURL != null){
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
    var tempDom = document.createElement('div');
    tempDom.innerHTML = nextPageRequest.responseText;
    var nextComicPanel = tempDom.getElementsByClassName('comic-table')[0];
    nextComicPanel.parentElement.removeChild(nextComicPanel);
    containerElement.insertBefore(nextComicPanel, null);
    mostRecentImageElement = nextComicPanel;
    nextImageURL = nextImageURLFN(mostRecentImageElement);
		isLoadingNextImage = false;
  } 


  return 'Injection complete.';
};

source();
