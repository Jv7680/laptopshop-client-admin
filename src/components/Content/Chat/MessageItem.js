import React from "react";
import Modal from "react-modal";

import './chat.css';

class MessageItem extends React.Component {
    render() {
        const { messageItem } = this.props;
        return (
            <>
                {
                    // là admin thì tin nhắn nằm bên phải
                    messageItem.user === 'user' ?
                        (
                            <div className="chat-item-left">
                                <span dangerouslySetInnerHTML={{ __html: messageItem.content }}></span>
                            </div>
                        )
                        :
                        (
                            <>
                                <div className="chat-item-right">
                                    <span dangerouslySetInnerHTML={{ __html: messageItem.content }}></span>
                                </div>
                                <img className="chat-item-right-image" src={process.env.PUBLIC_URL + '/img/logo/logoPTCustomer1.png'} alt="not fount" />
                            </>
                        )
                }
            </>
        );
    }
}

export default MessageItem;