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

let workCards = [...document.querySelectorAll('.work-card')];
const workTrack = document.querySelector('.work-track');
const featureImage = document.querySelector('#work-feature-image');
const featureTitle = document.querySelector('#work-feature-title');
const featureType = document.querySelector('#work-feature-type');
let activeWork = 0;

const seasonalGalleryBase = 'https://huggingface.co/datasets/TheBaldDudeCo/braun-log-homes-seasonal-gallery/resolve/main/';
const seasonalGalleryFiles = {
  fall: [
    'hf_20261006_194149_71b705b7-af65-49fa-87de-a36a67980bec.png',
    'hf_20261006_194149_9e960a0e-ec32-4043-91f0-ac2bf4e94b98.png',
    'hf_20261006_194149_9f77f97c-818a-4199-9dd1-e93d1d677bb3.png',
    'hf_20261006_194149_faa9494e-e576-45f2-ab68-ef695d4213de.png',
    'hf_20261006_194151_bdc00e07-3874-485a-b82a-f083b4dc92f8.png',
    'hf_20261006_194151_c1332d64-0a20-41ea-98bd-90f6fb9a26e6.png',
    'hf_20261006_194151_eed51fcc-4bd1-45da-b43c-40720eb843fb.png',
    'hf_20261006_194153_3867b43f-894b-4ab7-b652-f68982c1a9e0.png',
    'hf_20261006_194153_695da8c1-ee92-4ef4-bd4c-0358ac7a3427.png',
    'hf_20261006_194153_d03960e9-ad63-490d-b3d6-524cabb3d392.png',
    'hf_20261006_194153_2e8feb22-9bff-46a8-957d-e19aeacb4d56.png',
    'hf_20261006_194151_1cde3141-c339-49ef-af2d-c5be17ea3fc8.png'
  ],
  winter: [
    'hf_20261006_193237_0e8ed1ec-f88d-4662-8659-8cb906ef32b3.png',
    'hf_20261006_193237_97c9c345-e319-4e9e-be40-deda805615d8.png',
    'hf_20261006_193237_d4bdaf84-d511-4f78-9e80-2922217da540.png',
    'hf_20261006_193237_d8d9d5dd-0d0a-415e-bdbb-46d8150a0e9e.png',
    'hf_20261006_193240_1e967358-0d60-4dc1-b782-cdbeb1661c4f.png',
    'hf_20261006_193240_32c6ee9c-f89b-4097-bc61-09cec60f6bfc.png',
    'hf_20261006_193240_ccbbfcbf-7348-4f6a-b485-9e5583e348e4.png',
    'hf_20261006_193242_2ef5ca42-0638-4ea5-a516-dae1efc75bb2.png',
    'hf_20261006_193242_5c454295-d856-4636-bbb1-0a28931bcb8a.png',
    'hf_20261006_193242_7a73653a-f0ee-4b92-a2be-12e907680fc4.png',
    'hf_20261006_193242_c5308985-e11a-420c-b75e-6b1e16317921.png'
  ],
  spring: [
    'hf_20261006_193609_0448daee-1b13-444c-b50f-6c52d049915f.png',
    'hf_20261006_193609_0af4cdff-2c12-4520-8f29-aaf028e7f571.png',
    'hf_20261006_193609_2825f63d-862c-4a91-b615-5e1b6d55eab6.png',
    'hf_20261006_193609_8b7ad705-1adb-4a0c-b08b-0024403127a6.png',
    'hf_20261006_193615_1fb50d2a-eead-489e-91da-ac7a1c68acae.png',
    'hf_20261006_193615_4d7c78c3-be8b-49f4-8a23-843ba3aa436c.png',
    'hf_20261006_193615_5698655c-d631-4ada-96c3-4300a04467ab.png',
    'hf_20261006_193615_d2d3d617-3b7e-437e-8f4b-f3d425367249.png',
    'hf_20261006_193617_0d14ec30-146c-405d-b523-9bd2f1421b7c.png',
    'hf_20261006_193617_1a1ca0dd-8141-4e6c-bbb1-c77af4e78026.png',
    'hf_20261006_193617_22b36440-73f8-4405-91e9-89d9af7250d7.png',
    'hf_20261006_193617_489adf37-e63e-480f-a2d2-95774c3cf091.png'
  ],
  summer: [
    'hf_20261006_193617_489adf37-e63e-480f-a2d2-95774c3cf091.png',
    'hf_20261006_194128_44aa27fc-1557-42f5-b4a6-8e2c95950aa6.png',
    'hf_20261006_194128_57e6bfd3-13fe-4f8a-b897-acd052cf65b3.png',
    'hf_20261006_194128_bfa670eb-dac3-4e15-a6b5-b28e162d3e1b.png',
    'hf_20261006_194128_f7d2e735-a65a-45ff-bad9-9d2856ed2145.png',
    'hf_20261006_194130_1e1ed3fb-3bc2-4ad2-80a1-a343f20cbfcb.png',
    'hf_20261006_194130_64d223a5-35a3-4c1b-aa9d-85da14f4b176.png',
    'hf_20261006_194130_b7b7a32e-3bd4-4a80-bfc9-13e847767d73.png',
    'hf_20261006_194130_eab45074-7e77-4844-b52f-2820e30f0b21.png',
    'hf_20261006_194133_227ee355-8610-49f5-86b5-2f9cb5948ae7.png',
    'hf_20261006_194133_11fc000a-c172-43ef-975b-68c7ebf4c8fb.png',
    'hf_20261006_194133_76fc1ab5-77f3-4dce-87fb-b27e833f253f.png'
  ]
};
const seasonalGalleryImages = {
  feature: {
    fall: `${seasonalGalleryBase}fall/${seasonalGalleryFiles.fall[0]}`,
    winter: `${seasonalGalleryBase}winter/${seasonalGalleryFiles.winter[0]}`,
    spring: `${seasonalGalleryBase}spring/${seasonalGalleryFiles.spring[0]}`,
    summer: `${seasonalGalleryBase}summer/${seasonalGalleryFiles.summer[0]}`
  },
  selectedWork: {
    fall: `${seasonalGalleryBase}fall/${seasonalGalleryFiles.fall[1]}`,
    winter: `${seasonalGalleryBase}winter/${seasonalGalleryFiles.winter[1]}`,
    spring: `${seasonalGalleryBase}spring/${seasonalGalleryFiles.spring[1]}`,
    summer: `${seasonalGalleryBase}summer/${seasonalGalleryFiles.summer[1]}`
  },
  carousel: Object.fromEntries(Object.entries(seasonalGalleryFiles).map(([season, files]) => [
    season,
    files.map(file => `${seasonalGalleryBase}${season}/${file}`)
  ]))
};

function applySeasonalGalleryImages() {
  const featureSectionImage = document.querySelector('.feature-image img');
  const selectedFeature = seasonalGalleryImages.feature[currentSeason];
  const selectedWork = seasonalGalleryImages.selectedWork[currentSeason];
  if (featureSectionImage && selectedFeature) featureSectionImage.src = selectedFeature;
  if (featureImage && selectedWork) featureImage.src = selectedWork;
  const seasonalCarousel = seasonalGalleryImages.carousel[currentSeason] || [];
  if (workTrack && seasonalCarousel.length) {
    workTrack.innerHTML = seasonalCarousel.map((image, index) => `<button class="work-card${index === 0 ? ' is-active' : ''}" type="button" data-image="${image}" data-alt="Seasonal Braun Log Homes project" data-title="Braun Log Homes project" data-type="Seasonal gallery"><img src="${image}" alt=""></button>`).join('');
    workCards = [...workTrack.querySelectorAll('.work-card')];
  }
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
