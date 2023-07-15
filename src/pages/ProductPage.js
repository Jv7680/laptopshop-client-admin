import React, { Component } from 'react'
import Product from '../components/Content/Product/Product'


export default class ProductPage extends Component {
  render() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return (
      <Product match={this.props.match} ></Product>
    )
  }
}
