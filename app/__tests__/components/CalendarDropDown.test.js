import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CalendarDropDown from "./../../components/CalendarDropDown";

describe("CalendarDropDown component", () => {
  it("test_dropdown_opens_calendar", () => {
    const { getByText, getByTestId } = render(<CalendarDropDown />);
    // tests that the default value of the dropdown is 'Select Date'
    const dropdown = getByText("Select Date");
    fireEvent.press(dropdown);
    
    // Tests that clicking on the dropdown opens the calendar modal
    const calendar = getByTestId("calendar");
    expect(calendar).toBeTruthy();
  });

  // Tests that selecting a date on the calendar closes the modal and updates the selected date
  it("test_select_date_updates_dropdown", () => {
    const onSelectDate = jest.fn();
    const { getByText, getByLabelText } = render(
      <CalendarDropDown onSelectDate={onSelectDate} />
    );
    const dropdown = getByText("Select Date");
    fireEvent.press(dropdown);
    const day = getByLabelText(" Sunday 30 July 2023 ");  // note that min date = current date, so need to ensure date can be selected
    fireEvent.press(day);
    expect(onSelectDate).toHaveBeenCalledWith("2023-07-30");
    const updatedDropdown = getByText("2023-07-30");
    expect(updatedDropdown.props.children).toBe("2023-07-30");
  });

  // Tests that if no date is selected, the dropdown displays 'Select Date'
  it("test_dropdown_displays_select_date", () => {
    const { getByText } = render(<CalendarDropDown />);
    const dropdown = getByText("Select Date");
    expect(dropdown.props.children).toBe("Select Date");
  });


  // Tests that selecting an invalid date does not update the selected date
  it("test_selecting_invalid_date_does_not_update", () => {
    const onSelectDate = jest.fn();
    const { getByText, getByLabelText } = render(
      <CalendarDropDown onSelectDate={onSelectDate} />
    );
    const dropdown = getByText("Select Date");
    fireEvent.press(dropdown);
    const day = getByLabelText(" Monday 10 July 2023 ");  // should not be able to click on this date
    fireEvent.press(day);
    expect(onSelectDate).not.toHaveBeenCalled();
  });
});
