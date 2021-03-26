// example query: https://api.fda.gov/drug/label.json?search=openfda.generic_name:ibuprofen+openfda.brand_name:ibuprofen"

const topButton = document.getElementById('top-btn');
const searchButton = document.getElementById('search-btn');
const searchBox = document.getElementById('search-box');
const limit = 10; //max # of results displayed
let query = "https://api.fda.gov/drug/drugs@FDA.json?search="; //query link without search parameters added

// search generic and brand names of drugs based on search
searchButton.addEventListener('click', () => {
    let searchText = searchBox.value;
    if(searchText != "") {
        $("#result-head").html(`Results for "${searchText}"<br>`);
        searchText.replace(" ", "+");
        searchText = `"${searchText}"`;
        searchText = query + `(openfda.generic_name:${searchText})+(openfda.brand_name:${searchText})+(openfda.substance_name:${searchText})&limit=${limit}`;
        console.log(`Query Constructed: ${searchText}`);
        let page = 1, index = -1;;
        let url = searchText;
        let nextLink;
        do {
            makeQueryPage(url, page);
            fetch(url).then(function(response) {
                nextLink = response.headers.get("Link");
                if(nextLink.test('rel="Next')) {
                    index = nextLink.search('>');
                    url = nextLink.subString(1, index);
                }
            }).catch(() => index = -1);
            page++;
        } while(page <= 10 || index != -1);
    }
});

function makeQueryPage(url, pageNum) {
    $('#page-nav').append(`<a href="#result-${pageNum}" class="page-num">  ${pageNum}  <a/>`);
    $.getJSON(url, function(data) {
        console.log("Printing Query Data...");
        var text = JSON.stringify(data, null, 2);
        console.log(text);
        $("#result").append(`<div id="result-${pageNum}"><h1>Result ${pageNum}<h1/><pre id="json">${text}<pre/><div/>`);
    }).fail(function(jqXHR) {
        console.log(`Failed to get data for entry ${pageNum}`);
        $("#result").html(`Query Failed, ${jqXHR.status} Error`);
    });
}
