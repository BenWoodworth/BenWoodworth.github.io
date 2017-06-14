window.addEventListener("hashchange", function() {
    console.log("A");
    updateHash();
});

function updateHash() {
    var hash = window.location.hash;
    if (hash === "") {
        hash = "home";
    } else {
        hash = hash.substr(1);
    }

    var navItem = document.getElementById(hash);

    if (navItem === null) {
        return;
    }

    var page = navItem.dataset.page;
    if (page !== null) {
        loadContainer("content", page);
    }
}

updateHash();
