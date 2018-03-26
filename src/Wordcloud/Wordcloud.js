import React from 'react';
import './Wordcloud.css';
import PropTypes from 'prop-types';

/**
 * Check wheter the two rects intersect
 * @param {SVGRect} rect1 
 * @param {SVGRect} rect2 
 */
export function checkBoxIntersection(rect1, rect2) {
    return !(rect2.x > rect1.x + rect1.width ||
        rect2.x + rect2.width < rect1.x ||
        rect2.y > rect1.y + rect1.height ||
        rect2.y + rect2.height < rect1.y);
}

/** step size for placement algorithm */
const spiralTimeStepSize = 0.05;

/**
 * Definition of topic object
 * @typedef {Object} Topic
 * @property {string} label - topic which is displayed in word cloud.
 * @property {number} volume - Indicates popularity of topic (number of mentions).
 * @property {number} sentimentScore - sentiment score of topic.
 * @property {Sentiment} sentiment - number of positive, neutral, and negative sentiments
 */

/**
* Definition of topic object
* @typedef {Object} Sentiment
* @property {number} negative - number of negative mentions of topic
* @property {number} neutral - number of neutral mentions of topic
* @property {number} positive - number of positive mentions of topic
*/



/**
 * Wordcloud component which displays topics in wordcloud layout.
 */
export class Wordcloud extends React.Component {

    static propTypes = {
        /** all topics with bigger sentiment score than positiveSentimentBound are green */
        positiveSentimentBound: PropTypes.number,
        /** all topics with smaller sentiment score than negativeSentimentBound are green */
        negativeSentimentBound: PropTypes.number,
        /** categories of sizes for topics in wordcloud*/
        textSizeCategories: PropTypes.arrayOf(PropTypes.number),
        /** text sizes of topics in wordcloud*/
        textSizes: PropTypes.arrayOf(PropTypes.number),
        /** list of topics displayed in wordcloud, see type definition of Topic */
        topics: PropTypes.array,
        /** function which is called when clicking on topic*/
        onElementClicked: PropTypes.func
    }

    static defaultProps = {
        positiveSentimentBound: 60,
        negativeSentimentBound: 40,
        textSizeCategories: [5, 10, 15, 20, 100, 200],
        textSizes: [8, 15, 20, 25, 30, 50],
        topics: [],
        onElementClicked: () => { }
    };

    /** @type {SVGTextElement[]} */
    textElements = [];

    constructor(props) {
        super(props);
        this.state = { positions: {} };
    }

    /** @returns {Topic[]} */
    getTopics() {
        return this.props.topics;
    }

    /** handles click on topic */
    handleClick(index) {
        this.props.onElementClicked(index);
    };

    /** word placement algorithm according to https://users.soe.ucsc.edu/~pang/261/f15/misc/wordle.pdf */
    placeWords() {
        const boundingBoxes = this.textElements.map(e => {
            const box = this.getBBox(e);
            // copy as bounding box is read only on Microsoft Edge
            return { x: box, y: box.y, width: box.width, height: box.height }
        });

        const positions = boundingBoxes.map((element, index) => {
            const preceedingElements = boundingBoxes.slice(0, index);

            let t = 0;
            do {
                const spiralPosition = this.spiral(t);
                element.x = spiralPosition[0] - element.width / 2;
                element.y = spiralPosition[1] - element.height / 2;
                t += spiralTimeStepSize;
            }
            // as long as text element collides with other element
            while (!preceedingElements.every(precedingElement => !checkBoxIntersection(precedingElement, element)));

            // position is middle, bounding box coordiantes are upper left
            return [element.x, element.y + element.height / 2];
        });

        this.setState({ positions });
    }

    componentDidMount() {
        this.placeWords();
    }

    componentDidUpdate() {
        if (!this.state.bBox) {
            // get bounding box around text elements one time after placement
            const bBox = this.getBBox(this.refs.wrapper);
            this.setState({ bBox });
        }
    }

    /** equation to place words in archimedean spiral */
    spiral(t) {
        return [t * Math.cos(t), t * Math.sin(t)];
    }

    /**
     * get word color according to sentiment score
     * @param i index of clicked topic
     */
    getWordColor(i) {
        const sentimentScore = this.getTopics()[i].sentimentScore;

        if (sentimentScore > this.props.positiveSentimentBound) {
            return 'Wordcloud-positiveSentiment';
        } else if (sentimentScore < this.props.negativeSentimentBound) {
            return 'Wordcloud-negativeSentiment';
        } else {
            return 'Wordcloud-neutralSentiment';
        }
    }

    /**
     * get text size according to size category
     * @param i index of topic
    */
    getTextSize(i) {
        const topicImportance = this.getTopics()[i].volume;

        const categoryIndex = this.props.textSizeCategories.findIndex(element => element > topicImportance);

        return this.props.textSizes[categoryIndex];
    }

    render() {
        const words = this.getTopics().map(data => data.label);

        return (
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                viewBox={this.state.bBox && `${this.state.bBox.x} ${this.state.bBox.y} ${this.state.bBox.width} ${this.state.bBox.height}`}
                ref={(svg) => this.container = svg}>
                <g ref="wrapper">
                    {words.map((word, i) =>
                        <text
                            className={'Wordcloud-text ' + this.getWordColor(i)}
                            key={i}
                            ref={text => this.textElements[i] = text}
                            x={this.state.positions[i] && this.state.positions[i][0]}
                            y={this.state.positions[i] && this.state.positions[i][1]}
                            dominantBaseline="middle"
                            fontSize={this.getTextSize(i)} onClick={() => this.handleClick(i)}>

                            {word}
                        </text>
                    )}
                </g>
            </svg>
        );
    }

    /** wrapper to enable tests as getBBox is not available on jsdom */
    getBBox(element) {
        return (element.getBBox && element.getBBox()) || { x: 0, y: 0, width: 50, height: 5 };
    }
}



