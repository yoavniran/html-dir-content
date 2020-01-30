jest.mock("../utils", () => ({
    getFileFromFileEntry: jest.fn(() => Promise.resolve('file')),
    getListAsArray: (list) => Array.prototype.concat.apply([], list),
}));

import { getFileFromFileEntry } from "../utils";
import { getFileList } from "../fileList";

describe("fileList tests", () => {
    let dirCounter = 1,
        fileCounter = 1;

    beforeEach(() => {
        clearJestMocks(getFileFromFileEntry);
    });

    const getDirCounter = () => dirCounter++;
    const getFileCounter = () => fileCounter++;

    const getEntry = (isDir = false) => {
        const readEntries = isDir && jest.fn(),
            reader = jest.fn(() => ({ readEntries }));

        return {
            name: isDir ? `dir_${getDirCounter()}` : `file_${getFileCounter()}`,
            readEntries, //easy access
            isDirectory: isDir,
            isFile: !isDir,
            createReader: isDir && reader,
        };
    };

    const getFile = (name) => () => Promise.resolve(name ? { fileName: name } : null);

    const mockReadEntries = (dir, entries, err) =>
        dir.readEntries.mockImplementationOnce((cb, errCb) => setTimeout(() => err ? errCb(err) : cb(entries), 1)) //readEntries is async
            .mockImplementationOnce((cb, errCb) => setTimeout(() => err ? errCb(err) : cb([]), 1));
    it("should handle null", async () => {

        const files = await getFileList(null, { bail: 1000, recursive: false });

        expect(files).toHaveLength(0);
    });

    it("should work for 1 level with recursive false", async () => {

        const root = getEntry(true);

        mockReadEntries(root, [
            getEntry(),
            getEntry(),
            getEntry(),
        ]);

        getFileFromFileEntry
            .mockImplementationOnce(getFile("file1"))
            .mockImplementationOnce(getFile("file2"))
            .mockImplementationOnce(getFile("file3"));

        const files = await getFileList(root, { bail: 1000, recursive: false });

        expect(files).toHaveLength(3);
        expect(files[0]).toEqual({ fileName: "file1" });
    });

    it("should return only 1 level with recursive false", async () => {

        const root = getEntry(true);

        const subDir = getEntry(true);

        mockReadEntries(root, [
            getEntry(),
            subDir,
            getEntry(),
            getEntry(),
            getEntry(),
        ]);

        getFileFromFileEntry
            .mockImplementationOnce(getFile("file1"))
            .mockImplementationOnce(getFile("file2"))
            .mockImplementationOnce(getFile("file3"))
            .mockImplementationOnce(getFile(null));

        const files = await getFileList(root, { bail: 1000, recursive: false });

        expect(root.createReader).toHaveBeenCalled();
        expect(subDir.createReader).not.toHaveBeenCalled();

        expect(getFileFromFileEntry).toHaveBeenCalledTimes(4);

        expect(files).toHaveLength(3);
        expect(files[2]).toEqual({ fileName: "file3" });
    });

    it("should handle readEntries failure", async () => {

        const root = getEntry(true);

        mockReadEntries(root, null, "ERROR!");

        const files = await getFileList(root, { bail: 1000, recursive: false });

        expect(root.createReader).toHaveBeenCalled();
        expect(files).toHaveLength(0);
    });

    it("should stop at bail level with recursive true", async () => {

        const root = getEntry(true),
            subDir = getEntry(true),
            sub2Dir = getEntry(true),
            l2Dir = getEntry(true),
            l22Dir = getEntry(true);

        mockReadEntries(root, [
            getEntry(),
            subDir,
            getEntry(),
            getEntry(),
            sub2Dir,
        ]);

        mockReadEntries(subDir, [
            getEntry(),
            l2Dir,
            l22Dir,
            getEntry(),
        ]);

        mockReadEntries(sub2Dir, [
            getEntry(),
        ]);

        const names = ["f1", "f2", "f3", "f4", "f5", "f6"];

        getFileFromFileEntry
            .mockImplementationOnce(getFile(names[0]))
            .mockImplementationOnce(getFile(names[1]))
            .mockImplementationOnce(getFile(names[2]))
            .mockImplementationOnce(getFile(names[3]))
            .mockImplementationOnce(getFile(names[4]))
            .mockImplementationOnce(getFile(names[5]));

        const files = await getFileList(root, { bail: 2, recursive: true });

        expect(root.createReader).toHaveBeenCalled();
        expect(subDir.createReader).toHaveBeenCalled();
        expect(sub2Dir.createReader).toHaveBeenCalled();
        expect(l2Dir.createReader).not.toHaveBeenCalled();
        expect(l22Dir.createReader).not.toHaveBeenCalled();

        expect(getFileFromFileEntry).toHaveBeenCalledTimes(6);

        expect(files).toHaveLength(6);

        names.forEach((n) => {
            expect(files.find((f) => f.fileName === n)).toBeDefined();
        });
    });

    it("should return all tree with recursive true", async () => {

        /* tests the following structure:

                - root
                    file
                    - dir (subDir)
                        file
                        - dir (l2Dir)
                            - dir (l3Dir)
                                - dir (l4Dir)
                                    file
                            file
                            file
                        file
                    file
                    file
                    - dir (subDir2)
                        file
                        file
                        file
        */

        const root = getEntry(true),
            subDir = getEntry(true),
            subDir2 = getEntry(true),
            l2Dir = getEntry(true),
            l3Dir = getEntry(true),
            l4Dir = getEntry(true);

        mockReadEntries(root, [
            getEntry(),
            subDir,
            getEntry(),
            getEntry(),
            subDir2,
        ]);

        mockReadEntries(subDir, [
            getEntry(),
            l2Dir,
            getEntry(),
        ]);

        mockReadEntries(subDir2, [
            getEntry(),
            getEntry(),
            getEntry(),
        ]);

        mockReadEntries(l2Dir, [
            l3Dir,
            getEntry(),
            getEntry(),
        ]);

        mockReadEntries(l3Dir, [
            l4Dir
        ]);

        mockReadEntries(l4Dir, [
            getEntry(),
        ]);

        const names = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11"];

        getFileFromFileEntry
            .mockImplementationOnce(getFile(names[0]))
            .mockImplementationOnce(getFile(names[1]))
            .mockImplementationOnce(getFile(names[2]))
            .mockImplementationOnce(getFile(names[3]))
            .mockImplementationOnce(getFile(names[4]))
            .mockImplementationOnce(getFile(names[5]))
            .mockImplementationOnce(getFile(names[6]))
            .mockImplementationOnce(getFile(names[7]))
            .mockImplementationOnce(getFile(names[8]))
            .mockImplementationOnce(getFile(names[9]))
            .mockImplementationOnce(getFile(names[10]));

        const files = await getFileList(root, { bail: 1000, recursive: true });

        expect(root.createReader).toHaveBeenCalled();
        expect(subDir.createReader).toHaveBeenCalled();
        expect(subDir2.createReader).toHaveBeenCalled();
        expect(l2Dir.createReader).toHaveBeenCalled();
        expect(l3Dir.createReader).toHaveBeenCalled();
        expect(l4Dir.createReader).toHaveBeenCalled();

        expect(getFileFromFileEntry).toHaveBeenCalledTimes(11);

        expect(files).toHaveLength(11);

        names.forEach((n) => {
            expect(files.find((f) => f.fileName === n)).toBeDefined();
        });
    });
});
