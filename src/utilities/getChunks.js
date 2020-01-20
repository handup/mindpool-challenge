/* global WEBPACK_BUILD */

let fs;
let path;
let chunks;

if (!WEBPACK_BUILD) {
    fs = require('fs-extra');
    path = require('path');
}

export default function getChunks() {

    if (WEBPACK_BUILD) {
        return {};
    }

    if (!chunks) {
        chunks = fs.readJsonSync(path.join(process.cwd(), '/dist/chunks.json'));
    }

    return chunks;
}