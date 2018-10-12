import React, { Component } from 'react';
import TokenGrid from './TokenGrid';
import { Types } from './Token';

class TokenTabs extends Component {

  static defaultProps = {
    onFinish: () => {},
    structure: {
      selected: [],
      queue: [],
      finished: []
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: Types.Selected
    };
  }

  selectTab(tab) {
    this.setState({ activeTab: tab });
  }

  getContentMap() {
    const { queue, selected, finished } = this.props.structure;

    return new Map([
      [Types.Selected, { title: 'Selected', tokens: selected }],
      [Types.Queue, { title: 'Queue', tokens: queue }],
      [Types.Finished, { title: 'Finished', tokens: finished }],
    ]);
  }

  getTabItems(contentMap) {
    const tabItems = [];

    for (const [key, value] of contentMap.entries()) {
      tabItems.push(
        <li key={key} className={this.state.activeTab === key ? 'is-active' : ''} onClick={() => this.selectTab(key)}>
          <a>{value.title}</a>
        </li>
      );
    }

    return tabItems;
  }

  render() {
    const contentMap = this.getContentMap();
    const tabItems = this.getTabItems(contentMap);

    return (
      <div>
        <div className="tabs">
          <ul>{tabItems}</ul>
        </div>
        <TokenGrid type={this.state.activeTab} tokens={contentMap.get(this.state.activeTab).tokens} onFinish={(token) => this.props.onFinish(token)} />
      </div>
    );
  }
}

export default TokenTabs;
