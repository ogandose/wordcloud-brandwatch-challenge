import React from 'react';
import ReactDOM from 'react-dom';
import TopicInformation from './TopicInformation';
import ReactTestUtils from 'react-dom/test-utils';

test('display no information on no topic', () => {
    const div = document.createElement('div');
    const info = ReactDOM.render(<TopicInformation />, div);

    const element = ReactTestUtils.findRenderedDOMComponentWithTag(info, 'div');

    expect(element.innerHTML).toContain('No topic selected.');
});

test('display informations with topic object', () => {
    const topic = { label: 'foo', volume: 10, sentiment: { positive: 20, neutral: 3, negative: 1 } };

    const div = document.createElement('div');
    const info = ReactDOM.render(<TopicInformation topic={topic} />, div);

    expect(div.innerHTML).toContain(topic.label);
    expect(div.innerHTML).toContain(`Total Mentions: ${topic.volume}`);

    expect(ReactTestUtils.findRenderedDOMComponentWithClass(info, 'TopicInformation-positive').innerHTML)
        .toEqual(String(topic.sentiment.positive));

    expect(ReactTestUtils.findRenderedDOMComponentWithClass(info, 'TopicInformation-neutral').innerHTML)
        .toBe(String(topic.sentiment.neutral));

    expect(ReactTestUtils.findRenderedDOMComponentWithClass(info, 'TopicInformation-negative').innerHTML)
        .toBe(String(topic.sentiment.negative));
});