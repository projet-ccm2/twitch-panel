const API_BASE = 'https://achievement-management-dev-54587681968.europe-west1.run.app';
const SITE_URL = 'https://front-dev-54587681968.europe-west1.run.app/'; // À personnaliser

const twitch = window.Twitch.ext;
const app = document.getElementById('app');

function renderStats(data) {
    const total = data.length;
    const active = data.filter(a => a.active).length;
    const visible = data.filter(a => a.public).length;
    const hidden = data.filter(a => a.secret).length;

    app.innerHTML = `
        <h3>Succès</h3>
        <ul class="stats">
            <li><span>Total</span><span class="value">${total}</span></li>
            <li><span>Actifs</span><span class="value">${active}</span></li>
            <li><span>Visibles</span><span class="value">${visible}</span></li>
            <li><span>Cachés</span><span class="value">${hidden}</span></li>
        </ul>
        <a href="${SITE_URL}" target="_blank">Voir plus sur notre site &rarr;</a>
    `;
}

function fetchStats(channelId) {
    fetch(`${API_BASE}/achievements/channel/${encodeURIComponent(channelId)}`)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(renderStats)
        .catch(() => {
            app.innerHTML = '<span class="error">Erreur lors du chargement des statistiques.</span>';
        });
}

// Twitch fournit le channelId via onAuthorized
twitch.onAuthorized(auth => {
    fetchStats(auth.channelId);
});
