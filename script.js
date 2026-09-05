/* =========================
   REAL TIME CHAT
========================= */

let chatUnsubscribe = null;

const ADMIN_UID = "oNSKRlCO5SeQ4gXtyyNB7CDK7dx1";


/* =========================
   CREATE SAME CHAT ID
========================= */

function getChatId(userId) {
    return [ADMIN_UID, userId].sort().join("_");
}


/* =========================
   OPEN USER CHAT
========================= */

window.openChat = function () {

    const user = auth.currentUser;

    if (!user) {
        showLogin();
        return;
    }

    loadChat(user.uid);
};


/* =========================
   LOAD USER CHAT
========================= */

function loadChat(userId) {

    const messagesBox =
        document.getElementById("chatMessages");

    if (!messagesBox) return;

    if (chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
    }

    const chatId = getChatId(userId);

    const messagesRef = collection(
        db,
        "chats",
        chatId,
        "messages"
    );

    chatUnsubscribe = onSnapshot(
        messagesRef,
        (snapshot) => {

            messagesBox.innerHTML = "";

            const messages = [];

            snapshot.forEach((messageDoc) => {

                messages.push({
                    id: messageDoc.id,
                    ...messageDoc.data()
                });

            });

            /* Sort by createdAt */
            messages.sort((a, b) => {

                const timeA =
                    a.createdAt?.seconds || 0;

                const timeB =
                    b.createdAt?.seconds || 0;

                return timeA - timeB;
            });


            if (messages.length === 0) {

                messagesBox.innerHTML =
                    `<p class="chat-empty">
                        Start chatting with T5X LDKN Admin 👋
                    </p>`;

                return;
            }


            messages.forEach((data) => {

                const div =
                    document.createElement("div");

                div.className =
                    "chat-message " +
                    (
                        data.senderId === userId
                            ? "user"
                            : "admin"
                    );

                div.textContent =
                    data.text || "";

                messagesBox.appendChild(div);

            });


            messagesBox.scrollTop =
                messagesBox.scrollHeight;
        },

        (error) => {

            console.error(
                "Chat error:",
                error
            );

            messagesBox.innerHTML =
                `<p class="chat-empty">
                    Unable to load chat.
                </p>`;
        }
    );
}


/* =========================
   SEND USER MESSAGE
========================= */

window.sendMessage = async function () {

    const user = auth.currentUser;

    if (!user) {
        showLogin();
        return;
    }

    const input =
        document.getElementById("chatInput");

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) return;


    try {

        const chatId =
            getChatId(user.uid);


        await addDoc(
            collection(
                db,
                "chats",
                chatId,
                "messages"
            ),
            {
                text: text,
                senderId: user.uid,
                senderName:
                    user.displayName ||
                    "User",
                senderType: "user",
                createdAt:
                    serverTimestamp()
            }
        );


        input.value = "";


    } catch (error) {

        console.error(
            "Message send error:",
            error
        );

        alert(
            "Message send nahi hua: " +
            error.message
        );
    }
};


/* =========================
   ENTER TO SEND
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            document.activeElement &&
            document.activeElement.id === "chatInput"
        ) {

            event.preventDefault();

            window.sendMessage();
        }
    }
);
