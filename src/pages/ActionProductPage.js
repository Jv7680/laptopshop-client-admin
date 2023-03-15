import React, { Component } from 'react'
import ActionProduct from '../components/Content/Product/ActionProduct'

export default class ActionProductPage extends Component {
  render() {
    const { match, history } = this.props;
    let id;
    console.log('match là:', match);
    console.log('history là:', history);
    if (match) {
      id = match.params.id;
      console.log('id là: ', id);
    }
    return (
      <ActionProduct id={id} ></ActionProduct>
    )
  }
}
