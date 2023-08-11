import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import "@testing-library/jest-dom/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("firebase/auth", () => {});
jest.mock("firebase/firestore", () => ({
  query: jest.fn(() => {
    console.log("entered query");
    return { a: "b" };
  }),
  onSnapshot: jest.fn((data, callback) => {
    console.log("entered onSnapshot");
    callback([
      {
        // mock the data returned from the database
        data: jest.fn(function () {
          return {
            date: "2023-7-20",
            time: 1,
            facilityNumber: 1,
            facilityId: 123456789,
            groupId: 987654321,
            groupName: "Test Group",
            userEmail: "test@gmail.com",
          };
        }),
        id: "abcdefghijk",
      },
    ]);
    return jest.fn();
  }),
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock("firebase/app", () => {});

jest.mock("./config/firebase", () => {
  return {
    db: {},
    auth: {},
  };
});
