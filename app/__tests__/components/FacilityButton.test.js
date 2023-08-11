import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import FacilityButton from "../../components/FacilityButton";

describe("FacilityButton component", () => {
  // Tests that FacilityButton component renders a button with facility name and icon
  it("test_render_facility_button", () => {
    const { getByText } = render(
      <FacilityButton facilityId={1} facilityName="Test Facility" />
    );
    expect(getByText("Test Facility")).toBeTruthy();
  });

  // Tests that FacilityButton component expands to show bookings when button is clicked
  it("test_expand_facility_button", async () => {
    const { getByText, queryByText } = render(
      <FacilityButton
        facilityId={1}
        facilityName="Test Facility"
        searchQuery={""}
      />
    );

    fireEvent.press(screen.getByText("Test Facility"));
    //expect(await waitFor(() => getByText("Date:"))).toBeTruthy();
    const booking = await waitFor(() => screen.getByText("Date: 2023-7-20"));
    expect(booking).toBeInTheDocument();
  });

  // Tests that FacilityButton component filters out past bookings
  it("test_filter_past_bookings", () => {
    const { queryByText } = render(
      <FacilityButton facilityId={1} facilityName="Test Facility" />
    );
    expect(queryByText("Venue:")).toBeFalsy();
  });

  //   // Tests that FacilityButton component cancels a booking and updates state and database
  //   it('test_cancel_booking', async () => {
  //       const onCancel = jest.fn();
  //       const { getByText } = render(<FacilityButton facilityId={1} facilityName='Test Facility' />);
  //       fireEvent.press(getByText('Test Facility'));
  //       const bookingItem = getByText('Test Facility').parent.parent.children[1].children[0];
  //       await fireEvent.press(bookingItem.children[1]);
  //       expect(onCancel).toHaveBeenCalled();
  //   });
  //   // Tests that FacilityButton component handles no bookings for the facility
  //   it('test_no_bookings', () => {
  //       const { queryByText } = render(<FacilityButton facilityId={2} facilityName='Test Facility' />);
  //       expect(queryByText('Venue:')).toBeFalsy();
  //   });
  //   // Tests that FacilityButton component handles facility that does not exist in database
  //   it('test_facility_not_exist', () => {
  //       const { queryByText } = render(<FacilityButton facilityId={-1} facilityName='Test Facility' />);
  //       expect(queryByText('Venue:')).toBeFalsy();
  //   });
});
