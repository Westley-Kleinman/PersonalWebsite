document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const menuButton = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');

    if (menuButton && menu) {
        menuButton.addEventListener('click', () => {
            const open = menuButton.getAttribute('aria-expanded') !== 'true';
            menuButton.setAttribute('aria-expanded', String(open));
            menuButton.classList.toggle('active', open);
            menu.classList.toggle('active', open);
        });
        menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.classList.remove('active');
            menu.classList.remove('active');
        }));
    }

    const previews = {
        work: ['01 / Work', 'Hands-on R&D, testing, and manufacturing at Re:3D and Time Bicycles / Boyd Cycling.', 'Explore work ↗', '#experience'],
        projects: ['02 / Projects', 'Monte, an engineered cleaning system, DukeCycling.dev, and game experiments.', 'Explore projects ↗', '#projects'],
        about: ['03 / About', 'Mechanical engineering at Duke, with a focus on making, measuring, and shipping.', 'Read background ↗', '#about'],
        contact: ['04 / Contact', 'Open to engineering internships and collaborations.', 'Get in touch ↗', '#contact']
    };
    const nodes = document.querySelectorAll('[data-orbit]');
    const preview = document.querySelector('.orbit-preview');
    if (preview) {
        nodes.forEach(node => node.addEventListener('click', event => {
            const data = previews[node.dataset.orbit];
            if (!data) return;
            event.preventDefault();
            nodes.forEach(item => {
                item.classList.toggle('is-selected', item === node);
                if (item === node) item.setAttribute('aria-current', 'true');
                else item.removeAttribute('aria-current');
            });
            preview.querySelector('.orbit-preview-index').textContent = data[0];
            preview.querySelector('.orbit-preview-copy').textContent = data[1];
            const link = preview.querySelector('.orbit-preview-link');
            link.textContent = data[2];
            link.href = data[3];
            if (!reduceMotion.matches) {
                preview.animate([{opacity: 0.55, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 180, easing: 'ease-out'});
            }
        }));
    }

    // E = mgh for the three anvil masses documented in the Boyd case study.
    const chartCanvas = document.getElementById('impactChart');
    if (chartCanvas && typeof Chart !== 'undefined') {
        const heights = Array.from({length: 21}, (_, index) => index * 0.1);
        const grid = 'rgba(223, 227, 221, 0.15)';
        const ink = '#dce6e4';
        window.impactChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: heights.map(height => height.toFixed(1)),
                datasets: [
                    {mass: 10, color: '#8daead'},
                    {mass: 25, color: '#70c8c0'},
                    {mass: 50, color: '#dbad76'}
                ].map(({mass, color}) => ({
                    label: `${mass} kg anvil`,
                    data: heights.map(height => +(mass * 9.81 * height).toFixed(1)),
                    borderColor: color,
                    backgroundColor: color,
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {mode: 'index', intersect: false},
                scales: {
                    y: {beginAtZero: true, suggestedMax: 220, title: {display: true, text: 'Impact energy (J)', color: ink}, grid: {color: grid}, ticks: {color: ink}},
                    x: {title: {display: true, text: 'Drop height (m)', color: ink}, grid: {color: grid}, ticks: {color: ink}}
                },
                plugins: {legend: {labels: {color: ink}}, tooltip: {callbacks: {label: item => `${item.dataset.label}: ${item.formattedValue} J`}}}
            }
        });
    }
});
