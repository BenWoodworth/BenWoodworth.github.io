$(document).ready(function() {
    // Setup navigation links
    $("#navigation a").each(function() {
        e = $(this);

        // Set background colors
        var color = e.attr("data-color");
        this.style.backgroundColor = color;
        this.style.borderColor = color;

        // Add navigation images
        var src = e.attr("data-img");
        var div = document.createElement("div");
        var img = document.createElement("img");
        div.className = "nav-img-div";
        img.src = "./_img/" + src + ".svg";
        div.appendChild(img);
        e.prepend(div);
    });

    // Register click events
    $("#navigation").on("click", "a[data-nav]", function() {
        navigate($(this).attr("data-nav"));
    })
});

function navigate(url) {
    $("#navigation a").attr("data-nav-active", null);
    $("#navigation a[data-nav='" + url + "']").attr("data-nav-active", "");

    $("#content-frame")[0].src = url;
}

navigate("./index.html");
