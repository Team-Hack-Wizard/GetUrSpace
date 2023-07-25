import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NumberDropDown from "../../components/NumberDropDown";

describe("NumberDropDown component", () => {
  // Tests that dropdown displays 'Select Number' by default
  it("test_dropdown_displays_default", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={10} />
    );
    expect(getByText("Select Number")).toBeTruthy();
  });

  // Tests that dropdown displays selected number after selection
  it("test_dropdown_displays_selected_number", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={10} />
    );
    fireEvent.press(getByText("Select Number"));
    fireEvent.press(getByText("5"));
    expect(getByText("5")).toBeTruthy();
  });

  // Tests that modal opens when dropdown is pressed
  it("test_modal_opens_on_dropdown_press", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={10} />
    );
    fireEvent.press(getByText("Select Number"));
    expect(getByText("1")).toBeTruthy();
  });

  // Tests that modal displays options from 1 to maxNumber
  it("test_modal_displays_options", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={10} />
    );
    fireEvent.press(getByText("Select Number"));
    expect(getByText("10")).toBeTruthy();
  });

  // Tests that option press calls onSelectNumber
  it("test_option_press_sets_selected_number", () => {
    const onSelectNumber = jest.fn();
    const { getByText } = render(
      <NumberDropDown onSelectNumber={onSelectNumber} maxNumber={10} />
    );
    fireEvent.press(getByText("Select Number"));
    fireEvent.press(getByText("5"));
    expect(onSelectNumber).toHaveBeenCalledWith(5);
  });

  // Tests edge cases for maxNumber
  it("test_maxNumber_edge_cases", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={0} />
    );
    fireEvent.press(getByText("Select Number"));
    expect(() => getByText("1")).toThrow();
  });

  it("test_maxNumber_edge_cases", () => {
    const { getByText } = render(
      <NumberDropDown onSelectNumber={() => {}} maxNumber={100} />
    );
    fireEvent.press(getByText("Select Number"));
    expect(getByText("100")).toBeTruthy();
  });
});
