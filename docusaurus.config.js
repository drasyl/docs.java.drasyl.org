// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'drasyl',
  url: 'https://docs.java.drasyl.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'drasyl', // Usually your GitHub org/user name.
  projectName: 'drasyl', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/drasyl/docs.java.drasyl.org/blob/master',
          lastVersion: '0.12',
          versions: {
            current: {
              label: '0.13 (nightly) 🚧',
              path: 'master',
            },
            // '0.7': {
            //   path: 'v0.7'
            // }
          },
          routeBasePath: "/",
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'drasyl',
        logo: {
          alt: 'drasyl Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/drasyl/drasyl',
            position: 'right',
            className: 'header-github-link',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Getting Started',
                to: 'getting-started',
              },
              {
                label: 'Example Applications',
                href: 'https://github.com/drasyl/drasyl/tree/master/drasyl-examples',
              },
              {
                label: 'Javadoc',
                href: 'https://api.drasyl.org/',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/drasyl/drasyl/',
              },
              {
                label: 'Docker',
                href: 'https://hub.docker.com/r/drasyl/drasyl-java',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/2tcZPy7BCu',
              },
              {
                label: 'Blog',
                href: 'https://drasyl.org/blog',
              },
              {
                label: 'Network Explorer',
                href: 'https://drasyl.network',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Changelog',
                href: 'https://github.com/drasyl/drasyl/blob/master/CHANGELOG.md',
              },
              {
                label: 'Contributing',
                href: 'https://github.com/drasyl/drasyl/blob/master/CONTRIBUTING.md',
              },
              {
                label: 'Statuspage',
                href: 'https://status.drasyl.org/',
              },
            ],
          },
        ],
        copyright: `Copyright © 2020-${new Date().getFullYear()} Heiko Bornholdt and Kevin Röbert.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java']
      },
      announcementBar: {
        id: 'drasyl-java-documentation', // einzigartig
        content:
          '⚠️ <strong>IMPORTANT:</strong> This is <strong>drasyl-java</strong> (formerly drasyl). drasyl now refers to our new SDN solution. Visit <a href="https://drasyl.org" style="color: #ffffff; text-decoration: underline; font-weight: bold;">drasyl.org</a>',
        backgroundColor: '#ff6b35',
        textColor: '#ffffff',
        isCloseable: false,
      },
    }),
        themes: [
            // ... Your other themes.
            [
                require.resolve("@easyops-cn/docusaurus-search-local"),
                {
                    hashed: true,
                    indexBlog: false,
                    docsRouteBasePath: "/",
                },
            ],
        ],
        scripts: [],
};

module.exports = config;
