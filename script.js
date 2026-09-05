```js
const ADMIN_UID = "oNSKRlCO5SeQ4gXtyyNB7CDK7dx1";


/* =========================
   TEAM MEMBERS
========================= */

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
   USER CHAT
========================= */

let chatUnsubscribe = null;


/* OPEN USER CHAT */

window.openChat = function () {

    const user = auth.currentUser;

    if (!user) {
        showLogin();
        return;
    }

    loadChat(user.uid);
};


/* LOAD USER CHAT */

function loadChat(userId) {

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
                    "User chat error:",
                    error
                );

                messagesBox.innerHTML =
                    `<p class="chat-empty">
                        Unable to load chat.
                    </p>`;
            }
        );
}


/* SEND USER MESSAGE */

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


/* ENTER TO SEND USER MESSAGE */

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


/* =========================
   ADMIN USER LIST
========================= */

let usersUnsubscribe = null;
let selectedUserId = null;
let selectedUserName = "";
let adminChatUnsubscribe = null;


function loadUsers() {

    const usersList =
        document.getElementById("usersList");

    if (!usersList) return;

    if (usersUnsubscribe) {
        usersUnsubscribe();
        usersUnsubscribe = null;
    }

    usersUnsubscribe =
        onSnapshot(
            collection(db, "users"),

            (snapshot) => {

                usersList.innerHTML = "";

                if (snapshot.empty) {

                    usersList.innerHTML =
                        `<p style="color:#71809d;">
                            No users found.
                        </p>`;

                    return;
                }

                snapshot.forEach((userDoc) => {

                    const user =
                        userDoc.data();

                    const div =
                        document.createElement("div");

                    div.className = "user-item";

                    if (selectedUserId === user.uid) {
                        div.classList.add("active");
                    }

                    const name =
                        document.createElement("strong");

                    name.textContent =
                        user.name || "User";

                    const email =
                        document.createElement("small");

                    email.textContent =
                        user.email || "";

                    div.appendChild(name);
                    div.appendChild(email);

                    div.onclick = function () {

                        selectAdminUser(
                            user.uid,
                            user.name || "User"
                        );
                    };

                    usersList.appendChild(div);
                });
            },

            (error) => {

                console.error(
                    "Users loading error:",
                    error
                );

                usersList.innerHTML =
                    `<p style="color:#ff4d6d;">
                        Unable to load users.
                    </p>`;
            }
        );
}


/* =========================
   SELECT USER
========================= */

window.selectAdminUser = function (
    userId,
    userName
) {

    selectedUserId = userId;
    selectedUserName = userName;

    const title =
        document.getElementById("adminChatUser");

    if (title) {
        title.textContent = userName;
    }

    loadAdminChat(userId);
};


/* =========================
   LOAD ADMIN CHAT
========================= */

function loadAdminChat(userId) {

    const messagesBox =
        document.getElementById("adminChatMessages");

    if (!messagesBox) return;

    if (adminChatUnsubscribe) {
        adminChatUnsubscribe();
        adminChatUnsubscribe = null;
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

    adminChatUnsubscribe =
        onSnapshot(
            messagesQuery,

            (snapshot) => {

                messagesBox.innerHTML = "";

                if (snapshot.empty) {

                    messagesBox.innerHTML =
                        `<p class="chat-empty">
                            No messages yet.
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
                    "Admin chat error:",
                    error
                );

                messagesBox.innerHTML =
                    `<p class="chat-empty">
                        Unable to load messages.
                    </p>`;
            }
        );
}


/* =========================
   ADMIN SEND MESSAGE
========================= */

window.adminSendMessage = async function () {

    const admin =
        auth.currentUser;

    if (!admin) {
        showLogin();
        return;
    }

    if (admin.uid !== ADMIN_UID) {
        alert("Access denied.");
        return;
    }

    if (!selectedUserId) {
        alert("Please select a user first.");
        return;
    }

    const input =
        document.getElementById("adminChatInput");

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) return;

    try {

        await addDoc(
            collection(
                db,
                "chats",
                selectedUserId,
                "messages"
            ),
            {
                text: text,
                senderId: ADMIN_UID,
                senderType: "admin",
                createdAt: serverTimestamp()
            }
        );

        input.value = "";

    } catch (error) {

        console.error(
            "Admin message error:",
            error
        );

        alert(
            "Admin message send nahi hua: " +
            error.message
        );
    }
};


/* ENTER TO SEND ADMIN MESSAGE */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            document.activeElement &&
            document.activeElement.id === "adminChatInput"
        ) {

            event.preventDefault();

            window.adminSendMessage();
        }
    }
);


/* =========================
   OPEN ADMIN PANEL
========================= */

window.showAdmin = function () {

    const user =
        auth.currentUser;

    if (!user) {
        showLogin();
        return;
    }

    if (user.uid !== ADMIN_UID) {

        alert("Access denied.");

        showDashboard();

        return;
    }

    document.getElementById("homePage").style.display =
        "none";

    document.getElementById("auth").style.display =
        "none";

    document.getElementById("dashboard").style.display =
        "none";

    document.getElementById("admin").style.display =
        "block";

    loadUsers();

    window.scrollTo(0, 0);
};
```
