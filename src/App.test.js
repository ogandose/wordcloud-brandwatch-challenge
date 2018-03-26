import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactTestUtils from 'react-dom/test-utils';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('display topic information on click', () => {
  const div = document.createElement('div');
  const app = ReactDOM.render(<App />, div);
  const berlin = ReactTestUtils.scryRenderedDOMComponentsWithTag(app, 'text').find(e => e.innerHTML === 'Berlin');

  ReactTestUtils.Simulate.click(berlin);

  const topicInformation = ReactTestUtils.findRenderedDOMComponentWithClass(app, 'TopicInformation-topicInfo');

  expect(topicInformation.innerHTML).toContain('Berlin');
});
