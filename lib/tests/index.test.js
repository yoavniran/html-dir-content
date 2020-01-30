import {
    initOptions,
    isItemFileEntry,
    getAsEntry,
    getListAsArray,
} from "../utils";
import { getFileList } from "../fileList";
import { getFiles, getFilesFromDragEvent } from "../index";

jest.mock("../fileList", () => ({
    getFileList: jest.fn()
}));
jest.mock("../utils", () => ({
    isItemFileEntry: jest.fn(),
    getListAsArray: jest.fn((arr) => arr),
    getAsEntry: jest.fn((item) => ({ entry: item })),
    initOptions: jest.fn((options) => options),
}));

describe("index tests", () => {
    beforeEach(() => {
        global.clearJestMocks(
            getFileList,
            getListAsArray,
            getListAsArray,
            getAsEntry,
            initOptions,
        );
    });

    const getFileListImp = (result) => Promise.resolve(result);

    describe("getFiles tests", () => {

        it("should work with item", async () => {
            const item = {},
                options = {};

            await getFiles(item, options);

            expect(getAsEntry).toHaveBeenCalledWith(item);
            expect(initOptions).toHaveBeenCalledWith(options);
            expect(getFileList).toHaveBeenCalledWith({ entry: item }, options);
        });

        it("should work with undefined options", async () => {
            const item = {},
                options = {};

            initOptions.mockImplementationOnce(() => options);

            await getFiles(item);

            expect(getAsEntry).toHaveBeenCalledWith(item);
            expect(initOptions).toHaveBeenCalledWith({});
            expect(getFileList).toHaveBeenCalledWith({ entry: item }, options);
        });
    });

    describe("getFilesFromDragEvent tests", () => {

        it("should return files for event's items", async () => {

            const items = [
                { item: 1 },
                { item: 2, getAsFile: () => "file1" },
                { item: 3 },
                { item: 4 },
                { item: 5, getAsFile: () => null }
            ];

            const options = {};

            isItemFileEntry
                .mockImplementationOnce(() => false)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true);

            getFileList
                .mockImplementationOnce(() => getFileListImp([]))
                .mockImplementationOnce(() => getFileListImp(["file2", "file3"]))
                .mockImplementationOnce(() => getFileListImp(["file4", "file5", "file6"]))
                .mockImplementationOnce(() => getFileListImp([]));

            await getFilesFromDragEvent({
                dataTransfer: {
                    items
                }
            }, options);

            expect(initOptions).toHaveBeenCalledWith(options);
            expect(initOptions).toHaveBeenCalledTimes(5);

            expect(getFileList).toHaveBeenCalledTimes(4);
            expect(getFileList).toHaveBeenCalledWith({ entry: items[1] }, options);
            expect(getFileList).toHaveBeenCalledWith({ entry: items[2] }, options);
            expect(getFileList).toHaveBeenCalledWith({ entry: items[3] }, options);
            expect(getFileList).toHaveBeenCalledWith({ entry: items[4] }, options);

            expect(getListAsArray).toHaveBeenCalledWith(items);
            expect(getListAsArray).toHaveBeenCalledWith([
                ["file1"],
                ["file2", "file3"],
                ["file4", "file5", "file6"],
                []]);
        });

        it("should return files in case no items in event data", async () => {

            const files = {
                0: "f1",
                1: "f2",
                2: "f3",
                length: 3,
            };

            const result = await getFilesFromDragEvent({
                dataTransfer: {
                    files
                }
            });

            expect(result).toEqual(files);

        });

        it("should return empty array for no items/files", async () => {

            const result = await getFilesFromDragEvent({
                dataTransfer: {}
            });

            expect(result).toHaveLength(0);
        });
    });
});
