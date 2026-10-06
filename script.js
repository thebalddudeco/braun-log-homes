const navigationEntry = performance.getEntriesByType('navigation')[0];
if (navigationEntry?.type === 'reload') {
  history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  window.scrollTo(0, 0);
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const introLoader = document.querySelector('#intro-loader');
const heroVideo = document.querySelector('.hero-video');
const heroVideoSource = heroVideo?.querySelector('source');
const forceIntroPreview = new URLSearchParams(window.location.search).has('intro');
const introMinimum = 1400;
const introMaximum = 12000;

const seasonalHeroVideos = {
  fall: 'assets/video/Fall.webm',
  winter: 'assets/video/Winter.webm',
  spring: 'assets/video/Spring.webm',
  summer: 'assets/video/Summer.webm'
};

function getCurrentSeason(month) {
  if ([11, 0, 1].includes(month)) return 'winter';
  if ([2, 3, 4].includes(month)) return 'spring';
  if ([5, 6, 7].includes(month)) return 'summer';
  return 'fall';
}

const currentSeason = getCurrentSeason(new Date().getMonth());
const currentSeasonVideo = seasonalHeroVideos[currentSeason];
if (currentSeasonVideo) {
  if (heroVideoSource) {
    heroVideoSource.src = currentSeasonVideo;
    heroVideo.dataset.season = currentSeason;
    heroVideo.load();
  }
}

function finishIntro() {
  introLoader?.classList.add('is-complete');
  document.body.classList.remove('intro-active');
}

const startHeroVideo = () => heroVideo?.play().catch(() => {});
heroVideo?.addEventListener('canplay', startHeroVideo, { once: true });
startHeroVideo();

if (introLoader) {
  if (forceIntroPreview) document.body.classList.add('intro-preview');
  document.body.classList.add('intro-active');
  let minimumElapsed = false;
  let heroVideoReady = !heroVideo || heroVideo.readyState >= 3;
  const finishWhenReady = () => {
    if (minimumElapsed && heroVideoReady) finishIntro();
  };
  window.setTimeout(() => {
    minimumElapsed = true;
    finishWhenReady();
  }, introMinimum);
  heroVideo?.addEventListener('canplay', () => {
    heroVideoReady = true;
    finishWhenReady();
  }, { once: true });
  heroVideo?.addEventListener('error', () => {
    heroVideoReady = true;
    finishWhenReady();
  }, { once: true });
  window.setTimeout(finishIntro, introMaximum);
} else {
  finishIntro();
}

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));
document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const name = values.get('name') || 'Website visitor';
  const subject = encodeURIComponent(`Website inquiry from ${name}`);
  const body = encodeURIComponent([
    `Name: ${name}`,
    `Email: ${values.get('email') || ''}`,
    `Phone: ${values.get('phone') || ''}`,
    '',
    `${values.get('message') || ''}`
  ].join('\n'));
  const note = event.currentTarget.querySelector('.form-note');
  note.textContent = 'Opening your email app…';
  window.location.href = `mailto:braunloghomesllc@yahoo.com?subject=${subject}&body=${body}`;
});

const workCards = [...document.querySelectorAll('.work-card')];
const featureImage = document.querySelector('#work-feature-image');
const featureTitle = document.querySelector('#work-feature-title');
const featureType = document.querySelector('#work-feature-type');
let activeWork = 0;

const seasonalGalleryImages = {
  feature: {
    fall: 'assets/gallery/current/hf_20261006_175632_86a84c46-a1e2-4344-b928-683b36c987bd.jpg',
    winter: 'assets/gallery/current/contemporary-country-house-standing-snow-forest-front-camera-background-other-residence-among-pines-birches.jpg',
    spring: 'assets/gallery/current/hf_20261006_175644_de6683a8-3e0a-490f-a474-4f12552c1a80.jpg',
    summer: 'assets/gallery/current/hf_20261006_175650_96fc437a-1e13-4294-bfa4-e94d75cde62f.jpg'
  },
  selectedWork: {
    fall: 'assets/gallery/current/hf_20261006_175657_462db8ff-0b27-413d-9793-27b5cfdcb2d9.jpg',
    winter: 'assets/gallery/current/new-wooden-russian-bath-sunny-winter-day-view-from-outside-against-backdrop-snow-covered-forest.jpg',
    spring: 'assets/gallery/current/hf_20261006_175702_8c724fb0-b66b-4b76-8f70-358dc9cd07e8.jpg',
    summer: 'assets/gallery/current/hf_20261006_175718_82758a76-2b21-4f99-8666-bbe0a5a85427.jpg'
  }
};

function applySeasonalGalleryImages() {
  const featureSectionImage = document.querySelector('.feature-image img');
  const selectedFeature = seasonalGalleryImages.feature[currentSeason];
  const selectedWork = seasonalGalleryImages.selectedWork[currentSeason];
  if (featureSectionImage && selectedFeature) featureSectionImage.src = selectedFeature;
  if (featureImage && selectedWork) featureImage.src = selectedWork;
}

applySeasonalGalleryImages();

function showWork(index) {
  if (!workCards.length) return;
  activeWork = (index + workCards.length) % workCards.length;
  const card = workCards[activeWork];
  featureImage.src = card.dataset.image;
  featureImage.alt = card.dataset.alt;
  if (featureTitle) featureTitle.textContent = card.dataset.title;
  if (featureType) featureType.textContent = card.dataset.type;
  workCards.forEach((item, i) => item.classList.toggle('is-active', i === activeWork));
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

workCards.forEach((card, index) => card.addEventListener('click', () => showWork(index)));
document.querySelector('[data-carousel="prev"]')?.addEventListener('click', () => showWork(activeWork - 1));
document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => showWork(activeWork + 1));

const immersiveSections = document.querySelectorAll('main > section');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.16 });
immersiveSections.forEach((section) => {
  section.classList.add('reveal-section');
  revealObserver.observe(section);
});
