let currentSection = "chat";
let pendingContactRequest = false;
/* ================= SECTION NAVIGATION ================= */

function openSection(section) {

    currentSection = section;

    document.querySelectorAll(".section-view")
        .forEach(view => view.classList.remove("active"));

    document.querySelectorAll(".side-item")
        .forEach(item => item.classList.remove("active"));

    const sectionElement = document.getElementById(section + "Section");

    if (sectionElement) {
        sectionElement.classList.add("active");
    }

    const activeItem = document.querySelector(
        `.side-item[data-section="${section}"]`
    );

    if (activeItem) {
        activeItem.classList.add("active");
    }

    updateHeader(section);

    closeSidebarMobile();
}


function updateHeader(section) {

    const title = document.getElementById("pageTitle");
    const subtitle = document.getElementById("pageSubtitle");

    const pages = {

        chat: [
            "AskAman's AI Representative",
            "Ask questions about Aman"
        ],

        about: [
            "About Aman",
            "Professional profile"
        ],

        experience: [
            "Aman's Experience",
            "Professional journey"
        ],

        projects: [
            "Aman's Projects",
            "Technical work and applications"
        ],

        skills: [
            "Technical Skills",
            "Technologies Aman works with"
        ],

        recruiter: [
            "Recruiter Mode",
            "Evaluate Aman against a job requirement"
        ],

        interview: [
            "Interview Aman",
            "Ask technical questions and evaluate responses"
        ]

    };

    if (pages[section]) {
        title.textContent = pages[section][0];
        subtitle.textContent = pages[section][1];
    }
}


/* ================= CHAT ================= */

function newChat() {

    const messages = document.getElementById("messages");
    const welcome = document.getElementById("welcomeArea");

    messages.innerHTML = "";

    welcome.style.display = "flex";

    openSection("chat");

    document.getElementById("chatInput").focus();
}


function handleInputKey(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
}


function sendQuickPrompt(text) {

    openSection("chat");

    document.getElementById("welcomeArea").style.display = "none";

    addUserMessage(text);

    askBackend(text);
}
function sendMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value.trim();

    if (!message) {
        return;
    }

    document.getElementById("welcomeArea").style.display = "none";

    addUserMessage(message);

    input.value = "";

    /*
     * If AskAman is waiting for the visitor to explain
     * why they want to contact Aman, treat this message
     * as the contact purpose.
     */
    if (pendingContactRequest) {

        pendingContactRequest = false;

        askBackend(
            "The visitor wants to contact Aman. Their stated purpose is: " + message,
            message
        );

        return;
    }

    askBackend(message);
}

function addUserMessage(text) {

    const messages = document.getElementById("messages");

    const wrapper = document.createElement("div");

    wrapper.className = "message user";

    wrapper.innerHTML = `
        <div class="message-bubble">
            ${escapeHtml(text)}
        </div>
    `;

    messages.appendChild(wrapper);

    scrollMessages();
}


function addAIMessage(text) {

    const messages = document.getElementById("messages");

    const wrapper = document.createElement("div");

    wrapper.className = "message ai";

    wrapper.innerHTML = `
        <div class="message-avatar">A</div>

        <div class="message-bubble">
            ${formatAIResponse(text)}
        </div>
    `;

    messages.appendChild(wrapper);

    scrollMessages();
}


async function askBackend(message, contactPurpose = null) {

    addAIMessage("Thinking...");

    const messages = document.getElementById("messages");

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: message,
                mode: "normal",
                contactPurpose: contactPurpose
            })

        });

        if (!response.ok) {
            throw new Error("Backend request failed");
        }

        const data = await response.json();

        const lastMessage =
            messages.lastElementChild
                ?.querySelector(".message-bubble");

        if (!lastMessage) {
            return;
        }

        lastMessage.innerHTML =
            formatAIResponse(
                data.answer || "I couldn't generate an answer."
            );
            if (
                data.answer &&
                data.answer.toLowerCase().includes("what would you like to connect")
            ) {
                pendingContactRequest = true;
            }

    } catch (error) {

        const lastMessage =
            messages.lastElementChild
                ?.querySelector(".message-bubble");

        if (lastMessage) {
            lastMessage.innerHTML = `
                <strong>AskAman is currently unavailable.</strong>
                <br>
                Please try again in a moment.
            `;
        }

        console.error("AskAman error:", error);

    }

    scrollMessages();
}

