import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

//dynamic rendering of icons depending on which facility is being booked
const renderIcon = (facilityName) => {
  switch (facilityName) {
    case "MPH":
      return <Ionicons name="basketball-sharp" size={30} color="black" />;
    case "MPSH":
      return <Ionicons name="basketball-sharp" size={30} color="black" />;
    case "Meeting Room":
      return <MaterialIcons name="meeting-room" size={30} color="black" />;
    case "Study Room":
      return <FontAwesome5 name="door-closed" size={24} color="black" />;
    case "Gym":
      return <FontAwesome5 name="dumbbell" size={24} color="black" />;
    case "BBQ Pit":
      return <MaterialIcons name="outdoor-grill" size={24} color="black" />;
    case "Function Room":
      return (
        <MaterialCommunityIcons name="table-chair" size={24} color="black" />
      );
    default:
      return null;
  }
};

export default renderIcon;