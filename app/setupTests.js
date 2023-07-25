jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

jest.mock("firebase/auth", () => {});
jest.mock("firebase/firestore", () => {});
jest.mock("firebase/app", () => {});
jest.mock("./config/firebase", () => {
    return {
        db: {},
        auth: {},
    };
});
 