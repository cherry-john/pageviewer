//form Handling
$('#uploadForm').on("submit", (event) => {
    event.preventDefault();
    var reader = new FileReader();
    reader.onload = (e) => {
        $("#pageContent").contents().find('body').html(e.target.result);    
        $("#pageContent").contents().find("body").append('<link href="assets/css/highlighted.css" rel="stylesheet" type="text/css" >');
    }
    reader.readAsBinaryString($('#inputFile').prop('files')[0]);
})

$('#siteForm').on("submit", async (event) => {
    event.preventDefault();
    //Use api to get content to avoid cors errors
    $.ajax({
        url: "https://api.johncherry.me/page",
        method: 'POST',
        data: {url: $('#inputURL').val()}
    }).done((result) => {
        $("#pageContent").contents().find('body').html(result);
    }).fail((xhr, status) => {
        console.log(status);
    });
    $("#pageContent").contents().find("head").append('<link href="assets/css/highlighted.css" rel="stylesheet" type="text/css" >');
})

//Button Functions
const highlightHeadings = () => {
    $("#pageContent").contents().find('h1, h2, h3, h4, h5, h6').toggleClass("highlighted");
}

//CorrectHeadings -> Main functionality
const CorrectHeadings = (iframe) => {
    let jqueryFrame = $(iframe);
    let currentHeading = "h0";
    let previousCurrentHeading = "h0";//store what the previous level was before changing
    let tags = jqueryFrame.contents().find('body').find("h1, h2, h3, h4, h5, h6");
    tags.each((idx, elem) => {
        //create replacement element
        var new_element = document.createElement(getValidHeading(elem.tagName, currentHeading, previousCurrentHeading));
        previousCurrentHeading = elem.tagName;
        //add attributes
        for(var i = 0; i < elem.attributes.length; ++i){
            let attribute = elem.attributes.item(i);
            new_element.setAttribute(attribute.nodeName, attribute.nodeValue);
        }
        //add children
        while (elem.firstChild) {
            new_element.appendChild(elem.firstChild);
        }
        //replace element
        elem.parentNode.replaceChild(new_element, elem);
        currentHeading = new_element.tagName;
    })
}

const saveFile = () => {
    const dataBlob = new Blob([$('#pageContent').contents().find("html").html()], {type: "text/html"});

    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(dataBlob);
    elem.download = "updatedContent.html";
    document.body.appendChild(elem);
    elem.click();//trigger the download
    document.body.removeChild(elem);
}


//Utilities
/**
     * Returns the next valid heading level, based on the given currentHeading.
     * eg if heading="h3" and currentHeading="h1", this returns "h2", as that has been missed 
     * @param {String} heading tagName to verify
     * @param {String} currentHeading current highest relevant heading tagName
     * @param {String} previousCurrentHeading what was the previous heading before it was changed?
     * @returns {String}
     */
 const getValidHeading = (heading, currentHeading, previousCurrentHeading) => {
    const headingLevel = parseInt(heading.charAt(1));
    const previousLevel = parseInt(previousCurrentHeading.charAt(1));
    const currentHeadingLevel = parseInt(currentHeading.charAt(1));
    if (previousLevel == headingLevel) {
        return currentHeading;
    }
    if ((headingLevel <= currentHeadingLevel || headingLevel == currentHeadingLevel + 1)){
        if (previousLevel != headingLevel) {
            return heading;
        } else {
            return currentHeading;
        }
        
    }
    return "h" + (currentHeadingLevel + 1).toString();
}
