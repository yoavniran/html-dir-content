
global.clearJestMocks = (...mocks) => {
    mocks.forEach((mock) => mock.mockClear())
};
