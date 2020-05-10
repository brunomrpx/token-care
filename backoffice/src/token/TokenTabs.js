import React, { Component } from 'react';
import TokenGrid from './TokenGrid';
import { Types } from './Token';

class TokenTabs extends Component {

  static defaultProps = {
    onFinish: () => { },
    onDelete: () => { },
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
      const activeClass = this.state.activeTab === key ? 'active' : '';

      tabItems.push(
        <li key={key} className="nav-item " onClick={() => this.selectTab(key)}>
          <a class={"nav-link " + activeClass} href="#">{value.title}</a>
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
        <ul className="nav nav-tabs mb-2">{tabItems}</ul>
        <TokenGrid
          type={this.state.activeTab}
          tokens={contentMap.get(this.state.activeTab).tokens}
          onFinish={(token) => this.props.onFinish(token)}
          onDelete={(token) => this.props.onDelete(token)} />
      </div>
    );
  }
}

export default TokenTabs;
