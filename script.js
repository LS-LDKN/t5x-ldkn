const members = {

    lakhan: {
        name: "Lakhan Ji",
        role: "Founder / Developer",
        bio: "Founder and developer of T5X LDKN, working on AI, coding and digital technology projects.",
        skills: "AI • Coding • Web Development • Hacking"
    },

    drishti: {
        name: "Drishti",
        role: "Team Member",
        bio: "Member of the T5X LDKN technology team.",
        skills: "Technology • Teamwork"
    },

    khushi: {
        name: "Khushi Goel",
        role: "Team Member",
        bio: "Member of the T5X LDKN technology team.",
        skills: "Technology • Teamwork"
    },

    nirdesh: {
        name: "Nirdesh",
        role: "Team Member",
        bio: "Member of the T5X LDKN technology team.",
        skills: "Technology • Teamwork"
    },

    devansh: {
        name: "Davansh Goel",
        role: "Team Member",
        bio: "Member of the T5X LDKN technology team.",
        skills: "Technology • Teamwork"
    }
};


function showMember(member) {

    const data = members[member];

    if (!data) return;

    document.getElementById("member-name").textContent =
        data.name;

    document.getElementById("member-role").textContent =
        data.role;

    document.getElementById("member-bio").textContent =
        data.bio;

    document.getElementById("member-skills").textContent =
        data.skills;

    document
        .getElementById("member-detail")
        .classList.add("active");
}


/* =========================
   REAL TIME CHAT
========================= */

let chatUnsubscribe = null;


/* OPEN USER CHAT */

window.openChat = function () {

    const user = auth.currentUser;

    if (!user) {
        showLogin();
        return;
    }

    // Logged-in user ki UID use hogi
    loadChat(user.uid);
};


/* =========================
   LOAD USER CHAT
========================= */

function loadChat("oNSKRlCO5SeQ4gXtyyNB7CDK7dx1") {

    const messagesBox =
        document.getElementById("chatMessages");

    if (!messagesBox) return;

    if (chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
    }

    const messagesRef =
        collection(
            db,
            "chats",
            userId,
            "messages"
        );

    const messagesQuery =
        query(
            messagesRef,
            orderBy("createdAt", "asc")
        );

    chatUnsubscribe =
        onSnapshot(
            messagesQuery,

            (snapshot) => {

                messagesBox.innerHTML = "";

                if (snapshot.empty) {

                    messagesBox.innerHTML =
                        `<p class="chat-empty">
                            Start chatting with T5X LDKN Admin 👋
                        </p>`;

                    return;
                }

                snapshot.forEach((messageDoc) => {

                    const data =
                        messageDoc.data();

                    const div =
                        document.createElement("div");

                    div.className =
                        "chat-message " +
                        (
                            data.senderType === "user"
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

        await addDoc(
            collection(
                db,
                "chats",
                user.uid,
                "messages"
            ),
            {
                text: text,
                senderId: user.uid,
                senderType: "user",
                createdAt: serverTimestamp()
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
```
