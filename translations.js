// Файл переводов
const translations = {
	en: {
		// Навигация
		about: 'About',
		team: 'Team',
		ideas: 'Ideas',
		careers: 'Careers',
		contact: 'Contact',

		// Секция About Us
		aboutUs: 'About Us',
		whoWeAre: 'Who we are?',
		whoWeAreText:
			'KAGE Agency is a full-service creative agency specializing in creating unique digital solutions. We combine strategic thinking, innovative design and cutting-edge technologies.',
		ourMission: 'Our mission',
		ourMissionText:
			'We help brands stand out in the digital world by creating memorable experiences and effective solutions that drive real results.',
		projects: 'Projects',
		clients: 'Clients',
		yearsOfExperience: 'Years of experience',

		// Языки
		languages: {
			en: 'English',
			ru: 'Russian',
			de: 'German',
		},
	},
	ru: {
		// Навигация
		about: 'О нас',
		team: 'Команда',
		ideas: 'Идеи',
		careers: 'Карьера',
		contact: 'Контакты',

		// Секция About Us
		aboutUs: 'О нас',
		whoWeAre: 'Кто мы?',
		whoWeAreText:
			'KAGE Agency — это полноценное креативное агентство, специализирующееся на создании уникальных цифровых решений. Мы сочетаем стратегическое мышление, инновационный дизайн и передовые технологии.',
		ourMission: 'Наша миссия',
		ourMissionText:
			'Мы помогаем брендам выделиться в цифровом мире, создавая запоминающиеся впечатления и эффективные решения, которые приносят реальные результаты.',
		projects: 'Проектов',
		clients: 'Клиентов',
		yearsOfExperience: 'Лет опыта',

		// Языки
		languages: {
			en: 'Английский',
			ru: 'Русский',
			de: 'Немецкий',
		},
	},
	de: {
		about: 'Uber Uns',
		team: 'Team',
		ideas: 'Ideen',
		careers: 'Karriere',
		contact: 'Kontakte',

		// Секция About Us
		aboutUs: 'Uber Uns',
		whoWeAre: 'Wer sind wir?',
		whoWeAreText:
			'KAGE Agency ist eine vollwertige Kreativagentur, die sich auf die Entwicklung einzigartiger digitaler Lösungen spezialisiert hat. Wir kombinieren strategisches Denken, innovatives Design und modernste Technologien.',
		ourMission: 'Unsere Mission',
		ourMissionText:
			'Wir helfen Marken, sich in der digitalen Welt abzuheben, indem wir unvergessliche Erlebnisse und effektive Lösungen schaffen, die echte Ergebnisse liefern.',
		projects: 'Projekte',
		clients: 'Kunden',
		yearsOfExperience: 'Jahrelange Erfahrung',

		// Языки
		languages: {
			en: 'Englisch',
			ru: 'Russisch',
			de: 'Deutsch',
		},
	},
}

// Функция получения перевода
function getTranslation(key, lang = 'en') {
	const keys = key.split('.');
	let result = translations[lang];
	
	for (const k of keys) {
		if (result && result[k]) {
			result = result[k];
		} else {
			return translations.en[key] || key; // Fallback на английский
		}
	}
	
	return result || key;
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { translations, getTranslation };
}