document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.right = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(42, 9, 9, 0.95)';
            navLinks.style.padding = '20px';
            navLinks.style.textAlign = 'center';
            mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navLinks.style.display = '';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                navLinks.style.display = '';
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
            }
        });
    }, observerOptions);

    // Apply animation classes
    document.querySelectorAll('.goal-card, .section-title, .about-content, .about-image-wrapper, .event-card-large').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Modal Logic
    const modal = document.getElementById('event-modal');
    const openModalBtn = document.getElementById('open-event-details');
    const closeModalBtn = document.querySelector('.close-modal');

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', () => {
            // Reset to default featured event details when the static button is clicked
            const titleEl = document.getElementById('modal-event-title');
            if (titleEl) titleEl.innerText = 'أساسيات الإخراج السينمائي';
            
            const dateEl = document.getElementById('modal-event-date');
            if (dateEl) dateEl.innerText = '15 مارس 2026 | 4:00 عصراً';
            
            const locEl = document.getElementById('modal-event-location');
            if (locEl) locEl.innerText = 'مبنى كلية الإعلام - استوديو A';
            
            const descEl = document.getElementById('modal-event-desc');
            if (descEl) descEl.innerText = 'نسعى من خلال هذه الورشة إلى تمكين المبدعين من فهم أدوات المخرج الناجح، وكيفية بناء المشهد السينمائي باحترافية عالية، مع محتوى تدريبي يواكب المعايير العالمية.';

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Dynamic Events Loading from Local Storage
    const firstEventCard = document.querySelector('.featured-event .container .event-card-large');
    if (firstEventCard) {
        let events = JSON.parse(localStorage.getItem('club_events')) || [];
        
        if (events && events.length > 0) {
            // Get ONLY the last added event
            const lastEvent = events[events.length - 1];
            
            firstEventCard.innerHTML = `
                <div class="event-image-side">
                    <img src="assets/logo.png" alt="Logo" class="event-logo-overlay">
                    <img src="${lastEvent.image || 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=2000'}" alt="${lastEvent.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="event-category">${lastEvent.type}</div>
                </div>
                <div class="event-content-side">
                    <div class="event-meta">
                        <span class="event-date"><i class="far fa-calendar-alt"></i> ${lastEvent.date} ${lastEvent.time ? ' | ' + lastEvent.time : ''}</span>
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${lastEvent.location}</span>
                    </div>
                    <h3 class="event-title">${lastEvent.title}</h3>
                    <p class="event-description">${lastEvent.desc}</p>
                    <a href="${lastEvent.link}" target="_blank" class="btn btn-primary" style="margin-top: 15px; display: inline-block; width: fit-content;">
                        <i class="fas fa-external-link-alt"></i> التسجيل المباشر
                    </a>
                    <button class="btn btn-secondary-outline dynamic-event-details-btn" data-id="${lastEvent.id}" style="margin-top: 10px; display: inline-block; width: fit-content; border-color: var(--primary-main); color: var(--primary-main);">عرض التفاصيل</button>
                </div>
            `;
            
            // Note: because we changed the button entirely, we re-apply the click listener for it here
            const newDetailBtn = firstEventCard.querySelector('.dynamic-event-details-btn');
            if (newDetailBtn) {
                newDetailBtn.addEventListener('click', (e) => {
                    if (lastEvent && modal) {
                        document.getElementById('modal-event-title').innerText = lastEvent.title;
                        document.getElementById('modal-event-date').innerText = lastEvent.time ? `${lastEvent.date} | ${lastEvent.time}` : lastEvent.date;
                        document.getElementById('modal-event-location').innerText = lastEvent.location;
                        document.getElementById('modal-event-desc').innerText = lastEvent.desc;
                        if (lastEvent.image) {
                            document.getElementById('modal-event-img').src = lastEvent.image;
                        } else {
                            document.getElementById('modal-event-img').src = 'assets/logo2.png';
                        }
                        modal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
        }
    }

    // Dynamic Events Loading for Effectiveness Page
    const allEventsContainer = document.getElementById('all-events-container');
    if (allEventsContainer) {
        let events = JSON.parse(localStorage.getItem('club_events')) || [];
        
        if (events.length === 0) {
            allEventsContainer.innerHTML = '<p style="text-align: center; color: #777; font-size: 1.2rem; margin-top: 30px;">لا توجد فعاليات متاحة حالياً.</p>';
        } else {
            allEventsContainer.innerHTML = '';
            // Display newest first
            events.slice().reverse().forEach(event => {
                const eventHTML = `
                <div class="event-card-large animate-up" style="border-right: 5px solid var(--primary-main); position: relative; overflow: hidden; background: var(--white); border-radius: 15px; box-shadow: var(--shadow-soft);">
                    <div class="event-image-side" style="flex: 1; max-width: 45%; position: relative;">
                        <img src="assets/logo.png" alt="Logo" class="event-logo-overlay">
                        <img src="${event.image || 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=2000'}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        <div style="background: var(--primary-main); color: var(--white); padding: 8px 15px; position: absolute; top: 20px; right: 20px; border-radius: 8px; font-weight: bold; z-index: 10; font-size: 0.9rem;">${event.type}</div>
                    </div>
                    <div class="event-content-side" style="flex: 1; padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                        <div class="event-meta" style="margin-bottom: 15px; color: var(--primary-main); font-weight: 600; font-size: 0.95rem; display: flex; gap: 20px; flex-wrap: wrap;">
                            <span class="event-date"><i class="far fa-calendar-alt"></i> ${event.date} ${event.time ? '| ' + event.time : ''}</span>
                            <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        </div>
                        <h3 class="event-title" style="font-size: 1.8rem; color: var(--primary-root); margin-bottom: 15px;">${event.title}</h3>
                        <p class="event-description" style="color: #555; line-height: 1.8; margin-bottom: 25px;">${event.desc}</p>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <a href="${event.link}" target="_blank" class="btn btn-primary" style="flex: 1; text-align: center; border-radius: 8px;">
                                <i class="fas fa-external-link-alt"></i> التسجيل السريع
                            </a>
                            <button class="btn btn-secondary-outline dynamic-event-details-btn" data-id="${event.id}" style="flex: 1; border-radius: 8px; border-color: var(--primary-main); color: var(--primary-main);">
                                <i class="fas fa-info-circle"></i> عرض التفاصيل
                            </button>
                        </div>
                    </div>
                </div>`;
                allEventsContainer.insertAdjacentHTML('beforeend', eventHTML);
            });
            
            // Re-apply hover animations to new cards quickly if observer is available via CSS
            
            // Click listeners
            allEventsContainer.querySelectorAll('.dynamic-event-details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const eventId = e.target.closest('.dynamic-event-details-btn').getAttribute('data-id');
                    const selectedEvent = events.find(ev => ev.id == eventId);
                    if (selectedEvent && modal) {
                        document.getElementById('modal-event-title').innerText = selectedEvent.title;
                        document.getElementById('modal-event-date').innerText = selectedEvent.time ? `${selectedEvent.date} | ${selectedEvent.time}` : selectedEvent.date;
                        document.getElementById('modal-event-location').innerText = selectedEvent.location;
                        document.getElementById('modal-event-desc').innerText = selectedEvent.desc;
                        if (selectedEvent.image) {
                            document.getElementById('modal-event-img').src = selectedEvent.image;
                        } else {
                            document.getElementById('modal-event-img').src = 'assets/logo2.png';
                        }
                        modal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                });
            });
        }
    }

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Custom Cursor Movement
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows exactly
            cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

            // Circle follows with delay (via transition)
            follower.style.transform = `translate3d(${posX - 10}px, ${posY - 10}px, 0)`;
        });

        document.querySelectorAll('a, button, .gallery-item').forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                cursor.style.transform += ' scale(2.5)';
                follower.style.width = '60px';
                follower.style.height = '60px';
            });
            link.addEventListener('mouseleave', () => {
                follower.style.width = '30px';
                follower.style.height = '30px';
            });
        });
    }
});
