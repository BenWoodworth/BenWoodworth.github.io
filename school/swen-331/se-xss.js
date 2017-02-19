(function() {
	var replaceState = false;
	
	var searchUrl = "http://www.se.rit.edu/search/node/Daniel+Krutz";
	var krutzUrl = "http://www.se.rit.edu/faculty-staff/daniel-krutz";

	// Create iframe that will contain the actual site
	var frame = document.createElement("iframe");
	frame.name = "frame";

	// Make frame take up whole page
	frame.style.backgroundColor = "white";
	frame.style.position = "fixed";
	frame.style.border = "none";
	frame.style.top = "0";
	frame.style.bottom = "0";
	frame.style.left = "0";
	frame.style.right = "0";
	frame.style.width = "100%";
	frame.style.height = "100%";
	
	// Add the frame to the page
	document.body.appendChild(frame);
	var windowFrame = window.frames[frame.name];
	
	// Handle frame navigation
	frame.addEventListener("load", function() {
		var frameUrl = window.frames[frame.name].location.href;
		
		// Update the page state
		var frameTitle = windowFrame.document.title;
		replaceState ? window.history.replaceState({src: frameUrl, title: frameTitle}, "", frameUrl)
		             : window.history.pushState(   {src: frameUrl, title: frameTitle}, "", frameUrl);
		replaceState = false;
		
		// Edit Krutz's page
		if (frameUrl == krutzUrl) {
			windowFrame.document.body.innerHTML = windowFrame.document.body.innerHTML
				.replace("Daniel Krutz", "Daniel \"The Hacker\" Krutz")
				.replace("Lecturer",     "Lecturer & OG Rapper")
			
				.replace("Research Interests",             "Course Perks")
				.replace("Android Security",               "Accept bribes to boost grades.")
				.replace("Concolic Analysis",              "Gives out more candy than Martinez.")
				.replace("Mobile Malware",                 "Teaches how to hack grades in other classes.")
				.replace("Software Engineering Education", "Drops 3 lowest exam grades.");
		}
	});
	
	// Handle state changes
	window.addEventListener("popstate", function(event) {
		replaceState = true;
		windowFrame.location.href = event.state.src;
		document.title = event.state.title;
	});
		
	// Navigate to the search results
	replaceState = true;
	windowFrame.location.href = searchUrl;
})();
