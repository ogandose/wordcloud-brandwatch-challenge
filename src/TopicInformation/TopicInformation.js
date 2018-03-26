import React from 'react';
import './TopicInformation.css';
import PropTypes from 'prop-types';

/**
 * TopicInformation component displays information on selected topic in wordcloud,
 * including the total mentions, positive mentions, neutral mentions, and negative mentions.
 */
export default class TopicInformation extends React.Component {

    static propTypes = {
        /** topic on which information is displayed */
        topic: PropTypes.object,
    }

    render() {

        if (!this.props.topic) {
            return (
                <div>No topic selected.</div>
            );
        }

        return (
            <div className="TopicInformation-topicInfo">
                <h2>Information on topic: {this.props.topic.label}</h2><br />
                <h2>Total Mentions: {this.props.topic.volume}</h2><br />
                <h2>Positive Mentions: <span className="TopicInformation-positive">{this.props.topic.sentiment.positive}</span></h2>
                <h2>Neutral Mentions: <span className="TopicInformation-neutral">{this.props.topic.sentiment.neutral}</span></h2>
                <h2>Negative Mentions: <span className="TopicInformation-negative">{this.props.topic.sentiment.negative}</span></h2>
            </div>
        );
    }
}
