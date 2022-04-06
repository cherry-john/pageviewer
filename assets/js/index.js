//form Handling
$('#uploadForm').on("submit", (event) => {
    event.preventDefault();
    var reader = new FileReader();
    reader.onload = (e) => {
        $("#preProcessing").contents().find('body').html(e.target.result);    
        $("#preProcessing").contents().find("body").append('<link href="assets/css/highlighted.css" rel="stylesheet" type="text/css" >');
        copyBetweenIframes($("#preProcessing"), $("#postProcessing"));
    }
    reader.readAsBinaryString($('#inputFile').prop('files')[0]);
})

$('#siteForm').on("submit", async (event) => {
    event.preventDefault();
    //Use api to get content to avoid cors errors
    $.ajax({
        url: "http://api.johncherry.me/page",
        method: 'POST',
        data: {url: $('#inputURL').val()}
    }).done((result) => {
        $("#preProcessing").contents().find('body').html(result.response);
    }).fail((xhr, status) => {
        console.log(status);
    });
    $("#preProcessing").contents().find("head").append('<link href="assets/css/highlighted.css" rel="stylesheet" type="text/css" >');
    copyBetweenIframes($("#preProcessing"), $("#postProcessing"));
})

//Button Functions
const highlightHeadings = () => {
    $("#preProcessing").contents().find('h1, h2, h3, h4, h5, h6').toggleClass("highlighted");
    $("#postProcessing").contents().find('h1, h2, h3, h4, h5, h6').toggleClass("highlighted");
}

//CorrectHeadings -> Main functionality
const CorrectHeadings = (iframe) => {
    let jqueryFrame = $(iframe);
    let currentHeading = "h0";
        let tags = jqueryFrame.contents().find('body').find("h1, h2, h3, h4, h5, h6");
        tags.each((idx, elem) => {
            //create replacement element
            var new_element = document.createElement(getValidHeading(elem.tagName, currentHeading));
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


//Utilities
/**
 * Returns the next valid heading level, based on the given currentHeading.
 * eg if heading="h3" and currentHeading="h1", this returns "h2", as that has been missed 
 * @param {String} heading tagName to verify
 * @param {String} currentHeading current highest relevant heading tagName
 * @returns {String}
 */
 const getValidHeading = (heading, currentHeading) => {
    const headingLevel = parseInt(heading.charAt(1));
    const currentHeadingLevel = parseInt(currentHeading.charAt(1));
    if (headingLevel <= currentHeadingLevel || headingLevel == currentHeadingLevel + 1){
        return heading;
    }
    return "h" + (currentHeadingLevel + 1).toString();
}

const copyBetweenIframes = (originalIframe, newIframe) => {
    newIframe.contents().find("head").html(originalIframe.contents().find("head").html());
    newIframe.contents().find("body").html(originalIframe.contents().find("body").html());
}