import {getFileFromFileEntry, getListAsArray} from "./utils";

const getEntryData = (entry, options, level) => {
    let promise;

    if (entry.isDirectory) {
        promise = options.recursive ?
            getFileList(entry, options, (level + 1)) :
            Promise.resolve([]);
    }
    else {
        promise = getFileFromFileEntry(entry, options)
            .then((file) => (file ? [file] : []));
    }

    return promise;
};

/**
 * returns a flat list of files for root dir item
 * if recursive is true will get all files from sub folders
 */
const getFileList = (root, options, level = 0) =>
    (root && level < options.bail && root.isDirectory && root.createReader) ?
        new Promise((resolve) => {
            root.createReader()
                .readEntries(
                    (entries) =>
                        Promise.all(entries.map((entry) =>
                            getEntryData(entry, options, level)))
                            .then((results) =>
                                resolve(getListAsArray(results))), //flatten the results
                    () => resolve([])); //fail silently
        }) :
        Promise.resolve([]);

export default getFileList;
