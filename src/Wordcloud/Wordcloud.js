import React from 'react';
import './Wordcloud.css';
import PropTypes from 'prop-types';

/**
 * 
 * @param {SVGRect} box1 
 * @param {SVGRect} box2 
 */
export function chechBBoxIntersection(box1, box2) {
    return !(box2.x > box1.x + box1.width ||
        box2.x + box2.width < box1.x ||
        box2.y > box1.y + box1.height ||
        box2.y + box2.height < box1.y);
}

const spiralTimeStepSize = 0.05;


/**
 * Wordcloud component which displays topics in spiral based wordcloud layout.
 * Topics are displayed in six different sizes according to volume.
 * Topics with a sentiment score > 60 (default value) are displayed in green, 
 * topics with a sentiment score < 40 (default value) are dispalyed in red and other topics are displayed in grey.
 * By clicking on a topic additional information on the topic is displayed.
 * @author Sophie
 */
export class Wordcloud extends React.Component {

    static propTypes = {
        /**all topics with bigger sentiment score than positiveSentimentBound are green */
        positiveSentimentBound: PropTypes.number,
        /**all topics with smaller sentiment score than negativeSentimentBound are green */
        negativeSentimentBound: PropTypes.number,
        /**categories of sizes for topics in wordcloud*/
        textSizeCategories: PropTypes.arrayOf(PropTypes.number),
        /**text sizes of topics in wordcloud*/
        textSizes: PropTypes.arrayOf(PropTypes.number),
        /**topics data*/
        topics: PropTypes.array,
        /**function which is called when clicking on topic*/
        onElementClicked: PropTypes.func
    }

    static defaultProps = {
        positiveSentimentBound: 60,
        negativeSentimentBound: 40,
        textSizeCategories: [5, 20, 40, 100, 150, 200],
        textSizes: [10, 20, 30, 40, 50, 60],
        topics: [],
        onElementClicked: () => { }
    };


    /** @type {SVGTextElement[]} */
    textElements = [];

    /** @type {[number, number][]} */
    positions = [];


    /** 
     * bounding box surrounding text elements to automatically set viewbox
     * @type {SVGRect}
     */
    bBox;

    getTopics() {
        return this.props.topics;
    }

    handleClick(index) {
        this.props.onElementClicked(index);
    };

    placeWords() {
        const boundingBoxes = this.textElements.map(e => this.getBBox(e));

        this.positions = boundingBoxes.map((element, index) => {
            const preceedingElements = boundingBoxes.slice(0, index);

            let t = 0;
            do {
                const spiralPosition = this.spiral(t);
                element.x = spiralPosition[0] - element.width / 2;
                element.y = spiralPosition[1] - element.height / 2;
                t += spiralTimeStepSize;
            }
            //as long as text element collides with other element
            while (!preceedingElements.every(precedingElement => !chechBBoxIntersection(precedingElement, element)));

            // position is middle, bounding box coordiantes are upper left
            return [element.x, element.y + element.height / 2];
        });

        this.forceUpdate();
    }

    componentDidMount() {
        this.placeWords();
    }

    componentDidUpdate() {
        // 
        if (!this.bBox) {
            this.bBox = this.getBBox(this.refs.wrapper);
            this.forceUpdate();
        }
    }

    // equation to place words in archimedean spiral
    spiral(t) {
        return [t * Math.cos(t), t * Math.sin(t)];
    }

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

    getTextSize(i) {
        const topicImportance = this.getTopics()[i].volume;

        const categoryIndex = this.props.textSizeCategories.findIndex(element => element > topicImportance);

        return this.props.textSizes[categoryIndex];
    }


    render() {
        const words = this.getTopics().map(data => data.label);

        return (
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                viewBox={this.bBox && `${this.bBox.x} ${this.bBox.y} ${this.bBox.width} ${this.bBox.height}`}
                ref={(svg) => this.container = svg}>
                <g ref="wrapper">
                    {words.map((word, i) =>
                        <text
                            className={'Wordcloud-text ' + this.getWordColor(i)}
                            key={i}
                            ref={text => this.textElements[i] = text}
                            x={this.positions[i] && this.positions[i][0]}
                            y={this.positions[i] && this.positions[i][1]}
                            dominantBaseline="middle"
                            fontSize={this.getTextSize(i)} onClick={() => this.handleClick(i)}>

                            {word}
                        </text>
                    )}
                </g>
            </svg>
        );
    }

    /** wrapper to enable tests with jsdom */
    getBBox(element) {
        return (element.getBBox && element.getBBox()) || { x: 0, y: 0, width: 50, height: 5 };
    }
}



