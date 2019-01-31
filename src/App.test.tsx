import React from "react";
import App from "./App";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  const component = mount(<App />);
  expect(component.text()).toBe("Hello");
});
