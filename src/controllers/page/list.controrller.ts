import type { Request, Response } from 'express';

export async function top100Anime(req: Request, res: Response) {
	const { type, category } = req.params;

	if (type === 'anime' && category === 'top') {
		return res.render('list.ejs', {
			headTitle: 'Top 100 Anime | AnimaKU',
			title: 'Top 100 Highest Rated Anime',
			description:
				'A curated selection of the best-rated anime of all time. These titles stand out for their exceptional storytelling, animation, and fan reception.',
			js: '/js/animeTopService.js',
		});
	}

	if (type === 'anime' && category === 'trending') {
		return res.render('list.ejs', {
			headTitle: 'Trending Anime | AnimaKU',
			title: 'Trending Anime Right Now',
			description:
				'See what’s hot right now. These anime are rising fast in popularity and catching everyone’s attention this season.',
			js: '/js/animeTrendingService.js',
		});
	}

	if (type === 'manga' && category === 'top') {
		return res.render('list.ejs', {
			headTitle: 'Top 100 Manga | AnimaKU',
			title: 'Top 100 Highest Rated Manga',
			description:
				'These are the titles that consistently rise to the top thanks to great stories, strong characters, and loyal readers.',
			js: '/js/mangaTopService.js',
		});
	}
}
