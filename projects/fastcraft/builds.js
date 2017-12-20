var CIRCLE_BASE_URL = "https://circleci.com/api/v1.1/project/github/BenWoodworth/FastCraft";
var S3_BASE_URL = "http://s3.amazonaws.com/fastcraft";

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
function Build(outcome, number, previous, branch, tag, commitHash, commitUrl, artifactName, artifactUrl) {
    this.outcome = outcome;
    this.buildNumber = number;
    this.branch = branch;
    this.tag = tag;
    this.commitHash = commitHash;
    this.artifactName = artifactName;
    this.artifactUrl = artifactUrl;

    this.getPreviousBuild = function (callback) {
        getBuild(previous, callback);
    }
}

/**
 * Get the latest CircleCI build.
 *
 * @param callback the method called once the build has been fetched.
 */
function getLatestBuild(callback) {
    var req = new XMLHttpRequest();
    req.open("GET", CIRCLE_BASE_URL);
    req.onload = function () {
        if (req.status === 200) {
            var number = JSON.parse(req.responseText)[0].build_num;
            getBuild(number, callback)
        } else {
            alert("Request failed.");
        }
    };
    req.send();
}

/**
 * Get a CircleCI build.
 *
 * @param number the build number.
 * @param callback the method called once the build has been fetched.
 */
function getBuild(number, callback) {
    if (number == null || number < 1) {
        callback(null);
        return;
    }

    var s3Callback = function (circleBuild, s3Xml) {
        var xmlContents = s3Xml.getElementsByTagName("Contents")[0];
        var xmlKey = xmlContents && xmlContents.getElementsByTagName("Key")[0];
        var file = xmlKey && xmlKey.childNodes[0].nodeValue;

        var fileUrl = file && (S3_BASE_URL + "/" + file);
        var fileName = file && file.substr(file.lastIndexOf("/") + 1);

        callback(new Build(
            circleBuild.outcome,
            circleBuild.build_num,
            (circleBuild.previous || {}).build_num || null,
            circleBuild.branch,
            circleBuild.vcs_tag,
            (circleBuild.all_commit_details[0] || {}).commit || null,
            (circleBuild.all_commit_details[0] || {}).commit_url || null,
            fileName,
            fileUrl
        ));
    };

    var circleCallback = function (circleBuild) {
        var req = new XMLHttpRequest();
        req.open("GET", S3_BASE_URL + "?prefix=circleci/" + number + "/");
        req.onload = function () {
            if (req.status === 200) {
                s3Callback(circleBuild, req.responseXML);
            } else {
                alert("Request failed.");
            }
        };
        req.send();
    };

    var req = new XMLHttpRequest();
    req.open("GET", CIRCLE_BASE_URL + "/" + number);
    req.onload = function () {
        if (req.status === 200) {
            circleCallback(JSON.parse(req.responseText));
        } else {
            alert("Request failed.");
        }
    };
    req.send();
}