import React from "react";
import { renderIcon } from "../../functions";
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons, } from "@expo/vector-icons";

describe("render correct icon based on facilityName", () => {
  it("given MPH, return basketball icon", () => {
    expect(renderIcon("MPH")).toEqual(
      <Ionicons name="basketball-sharp" size={30} color="black" />
    );
  });
  it("given MPSH, return basketball icon", () => {
    expect(renderIcon("MPSH")).toEqual(
      <Ionicons name="basketball-sharp" size={30} color="black" />
    );
  });
  it("given Meeting Room, return meeting room icon", () => {
    expect(renderIcon("Meeting Room")).toEqual(
      <MaterialIcons name="meeting-room" size={30} color="black" />
    );
  });
  it("given Study Room, return door icon", () => {
    expect(renderIcon("Study Room")).toEqual(
      <FontAwesome5 name="door-closed" size={24} color="black" />
    );
  });
  it("given Gym, return dumbbell icon", () => {
    expect(renderIcon("Gym")).toEqual(
      <FontAwesome5 name="dumbbell" size={24} color="black" />
    );
  });
  it("given BBQ Pit, return grill icon", () => {
    expect(renderIcon("BBQ Pit")).toEqual(
      <MaterialIcons name="outdoor-grill" size={24} color="black" />
    );
  });
  it("given Function Room, return table icon", () => {
    expect(renderIcon("Function Room")).toEqual(
      <MaterialCommunityIcons name="table-chair" size={24} color="black" />
    );
  });
  it("given invalid facilityName, return null", () => {
    expect(renderIcon("Invalid")).toEqual(null);
  });
});
