import React from "react";
import Modal from "react-modal";
import axios from "axios";
import PulseLoader from 'react-spinners/PulseLoader';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { readListUserChat, writeUserChatData } from "../../../firebase/RealtimeDatabase";
import ChatAdmin from "./ChatAdmin";
import { Link } from 'react-router-dom'
import { NavLink } from "react-router-dom";
import './chat.css';
import { toast } from "react-toastify";
import { realtimeDB } from "../../../firebase/firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const cssPulseLoader = css`
    margin: auto;
    z-index: 9999;
    display: block;
`;

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "90vw",
        height: "80vh",
        maxHeight: "96vh",
        overflow: "auto",
    }
};

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatContent: '',
            messageListAdmin: [],
            listUserChat: {},
            showRightCol: false,
        };

        this.countDidUpdate = 0;
        this.currentUserId = 0;
    }

    componentDidMount = async () => {
        await this.getListUserChat();

        // trigger onValue here to listening value change
        onValue(ref(realtimeDB, 'userChat'), (snapshot) => {
            console.log('trigged onValue(), listening');
            console.log('snap', snapshot);
            console.log('snapshot.val()', snapshot.val());

            this.setState({ listUserChat: snapshot.val() }, () => {
                if (this.currentUserId != 0 && this.currentUserId) {
                    this.setState({
                        messageListAdmin: this.state.listUserChat[this.currentUserId]
                    });
                }
            });
        });
    }

    componentWillUnmount = () => {
        // unsubcribe listener onValue
        off(ref(realtimeDB, 'userChat'));
    }

    componentDidUpdate = () => {
        // add enter event to textarea
        if (this.countDidUpdate === 0 && this.state.showRightCol) {
            this.countDidUpdate = 1;
            let chatContentTextArea = document.getElementsByClassName("chat-content-textarea")[0];
            chatContentTextArea.addEventListener("keypress", (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    document.getElementsByClassName("fa-paper-plane")[0].click();
                }
            });
        }

        // scroll contet area xuống cuối cùng mỗi khi update
        let chatContentArea = document.getElementsByClassName('chat-content-area')[0];
        if (chatContentArea) {
            chatContentArea.scrollTo(0, chatContentArea.scrollHeight);
        }
    }

    getListUserChat = async () => {
        let listUserChat = await readListUserChat();
        console.log('listUserChat', listUserChat);
        this.setState({
            listUserChat
        });
    }



    formatChatContent = (stringRes) => {
        // console.log('stringRes1', stringRes);
        // cắt 2 \n\n đầu tiên
        if (stringRes[0] === '\n' && stringRes[1] === '\n') {
            stringRes = stringRes.slice(2);
        }
        // console.log('stringRes2', stringRes);
        // console.log('stringRes3', stringRes.replaceAll('\n', '<br/>'));
        return stringRes.replaceAll('\n', '<br/>');
    }

    handleChange = event => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({
            [name]: value
        });
    }

    handleOnInput = (event) => {
        if (event.target.scrollHeight >= 85) {
            return;
        }
        event.target.style.height = "";
        event.target.style.height = (event.target.scrollHeight) + "px";
    }

    onClickName = async (userId, event) => {
        let listChatName = document.getElementsByClassName('left-col-chat-name');
        for (let i = 0; i < listChatName.length; i++) {
            listChatName[i].classList.remove('left-col-chat-name--active')
            listChatName[i].childNodes[0].classList.remove('left-col-chat-name--active')
        }
        if (event.target.classList.contains('left-col-chat-name')) {
            // console.log(event);
            event.target.classList.add('left-col-chat-name--active');
        }
        else {
            event.target.classList.add('left-col-chat-name--active');
            event.target.parentNode.classList.add('left-col-chat-name--active');
        }
        // event.target.classList.add('left-col-chat-name--active');

        this.currentUserId = userId;
        await this.getListUserChat();
        let { listUserChat } = this.state;
        this.setState({
            showRightCol: true,
            chatContent: '',
            messageListAdmin: listUserChat[userId]
        });
    }

    handleSubmit = async () => {
        let { chatContent, listUserChat } = this.state;

        this.setState({
            chatContent: '',
        },
            () => {
                let textarea = document.getElementsByClassName('chat-content-textarea')[0];
                if (textarea.scrollHeight < 85) {
                    textarea.style.height = "";
                    textarea.style.height = (textarea.scrollHeight) + "px";
                }
            }
        );

        if (chatContent.length === 0) {
            toast.error('Bạn chưa nhập nội dung chat!');
            return;
        }
        let messageItem = {
            user: 'admin',
            content: this.formatChatContent(chatContent),
        };

        let handleChange = this.handleChange;
        let inputChatContentLoading = document.getElementsByClassName('input-chat-content-loading')[0];
        try {
            // khóa thanh input
            inputChatContentLoading.classList.add('input-chat-content-loading--show');
            this.handleChange = () => { };

            // write user chat into firebase database
            // messageListAdmin.push(messageItem);
            await writeUserChatData(this.currentUserId, messageItem, listUserChat[this.currentUserId].length);

            // get data again
            let listUserChatAgain = await readListUserChat();
            this.setState({
                messageListAdmin: listUserChatAgain[this.currentUserId]
            });
        }
        finally {
            // mở thanh input
            this.handleChange = handleChange;
            inputChatContentLoading.classList.remove('input-chat-content-loading--show');
        }
    }

    render() {
        const { listUserChat, chatContent, messageListAdmin } = this.state;
        return (
            <div className="content-inner" style={{ maxHeight: '100vh' }}>
                {/* Page Header*/}
                <header className="page-header">
                    <div className="container-fluid">
                        <h2 className="no-margin-bottom">Chat</h2>
                    </div>
                </header>
                {/* Breadcrumb*/}
                <div className="breadcrumb-holder container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item active">Chat</li>
                    </ul>
                </div>
                <section className="tables pt-3">
                    <div className="container-fluid">
                        <div className="row" style={{ height: '70vh' }}>
                            <div className="col-3 left-col">
                                {
                                    listUserChat && Object.keys(listUserChat).length != 0 ?
                                        (
                                            Object.keys(listUserChat).map(
                                                (item, index) => {
                                                    return (
                                                        <div key={item} className="left-col-chat-name" onClick={(event) => { this.onClickName(item, event) }}>
                                                            <span >
                                                                {listUserChat[item][0].userName}
                                                            </span>
                                                        </div>
                                                    )
                                                }
                                            )
                                        )
                                        :
                                        (
                                            null
                                        )
                                }
                            </div>

                            <div className="col-9 right-col">
                                {
                                    this.state.showRightCol ?
                                        (
                                            <>
                                                {/* row content chat */}
                                                <div className="chat-content-area">
                                                    <ChatAdmin messageListAdmin={messageListAdmin}></ChatAdmin>
                                                </div>

                                                {/* row sent chat */}
                                                <div className="chat-sent-area">
                                                    <div className="col-12 input-chat-content">
                                                        {/* <input type="text" placeholder="Nội dung" /> */}
                                                        <textarea
                                                            className="chat-content-textarea"
                                                            autoFocus={true}
                                                            name="chatContent"
                                                            placeholder="Nội dung"
                                                            rows="1"
                                                            value={chatContent}
                                                            onChange={(event) => { this.handleChange(event); this.handleOnInput(event); }}
                                                        >
                                                        </textarea>
                                                        <i className="fa-regular fa-paper-plane" onClick={() => { this.handleSubmit() }}></i>
                                                    </div>
                                                    <div className="col-12 input-chat-content-loading">
                                                        <PulseLoader
                                                            css={cssPulseLoader}
                                                            sizeUnit={"px"}
                                                            size={10}
                                                            color={'rgba(71, 74, 240, 0.8)'}
                                                            loading={true}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            <>Hãy chọn đối tượng chat</>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

// export default Chat;

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Chat);