const utils = require('../utils');

describe("utils tests", () => {

    beforeAll(()=>{
        global.File = function ([file], filename) {
            return {
                ...file,
                name: filename
            };
        };
    });

    describe("getAsEntry tests", () => {

        it("should use getAsEntry over webkitGetAsEntry", () => {
            const item = {
                getAsEntry: jest.fn(),
                webkitGetAsEntry: jest.fn(),
            };

            utils.getAsEntry(item);

            expect(item.getAsEntry).toHaveBeenCalled();
            expect(item.webkitGetAsEntry).not.toHaveBeenCalled();
        });

        it("should use webkitGetAsEntry if getAsEntry isnt available", () => {
            const item = {
                webkitGetAsEntry: jest.fn(),
            };
            utils.getAsEntry(item);

            expect(item.webkitGetAsEntry).toHaveBeenCalled();
        });

        it("should return null if no get* method available", () => {
            expect(utils.getAsEntry({})).toBe(null);
        });
    });

    describe("isItemFileEntry tests", () => {

        it("should return true for file kind", () => {
            expect(utils.isItemFileEntry({ kind: "file" })).toBe(true);
        });

        it("should return false for non file kind", () => {
            expect(utils.isItemFileEntry({ kind: "text" })).toBe(false);
        });
    });

    describe("initOptions tests", () => {

        it("should return defaults if no values provided", () => {

            const options = utils.initOptions({});

            expect(options.recursive).toBe(false);
            expect(options.bail).toBe(1000);
        });

        it("should return provided values", () => {

            const options = utils.initOptions({
                recursive: true,
                bail: 5
            });

            expect(options.recursive).toBe(true);
            expect(options.bail).toBe(5);
        });

        it("should return the same object for second call", () => {
            const options = utils.initOptions({});
            expect(utils.initOptions(options)).toBe(options);
        });

        it("should work with boolean true", () => {
            const options = utils.initOptions(true);

            expect(options.recursive).toBe(true);
            expect(options.bail).toBe(1000);
        });

        it("should work with boolean false", () => {
            const options = utils.initOptions(false);

            expect(options.recursive).toBe(false);
            expect(options.bail).toBe(1000);
        });
    });

    describe("getFileFromFileEntry tests", () => {

        it("should return the file object", async () => {

            const file = { name: 1 };

            const result = await utils.getFileFromFileEntry(
                { file: (resolve) => resolve(file) });

            expect(result).toBe(file);
        });

        it("should return the file object with full path", async () => {
            const fullPath = "a/b/c";
            const file = { name: 1 };

            const result = await utils.getFileFromFileEntry(
                { file: (resolve) => resolve(file), fullPath },
                { withFullPath: true });

            expect(result).toEqual({ name: fullPath, hdcFullPath: fullPath });
        });

        it("should swallow error", async () => {

            const result = await utils.getFileFromFileEntry(
                { file: (resolve, reject) => reject() });

            expect(result).toBe(null);
        });

        it("should handle not a file", async () => {
            const result = await utils.getFileFromFileEntry({});
            expect(result).toBe(null);
        })
    });

    describe("getListAsArray tests", () => {

        it("should work on array like map", () => {
            const arr = utils.getListAsArray({
                0: "a",
                1: "b",
                2: "c",
                length: 3,
            });

            expect(arr).toEqual(["a", "b", "c"]);
        });

        it("should work on simple array", () => {
            expect(utils.getListAsArray([1, 2, 3])).toEqual([1, 2, 3]);
        });

        it("should flatten array of arrays", () => {
            const arr = utils.getListAsArray([
                [1, 2, 3],
                [4, 5],
                [6, 7, 8]
            ]);

            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
        });

    });
});
