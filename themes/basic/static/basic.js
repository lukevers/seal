function script(url) {
    let myScript = document.createElement('script');
    myScript.src = url;
    document.body.appendChild(myScript);
}

function css(url) {
    var link = document.createElement('link');
    link.href = url;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
}

// Lazy load assets that aren't "needed" but help
setTimeout(function() { css('https://fonts.googleapis.com/css?family=Source+Code+Pro:200'); }, 50);
setTimeout(function() { script('/s/basic/static/prism.js'); }, 250);