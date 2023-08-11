

const firebase = jest.createMockFromModule("firebase");

export const onAuthStateChanged = jest.fn();
const myFirestore = jest.fn();