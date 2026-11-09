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
    const nodes = [...document.querySelectorAll('[data-orbit]')];
    const preview = document.querySelector('.orbit-preview');
    const instrument = document.querySelector('.orrery-instrument');
    if (preview && instrument) {
        let selected = nodes[0];
        const show = node => {
            const data = previews[node.dataset.orbit];
            instrument.dataset.focus = node.dataset.orbit;
            preview.querySelector('.orbit-preview-index').textContent = data[0];
            preview.querySelector('.orbit-preview-copy').textContent = data[1];
            const link = preview.querySelector('.orbit-preview-link');
            link.textContent = data[2];
            link.href = data[3];
        };
        const select = node => {
            selected = node;
            nodes.forEach(item => {
                item.classList.toggle('is-selected', item === node);
                if (item === node) item.setAttribute('aria-current', 'location');
                else item.removeAttribute('aria-current');
            });
            show(node);
        };
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => show(node));
            node.addEventListener('mouseleave', () => show(selected));
            node.addEventListener('focus', () => show(node));
            node.addEventListener('blur', () => show(selected));
            node.addEventListener('click', event => {
                const target = document.querySelector(node.getAttribute('href'));
                if (!target) return;
                event.preventDefault();
                select(node);
                const hash = node.getAttribute('href');
                if (location.hash !== hash) history.pushState({orbit: node.dataset.orbit}, '', hash);
                target.scrollIntoView({behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start'});
            });
        });
        window.addEventListener('popstate', () => {
            const node = nodes.find(item => item.getAttribute('href') === location.hash);
            select(node || nodes[0]);
            const target = location.hash ? document.getElementById(location.hash.slice(1)) : document.getElementById('home');
            target?.scrollIntoView({behavior: 'auto', block: 'start'});
        });
        const initial = nodes.find(item => item.getAttribute('href') === location.hash);
        if (initial) select(initial);

        const pointer = matchMedia('(pointer: fine) and (min-width: 901px)');
        let tiltFrame = 0;
        instrument.addEventListener('pointermove', event => {
            if (!pointer.matches || reduceMotion.matches) return;
            const box = instrument.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width - .5;
            const y = (event.clientY - box.top) / box.height - .5;
            cancelAnimationFrame(tiltFrame);
            tiltFrame = requestAnimationFrame(() => {
                instrument.style.setProperty('--tilt-x', `${(-y * 3).toFixed(2)}deg`);
                instrument.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
            });
        });
        instrument.addEventListener('pointerleave', () => {
            instrument.style.removeProperty('--tilt-x');
            instrument.style.removeProperty('--tilt-y');
        });
    }

    // Two source-backed callouts on the Re:3D feedstock / frame photograph.
    const annotations = [...document.querySelectorAll('[data-annotation]')];
    annotations.forEach(control => control.addEventListener('click', () => {
        annotations.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.annotation === control.dataset.annotation)));
    }));

    // Detail photographs and diagrams can be inspected without replacing their captions.
    const inspectable = [...document.querySelectorAll('.project-hero .project-image > img, .project-hero .annotated-project-image > img, .hero-photo-large img, .analysis-image img, .project-image-grid img, .project-poster-image')];
    if (inspectable.length && typeof HTMLDialogElement !== 'undefined') {
        const dialog = document.createElement('dialog');
        dialog.className = 'image-dialog';
        dialog.setAttribute('aria-label', 'Project image viewer');
        dialog.innerHTML = '<div class="image-dialog-inner"><div class="image-dialog-bar"><span>Image inspection</span><button type="button" class="image-dialog-close" aria-label="Close image viewer">Close ×</button></div><figure class="image-dialog-figure"><img alt=""><figcaption></figcaption></figure><div class="image-dialog-nav"><button type="button" class="image-dialog-prev" aria-label="Previous image">← Previous</button><button type="button" class="image-dialog-next" aria-label="Next image">Next →</button></div></div>';
        document.body.append(dialog);
        const shown = dialog.querySelector('img');
        const caption = dialog.querySelector('figcaption');
        const close = dialog.querySelector('.image-dialog-close');
        const previous = dialog.querySelector('.image-dialog-prev');
        const next = dialog.querySelector('.image-dialog-next');
        let current = 0;
        let opener;
        const display = index => {
            current = (index + inspectable.length) % inspectable.length;
            const source = inspectable[current];
            shown.src = source.currentSrc || source.src;
            shown.alt = source.alt;
            caption.textContent = source.closest('.analysis-image')?.querySelector('.analysis-caption')?.textContent?.trim() || source.alt;
            previous.disabled = next.disabled = inspectable.length < 2;
        };
        inspectable.forEach((img, index) => {
            const wrapper = img.parentElement;
            wrapper.classList.add('inspectable-image');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'image-enlarge';
            button.textContent = 'Enlarge ↗';
            button.setAttribute('aria-label', `Enlarge image: ${img.alt}`);
            button.addEventListener('click', () => {
                opener = button;
                display(index);
                dialog.showModal();
                close.focus();
            });
            wrapper.append(button);
        });
        close.addEventListener('click', () => dialog.close());
        previous.addEventListener('click', () => display(current - 1));
        next.addEventListener('click', () => display(current + 1));
        dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
        dialog.addEventListener('close', () => opener?.focus());
        dialog.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); display(current - 1); }
            if (event.key === 'ArrowRight') { event.preventDefault(); display(current + 1); }
        });
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
