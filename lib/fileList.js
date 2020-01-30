import { getFileFromFileEntry, getListAsArray } from "./utils";

const getEntryData = (entry, options, level) => {
    let promise;

    if (entry.isDirectory) {
        promise = options.recursive ?
            getFileList(entry, options, (level + 1)) :
            Promise.resolve([]);
    } else {
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
            let allEntries = [];
            const reader = root.createReader();

            const createResults = () => {
                Promise.all(allEntries.map((entry) =>
                    getEntryData(entry, options, level)))
                    .then((results) =>
                        resolve(getListAsArray(results))) //flatten the results
            };

            const readEntries = () => {
                reader.readEntries(
                    (entries) => {
                        if (entries.length) {
                            allEntries = allEntries.concat(entries);
                            readEntries();
                        } else {
                            createResults();
                        }
                    },
                    createResults); //fail silently
            };

            readEntries();
        }) :
        Promise.resolve([]);

export {
    getFileList
};
