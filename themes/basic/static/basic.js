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

// Get the cache hash
var cachehash = document.getElementsByTagName('body')[0].dataset.cachehash;

// Lazy load assets that aren't "needed" but help
setTimeout(function() { css('https://fonts.googleapis.com/css?family=Source+Code+Pro:200'); }, 50);
setTimeout(function() { script('/s/basic/static/prism.js?cache=' + cachehash); }, 250);

// Convert <br/> to new lines before prism runs
Array.prototype.slice.call(document.getElementsByClassName('code-block')).map(function (el) {
    el.innerHTML = el.innerHTML.replace(/<br\s*[\/]?>/gi, "\n");
});

// Subscribing emails
document.querySelector('#subscribe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    document.querySelector('#subscribe-email-submit').disabled = true;

    var req = new XMLHttpRequest();
    req.addEventListener('load', function() {
        document.querySelector('#subscribe-footer-title').innerHTML = "Thank you!";
        document.querySelector('#subscribe-footer-description').remove();
        document.querySelector('#subscribe-form').remove();
    });

    document.querySelector('#subscribe-email-submit').remove();

    req.open('POST', '/forms/subscribe');
    req.send(JSON.stringify({
        email: document.querySelector('#subscribe-email').value,
    }));
});