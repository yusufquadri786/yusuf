const seedPosts = [
  { id: 1, name: "Yusuf", handle: "@yusuf", text: "Welcome to MySocial! 🚀 This is my first post.", avatar: "Y", likes: 12, liked: false, comments: ["Looks great!"], time: "2h" },
  { id: 2, name: "Aarav", handle: "@aarav", text: "Building something new today. Keep learning and keep creating! ✨", avatar: "A", likes: 27, liked: false, comments: [], time: "4h" },
  { id: 3, name: "Sarah", handle: "@sarah", text: "What is everyone working on this week?", avatar: "S", likes: 19, liked: false, comments: ["A school project!"], time: "6h" }
];

let posts = JSON.parse(localStorage.getItem("mysocial_posts") || "null") || seedPosts;
const stories = [
  ["Your story", "Y"], ["Aarav", "A"], ["Sarah", "S"], ["Rahul", "R"], ["Anaya", "N"]
];

const feed = document.getElementById("feed");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

function save() {
  localStorage.setItem("mysocial_posts", JSON.stringify(posts));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));
}

function renderStories() {
  document.getElementById("storiesList").innerHTML = stories.map(([name, letter], i) =>
    '<div class="story"><div class="story-ring"><div class="avatar ' + (i % 2 ? "purple" : "") + '">' + letter + '</div></div><span>' + escapeHtml(name) + '</span></div>'
  ).join("");
}

function renderPosts(filter = "") {
  const q = filter.trim().toLowerCase();
  const visible = posts.filter(p => (p.name + " " + p.handle + " " + p.text).toLowerCase().includes(q));
  emptyState.classList.toggle("hidden", visible.length !== 0);
  feed.innerHTML = visible.map(p => `
    <article class="post card">
      <div class="post-head">
        <div class="avatar">${escapeHtml(p.avatar)}</div>
        <div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.handle)} · ${escapeHtml(p.time)}</small></div>
        <button class="post-menu" title="Post options">•••</button>
      </div>
      <div class="post-text">${escapeHtml(p.text)}</div>
      <div class="post-actions">
        <button class="action ${p.liked ? "liked" : ""}" data-like="${p.id}">♡ ${p.likes}</button>
        <button class="action" data-focus-comment="${p.id}">💬 ${p.comments.length}</button>
        <button class="action" data-share="${p.id}">↗ Share</button>
      </div>
      <div class="comments">
        ${p.comments.map(c => '<div class="comment">' + escapeHtml(c) + '</div>').join("")}
        <div class="comment-box">
          <input data-comment-input="${p.id}" maxlength="160" placeholder="Write a comment..." />
          <button class="primary-btn" data-comment="${p.id}">Send</button>
        </div>
      </div>
    </article>`).join("");
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 1800);
}

document.getElementById("postBtn").addEventListener("click", () => {
  const input = document.getElementById("postText");
  const text = input.value.trim();
  if (!text) return toast("Write something first.");
  posts.unshift({ id: Date.now(), name: "Yusuf", handle: "@yusuf", text, avatar: "Y", likes: 0, liked: false, comments: [], time: "now" });
  input.value = "";
  save();
  renderPosts(searchInput.value);
  toast("Post published!");
});

document.getElementById("postText").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); document.getElementById("postBtn").click(); }
});

feed.addEventListener("click", e => {
  const likeId = e.target.dataset.like;
  const commentId = e.target.dataset.comment;
  const focusId = e.target.dataset.focusComment;
  const shareId = e.target.dataset.share;

  if (likeId) {
    const p = posts.find(x => x.id == likeId);
    p.liked = !p.liked;
    p.likes += p.liked ? 1 : -1;
    save(); renderPosts(searchInput.value);
  }
  if (focusId) document.querySelector('[data-comment-input="' + focusId + '"]')?.focus();
  if (commentId) {
    const input = document.querySelector('[data-comment-input="' + commentId + '"]');
    const text = input?.value.trim();
    if (!text) return;
    posts.find(x => x.id == commentId).comments.push(text);
    save(); renderPosts(searchInput.value); toast("Comment added!");
  }
  if (shareId) {
    const p = posts.find(x => x.id == shareId);
    navigator.clipboard?.writeText(p.text).then(() => toast("Post text copied!")).catch(() => toast("Share ready!"));
  }
});

searchInput.addEventListener("input", () => renderPosts(searchInput.value));

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("mysocial_dark", document.body.classList.contains("dark") ? "1" : "0");
});
if (localStorage.getItem("mysocial_dark") === "1") document.body.classList.add("dark");

document.getElementById("addStoryBtn").addEventListener("click", () => toast("Story upload will be added in the next version."));

document.querySelectorAll(".follow-btn").forEach(btn => btn.addEventListener("click", () => {
  btn.textContent = btn.textContent === "Follow" ? "Following" : "Follow";
}));

document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(x => x.classList.remove("active"));
  btn.classList.add("active");
  if (btn.dataset.section === "explore") toast("Explore is ready for more content.");
  if (btn.dataset.section === "notifications") toast("No new notifications.");
  if (btn.dataset.section === "profile") toast("Profile section coming next.");
}));

renderStories();
renderPosts();
