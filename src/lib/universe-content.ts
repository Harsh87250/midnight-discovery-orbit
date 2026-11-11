export const chapters = [
  { path: '/little-universe', label: 'Her Little Universe', short: 'Little universe', symbol: '🌷', description: 'Beautifully, quietly, entirely you.' },
  { path: '/little-things', label: 'A Thousand Little Things', short: 'Little things', symbol: '✧', description: 'A sky full of reasons to smile.' },
  { path: '/beyond-the-stars', label: 'Beyond the Stars', short: 'Beyond the stars', symbol: '☾', description: 'A little moonlight for your soul.' },
  { path: '/music', label: 'Music for the Midnight', short: 'Midnight music', symbol: '♫', description: 'For feelings that sound like a song.' },
  { path: '/letter', label: 'A Letter for You', short: 'The letter', symbol: '✉', description: 'Some thoughts, sealed with stardust.' },
  { path: '/surprise', label: 'The Midnight Surprise', short: 'A surprise', symbol: '✦', description: 'Where shall the night take us?' },
] as const;

export const compliments = [
  'Your smile has a way of making ordinary moments feel special.',
  'Some people are beautiful in ways that words cannot completely explain.',
  'You have your own kind of magic. Never lose it.',
  'Even the quietest stars make the darkest skies beautiful.',
  "There's something wonderfully different about you.",
  'Maybe the most beautiful things are the ones we cannot explain.',
  "You don't even have to try to make a moment memorable.",
  'Keep that beautiful little spark of yours alive.',
];

export const encouragements = [
  'Your worth is never measured by a result.',
  "You don't have to have everything figured out today.",
  'Take your time. Beautiful things grow at their own pace.',
  'Never forget that you are capable of more than you sometimes believe.',
  "Be proud of how far you've come, even when the journey feels unfinished.",
];

export const letter = [
  'Hey you...',
  "I don't know if words can ever fully describe how special someone can be.",
  'Sometimes, a person becomes a beautiful part of ordinary days without even realizing it.',
  'A random conversation, a little smile, a funny moment, or even a simple message can make an ordinary day feel different.',
  'So I wanted to create something unusual.',
  'Not something expensive or perfect, but something made with imagination, a little creativity, some stars, and a lot of thought.',
  'I hope this little universe makes you smile.',
  'Never forget that you deserve happiness, peace, beautiful opportunities, and all the little things that make life special.',
  'Keep shining, keep being yourself, and never lose that beautiful spark.',
  'Some people are simply worth creating a universe for.',
  'With a little warmth,\nSomeone who wishes you happiness.',
];

export const featuredTrack = {
  title: 'Dilruba Dilnashi', artist: 'Rito Riba', language: 'Hindi',
  url: 'https://open.spotify.com/track/3ZhV3K4tmdYofyLKPS5KqF',
  officialTitle: 'Dilruba Dilnasheen',
};

// Identity is resolved only by the final scene, never by shared navigation or metadata.
export function revealIdentity(elapsedSeconds: number) {
  return { name: elapsedSeconds >= 13 ? 'Shalu' : null, nickname: elapsedSeconds >= 18 ? 'Ugglu Buglu' : null };
}

export function pageHead(title: string, description: string) {
  return { meta: [
    { title: `${title} · Somewhere Between Dreams & Stars` },
    { name: 'description', content: description },
    { property: 'og:title', content: `${title} · Somewhere Between Dreams & Stars` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] };
}