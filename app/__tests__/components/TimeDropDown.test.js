import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TimeDropDown from "../../components/TimeDropDown";

describe("<TimeDropDown />", () => {
  // Tests that the dropdown button opens the modal
  it("test_dropdown_opens_modal", () => {
    const { getByText, getByTestId } = render(<TimeDropDown />);
    const dropdownButton = getByText("Select Timing");
    fireEvent.press(dropdownButton);
    const modal = getByTestId("modal");
    expect(modal).toBeTruthy();
  });

  // Tests that an option is selected and the modal closes
  it("test_option_selected", () => {
    const onSelectTime = jest.fn();
    const { getByText, queryByTestId } = render(
      <TimeDropDown onSelectTime={onSelectTime} startTime={0} endTime={23} />
    );
    const dropdownButton = getByText("Select Timing");
    fireEvent.press(dropdownButton);
    const option = getByText("00:00");
    fireEvent.press(option);
    // Tests that the onSelectTime function is called with the correct argument when an option is selected
    expect(onSelectTime).toHaveBeenCalledWith("00:00");
    const modal = queryByTestId("modal");
    expect(modal.props.visible).toBeFalsy();
  });

  // Tests that the value prop is passed and displayed in dropdown text
  it("test_value_prop_displayed", () => {
    const { getByText } = render(<TimeDropDown value="10:00" />);
    const dropdownText = getByText("10:00");
    expect(dropdownText).toBeTruthy();
  });

  // Tests that the default text is displayed when value prop is null
  it("test_default_text_displayed", () => {
    const { getByText } = render(<TimeDropDown />);
    const dropdownText = getByText("Select Timing");
    expect(dropdownText).toBeTruthy();
  });

});
