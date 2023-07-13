import React from 'react';
import renderer from 'react-test-renderer';
//import Intro from './Intro';
import Title from './components/Title';

test('renders correctly', () => {
  const tree = renderer.create(<Title data={"Test Title"} />).toJSON();
  expect(tree).toMatchSnapshot();
});