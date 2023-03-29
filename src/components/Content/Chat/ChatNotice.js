import React from "react";
import Modal from "react-modal";
import MessageItem from "./MessageItem";

import './chat.css';

class ChatNotice extends React.Component {
    render() {
        const { isShow } = this.props;
        return (
            <>
                {
                    isShow ?
                        (
                            <span className="left-col__chat-name-notice"></span>
                        )
                        :
                        (
                            null
                        )
                }
            </>
        );
    }
}

export default ChatNotice;