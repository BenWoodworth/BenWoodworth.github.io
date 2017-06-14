

function loadContainer(containerId, url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);

    var pageContent;
    req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
            pageContent = req.responseText;

            var container = document.getElementById(containerId);
            container.innerHTML = pageContent;
        } else {
            console.log(
                "loadPage error (" + req.status + "): " +
                "containerId=" + containerId + ", " +
                "url=" + url)
        }

    };

    req.send();
}
