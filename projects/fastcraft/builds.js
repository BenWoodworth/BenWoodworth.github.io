var BASE_URL = "https://circleci.com/api/v1.1/project/github/BenWoodworth/FastCraft";

/**
 * The result of the build.
 */
var BuildOutcome = {
    SUCCESS: "success",
    FAILED: "failed",
    RUNNING: null
};

/**
 * A CircleCI build.
 *
 * @constructor
 */
function Build(outcome, number, branch, tag, commitHash, commitUrl, artifactName, artifactUrl) {
    this.outcome = outcome;
    this.buildNumber = number;
    this.branch = branch;
    this.tag = tag;
    this.commitHash = commitHash;
    this.artifactName = artifactName;
    this.artifactUrl = artifactUrl;
}

/**
 * Get the builds from CircleCI.
 */
function getBuilds(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.onload = function () {
        if (req.status === 200) {
            parseBuilds(req.responseText);
        } else {
            alert("Request failed.");
        }
    };
    req.send();
}

/**
 * Parse the builds from a CircleCI API response.
 *
 * @param json the CircleCI JSON response
 */
function parseBuilds(json) {
    var response = JSON.parse(json);

    var builds = [];
    response.forEach(function(build) {
        builds.push(new Build(
            build.outcome,
            build.build_num,
            build.branch,
            build.vcs_tag,
            build.all_commit_details.commit,
            build.all_commit_details.commit_url,
            null,
            null
        ));
    });

    getArtifacts(builds);
}

/**
 * Get the artifacts associated with the builds.
 *
 * @param builds the CircleCI Builds
 */
function getArtifacts(builds) {
    listBuilds(builds);
}

function listBuilds(builds) {
    alert(builds);
}

getBuilds(BASE_URL);