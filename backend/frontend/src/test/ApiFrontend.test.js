import React from "react";
import ApiFrontend from "../components/ApiFrontend";
import renderer from "react-test-renderer";


// below code performs a snapshot test. 

// to run this test start the app

test('renders correctly', () => {
    const tree = renderer
    .create(<ApiFrontend/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
    });

// below code tests our fetch api

// to run this test start the app 

test("Testing fetch", async () => {
  const response = await fetch(
    `https://itunes.apple.com/search?artistName=alphaville&term=forever%20Young&entity=song&limit=6`
  );
  const result = await response.json();
  // we "expect" the result not to be "null" or nothing.
  // if the result is "null" the tests fails, else the test passes.
  expect(result).not.toBe();
});
