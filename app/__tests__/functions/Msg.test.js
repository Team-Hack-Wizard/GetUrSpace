import { Msg } from "../../functions";
import { Alert } from "react-native";

// currently Function coverage is 1/3 (33.33%)
describe("gives an alert with the correct title, message, onOk and onCancel", () => {
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it("alert with correct title and message", () => {
    const spy = jest.spyOn(Alert, "alert");
    Msg("Test Title", "Test Message");
    expect(spy).toHaveBeenCalledWith(
      "Test Title",
      "Test Message",
      expect.anything(),
      expect.anything()
    );
  });
  // Tests that the function is called with valid arguments
  it("test_valid_arguments", () => {
    expect(() =>
      Msg(
        "title",
        "msg",
        () => {},
        () => {}
      )
    ).not.toThrow();
  });

  // Tests that onOk is a function
  it("test_on_ok_function", () => {
    expect(() => Msg("title", "msg", "not a function", () => {})).toThrow(
      "onOk must be a function"
    );
  });
  // Tests that onCancel is a function
  it("test_on_cancel_function", () => {
    expect(() => Msg("title", "msg", () => {}, "not a function")).toThrow(
      "onCancel must be a function"
    );
  });
  // Tests that onOk is optional
  it("test_on_ok_optional", () => {
    expect(() => Msg("title", "msg", undefined, () => {})).not.toThrow();
  });
  it("alert with correct onOk", () => {
    const spy = jest.spyOn(Alert, "alert");
    const mockOnOk = jest.fn();
    Msg("", "", mockOnOk, () => {});
    spy.mock.calls[0][2][1].onPress();
    expect(mockOnOk).toHaveBeenCalled();
  });

  it("alert with correct onCancel", () => {
    const spy = jest.spyOn(Alert, "alert");
    const mockOnCancel = jest.fn();
    Msg("", "", () => {}, mockOnCancel);
    spy.mock.calls[0][2][0].onPress();
    expect(mockOnCancel).toHaveBeenCalled();
  });
  // Tests that the function works correctly when called without a title parameter
  it("test_missing_title_parameter", () => {
    const spyAlert = jest.spyOn(Alert, "alert");
    Msg(
      undefined,
      "Message",
      () => {},
      () => {}
    );
    expect(spyAlert).toHaveBeenCalledWith(
      undefined,
      "Message",
      [
        {
          text: "Cancel",
          onPress: expect.any(Function),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: expect.any(Function),
        },
      ],
      { cancelable: false }
    );
  });
  // Tests that the function works correctly when called without a message parameter
  it("test_missing_message_parameter", () => {
    const spyAlert = jest.spyOn(Alert, "alert");
    Msg(
      "Title",
      undefined,
      () => {},
      () => {}
    );
    expect(spyAlert).toHaveBeenCalledWith(
      "Title",
      undefined,
      [
        {
          text: "Cancel",
          onPress: expect.any(Function),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: expect.any(Function),
        },
      ],
      { cancelable: false }
    );
  });
  // Tests that the function works correctly when called with both onOk and onCancel parameters as null
  it("test_null_onok_and_oncancel_parameters", () => {
    const spyAlert = jest.spyOn(Alert, "alert");
    Msg("Title", "Message", null, null);
    expect(spyAlert).toHaveBeenCalledWith(
      "Title",
      "Message",
      [
        {
          text: "Cancel",
          onPress: expect.any(Function),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: expect.any(Function),
        },
      ],
      { cancelable: false }
    );
  });
});
