// swap class with enlarge
// load data.json
// next page / prev page
// default active section: section1
function loadJSON(url, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}
// var data;
var lis = document.getElementsByTagName('li');
var elems = {
    "guideTitle": document.querySelector('.guide-title'),
    "content": document.querySelector('.content'),
    "leftWrapper": document.querySelector('.left-wrapper'),
    "rightWrapper": document.querySelector('.right-wrapper'),
    "leftArrow": document.querySelector('.left-arrow'),
    "rightArrow": document.querySelector('.right-arrow'),
    "left": document.querySelector('.left'),
    "right": document.querySelector('.right'),
    "currentArticle": document.querySelector('.current-article'),
    "guideWrapper": document.querySelector('.guide-wrapper'),
    "rightColumn": document.querySelector('.right-column-wrapper')
}
var currentGuide;
var currentCollection;
var data;
var currentGuideIndex = 0;
function init() {
    loadJSON('./data.json', function(response) {
        // Parse JSON string into object
        data = JSON.parse(response);
        assginCollection(data)
    });
    // if(window.innerWidth < 950){
    //     document.querySelector('.enlarge').className = '';
    // }
}
init();
function assginCollection(data) {
    for(var i = 0; i < lis.length; i++){
        lis[i].children[1].innerText = data["section" + (i+1)].title;
        lis[i].children[0].innerText = data["section" + (i+1)].children[0].title;
    }
    currentCollection = data.section1;
    currentGuide = data.section1.children[0];
    assignGuide(currentGuide, 0);
}
function assignGuide(_currentGuide, _currentGuideIndex) {
    elems.guideTitle.innerText = _currentGuide.title;
    elems.content.innerHTML = _currentGuide.content;
    elems.right.innerText = currentCollection.children[_currentGuideIndex + 1] ? currentCollection.children[_currentGuideIndex + 1].title : ' ';
    elems.left.innerText = currentCollection.children[_currentGuideIndex - 1] ? currentCollection.children[_currentGuideIndex -1].title: ' ';
    document.querySelector('.enlarge').children[0].innerText = _currentGuide.title;

    if(!currentCollection.children[_currentGuideIndex + 1]){
        // elems.rightArrow.className = 'right-arrow hide'
        elems.rightArrow.style.display = 'none'
    } else{
        elems.rightArrow.style.display = 'block'
        // elems.rightArrow.className = 'right-arrow'
    }
    if(!currentCollection.children[_currentGuideIndex - 1]){
        elems.leftArrow.style.display = 'none'
        // elems.leftArrow.className = 'left-arrow hide'
    } else{
        // elems.leftArrow.className = 'left-arrow'
        elems.leftArrow.style.display = 'block'
    }
    resetContentScrollEffect();
    elems.guideWrapper.scrollTop = 0;
}
function onCollectionClick(li, i) {
  for(var j = 0; j < lis.length; j++){
    if(j === i) continue;
    lis[j].className = '';
    lis[j].children[0].className = 'current-article hide';
    // lis[j].querySelector('.current-article').className = "hide"
  }
  li.className = 'enlarge show';
  li.children[0].className = "current-article show"
  //load guide title in collection section
  //load guide title & content
  currentCollection = data["section" + (i+1)];
  currentGuideIndex = 0;

  //Change arrow color
  document.getElementById('left-arrow-svg').setAttribute('fill', currentCollection.color);
  document.getElementById('right-arrow-svg').setAttribute('fill', currentCollection.color);
  document.getElementById('Oval').setAttribute('stroke', currentCollection.color);
  document.getElementById('Shape').setAttribute('fill', currentCollection.color);
  elems.guideTitle.style.color = currentCollection.color;
  elems.left.style.color = currentCollection.color;
  elems.right.style.color = currentCollection.color;
  elems.rightColumn.style.display = 'block';
  assignGuide(currentCollection.children[currentGuideIndex], currentGuideIndex);
}
function addClickEvent() {
    for(var i =0; i < lis.length; i++){
      (function (i) {
        var li = lis[i];
        li.addEventListener('click', function (e) {
            onCollectionClick(li, i);
        })
      }(i))
    }
    elems.rightWrapper.addEventListener('click', function () {
        currentGuideIndex += 1;
        currentGuide = currentCollection.children[currentGuideIndex];

        assignGuide(currentGuide, currentGuideIndex);
    })

    elems.leftWrapper.addEventListener('click', function () {
        currentGuideIndex -= 1;
        currentGuide = currentCollection.children[currentGuideIndex];

        assignGuide(currentGuide, currentGuideIndex);
    })
    document.getElementById('guide-mobile-close').addEventListener('click', function () {
        elems.rightColumn.style.display = 'none';
    })

}
addClickEvent();

//fade out text at top/bottom when scrolling to bottom/top
elems.guideWrapper.onscroll = function() {
    var elm = elems.guideWrapper;
    if(elm.scrollTop + elm.clientHeight == elm.scrollHeight &&  elm.scrollHeight != elm.clientHeight) {
        //bottom
        document.querySelector('.content-gradient-bottom').style.display = 'none'
        document.querySelector('.content-gradient-top').style.display = 'block'
    } else if(elm.scrollTop === 0 && elm.scrollHeight != elm.clientHeight){
        //top
        document.querySelector('.content-gradient-top').style.display = 'none'
        document.querySelector('.content-gradient-bottom').style.display = 'block'
    }
    else {
        document.querySelector('.content-gradient-bottom').style.display = 'none'
        document.querySelector('.content-gradient-top').style.display = 'none'
    }
}
function resetContentScrollEffect() {
    if(elems.guideWrapper.clientHeight === elems.guideWrapper.scrollHeight){
        document.querySelector('.content-gradient-top').style.display = 'none'
        document.querySelector('.content-gradient-bottom').style.display = 'none'
    }else{
        document.querySelector('.content-gradient-top').style.display = 'none'
        document.querySelector('.content-gradient-bottom').style.display = 'block'
    }

}
window.onresize = function(event) {
    if(window.innerWidth >= 950 ){
        elems.rightColumn.style.display = 'block';
    }
};
