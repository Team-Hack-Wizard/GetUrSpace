import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import AdminFacItem from "./../../components/AdminFacItem";

describe("AdminFacItem component", () => {
  // Tests that the AdminFacItem component renders without crashing
  it("test_render_without_crashing", () => {
    render(<AdminFacItem />);
  });
  // Tests that pressing the TouchableOpacity navigates to book facility screen with correct props
  it("test_navigate_to_facility_info", () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const facilityId = "123";
    const facilityName = "Gym";
    const groupId = "456";
    const groupName = "NUS";
    const number = 5;
    const { getByText } = render(
      <AdminFacItem
        navigation={navigation}
        facilityId={facilityId}
        facilityName={facilityName}
        groupId={groupId}
        groupName={groupName}
        number={number}
      />
    );
    // this should be able to confirm that the button has text Gym
    fireEvent.press(getByText("Gym"));
    // tests the navigation to book facility screen with correct props
    // when button pressed
    expect(navigation.navigate).toHaveBeenCalledWith("Book Facility", {
      facilityId: facilityId,
      facilityName: facilityName,
      groupId: groupId,
      groupName: groupName,
      number: number,
    });
  });
  // Tests that it handles null or undefined navigation prop
  it("test_navigate_to_facility_info", () => {
    const facilityId = "123";
    const facilityName = "Gym";
    const groupId = "456";
    const groupName = "NUS";
    const number = 5;
    const { getByText } = render(
      <AdminFacItem
        facilityId={facilityId}
        facilityName={facilityName}
        groupId={groupId}
        groupName={groupName}
        number={number}
      />
    );
    expect(getByText("Gym")).toBeTruthy();
  });
});
