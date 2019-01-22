function loadScript(url) {
    let myScript = document.createElement("script");
    myScript.src = url;
    document.body.appendChild(myScript);
}

// Lazy load scripts
setTimeout(loadScript('/s/basic/static/prism.js'), 100);