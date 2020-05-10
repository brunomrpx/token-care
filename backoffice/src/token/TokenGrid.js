import React, { Component } from 'react';
import { Types } from './Token';

class TokenGrid extends Component {

  static defaultProps = {
    onFinish: () => { },
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

  getEmptyListRow({ colSpan } = { colSpan: 3 }) {
    return (
      <tr>
        <td colSpan={colSpan} style={{ textAlign: 'center' }}>Empty list</td>
      </tr>
    );
  }

  getSelectedGrid(tokens) {
    const renderRows = () => tokens.map(token => (
      <tr key={token._id}>
        <td>{token._id}</td>
        <td>{token.createDate}</td>
        <td>
          <button className="btn btn-warning" onClick={() => this.props.onFinish(token)}>Finish</button>
        </td>
      </tr>
    ));

    return (
      <table className="table table-striped table-borderless" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 ? renderRows() : this.getEmptyListRow({ colSpan: 3 })}
        </tbody>
      </table>
    );
  }

  getQueueGrid(tokens) {
    const renderRows = () => tokens.map(token => (
      <tr key={token._id}>
        <td>{token._id}</td>
        <td>{token.createDate}</td>
      </tr>
    ));

    return (
      <table className="table table-striped table-borderless" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 ? renderRows() : this.getEmptyListRow({ colSpan: 2 })}
        </tbody>
      </table>
    );
  }

  getFinishedGrid(tokens) {
    const renderRows = () => tokens.map(token => (
      <tr key={token._id}>
        <td>{token._id}</td>
        <td>{token.createDate}</td>
        <td>{token.finishDate}</td>
        <td>
          <button className="btn btn-danger" onClick={() => this.props.onDelete(token)}>Delete</button>
        </td>
      </tr>
    ));

    return (
      <table className="table table-striped table-borderless" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Created Date</th>
            <th>Finished Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens.length > 0 ? renderRows() : this.getEmptyListRow({ colSpan: 4 })}
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
