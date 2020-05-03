import enterView from 'enter-view';
import textBalancer from 'text-balancer';
import './scripts/page';

import { spectate as spectateConfig } from '../package.json';

// Fade in navbar at scroll trigger

const navbar = document.getElementById('navbar');

if (spectateConfig.USE_NEWS_NAV) {
  enterView({
    selector: '.headline',
    offset: 1,
    enter: () => navbar.classList.remove('hide-news-navbar'),
    exit: () => navbar.classList.add('hide-news-navbar'),
  });
}

// Text balance headline, deck, and image captions

if (window.innerWidth <= 460) {
  textBalancer.balanceText('.headline, .deck, .image-caption-text');
}
