import Handlebars from 'handlebars/dist/handlebars.js';
import './styles.css';

import layoutTpl from './templates/layout.hbs?raw';
import headerTpl from './templates/header.hbs?raw';
import footerTpl from './templates/footer.hbs?raw';
import homeTpl from './templates/home.hbs?raw';
import aboutTpl from './templates/about.hbs?raw';
import contactTpl from './templates/contact.hbs?raw';

Handlebars.registerPartial('header', headerTpl);
Handlebars.registerPartial('footer', footerTpl);

 routes = {
  '': homeTpl,
  'about': aboutTpl,
  'contact': contactTpl
};

function normalizeRoute(input) {
  if (!input) return '';
  
  return String(input)
    .replace(/^.*#\//, '')   
    .replace(/^\/+/, '')      
    .replace(/\/+$/, '');    
}

function navigateTo(route) {
  const r = normalizeRoute(route);
  window.location.hash = r ? `#/${r}` : '#/';
}

function render(path) {
  const key = normalizeRoute(path);
  const pageTpl = routes[key] || routes[''];
  const layout = Handlebars.compile(layoutTpl);
  const body = Handlebars.compile(pageTpl);

  document.getElementById('app').innerHTML = layout({ body: body({}) });

  document.querySelectorAll('[data-link]').forEach((el) => {
    el.addEventListener('click', (e) => {
     
      const href = el.getAttribute('href') || '';
      if (href.startsWith('#/')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });


  const form = document.querySelector('form.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      alert(`Subscribed: ${email}`);
      form.reset();
    });
  }

 
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
    btn.addEventListener('mouseup', () => btn.classList.remove('pressed'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
  });
}

function currentPath() {
  return window.location.hash || '#/';
}

window.addEventListener('hashchange', () => render(currentPath()));

if (!window.location.hash) {
  navigateTo('');
} else {
  render(currentPath());
}
