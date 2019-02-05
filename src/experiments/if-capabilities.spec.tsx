import React from "react";
import { IfCapabilities, query } from "./if-capabilities";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MockedProvider } from "react-apollo/test-utils";
configure({ adapter: new Adapter() });

const tick = async () => new Promise(r => setTimeout(r));

describe.only("if-capability component", () => {
  it("hides children if not capable", async () => {
    const mocks = [
      { request: { query, result: { data: { capabilities: [] } } } }
    ];
    const component = mount(
      <MockedProvider mocks={mocks}>
        <IfCapabilities includes={["a"]} />
      </MockedProvider>
    );

    throw new Error("foo");
    await tick();
    component.update();

    expect(component.find("IfCapabilities").text()).toBe(null);
  });

  it("shows children if capable", async () => {
    const mocks = [
      { request: { query }, result: { data: { capabilities: ["a"] } } }
    ];
    const component = mount(
      <MockedProvider mocks={mocks}>
        <IfCapabilities includes={["a"]}>ok</IfCapabilities>
      </MockedProvider>
    );

    await tick();
    component.update();

    expect(component.find("IfCapabilities").text()).toBe("ok");
  });

  it("dedupes requests", async () => {
    const mocks = [
      { request: { query }, result: { data: { capabilities: ["a"] } } }
    ];
    const component = mount(
      <MockedProvider mocks={mocks}>
        <div>
          <IfCapabilities includes={["a"]}>ok</IfCapabilities>
          <IfCapabilities includes={["a"]}>ok</IfCapabilities>
        </div>
      </MockedProvider>
    );

    await tick();
    component.update();

    expect(component.find("div").text()).toBe("okok");

    // no deduping should cause error
    const dupey = mount(
      <MockedProvider mocks={mocks}>
        <div>
          <IfCapabilities includes={["a"]} queryDeduplication={false}>
            ok
          </IfCapabilities>
          <IfCapabilities includes={["a"]} queryDeduplication={false}>
            ok
          </IfCapabilities>
        </div>
      </MockedProvider>
    );
  });
});
