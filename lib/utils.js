const OPTS_SYM = "opts_init", //not using Symbol to avoid polyfill
    BAIL_LEVEL = 1000,
    arrayConcat = Array.prototype.concat;

const initOptions = (options) => options[OPTS_SYM] === true ?
    options : {
        [OPTS_SYM]: true,
        recursive: options === true || !!options.recursive,
        withFullPath: !!options.withFullPath,
        bail: (options.bail && options.bail > 0) ? options.bail : BAIL_LEVEL,
    };


const getFile = (file, fullPath, {withFullPath = false} = {}) => withFullPath ?
    new File([file], fullPath, {type: file.type}) : file;

const getFileFromFileEntry = (entry, options) =>
    new Promise((resolve, reject) => {
        if (entry.file) {
            entry.file((file) =>
                resolve(getFile(file, entry.fullPath, options)), reject);
        }
        else {
            resolve(null);
        }
    })
        .catch(() => { //swallow errors
            return null;
        });

const isItemFileEntry = (item) => (item.kind === "file");

const getAsEntry = (item) => item.getAsEntry ?
    item.getAsEntry() :
    item.webkitGetAsEntry ?
        item.webkitGetAsEntry() :
        null;

const getListAsArray = (list) => //returns a flat array
    arrayConcat.apply([], list);

export {
    initOptions,
    getFileFromFileEntry,
    isItemFileEntry,
    getAsEntry,
    getListAsArray,
};
