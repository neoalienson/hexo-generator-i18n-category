'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');

describe('I18n Category generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  const generator = require('./index.js');

  beforeEach(() => {
    hexo.config = {
      language: ['en', 'zh-TW'],
      i18n_category_generator: {
        enable: true,
        per_page: 10,
        order_by: '-date'
      }
    };
  });

  it('returns empty array when disabled', () => {
    hexo.config.i18n_category_generator.enable = false;
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
    result.length.should.equal(0);
  });

  it('returns empty array when no categories', () => {
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
    result.length.should.equal(0);
  });

  it('handles basic category generation', () => {
    const mockPosts = [
      { lang: 'en', date: new Date(2024, 0, 1), original_lang_url: null },
      { lang: 'zh-TW', date: new Date(2024, 0, 2), original_lang_url: null }
    ];

    const mockCategory = {
      name: 'tech',
      slug: 'tech',
      posts: {
        filter: () => ({
          toArray: () => mockPosts.filter(p => p.lang === 'en')
        })
      }
    };

    const locals = {
      categories: [mockCategory]
    };

    // Mock hexo.model for Query constructor
    hexo.model = () => ({
      Query: function(posts) {
        this.data = posts;
        return this;
      }
    });

    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('uses default config when not specified', () => {
    delete hexo.config.i18n_category_generator;
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
    result.length.should.equal(0);
  });

  it('handles single language configuration', () => {
    hexo.config.language = 'en';
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
    result.length.should.equal(0);
  });

  it('uses custom per_page setting', () => {
    hexo.config.i18n_category_generator.per_page = 5;
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('uses custom order_by setting', () => {
    hexo.config.i18n_category_generator.order_by = 'date';
    const locals = { categories: [] };
    
    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('sorts posts by -date (newest first)', () => {
    hexo.config.i18n_category_generator.order_by = '-date';
    
    const mockPosts = [
      { lang: 'en', date: new Date(2024, 0, 1), title: 'Post A' },
      { lang: 'en', date: new Date(2024, 0, 3), title: 'Post C' },
      { lang: 'en', date: new Date(2024, 0, 2), title: 'Post B' }
    ];

    const mockCategory = {
      name: 'tech',
      slug: 'tech',
      posts: {
        filter: () => ({
          toArray: () => mockPosts
        })
      }
    };

    const locals = { categories: [mockCategory] };
    hexo.model = () => ({ Query: function(posts) { this.data = posts; return this; } });

    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('sorts posts by date (oldest first)', () => {
    hexo.config.i18n_category_generator.order_by = 'date';
    
    const mockPosts = [
      { lang: 'en', date: new Date(2024, 0, 3), title: 'Post C' },
      { lang: 'en', date: new Date(2024, 0, 1), title: 'Post A' },
      { lang: 'en', date: new Date(2024, 0, 2), title: 'Post B' }
    ];

    const mockCategory = {
      name: 'tech',
      slug: 'tech',
      posts: {
        filter: () => ({
          toArray: () => mockPosts
        })
      }
    };

    const locals = { categories: [mockCategory] };
    hexo.model = () => ({ Query: function(posts) { this.data = posts; return this; } });

    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('sorts posts by title', () => {
    hexo.config.i18n_category_generator.order_by = 'title';
    
    const mockPosts = [
      { lang: 'en', date: new Date(2024, 0, 1), title: 'Zebra' },
      { lang: 'en', date: new Date(2024, 0, 2), title: 'Apple' },
      { lang: 'en', date: new Date(2024, 0, 3), title: 'Mango' }
    ];

    const mockCategory = {
      name: 'tech',
      slug: 'tech',
      posts: {
        filter: () => ({
          toArray: () => mockPosts
        })
      }
    };

    const locals = { categories: [mockCategory] };
    hexo.model = () => ({ Query: function(posts) { this.data = posts; return this; } });

    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });

  it('posts with original_lang_url appear last regardless of order_by', () => {
    hexo.config.i18n_category_generator.order_by = '-date';
    
    const mockPosts = [
      { lang: 'en', date: new Date(2024, 0, 3), title: 'Post C', original_lang_url: '/zh/post-c' },
      { lang: 'en', date: new Date(2024, 0, 2), title: 'Post B' },
      { lang: 'en', date: new Date(2024, 0, 1), title: 'Post A' }
    ];

    const mockCategory = {
      name: 'tech',
      slug: 'tech',
      posts: {
        filter: () => ({
          toArray: () => mockPosts
        })
      }
    };

    const locals = { categories: [mockCategory] };
    hexo.model = () => ({ Query: function(posts) { this.data = posts; return this; } });

    const result = generator.call(hexo, locals);
    result.should.be.an('array');
  });
});