import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Kaushik Srivatsan",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "ksrivats.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "Zodiak, serif",
        body: "Crimson Pro, serif",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#FFF5E4",
          lightgray: "#f0e6d2",
          gray: "#b8a082",
          darkgray: "#5d4e37",
          dark: "#461031",
          secondary: "#461031",
          tertiary: "#8b6f47",
          highlight: "rgba(70, 16, 49, 0.1)",
          textHighlight: "rgba(70, 16, 49, 0.15)",
        },
        darkMode: {
          light: "#3E0829",
          lightgray: "#4a1d35",
          gray: "#6b4c6b",
          darkgray: "#c9b8c9",
          dark: "#FFF5E4",
          secondary: "#FFF5E4",
          tertiary: "#d4c4a8",
          highlight: "rgba(255, 245, 228, 0.1)",
          textHighlight: "rgba(255, 245, 228, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
