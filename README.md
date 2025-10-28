# hexo-generator-i18n-category

Hexo plugin for generating i18n category pages with language-specific filtering and sorting.

## Features

- Generates category pages for each language
- Filters posts by language
- Sorts posts with redirect posts (original_lang_url) appearing last
- Supports pagination
- Can be toggled on/off via configuration

## Installation

Add to your `package.json`:

```json
{
  "dependencies": {
    "hexo-generator-i18n-category": "file:../hexo-generator-i18n-category"
  }
}
```

## Configuration

In `_config.yml`:

```yaml
# Enable/disable the plugin (default: true)
i18n_category_generator:
  enable: true
  per_page: 10      # Posts per page (default: 10)
  order_by: -date   # Sort order (default: -date)
```

### Configuration Options

- `enable`: Enable/disable the plugin (default: `true`)
- `per_page`: Number of posts per page (default: `10`)
- `order_by`: Sort order for posts (default: `-date`)
  - `-date`: Newest first
  - `date`: Oldest first  
  - `-title`: Reverse alphabetical by title
  - `title`: Alphabetical by title

To disable:

```yaml
i18n_category_generator:
  enable: false
```

## Usage

The plugin automatically generates category pages for all configured languages. No additional configuration needed beyond the standard Hexo language settings.

## I18n Structure

The plugin generates language-specific category pages based on your Hexo language configuration:

- **Default language**: Categories at `/categories/{category}/` (root level)
- **Other languages**: Categories at `/{lang}/categories/{category}/`

Example with `language: ['en', 'zh-TW', 'zh-CN']`:
```
/categories/tech/          # English (default language)
/zh-TW/categories/tech/    # Traditional Chinese
/zh-CN/categories/tech/    # Simplified Chinese
```

## Original Language URL Support

Posts with `original_lang_url` metadata are sorted with lowest priority in category pages:

- **Purpose**: Indicates content is only available in original language
- **Behavior**: Shows redirect notice instead of content
- **Ordering**: Posts with `original_lang_url` appear last in category pages
- **Messages**: Automatically localized based on post language

Example post with original language URL:
```yaml
---
title: "Post Title"
lang: zh-TW
categories: [tech]
original_lang_url: "/en/original-post/"
---
```
