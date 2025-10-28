const pagination = require('hexo-pagination');

const defaultConfig = {
  enable: true,
  per_page: 10,
  order_by: '-date'
};

function generator(locals) {
  const cfg = Object.assign({}, defaultConfig, this.config.i18n_category_generator || {});
  if (!cfg.enable) return [];

  const config = this.config;
  const languages = config.language || ['en'];
  const defaultLang = Array.isArray(languages) ? languages[0] : languages;
  const perPage = cfg.per_page !== undefined ? cfg.per_page : 
    (config.category_generator && config.category_generator.per_page !== undefined
      ? config.category_generator.per_page
      : config.per_page);
  const orderBy = cfg.order_by || '-date';
  const pages = [];
  const { Query } = this.model('Post');

  const categories = locals.categories;

  categories.forEach(category => {
    languages.forEach(lang => {
      const sortedPosts = category.posts.filter(post => {
        const postLang = post.lang || defaultLang;
        return postLang === lang;
      }).toArray().sort((a, b) => {
        const redirectA = a.original_lang_url ? 1 : 0;
        const redirectB = b.original_lang_url ? 1 : 0;
        if (redirectA !== redirectB) return redirectA - redirectB;
        
        // Apply order_by sorting
        if (orderBy === '-date') return b.date - a.date;
        if (orderBy === 'date') return a.date - b.date;
        if (orderBy === '-title') return b.title.localeCompare(a.title);
        if (orderBy === 'title') return a.title.localeCompare(b.title);
        return b.date - a.date; // fallback to -date
      });

      if (sortedPosts.length === 0) return;

      const langPosts = new Query(sortedPosts);
      const langPrefix = lang === defaultLang ? '' : `/${lang}`;
      const categoryPath = `${langPrefix}/categories/${category.slug}/`;

      pages.push(...pagination(categoryPath, langPosts, {
        perPage,
        layout: ['category', 'archive', 'index'],
        format: 'page/%d/',
        data: {
          category: category.name,
          slug: category.slug,
          lang: lang
        }
      }));
    });
  });

  return pages;
}

if (typeof hexo !== 'undefined') {
  hexo.extend.generator.register('i18n-category', generator);
}

module.exports = generator;