function formatAIResponse(text) {

    if (!text) {
        return "";
    }

    let formatted = escapeHtml(text);

    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    formatted = formatted.replace(
        /\n/g,
        "<br>"
    );

    return formatted;
}


function escapeHtml(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function scrollMessages() {

    const container = document.querySelector(".chat-container");

    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}


/* ================= RECRUITER MODE ================= */

async function analyzeJD() {

    const input = document.getElementById("jdInput");
    const result = document.getElementById("jdResult");

    const jd = input.value.trim();

    if (!jd) {

        result.style.display = "block";

        result.innerHTML =
            "Please paste a job description first.";

        return;
    }

    result.style.display = "block";

    result.innerHTML =
        "Analyzing the job description...";

    try {

        const response = await fetch("/api/recruiter/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                jobDescription: jd
            })

        });

        if (!response.ok) {
            throw new Error("JD analysis failed");
        }

        const data = await response.json();

        result.innerHTML =
            formatAIResponse(
                data.answer || "No analysis available."
            );

    } catch (error) {

        result.innerHTML = `
            <strong>Analysis service unavailable.</strong>
            <br>
            Backend AI integration will handle this section.
        `;

        console.error(error);
    }
}


/* ================= INTERVIEW ================= */

async function evaluateInterview() {

    const input =
        document.getElementById("interviewAnswer");

    const result =
        document.getElementById("interviewResult");

    const answer = input.value.trim();

    if (!answer) {

        result.style.display = "block";

        result.innerHTML =
            "Please write your answer first.";

        return;
    }

    result.style.display = "block";

    result.innerHTML =
        "Evaluating your answer...";

    try {

        const response =
            await fetch("/api/interview/evaluate", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question:
                        "Explain the difference between method overloading and method overriding in Java.",

                    answer: answer
                })

            });

        if (!response.ok) {
            throw new Error("Interview evaluation failed");
        }

        const data = await response.json();

        result.innerHTML =
            formatAIResponse(
                data.answer || "No evaluation available."
            );

    } catch (error) {

        result.innerHTML = `
            <strong>Interview evaluation service unavailable.</strong>
            <br>
            AI backend integration will handle this section.
        `;

        console.error(error);
    }
}


/* ================= RESUME ================= */

function downloadResume() {

    window.open(
        "/resume/Aman-Kumar-Resume.pdf",
        "_blank"
    );
}


/* ================= EXTERNAL LINKS ================= */

function openGitHub() {

    window.open(
        "https://github.com/amankcodes",
        "_blank"
    );
}


function openLinkedIn() {

    window.open(
        "https://www.linkedin.com/in/dev-aman-kr17/",
        "_blank"
    );
}
function openLeetCode() {
    window.open(
        "https://leetcode.com/u/amankcodes/",
        "_blank"
    );
}

function openHackerRank() {
    window.open(
        "https://www.hackerrank.com/profile/amankr17",
        "_blank"
    );
}

/* ================= THEME ================= */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "askaman-theme",
        dark ? "dark" : "light"
    );
}


function loadTheme() {

    const theme =
        localStorage.getItem("askaman-theme");

    if (theme === "dark") {
        document.body.classList.add("dark");
    }
}


/* ================= MOBILE ================= */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("open");
}


function closeSidebarMobile() {

    document
        .getElementById("sidebar")
        .classList.remove("open");
}


/* ================= VOICE ================= */

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported in this browser."
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("chatInput").value =
            transcript;

        document.getElementById("chatInput").focus();
    };

    recognition.onerror = function(event) {

        console.error(
            "Voice recognition error:",
            event.error
        );

    };
}


/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    updateHeader("chat");

});