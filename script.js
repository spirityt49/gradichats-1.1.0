// script.js

// 1. STATE VARIABLES
let currentUser = { name: "", pass: "", avatar: "placeholder.png" };
let isFollowingProfile = false;
let targetedProfile = null; // The profile being viewed

// List of fake users for search/follow logic
const fakeUsers = [
    { name: "alex_riva", avatar: "placeholder.png", following: false },
    { name: "creative_mind", avatar: "global.png", following: true },
    { name: "dev_studio", avatar: "global.png", following: false }
];

// 2. ONBOARDING LOGIC

// Navigate between steps (username -> pass -> profile)
function nextOnboardingStep(nextStepId) {
    // Basic Validation
    const currentStep = document.querySelector('.onboarding-step:not(.hidden)');
    const input = currentStep.querySelector('input');
    
    if (input && input.value.trim() === "") {
        alert("This field is required.");
        return;
    }

    // Save state
    if (currentStep.id === "step-username") currentUser.name = input.value;
    if (currentStep.id === "step-pass") currentUser.pass = input.value;

    // Hide all, show next
    document.querySelectorAll('.onboarding-step').forEach(step => step.classList.add('hidden'));
    document.getElementById(`step-${nextStepId}`).classList.remove('hidden');
}

// Handle Profile Image Upload
function previewRegistrationAvatar() {
    const input = document.getElementById('reg-avatar-input');
    const preview = document.getElementById('reg-avatar-preview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            currentUser.avatar = e.target.result;
            preview.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Complete Onboarding & Enter App
function completeOnboarding() {
    // Hide Onboarding, Show App
    document.getElementById('onboarding-container').classList.add('hidden');
    document.getElementById('main-app-container').classList.remove('hidden');

    // Setup Header/Greeting
    document.getElementById('home-greeting-name').innerText = currentUser.name;
    document.getElementById('my-header-avatar').src = currentUser.avatar;
}

// 3. PAGE NAVIGATION LOGIC

function showAppPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.app-page').forEach(page => page.classList.add('hidden'));
    // Show targeted page
    document.getElementById(`page-${pageName}`).classList.remove('hidden');
}

// 4. GLOBAL SEARCH LOGIC (HOME PAGE)

function handleGlobalSearch() {
    const query = document.getElementById('global-search').value.toLowerCase();
    const resultsUl = document.getElementById('global-search-results');
    resultsUl.innerHTML = ""; // Clear old results

    if (query.trim() === "") {
        resultsUl.classList.add('hidden');
        return;
    }

    // Filter fake users
    const filtered = fakeUsers.filter(user => user.name.toLowerCase().includes(query));

    if (filtered.length > 0) {
        resultsUl.classList.remove('hidden');
        filtered.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${user.avatar}" class="avatar-sm"> ${user.name}`;
            li.onclick = () => viewUserProfile(user); // Define action on click
            resultsUl.appendChild(li);
        });
    } else {
        resultsUl.classList.add('hidden');
    }
}

// 5. PROFILE VIEW & FOLLOW LOGIC

// View a specific user's profile card
function viewUserProfile(userObject) {
    targetedProfile = userObject; // Save state of viewed profile
    showAppPage('profile-view');
    document.getElementById('global-search-results').classList.add('hidden');
    
    // Set UI details
    document.getElementById('view-profile-name').innerText = targetedProfile.name;
    document.getElementById('view-profile-avatar').src = targetedProfile.avatar;
    
    // Set Follow Button state
    isFollowingProfile = targetedProfile.following;
    updateFollowBtnUI();
}

function updateFollowBtnUI() {
    const btn = document.getElementById('profile-follow-btn');
    if (isFollowingProfile) {
        btn.innerText = "Following";
        btn.className = "following";
    } else {
        btn.innerText = "Follow";
        btn.className = "not-following";
    }
}

function toggleFollowInProfile() {
    // Toggle state (conceptual follow logic)
    isFollowingProfile = !isFollowingProfile;
    updateFollowBtnUI();
}

// Start Chat from Profile View (Redirect to Messages)
function startChatFromProfile() {
    if (!targetedProfile) return;
    
    // Conceptually "add" the chat to the sidebar if it doesn't exist
    loadChat(targetedProfile.name, targetedProfile.avatar);
    
    // Switch to Messages page
    showAppPage('messages');
}

// 6. MESSAGING LOGIC

function loadChat(name, avatar) {
    // Set Chat Window Header
    document.getElementById('active-chat-name').innerText = name;
    document.getElementById('active-chat-avatar').src = avatar;
    
    // Conceptually load messages (clear display for now)
    document.getElementById('message-display').innerHTML = "";
}

function send() {
    const input = document.getElementById('msg-input');
    const display = document.getElementById('message-display');

    if (input.value.trim() !== "") {
        // Simple Sent Message (Conceptual - no Java link yet)
        const row = document.createElement('div');
        row.innerHTML = `<div class="msg sent" style="background:var(--primary-gradient); color:white; max-width:60%; padding:10px; border-radius:10px; align-self:flex-end">${input.value}</div>`;
        row.style.display = "flex"; row.style.justifyContent = "flex-end"; row.style.margin = "5px 0";

        display.appendChild(row);
        display.scrollTop = display.scrollHeight;
        input.value = "";
    }
}