import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FacilityItem from "./../../components/FacilityItem";

describe("FacilityItem component", () => {
  // Tests that the FacilityItem component renders without crashing
  it("test_render_without_crashing", () => {
    render(<FacilityItem />);
  });
  // Tests that pressing the TouchableOpacity navigates to Facility Info screen with correct props
  it("test_navigate_to_facility_info", () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const facilityId = "123";
    const facilityName = "Gym";
    const groupId = "456";
    const groupName = "NUS";
    const booking = {
      userId: "123456",
      userEmail: "tester@gmail.com",
      facilityId: "",
      facilityName: "",
      groupId: "",
      groupName: "",
      date: "2023-07-20",
      time: "",
      facilityNumber: 0,
    };
    const { getByText } = render(
      <FacilityItem
        navigation={navigation}
        facilityId={facilityId}
        facilityName={facilityName}
        groupId={groupId}
        groupName={groupName}
        booking={booking}
      />
    );
    // this should be able to confirm that the button has text Gym
    fireEvent.press(getByText("Gym"));
    // tests the navigation to Facility Info screen with correct props
    // when button pressed
    expect(navigation.navigate).toHaveBeenCalledWith("Facility Info", {
      ...booking,
      facilityId: facilityId,
      facilityName: facilityName,
      groupId: groupId,
      groupName: groupName,
    });
  });

  // Tests that FacilityItem component handles null or undefined navigation prop
  it("test_null_undefined_navigation", () => {
    const facilityId = "123";
    const facilityName = "Gym";
    const groupId = "456";
    const groupName = "Group 1";
    const booking = {
      date: "2022-01-01",
      time: "10:00",
      duration: 2,
      purpose: "Basketball game",
    };
    const { getByText } = render(
      <FacilityItem
        facilityId={facilityId}
        facilityName={facilityName}
        groupId={groupId}
        groupName={groupName}
        booking={booking}
      />
    );
    expect(getByText("Gym")).toBeTruthy();
  });
});
