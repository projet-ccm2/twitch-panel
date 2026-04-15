const twitch = window.Twitch.ext;
const app = document.getElementById('app');
let token = '';
let userId = '';
let channelId = '';
let activeTab = 'my-stats';

function headers() {
    return { 'Authorization': `Bearer ${token}` };
}

// ── Tab rendering ──

function renderTabs() {
    const lbActive = activeTab === 'leaderboard' ? 'active' : '';
    const msActive = activeTab === 'my-stats' ? 'active' : '';

    app.innerHTML = `
        <div class="tabs">
            <button class="tab ${lbActive}" data-tab="leaderboard">Leaderboard</button>
            <button class="tab ${msActive}" data-tab="my-stats">My Stats</button>
        </div>
        <div id="tab-content"><span class="loading">Loading...</span></div>
    `;

    app.querySelectorAll('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            renderTabs();
        });
    });

    if (activeTab === 'leaderboard') loadLeaderboard();
    else loadMyStats();
}

// ── My Stats tab ──

function loadMyStats() {
    const content = document.getElementById('tab-content');

    if (USER_API) {
        fetch(`${USER_API}/${encodeURIComponent(userId)}`, { headers: headers() })
            .then(res => {
                if (res.status === 404) { renderRegister(content); return; }
                if (!res.ok) throw new Error(res.status);
                loadUserStats(content);
            })
            .catch(() => {
                content.innerHTML = '<span class="error">Error loading data.</span>';
            });
    } else {
        loadUserStats(content);
    }
}

function loadUserStats(content) {
    fetch(`${ACHIEVEMENT_API}/achievements/user/${encodeURIComponent(userId)}/channel/${encodeURIComponent(channelId)}`, { headers: headers() })
        .then(res => {
            if (res.status === 404) { renderRegister(content); return; }
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => { if (data) renderMyStatsContent(content, data); })
        .catch(() => {
            content.innerHTML = '<span class="error">Error loading stats.</span>';
        });
}

function renderRegister(content) {
    content.innerHTML = `
        <div class="register">
            <p>You don't have an account yet.</p>
            <a class="btn" href="${SITE_URL}" target="_blank">Sign up on our site</a>
        </div>
    `;
}

function renderMyStatsContent(content, data) {
    const achievements = data.achievements || [];
    const completed = achievements.filter(a => a.achieved && a.achieved.finished).length;
    const total = achievements.length;
    const xp = achievements
        .filter(a => a.achieved && a.achieved.finished)
        .reduce((sum, a) => sum + (a.reward || 0), 0);
    const inProgress = achievements.filter(a => a.achieved && !a.achieved.finished).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    content.innerHTML = `
        <ul class="stats">
            <li><span>Completed</span><span class="value">${completed} / ${total}</span></li>
            <li><span>Total XP</span><span class="value">${xp}</span></li>
            <li><span>In Progress</span><span class="value">${inProgress}</span></li>
            <li><span>Completion</span><span class="value">${rate}%</span></li>
        </ul>
        <a href="${SITE_URL}" target="_blank">View more on our site &rarr;</a>
    `;
}

// ── Leaderboard tab ──

function loadLeaderboard() {
    const content = document.getElementById('tab-content');

    fetch(`${ACHIEVEMENT_API}/achievements/channel/${encodeURIComponent(channelId)}/leaderboard?limit=10`, { headers: headers() })
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => renderLeaderboardContent(content, data))
        .catch(() => {
            content.innerHTML = '<span class="error">Error loading leaderboard.</span>';
        });
}

function renderLeaderboardContent(content, data) {
    const top = data.slice(0, 10);
    if (!top.length) {
        content.innerHTML = '<div class="coming-soon">No data yet.</div>';
        return;
    }

    const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
    const podiumHtml = top.slice(0, 3).map((entry, i) => `
        <div class="podium-item rank-${i + 1}">
            <span class="medal">${medals[i]}</span>
            <span class="name">${entry.username || entry.userId}</span>
            <span class="xp">${entry.xp} XP</span>
        </div>
    `).join('');

    const listHtml = top.slice(3).map((entry, i) => `
        <li>
            <span class="rank">#${i + 4}</span>
            <span class="name">${entry.username || entry.userId}</span>
            <span class="xp">${entry.xp} XP</span>
        </li>
    `).join('');

    content.innerHTML = `
        <div class="podium">${podiumHtml}</div>
        ${listHtml ? `<ul class="lb-list">${listHtml}</ul>` : ''}
    `;
}

// ── Init ──

twitch.onAuthorized(auth => {
    token = auth.token;
    userId = auth.userId;
    channelId = auth.channelId;
    renderTabs();
});
