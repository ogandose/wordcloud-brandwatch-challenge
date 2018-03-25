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
              textSizes={[10, 20, 30, 40, 50, 60]}
              textSizeCategories={[5, 20, 40, 100, 150, 200]}
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
