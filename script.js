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
  const note = event.currentTarget.querySelector('.form-note');
  note.textContent = 'Thanks — your note is ready for the Braun Log Homes team.';
  event.currentTarget.reset();
});

const workCards = [...document.querySelectorAll('.work-card')];
const featureImage = document.querySelector('#work-feature-image');
const featureTitle = document.querySelector('#work-feature-title');
const featureType = document.querySelector('#work-feature-type');
let activeWork = 0;

function showWork(index) {
  if (!workCards.length) return;
  activeWork = (index + workCards.length) % workCards.length;
  const card = workCards[activeWork];
  featureImage.src = card.dataset.image;
  featureImage.alt = card.dataset.alt;
  featureTitle.textContent = card.dataset.title;
  featureType.textContent = card.dataset.type;
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
