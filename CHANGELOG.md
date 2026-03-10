# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-03-10

### Added

- **Search**: Ctrl+F shortcut to focus search (aligned with common app conventions)
- **Search**: Keyboard navigation (↑/↓ to select, Enter to jump, Esc to close)
- **Sidebar**: Auto-expand category when entering command detail; scroll active item into view
- **Dynamic title**: Page title updates with current route (category/command name)
- **Related commands**: Same-category command cards at bottom of command detail page
- **Back to top**: Floating button appears when scrolled > 400px
- **404 page**: Friendly not-found page for invalid routes
- **Route transitions**: Fade animation on page navigation
- **Version config**: Centralized `src/config/version.js` for OpenClaw version; single place to update
- **Bilingual**: Category card command tags respect locale

### Changed

- **Footer**: Right-aligned; links (Based on OpenClaw v2026.3.8 · Official Docs · GitHub)
- **BackToTop**: Fixed scroll detection (listen to `window` instead of non-scrollable container)

### Fixed

- Back to top button visibility on scroll

---

[1.0.0]: https://github.com/Trey-Xu/openclaw-commands/releases/tag/v1.0.0
