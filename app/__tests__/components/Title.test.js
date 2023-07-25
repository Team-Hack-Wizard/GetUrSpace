import Title from "../../components/Title.js";
import React from "react";
import { render } from "@testing-library/react-native"; 

describe("Title component", () => {
  it("Title renders with the correct text", () => {
    const data = "Title";
    const { getByText } = render(<Title data={data} />);
    expect(getByText(data)).toBeTruthy();
  });
  // Tests that component renders with empty data prop
  it("test_render_with_empty_data_prop", () => {
    const { getByTestId } = render(<Title data="" />);
    const textElement = getByTestId("text");
    expect(textElement.props.children).toBe("");
  });
  // Tests that component renders with null data prop
  it("test_render_with_null_data_prop", () => {
    const { getByTestId } = render(<Title data={null} />);
    const textElement = getByTestId("text");
    expect(textElement.props.children).toBeNull();
  });
  // Tests that component renders with undefined data prop
  it("test_render_with_undefined_data_prop", () => {
    const { getByTestId } = render(<Title data={undefined} />);
    const textElement = getByTestId("text");
    expect(textElement.props.children).toBeUndefined();
  });
  // Tests that component renders with correct styles
  it("test_render_with_correct_styles", () => {
    const { getByTestId } = render(<Title data="Test Data" />);
    const boxElement = getByTestId("box");
    const textElement = getByTestId("text");
    expect(boxElement.props.style).toEqual({
      backgroundColor: "#094074",
      width: "95%",
      height: 40,
      marginVertical: 20,
      alignSelf: "center",
      justifyContent: "center",
    });
    expect(textElement.props.style).toEqual({
      color: "white",
      fontSize: 15,
      textAlign: "left",
      marginLeft: 20,
    });
    expect(textElement.props.children).toBe("Test Data");
  });
});
