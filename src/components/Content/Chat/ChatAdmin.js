import React from "react";
import Modal from "react-modal";
import MessageItem from "./MessageItem";

import './chat.css';

class ChatAdmin extends React.Component {
    render() {
        const { messageListAdmin } = this.props;
        return (
            <>
                {
                    messageListAdmin && messageListAdmin.length ?
                        (
                            messageListAdmin.map((item, index) => {
                                return (
                                    <div className="chat-row" key={index}>
                                        <MessageItem messageItem={item}></MessageItem>
                                    </div>

                                );
                            })
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

export default ChatAdmin;