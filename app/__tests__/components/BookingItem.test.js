import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import BookingItem from "../../components/BookingItem";
import { Alert } from "react-native";

describe("BookingItem component", () => {
  // Tests that the booking item is rendered with all props
  it("test_render_booking_item_with_all_props", () => {
    const { getByText } = render(
      <BookingItem
        id={1}
        facility="MPH"
        facilityId={1}
        facilityNumber={1}
        venue="Venue 1"
        date="2022-01-01"
        time={9}
        userEmail="user@example.com"
        onCancel={() => {}}
      />
    );
    expect(getByText("MPH")).toBeTruthy();
    expect(getByText("Venue: Venue 1")).toBeTruthy();
    expect(getByText("Facility Number: 1")).toBeTruthy();
    expect(getByText("Date: 2022-01-01")).toBeTruthy();
    expect(getByText("Time: 09:00")).toBeTruthy();
    expect(getByText("User Email: user@example.com")).toBeTruthy();
  });

  // Tests that the booking item is rendered without some props
  it("test_render_booking_item_without_on_cancel_prop", () => {
    const { getByText, queryByText } = render(
      <BookingItem
        id={1}
        facilityId={1}
        facilityNumber={1}
        date="2022-01-01"
        time={10}
      />
    );
    expect(queryByText("MPH")).toBeNull();
    expect(queryByText("Venue")).toBeNull();
    expect(getByText("Facility Number: 1")).toBeTruthy();
    expect(getByText("Date: 2022-01-01")).toBeTruthy();
    expect(getByText("Time: 10:00")).toBeTruthy();
    expect(queryByText("User Email:")).toBeNull();
    expect(queryByText("Cancel")).toBeNull();
  });

  // Tests that the cancel button works and confirms cancellation
  it("presses cancel button and confirms cancellation", () => {
    const mockOnCancel = jest.fn();
    const spy = jest.spyOn(Alert, "alert");
    //const spy = jest.spyOn(Msg, "Msg");
    const { getByText } = render(
      <BookingItem
        id="123"
        facility="MPH"
        facilityId="123"
        facilityNumber="1"
        venue="Venue 1"
        date="2022-07-20"
        time={10}
        userEmail="user@example.com"
        onCancel={mockOnCancel}
      />
    );
    fireEvent.press(getByText("Cancel"));
    spy.mock.calls[0][2][1].onPress();
    expect(mockOnCancel).toHaveBeenCalledWith(
      "123",
      "123",
      "1",
      "2022-07-20",
      10
    );
  });
});
