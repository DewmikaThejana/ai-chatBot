document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const darkIcon = document.getElementById("theme-toggle-dark-icon");
  const lightIcon = document.getElementById("theme-toggle-light-icon");

  // Check pre-existing theme preference or user OS preference
  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    lightIcon.classList.remove("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    darkIcon.classList.remove("hidden");
  }

  themeToggleBtn.addEventListener("click", () => {
    // Toggle Icons
    darkIcon.classList.toggle("hidden");
    lightIcon.classList.toggle("hidden");

    // Toggle Theme
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  });

  // --- Chat Logic ---
  const chatForm = document.getElementById("chat-form");
  const userInputField = document.getElementById("user-input");
  const chatContainer = document.getElementById("chat-container");

  // Message History for context
  const messageHistory = [];

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageText = userInputField.value.trim();
    if (!messageText) return;

    // 1. Add User Message
    addUserMessage(messageText);
    userInputField.value = "";
    messageHistory.push({ role: "user", content: messageText });

    // 2. Show Typing Indicator
    const typingId = showTypingIndicator();

    // 3. Get Bot Reply from API
    const aiReplyContent = await getAIResponse(messageHistory);

    // 4. Show Bot Reply
    removeMessage(typingId);
    addBotMessage(aiReplyContent);
    messageHistory.push({ role: "assistant", content: aiReplyContent });
  });

  function addUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex gap-3 justify-end";

    msgDiv.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-[0_4px_15px_rgba(79,70,229,0.3)] max-w-[80%] break-words transform transition hover:-translate-y-1 font-medium relative z-10">
                ${escapeHTML(text)}
            </div>
            <div class="flex-shrink-0 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_5px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 z-10">
                <svg class="w-6 h-6 text-indigo-500 dark:text-indigo-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            </div>
        `;

    chatContainer.appendChild(msgDiv);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "flex gap-3";

    msgDiv.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold shadow-[0_4px_10px_rgba(79,70,229,0.4)] border border-white/20 relative z-10">
                A
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-100 border border-white/50 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.05)] max-w-[80%] break-words transform transition hover:-translate-y-1 relative z-10">
                ${escapeHTML(text)}
            </div>
        `;

    chatContainer.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const id = "typing-" + Date.now();
    const msgDiv = document.createElement("div");
    msgDiv.id = id;
    msgDiv.className = "flex gap-3";

    msgDiv.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold shadow-[0_4px_10px_rgba(79,70,229,0.4)] border border-white/20 relative z-10">
                A
            </div>
            <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-100 border border-white/50 dark:border-gray-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)] max-w-[80%] flex gap-2 items-center relative z-10">
                <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full typing-dot shadow-sm"></div>
                <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full typing-dot shadow-sm"></div>
                <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full typing-dot shadow-sm"></div>
            </div>
        `;

    chatContainer.appendChild(msgDiv);
    scrollToBottom();
    return id;
  }

  function removeMessage(id) {
    const msg = document.getElementById(id);
    if (msg) msg.remove();
  }

  function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Basic HTML unescaping to prevent XSS
  function escapeHTML(str) {
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }
});
