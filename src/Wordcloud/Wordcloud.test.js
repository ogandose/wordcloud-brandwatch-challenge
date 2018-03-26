import React from 'react';
import ReactDOM from 'react-dom';
import topicsData from '../topics.json';
import { Wordcloud, checkBoxIntersection } from './Wordcloud';
import ReactTestUtils from 'react-dom/test-utils';

test('display topics in correct color and size', () => {
    const topics = topicsData.topics;
    const div = document.createElement('div');
    const wordcloud = ReactDOM.render(<Wordcloud topics={topics} textSizes={[8, 15, 20, 25, 30, 50]} />, div);

    const checkText = (text, className, size) => {
        const berlin = ReactTestUtils.scryRenderedDOMComponentsWithTag(wordcloud, 'text').find(e => e.innerHTML === text);

        expect(berlin.className).toContain(className);
        //largest text size
        expect(berlin.getAttribute('font-size')).toBe(String(size));
    }

    checkText('Berlin', 'Wordcloud-positiveSentiment', 50);
    checkText('dance music', 'Wordcloud-neutralSentiment', 8);

});

test('when clicking on topic show information on this topic', () => {
    const mockCallback = jest.fn();
    const topics = topicsData.topics;
    const div = document.createElement('div');
    const wordcloud = ReactDOM.render(<Wordcloud topics={topics} onElementClicked={mockCallback} />, div);

    const element = ReactTestUtils.scryRenderedDOMComponentsWithTag(wordcloud, 'text')[10];
    ReactTestUtils.Simulate.click(element);

    expect(mockCallback.mock.calls.length).toBe(1);
    // check if event fired with correct index (10)
    expect(mockCallback.mock.calls[0][0]).toBe(10);
});

test('chechBBoxIntersection', () => {
    const box1 = { x: 10, y: 20, width: 10, height: 10 };
    const box2 = { x: 50, y: 50, width: 10, height: 10 };
    const box3 = { x: 20, y: 20, width: 10, height: 10 };

    expect(checkBoxIntersection(box1, box1)).toBe(true);

    expect(checkBoxIntersection(box1, box2)).toBe(false);

    expect(checkBoxIntersection(box1, box3)).toBe(true);
});
