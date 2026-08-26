document.getElementById('current-year').textContent = new Date().getFullYear();

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  if (sections.length > 0 && navLinks.length > 0) {
    const navLinkMap = new Map();
    navLinks.forEach(link => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        navLinkMap.set(hash.slice(1), link);
      }
    });

    const activateLink = (id) => {
      navLinks.forEach(link => link.classList.remove('header__link--active'));
      const activeLink = navLinkMap.get(id);
      if (activeLink) {
        activeLink.classList.add('header__link--active');
      }
    };

    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));

    window.addEventListener('scroll', () => {
      const isAtBottom = (window.innerHeight + Math.ceil(window.scrollY)) >= document.documentElement.scrollHeight - 20;
      if (isAtBottom) {
        activateLink('contacts');
      }
    }, { passive: true });
  }

  const burgerBtn = document.getElementById('burgerBtn');
  const headerNav = document.getElementById('headerNav');
  const navLinksList = document.querySelectorAll('.header__link');

  if (burgerBtn && headerNav) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('header__burger--active');
      headerNav.classList.toggle('header__nav--active');
      document.body.classList.toggle('no-scroll');
    });

    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('header__burger--active');
        headerNav.classList.remove('header__nav--active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  const tickerTrack = document.getElementById('tickerTrack');

  if (tickerTrack) {
    const items = [
      'web',
      'programming',
      'node.js',
      'development',
      'javascript',
      'react',
      'css',
      'figma',
      'git',
      'html',
      'bem',
      'sass(SCSS)',
    ];

    const createTickerList = () => {
      const list = document.createElement('div');
      list.classList.add('ticker__list');

      items.forEach(text => {
        const itemSpan = document.createElement('span');
        itemSpan.classList.add('ticker__item');
        itemSpan.textContent = text.toUpperCase();

        const sepSpan = document.createElement('span');
        sepSpan.classList.add('ticker__separator');
        sepSpan.textContent = '/';

        list.appendChild(itemSpan);
        list.appendChild(sepSpan);
      });

      return list;
    };

    tickerTrack.innerHTML = '';

    const firstList = createTickerList();
    tickerTrack.appendChild(firstList);

    for (let i = 0; i < 2; i++) {
      const listCopy = createTickerList();
      listCopy.setAttribute('aria-hidden', 'true');
      tickerTrack.appendChild(listCopy);
    }

    const updateTickerWidth = () => {
      const exactWidth = firstList.getBoundingClientRect().width;
      tickerTrack.style.setProperty('--ticker-distance', `-${exactWidth}px`);
    };

    if (document.fonts) {
      document.fonts.ready.then(updateTickerWidth);
    } else {
      updateTickerWidth();
    }

    window.addEventListener('resize', updateTickerWidth);
  }

  const projectCards = document.querySelectorAll('.project-card');

  const resetCardScroll = (card) => {
    const scrollList = card.querySelector('[data-scroll-list]');
    const thumb = card.querySelector('[data-scrollbar-thumb]');
    
    if (scrollList) {
      scrollList.scrollTop = 0;
    }
    if (thumb) {
      thumb.style.transform = 'translateY(0px)';
    }
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio < 0.5 && entry.target.classList.contains('project-card--flipped')) {
        entry.target.classList.remove('project-card--flipped');
        resetCardScroll(entry.target);
      }
    });
  }, {
    root: null,
    threshold: [0, 0.5, 1.0]
  });

  projectCards.forEach(card => {
    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    cardObserver.observe(card);

    card.addEventListener('mouseleave', () => {
      setTimeout(() => {
        resetCardScroll(card);
      }, 350);
    });

    card.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isScrolling = false;
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      const touchCurrentY = e.touches[0].clientY;
      const touchCurrentX = e.touches[0].clientX;

      if (Math.abs(touchCurrentY - touchStartY) > 8 || Math.abs(touchCurrentX - touchStartX) > 8) {
        isScrolling = true;
      }
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      if (e.target.closest('.project-card__link') || isScrolling) {
        return;
      }

      const isFlipped = card.classList.contains('project-card--flipped');

      projectCards.forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('project-card--flipped')) {
          otherCard.classList.remove('project-card--flipped');
          resetCardScroll(otherCard);
        }
      });

      if (isFlipped) {
        card.classList.remove('project-card--flipped');
        setTimeout(() => {
          resetCardScroll(card);
        }, 350);
      } else {
        card.classList.add('project-card--flipped');
      }
    });
  });

  const detailsWraps = document.querySelectorAll('.project-card__details-wrap');

  detailsWraps.forEach((wrap) => {
    const list = wrap.querySelector('[data-scroll-list]');
    const track = wrap.querySelector('[data-scrollbar]');
    const thumb = wrap.querySelector('[data-scrollbar-thumb]');

    if (!list || !track || !thumb) return;

    let hideTimeout = null;

    const updateThumb = () => {
      const { scrollHeight, clientHeight, scrollTop } = list;
      const scrollable = scrollHeight - clientHeight > 1;

      track.style.display = scrollable ? 'block' : 'none';
      if (!scrollable) return;

      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 24);
      const maxThumbTop = trackHeight - thumbHeight;
      const scrollRatio = scrollTop / (scrollHeight - clientHeight);

      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${maxThumbTop * scrollRatio}px)`;
    };

    const showTrack = () => {
      track.classList.add('project-card__scrollbar--visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        track.classList.remove('project-card__scrollbar--visible');
      }, 900);
    };

    list.addEventListener('scroll', () => {
      updateThumb();
      showTrack();
    }, { passive: true });

    wrap.addEventListener('mouseenter', () => {
      updateThumb();
      showTrack();
    });

    window.addEventListener('resize', updateThumb);

    requestAnimationFrame(updateThumb);
    if (document.fonts) {
      document.fonts.ready.then(updateThumb);
    }
  });

  const contactCards = document.querySelectorAll('.contacts__card');

  contactCards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.classList.add('contacts__card--active');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.classList.remove('contacts__card--active');
      }, 200);
    }, { passive: true });

    card.addEventListener('touchcancel', () => {
      card.classList.remove('contacts__card--active');
    }, { passive: true });
  });
});