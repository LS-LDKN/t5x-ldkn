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
    }
    nirdesh: {
        name: "Davansh Goel",
        role: "Team Member",
        bio: "Member of the T5X LDKN technology team.",
        skills: "Technology • Teamwork"
    }
};

function showMember(member) {
    const data = members[member];

    document.getElementById("member-name").textContent = data.name;
    document.getElementById("member-role").textContent = data.role;
    document.getElementById("member-bio").textContent = data.bio;
    document.getElementById("member-skills").textContent = data.skills;

    document.getElementById("member-detail").classList.add("active");
}
