import React, { Component } from 'react'
import PulseLoader from 'react-spinners/PulseLoader';

import './loading.css';

class Loading extends Component {
    render() {
        const { loadingCSS } = this.props;

        return (
            <div
                className='sweet-loading'
            // style={{ display: displayStyle }}
            >
                <PulseLoader
                    css={loadingCSS}
                    sizeUnit={"px"}
                    size={20}
                    color={'rgba(71, 74, 240, 0.8)'}
                    loading={true}
                />
            </div>
        )
    }
}

export default (Loading)
