# HTML DIR CONTENT

[![npm version](https://badge.fury.io/js/html-dir-content.svg)](https://badge.fury.io/js/html-dir-content)
[![CircleCI](https://circleci.com/gh/yoavniran/html-dir-content.svg?style=svg)](https://circleci.com/gh/yoavniran/html-dir-content)

**(recursively) iterate directory entries in the browser (html5 File System API)**

### API

   * getFiles(item:[DataTransferItem](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem), options?: Options) : Promise<Array<File>>

        Returns a promise of an array of files in case the provided item 
        represents a directory and the FS API returns children files for it.
        
        - Options: Boolean | Object
            
            (In case of boolean value, it will be used for the recursive config) 
            - recursive (default: false) - whether to recursively follow the dir structure
            - bail (default: 1000) - how many levels to follow recursively before bailing
            
   *  getFilesFromDragEvent(evt: [DragEvent](https://developer.mozilla.org/en-US/docs/Web/Events/drop), options?: Options)
   
        Returns a promise of an array of files for the given event. 
        In case the event [dataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) property contains file system entries
        and at least one of them is represents a directory and the FS API returns children files for it.
        
        - Options: Boolean | Object
            
            (In case of boolean value, it will be used for the recursive config)
            - recursive (default: false) - whether to recursively follow the dir structure
            - bail (default: 1000) - how many levels to follow recursively before bailing

> note: The order of files returned is not guaranteed to be in same order the files on the file system or organized     

### Example

your HTML:

``` html
        <script src="dist/html-dir-content.min.js"></script>

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

You can drag a directory (ex: from File Explorer / Finder) and the resolved files array will contain the files contained within it and its sub folders 

### Dependencies

Requires global [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object to be available

> Works on all the latest browser versions (not IE11)
