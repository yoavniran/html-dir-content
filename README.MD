# HTML DIR CONTENT

[![npm version](https://badge.fury.io/js/html-dir-content.svg)](https://www.npmjs.com/package/html-dir-content)
[![CircleCI](https://circleci.com/gh/yoavniran/html-dir-content.svg?style=svg)](https://circleci.com/gh/yoavniran/html-dir-content)
[![Coverage Status](https://coveralls.io/repos/github/yoavniran/html-dir-content/badge.svg?branch=master)](https://coveralls.io/github/yoavniran/html-dir-content?branch=master)

**(recursively) iterate directory entries in the browser (html5 File System API)**


### Install

In Node/Webpack environment:
```
    npm i html-dir-content
    OR
    yarn add html-dir-content
```

Directly in the browser:
```
    <script src="https://unpkg.com/html-dir-content/dist/html-dir-content.min.js"></script>
```

### API

   * getFiles(item:[DataTransferItem](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem), options?: Options) : Promise<Array<File>>

        Returns a promise of an array of files in case the provided item
        represents a directory and the FS API returns children files for it.

        - Options: Boolean | Object

            (In case of boolean value, it will be used for the recursive config)
            - recursive (default: false) - whether to recursively follow the dir structure
            - bail (default: 1000) - how many levels to follow recursively before bailing
            - withFullPath (default: false) - file names contain the full file path


   *  getFilesFromDragEvent(evt: [DragEvent](https://developer.mozilla.org/en-US/docs/Web/Events/drop), options?: Options)

        Returns a promise of an array of files for the given event.
        In case the event [dataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) property contains file system entries
        and at least one of them is represents a directory and the FS API returns children files for it.

        - Options: Boolean | Object

            (In case of boolean value, it will be used for the recursive config)
            - recursive (default: false) - whether to recursively follow the dir structure
            - bail (default: 1000) - how many levels to follow recursively before bailing
            - withFullPath (default: false) - file names contain the full file path

> note: The order of files returned is not guaranteed to be in same order the files on the file system are organized

> note: Firefox will turn any path delimiter (/) in the File name property to ":" (when using 'withFullPath') :\( - So in case you need to parse/save the path you can use the custom 'hdcFullPath' prop on the File object  or replace the colons with slashes if needed.

### Example

check out this [codepen](https://codepen.io/poeticGeek/pen/xXmPyX).

your HTML:

``` html
        <script src="<path-to-node_modules>/html-dir-content/dist/html-dir-content.min.js"></script>
```

your Javascript:

``` javascript

    window.addEventListener("drop", (e) => {
                e.preventDefault();

                htmlDirContent.getFilesFromDragEvent(e, true) //will perform recusrive traversal
                    .then((files) => {
                        console.log("we have the files: ", files);
                    });
            });
```

or with import/require:

``` javascript

    import {getFilesFromDragEvent} from "html-dir-content";
    .
    .
    .
    getFilesFromDragEvent(e, true)
        .then((files) => {

        });
```

You can drag a directory (ex: from File Explorer / Finder) and the resolved files array will contain the files contained within it and its sub folders

### Dependencies

Requires global [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object to be available

> Works on Chrome, Firefox, Safari (at least from version 13), and Edge (no support on IE11)
