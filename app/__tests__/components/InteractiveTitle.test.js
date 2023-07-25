import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import InteractiveTitle from "../../components/InteractiveTitle";

describe("InteractiveTitle component", () => {
  // Tests that the component renders correctly with valid props
  it("test_renders_correctly", () => {
    const data = {
      groupId: "1",
      groupName: "Test Group",
    };
    const navigation = {
      navigate: jest.fn(),
    };
    const { getByText, getByTestId } = render(
      <InteractiveTitle navigation={navigation} data={data} />
    );
    const titleText = getByText("Test Group");
    const icon = getByTestId("icon");
    expect(titleText).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  // Tests that clicking on the TouchableOpacity navigates to 'Manage Groupings' screen with correct data
  it("test_navigates_to_manage_groupings", () => {
    const data = {
      groupId: "1",
      groupName: "Test Group",
    };
    const navigation = {
      navigate: jest.fn(),
    };
    const { getByTestId } = render(
      <InteractiveTitle navigation={navigation} data={data} />
    );
    const icon = getByTestId("icon");
    fireEvent.press(icon);
    expect(navigation.navigate).toHaveBeenCalledWith("Manage Groupings", {
      groupId: "1",
      groupName: "Test Group",
    });
  });

  // Tests that the component handles null or undefined data prop
  it("test_data_prop_null_or_undefined", () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const { queryByTestId } = render(
      <InteractiveTitle navigation={navigation} />
    );
    const titleText = queryByTestId("title");
    const icon = queryByTestId("icon");
    expect(titleText).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  // Tests that the component handles null or undefined data.groupName
  it("test_group_name_null_or_undefined", () => {
    const data = {
      groupId: "1",
      groupName: null,
    };
    const navigation = {
      navigate: jest.fn(),
    };
    const { queryByTestId } = render(
      <InteractiveTitle navigation={navigation} data={data} />
    );
    const titleText = queryByTestId("title");
    const icon = queryByTestId("icon");
    expect(titleText).toBeTruthy();
    expect(icon).toBeTruthy();
  });

  // Tests that the component handles null or undefined data.groupId
  it("test_group_id_null_or_undefined", () => {
    const data = {
      groupId: null,
      groupName: "Test Group",
    };
    const navigation = {
      navigate: jest.fn(),
    };
    const { queryByTestId } = render(
      <InteractiveTitle navigation={navigation} data={data} />
    );
    const titleText = queryByTestId("title");
    const icon = queryByTestId("icon");
    expect(titleText).toBeTruthy();
    expect(icon).toBeTruthy();
  });

});
