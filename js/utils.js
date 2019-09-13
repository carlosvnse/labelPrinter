function capitalize(text) {
    var words = text.split(" ");
    var i = 0;

    for (; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return words.join(" ");
}

/**
 * Get an array of json from a csv format.
 * @param csv
 * @returns {Array<JSON>}
 */
function csvToJson(csv) {
    var array = [];

    if ("string" === typeof csv) {
        var rows = csv.split("\n");
        var headers = rows[1].split(",");
        var i = 2;

        for (; i < rows.length; i++) {
            // Try to change comma by dot in price string.
            var row = rows[i];
            var priceMatches = row.match(/\$\s?\d+,\d/g) || [];

            for (var k = 0; k < priceMatches.length; k++) {
                var price = priceMatches[k];
                row = row.replace(price, price.replace(",", "."));
            }

            var columns = row.split(",");
            var json = {};
            var j = 0;

            for (; j < columns.length; j++) {
                if ("string" === typeof headers[j]) {
                    var key = headers[j];
                    var value = columns[j];

                    key = key.trim();
                    value = value.trim();

                    json[key] = value;
                }
            }

            array.push(json);
        }
    }

    return array;
}

/**
 *
 * @return {string}
 */
function getDateUTCFormat() {
    var date = new Date()
        , year = date.getFullYear()
        , month = ('0' + (date.getMonth() + 1)).slice(-2)
        , day = ('0' + (date.getDay())).slice(-2)
        , hour = date.getHours()
        , minutes = date.getMinutes()
        , seconds = date.getSeconds();

    return `${ year }-${ month }-${ day } ${ hour }:${ minutes }:${ seconds }`;
}

/**
 * Get consecutive day of the year.
 * @returns {number}
 */
function getJulianDay() {
    var today = new Date();
    return Math.ceil((today - new Date(today.getFullYear(),0,1)) / 86400000);
}

/**
 * Validate extension of a file
 * @param extension
 * @param fileName
 * @returns {boolean}
 */
function validateExtension(fileName, extension = 'csv') {
    return fileName.substr(fileName.length - extension.length, fileName.length).toLowerCase() === extension;
}


function Storage() {

    /**
     * Clear Storage
     */
    this.clear = () => {
        localStorage.clear();
    }

    /**
     * Load from Storage.
     * @param {string} key
     * @returns {JSON}
     */
    this.load = (key) => {
        //alert("en storage . load");
        var data = localStorage.getItem(key);
        return JSON.parse(data);
    }

    /**
     * Save data into Storage.
     * @param key
     * @param data
     */
    this.save = (key, data) => {
        var object = JSON.stringify(data);
        localStorage.setItem(key, object);
    }

    /**
     * Remove an item from local storage.
     * @param key
     */
    this.remove = (key) => {
        localStorage.removeItem(key);
    }

}