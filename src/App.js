import React, { Component } from 'react';
import './App.css';
import topicsData from './topics.json';
import { Wordcloud } from './Wordcloud/Wordcloud';
import TopicInformation from './TopicInformation/TopicInformation';

class App extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>My Topics Challenge</h1>
        <div className="App-column">
          <div className="App-left">
            <Wordcloud
              textSizes={[8, 15, 20, 25, 30, 50]}
              textSizeCategories={[5, 10, 15, 20, 100, 200]}
              positiveSentimentBound={60}
              negativeSentimentBound={40}
              topics={topicsData.topics}
              onElementClicked={(i) => this.setState({ selectedTopic: topicsData.topics[i] })}
            />
          </div>
          <div className="App-right">
            <TopicInformation topic={this.state.selectedTopic} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
