import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TimeBtn from "../../components/TimeBtn";

describe("<TimeBtn />", () => {
  // Tests that Text component displays the time in HH:00 format
  it("test_time_btn_text_display", () => {
    const { getByText } = render(
      <TimeBtn id={1} time={9} selected={false} onPress={() => {}} />
    );
    expect(getByText("09:00")).toBeTruthy();
  });
  // Tests that TouchableOpacity is disabled when selected
  it("test_time_btn_disabled_when_selected", () => {
    const { getByText } = render(
      <TimeBtn id={1} time={10} selected={true} onPress={() => {}} />
    );
    expect(getByText("10:00").parent).toBeDisabled();
  });
  // Tests that TouchableOpacity has a background color of #E6E6E6 when not selected
  it("test_time_btn_background_color_not_selected", () => {
    const { getByTestId } = render(
      <TimeBtn id={1} time={10} selected={false} onPress={() => {}} />
    );
    expect(getByTestId("button")).toHaveStyle({
      backgroundColor: "#E6E6E6",
    });
  });
  // Tests that TouchableOpacity has a background color of #094074 when selected
  it("test_time_btn_background_color_selected", () => {
    const { getByTestId } = render(
      <TimeBtn id={1} time={10} selected={true} onPress={() => {}} />
    );
    expect(getByTestId("button")).toHaveStyle({
      backgroundColor: "#094074",
    });
  });
  // Tests that onPress is called with the correct id when TouchableOpacity is pressed
  it("test_on_press", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <TimeBtn id={1} time={12} selected={false} onPress={onPressMock} />
    );
    const button = getByTestId("button");
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledWith(1);
  });
});
