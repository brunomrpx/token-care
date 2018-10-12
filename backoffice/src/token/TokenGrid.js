import React, { Component } from 'react';
import { Types } from './Token';

class TokenGrid extends Component {

  static defaultProps = {
    onFinish: () => {},
    type: Types.Selected,
    tokens: []
  }; 

  constructor(props) {
    super(props);

    this.renderFunctions = {
      [Types.Queue]: this.getQueueGrid,
      [Types.Selected]: this.getSelectedGrid,
      [Types.Finished]: this.getFinishedGrid
    };
  }

  getSelectedGrid(tokens) {
    return (
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(token => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.createDate}</td>
              <td>
                <button className="button is-warning" onClick={() => this.props.onFinish(token)}>Finish</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  getQueueGrid(tokens) {
    return (
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(token => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.createDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  getFinishedGrid(tokens) {
    return (
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Created Date</th>
            <th>Finished Date</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map(token => (
            <tr key={token.id}>
              <td>{token.id}</td>
              <td>{token.createDate}</td>
              <td>{token.finishDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  render() {
    const renderFunctionForType = this.renderFunctions[this.props.type].bind(this);

    return renderFunctionForType(this.props.tokens);
  }
}

export default TokenGrid;
