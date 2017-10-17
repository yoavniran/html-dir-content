describe("index tests", () => {

    const mockGetFileList = jest.fn(),
        mockUtils = {
            isItemFileEntry: jest.fn(),
            getListAsArray: jest.fn((arr) => arr),
            getAsEntry: jest.fn((item) => ({entry: item})),
            initOptions: jest.fn((options) => options),
        };

    let getFiles,
        getFilesFromDragEvent;

    beforeAll(() => {

        jest.mock("../fileList", () => mockGetFileList);
        jest.mock("../utils", () => mockUtils);

        const index = require("../");
        getFiles = index.getFiles;
        getFilesFromDragEvent = index.getFilesFromDragEvent;
    });

    beforeEach(() => {

        global.clearJestMocks(
            mockGetFileList,
            mockUtils.getListAsArray,
            mockUtils.getListAsArray,
            mockUtils.getAsEntry,
            mockUtils.initOptions,
        );
    });

    const getFileListImp = (result) => Promise.resolve(result);

    describe("getFiles tests", () => {

        it("should work with item", async () => {
            const item = {},
                options = {};

            await getFiles(item, options);

            expect(mockUtils.getAsEntry).toHaveBeenCalledWith(item);
            expect(mockUtils.initOptions).toHaveBeenCalledWith(options);
            expect(mockGetFileList).toHaveBeenCalledWith({entry: item}, options);
        });
    });

    describe("getFilesFromDragEvent tests", () => {

        it("should return files for event's items", async () => {

            const items = [
                {item: 1},
                {item: 2, getAsFile: () => "file1"},
                {item: 3},
                {item: 4},
                {item: 5, getAsFile: () => null}
            ];

            const options = {};

            mockUtils.isItemFileEntry
                .mockImplementationOnce(() => false)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true)
                .mockImplementationOnce(() => true);

            mockGetFileList
                .mockImplementationOnce(() => getFileListImp([]))
                .mockImplementationOnce(() => getFileListImp(["file2", "file3"]))
                .mockImplementationOnce(() => getFileListImp(["file4", "file5", "file6"]))
                .mockImplementationOnce(() => getFileListImp([]));

            await getFilesFromDragEvent({
                dataTransfer: {
                    items
                }
            }, options);

            expect(mockUtils.initOptions).toHaveBeenCalledWith(options);
            expect(mockUtils.initOptions).toHaveBeenCalledTimes(5);

            expect(mockGetFileList).toHaveBeenCalledTimes(4);
            expect(mockGetFileList).toHaveBeenCalledWith({entry: items[1]}, options);
            expect(mockGetFileList).toHaveBeenCalledWith({entry: items[2]}, options);
            expect(mockGetFileList).toHaveBeenCalledWith({entry: items[3]}, options);
            expect(mockGetFileList).toHaveBeenCalledWith({entry: items[4]}, options);

            expect(mockUtils.getListAsArray).toHaveBeenCalledWith(items);
            expect(mockUtils.getListAsArray).toHaveBeenCalledWith([
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
