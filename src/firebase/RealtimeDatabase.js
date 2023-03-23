import { realtimeDB } from "./firebaseConfig";
import { ref, set, onValue, get, child } from "firebase/database";

let objSent = {
    role: 'user',
    contentChat: 'Xin Chào!'
};

let newChatIndex = 0;

// write chat into database
export async function writeUserChatData(userId, messageItem, newChatIndex) {
    await set(ref(realtimeDB, 'userChat/' + `${userId}/` + newChatIndex), messageItem)
        .then(() => {
            console.log('writeUserChatData success');
        });
}

// read user chat from database
// return chat array
// export async function readUserChatData(userId) {
//     let messageList = [];
//     await onValue(ref(realtimeDB, 'userChat/' + `${userId}`), (snapshot) => {
//         // If exist data
//         if (snapshot.size != 0) {
//             newChatIndex = snapshot.val().length;
//             console.log('newChatIndex', newChatIndex);
//             console.log('snap', snapshot);
//             console.log('snapshot.val()', snapshot.val());
//             messageList = snapshot.val();
//         }
//         else {
//             console.log('userId không tồn tại!');
//         }
//     });

//     return messageList;
// }

// read user chat from database
// return chat array
export async function readListUserChat() {
    let listUserChat = {};
    const dbRef = ref(realtimeDB);
    await get(child(dbRef, `userChat`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log('snap', snapshot);
            console.log('snapshot.val()', snapshot.val());
            listUserChat = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((e) => {
        console.log('error in readListUserChat:', e);
    });
    return listUserChat;
}