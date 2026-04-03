(()=>{var a={};a.id=4230,a.ids=[4230,5531,7817,7912],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3421:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(71237),e=c(55088),f=c(17679);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28402:a=>{"use strict";a.exports=import("@opennextjs/cloudflare")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},41499:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>H,patchFetch:()=>G,routeModule:()=>C,serverHooks:()=>F,workAsyncStorage:()=>D,workUnitAsyncStorage:()=>E});var d={};c.r(d),c.d(d,{POST:()=>A});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(67817);let w=`-- Lizardware CMS Database Structure
-- Generated automatically.
-- Generated at: 2026-04-03T00:32:27.497Z


-- File: 000_baseline_schema.sql
-- Migration 000: Baseline Schema
-- Final consolidated schema for Lizardware CMS

-- Core V2 Tables
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    schema_version TEXT DEFAULT '1.0',
    layout_json TEXT NOT NULL, 
    seo_json TEXT,             
    status TEXT DEFAULT 'draft',
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL, 
    excerpt TEXT,
    status TEXT DEFAULT 'draft',
    published_at INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS saved_blocks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    component_tree_json TEXT NOT NULL, 
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS navigation (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    items_json TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value_json TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    dimensions TEXT,
    filesize INTEGER,
    tags TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS internal_docs (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    layout_json TEXT NOT NULL,
    hub_type TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Legacy Surviving Tables

CREATE TABLE IF NOT EXISTS redirects (
    id TEXT PRIMARY KEY,
    source_path TEXT UNIQUE NOT NULL,
    destination_path TEXT NOT NULL,
    type INTEGER DEFAULT 301,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS seo_checkups (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    score INTEGER NOT NULL,
    issues_json TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS authors (
    id TEXT PRIMARY KEY, -- Clerk ID
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    metadata_json TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS changelogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL UNIQUE,
    version_name TEXT,
    date TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    status TEXT DEFAULT 'draft',
    category TEXT DEFAULT 'feature',
    type TEXT DEFAULT 'public',
    breaking_change INTEGER DEFAULT 0,
    author TEXT,
    author_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    subscribed_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS media_blobs (
    id TEXT PRIMARY KEY,
    mime_type TEXT NOT NULL,
    data BLOB NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS roadmap_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS roadmap_changelog_links (
    roadmap_item_id TEXT NOT NULL,
    changelog_id TEXT NOT NULL,
    linked_at INTEGER DEFAULT (strftime('%s', 'now')),
    PRIMARY KEY (roadmap_item_id, changelog_id),
    FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items(id) ON DELETE CASCADE,
    FOREIGN KEY (changelog_id) REFERENCES changelogs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS forum_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    user_id TEXT, -- Nullable for visitor
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    user_id TEXT, -- Nullable for visitor
    content TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_reactions (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT, -- Nullable for visitor
    reaction_type TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS forum_reports (
    id TEXT PRIMARY KEY,
    reported_item_id TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'thread' or 'post'
    reporter_id TEXT, -- Nullable for visitor
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- New Forum Profiles (Replacing forum_users)
CREATE TABLE IF NOT EXISTS forum_profiles (
    id TEXT PRIMARY KEY,              -- Clerk user ID (matches authors.id)
    reputation INTEGER DEFAULT 0,
    is_moderator INTEGER DEFAULT 0,
    bio TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Default site settings
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('media.storage_provider', '"none"');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('seo.title_template', '"{page_title} | {site_name}"');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('seo.robots_txt', '"User-agent: *\\nAllow: /\\nDisallow: /admin/\\nDisallow: /api/\\nDisallow: /setup/\\n\\nSitemap: {{site_url}}/sitemap.xml"');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.blog', 'true');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.gallery', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.newsletter', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.monetization', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.comments', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.servicePages', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.menu', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.booking', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.customerPortal', 'false');
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('features.analytics', 'false');

`,x={blank:`-- Seed: Blank Canvas
-- Created: 2026-01-03
-- Strategy: Minimal structure to prevent 404s, but no demo content.

-- 1. Minimal Home Page (Required for routing)
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order, created_at, updated_at)
VALUES (
  'page-home',
  'home',
  'Welcome',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Blank Canvas","subtitle":"Welcome to your new site. Start building by adding blocks in the admin dashboard.","ctaText":"Go to Admin","ctaLink":"/admin","alignment":"center"},"styleOptions":{"background":"primary","padding":"large"}}]',
  '{"title":"Welcome - Blank Canvas","description":"New site placeholder"}',
  'published',
  0,
  strftime('%s','now'),
  strftime('%s','now')
);

-- 1.5 Legal Pages (Minimalist)
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES 
('page-support', 'support', 'Support', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Support","subtitle":"How can we help?","ctaText":"","alignment":"center"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"content","type":"richtext","props":{"content":"<p>Need assistance? Contact our team at <a href=\\"mailto:info@example.com\\">info@example.com</a>.</p>"},"styleOptions":{"background":"transparent","padding":"medium","maxWidth":"4xl"}}]', '{"title":"Support","description":"How can we help?"}', 'published', 60),
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy","subtitle":"How we handle your data.","ctaText":"","alignment":"left"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"content","type":"richtext","props":{"content":"<h2>Information Collection</h2><p>We only collect information necessary to provide our services.</p>"},"styleOptions":{"background":"transparent","padding":"medium","maxWidth":"4xl"}}]', '{"title":"Privacy Policy","description":"How we handle your data."}', 'published', 80),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service","subtitle":"Read our terms of use.","ctaText":"","alignment":"left"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"content","type":"richtext","props":{"content":"<h2>Usage Guidelines</h2><p>By using this site, you agree to our basic terms of conduct.</p>"},"styleOptions":{"background":"transparent","padding":"medium","maxWidth":"4xl"}}]', '{"title":"Terms of Service","description":"Guidelines for use."}', 'published', 90);

-- 2. Configuration
-- 2. Navigation
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","type":"link","order_index":10},
    {"id":"admin","label":"Admin Login","href":"/admin","type":"link","order_index":20}
  ]'
);

-- 3. Settings
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"New Site","title_template":"%s | Lizardware","default_description":"Built with Lizardware CMS"}');
`,blog:`-- Seed: Blog / Publishing
-- Created: 2026-01-03
-- Strategy: Content-focused structure

-- 1. Categories (REMOVED - V2 uses tags within posts)

-- 2. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('editor', 'Blog', 'Editor', 'https://placehold.co/200x200/6366f1/ffffff/png?text=BE', '{"bio":"The voice behind {{siteName}}. Writer, photographer, and storyteller exploring the intersection of creativity and technology."}', strftime('%s','now'), strftime('%s','now')),
  ('contributor', 'Guest', 'Contributor', 'https://placehold.co/200x200/10b981/ffffff/png?text=GC', '{"bio":"Guest writer and lifestyle expert focused on intentional living and digital wellness. Former tech journalist."}', strftime('%s','now'), strftime('%s','now')),
  ('traveler', 'World', 'Traveler', 'https://placehold.co/200x200/f59e0b/ffffff/png?text=WT', '{"bio":"Sharing journeys from around the world through photography and narrative. Visited 40+ countries across 6 continents."}', strftime('%s','now'), strftime('%s','now'));

-- 3. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-blog-storytelling', 'placeholder', 'https://placehold.co/1200x630/6366f1/ffffff/png?text=The+Art+of+Storytelling', 'Vintage typewriter on a wooden desk', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-blog-minimalism', 'placeholder', 'https://placehold.co/1200x630/10b981/ffffff/png?text=Digital+Minimalism', 'Clean desk with a single laptop and a plant', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-blog-kyoto', 'placeholder', 'https://placehold.co/1200x630/f59e0b/ffffff/png?text=Kyoto+Autumn', 'Golden temple surrounded by red maple trees', '1200x630', 60000, strftime('%s','now'), strftime('%s','now')),
('seed-blog-publishing', 'placeholder', 'https://placehold.co/1200x630/8b5cf6/ffffff/png?text=Future+of+Publishing', 'Abstract network of connected dots and lines', '1200x630', 55000, strftime('%s','now'), strftime('%s','now'));

-- 4. Blog Posts
INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-storytelling',
  'the-art-of-storytelling',
  'The Art of Storytelling',
  '{"blocks":[{"type":"header","content":"Why Stories Matter"},{"type":"paragraph","content":"Human beings are wired for stories. From ancient campfires to modern streaming services, narrative is how we make sense of the world."},{"type":"header","content":"The Elements of a Good Story"},{"type":"list","items":["Character: Who is it about?","Conflict: What stands in their way?","Resolution: How does it end?"]},{"type":"paragraph","content":"Whether you''re writing a novel or a blog post, these elements are essential."}]}',
  'Exploring the fundamental elements of narrative structure.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-minimalism',
  'digital-minimalism',
  'Embracing Digital Minimalism',
  '{"blocks":[{"type":"header","content":"Less is More"},{"type":"paragraph","content":"In a world of constant notifications and infinite scrolling, reclaiming your attention is a radical act."},{"type":"paragraph","content":"Digital minimalism isn''t about rejecting technology; it''s about using it intentionally."},{"type":"quote","content":"The cost of a thing is the amount of what I call life which is required to be exchanged for it, immediately or in the long run.","author":"Henry David Thoreau"}]}',
  'Thoughts on intentional technology use.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-kyoto',
  'travel-diary-kyoto',
  'Travel Diary: Autumn in Kyoto',
  '{"blocks":[{"type":"header","content":"Red Maples and Gold Temples"},{"type":"paragraph","content":"Kyoto in autumn is a sight to behold. The city transforms into a canvas of vibrant reds, oranges, and golds."},{"type":"paragraph","content":"We spent our days wandering through Arashiyama and our evenings exploring the narrow alleys of Pontocho."}]}',
  'A visual journey through Kyoto during the fall foliage season.',
  'published',
  strftime('%s','now', '-14 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-future',
  'future-of-publishing',
  'The Future of Independent Publishing',
  '{"blocks":[{"type":"header","content":"The Shift to Niche"},{"type":"paragraph","content":"We are entering a new era of independent publishing. As major platforms consolidate, readers are seeking out specialized voices and unique perspectives."},{"type":"header","content":"What it means for you"},{"type":"list","items":["Ownership: Owning your platform is more important than ever.","Direct Relationship: Connect with your readers without intermediaries.","Value over Volume: Focus on depth and quality over daily posting."]}]}',
  'A forward-looking perspective on the independent publishing landscape.',
  'published',
  strftime('%s','now', '-21 days'),
  strftime('%s','now'),
  strftime('%s','now')
);





-- 5. Navigation Items (Blog Focus)
-- 5. Navigation Items (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","type":"link","order_index":10},
    {"id":"blog","label":"Blog","href":"/blog","type":"module","order_index":20,"feature_flag":"blog"},
    {"id":"about","label":"About","href":"/about","type":"page","order_index":30},
    {"id":"contact","label":"Contact","href":"/contact","type":"page","order_index":40},
    {"id":"support","label":"Support","href":"/support","type":"page","order_index":50},
    {"id":"admin","label":"Admin Login","href":"/admin","type":"link","order_index":99}
  ]'
);

-- 6. Page Definitions (V2 Format)
-- Home Page (Custom for Blog)
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order, created_at, updated_at)
VALUES (
  'page-home',
  'home',
  'Welcome to {{siteName}}',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"{{siteName}}","subtitle":"Read. Think. Grow.","ctaText":"","alignment":"center"},"styleOptions":{"background":"primary","padding":"large"}},{"id":"topics","type":"feature-grid","props":{"title":"What I Write About","features":[{"title":"Writing & Creativity","description":"Exploring the craft of storytelling and narrative structure."},{"title":"Lifestyle & Minimalism","description":"Intentional living in a digital age."},{"title":"Travel & Photography","description":"Visual journeys and cultural exploration."}]},"styleOptions":{"background":"transparent","padding":"medium"}},{"id":"blog-cta","type":"cta","props":{"title":"Latest Articles","text":"Dive into our most recent thoughts and discoveries.","buttonText":"Read the Blog","buttonHref":"/blog"},"styleOptions":{"background":"alternate","padding":"medium"}}]',
  '{"title":"Welcome to {{siteName}}","description":"The home of {{siteName}} - a blog about writing, lifestyle, and travel"}',
  'published',
  0,
  strftime('%s','now'),
  strftime('%s','now')
);

-- About Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-about',
  'about',
  'Behind the Scenes',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Hi, I''m the Editor.","subtitle":"A digital garden for thoughts on writing, technology, and intentional living.","ctaText":"","alignment":"left"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"intro","type":"richtext","props":{"content":"<p class=\\"lead text-xl\\">I started {{siteName}} with a simple goal: to document the things I''m learning in public.</p><p>What began as a small collection of notes has grown into a community of readers who care about <strong>craft, clarity, and curiosity</strong>.</p>"},"styleOptions":{"background":"transparent","padding":"medium"}},{"id":"grid","type":"feature-grid","props":{"title":"The Philosophy","columns":3,"features":[{"title":"Slow Web","description":"Resisting the urge for hot takes and clickbait in favor of thoughtful, evergreen content."},{"title":"Open Works","description":"Building in public and sharing the process, not just the polished result."},{"title":"Minimalism","description":"Focusing on the essential—in design, in writing, and in life."}]},"styleOptions":{"background":"secondary","padding":"medium"}},{"id":"story","type":"richtext","props":{"content":"<h2>My Background</h2><p>By day, I work in software. By night, I write about the intersection of humanity and our tools.</p>"}}]',
  '{"title":"Behind the Scenes - {{siteName}}","description":"About the voice and vision behind {{siteName}}."}',
  'published',
  10
);

-- Contact Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-contact',
  'contact',
  'Contact',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Contact Us","subtitle":"Have a question or story idea?","ctaText":""},"styleOptions":{"background":"primary","padding":"large"}},{"id":"form","type":"contact-form","props":{"title":"Send a Message","emailTo":"hello@example.com"},"styleOptions":{"background":"transparent","padding":"medium"}}]',
  '{"title":"Contact Us - {{siteName}}","description":"Get in touch with the {{siteName}} team."}',
  'published',
  70
);

-- Support Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-support',
  'support',
  'Support',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"How can we help?","subtitle":"Find answers to common questions or reach out for support.","ctaText":"","alignment":"center"},"styleOptions":{"background":"primary","padding":"large"}},{"id":"faq","type":"feature-grid","props":{"title":"FAQ","columns":2,"features":[{"title":"Subscribing","description":"You can join our newsletter to get weekly updates."},{"title":"Content Usage","description":"All articles are published under CC-BY-SA license."}]},"styleOptions":{"background":"secondary","padding":"medium"}},{"id":"cta","type":"cta","props":{"title":"Still need help?","text":"Reach out directly for specialized support.","buttonText":"Contact Support","buttonHref":"/contact"},"styleOptions":{"background":"alternate","padding":"medium"}}]',
  '{"title":"Support - {{siteName}}","description":"Help resources and contact options."}',
  'published',
  60
);

-- Privacy & Terms
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES 
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy","subtitle":"How we handle your data."}}]', '{"title":"Privacy Policy","description":"How we handle your data."}', 'published', 80),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service","subtitle":"Guidelines for use."}}]', '{"title":"Terms of Service","description":"Guidelines for use."}', 'published', 90);

-- 7. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"{{siteName}}","title_template":"%s | {{siteName}}","default_description":"A personal blog about writing, lifestyle, and travel."}');
`,marketing:`-- Consolidates content from migrations 098, 099, 102, 106, 107

-- 1. Categories (REMOVED - V2 uses tags)

-- 1. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('marketing', 'Marketing', 'Team', 'https://placehold.co/200x200/ec4899/ffffff/png?text=MT', '{"bio":"Strategic insights from our collaborative team of digital marketers."}', strftime('%s','now'), strftime('%s','now')),
  ('seo-specialist', 'SEO', 'Specialist', 'https://placehold.co/200x200/22c55e/ffffff/png?text=SS', '{"bio":"Technical SEO expert sharing the latest algorithm updates and ranking strategies."}', strftime('%s','now'), strftime('%s','now')),
  ('content-strategist', 'Content', 'Strategist', 'https://placehold.co/200x200/6366f1/ffffff/png?text=CS', '{"bio":"Crafting compelling narratives that resonate with target audiences."}', strftime('%s','now'), strftime('%s','now')),
  ('paid-media-buyer', 'Paid', 'Media Buyer', 'https://placehold.co/200x200/94a3b8/ffffff/png?text=PM', '{"bio":"Optimizing ad spend for maximum ROI across all major platforms."}', strftime('%s','now'), strftime('%s','now'));

INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order, created_at, updated_at)
VALUES (
  'page-home',
  'home',
  'Home',
  '1.0',
  '[
    {
      "id": "home-hero",
      "type": "gradient-hero",
      "props": {
        "title": "Scale Your Influence.",
        "subtitle": "We are a full-service creative agency that combines data-driven performance with world-class storytelling.",
        "primaryButtonText": "View Our Portfolio",
        "primaryButtonHref": "/blog",
        "secondaryButtonText": "Who We Are",
        "secondaryButtonHref": "/about"
      }
    },
    {
      "id": "capabilities",
      "type": "feature-grid-premium",
      "props": {
        "title": "Agency Capabilities",
        "items": [
          {"icon": "📢", "title": "Brand Identity", "description": "Defining your voice, visual language, and positioning in a crowded market."},
          {"icon": "🎯", "title": "Paid Acquisition", "description": "Hyper-targeted campaigns across Meta, Google, and LinkedIn with a focus on CAC optimization."},
          {"icon": "✍️", "title": "Content Engine", "description": "Scaling high-quality editorial, video, and social content that builds communities."},
          {"icon": "🔍", "title": "SEO Mastery", "description": "Technical and creative search strategies that drive organic authority and intent-based traffic."},
          {"icon": "⚙️", "title": "Growth Systems", "description": "Building the marketing automation and CRM stacks that power scalable operations."},
          {"icon": "📊", "title": "Data Science", "description": "Lifting the veil on your metrics with custom attribution models and real-time reporting."}
        ]
      },
      "styleOptions": {
        "background": "secondary",
        "padding": "large"
      }
    },
    {
      "id": "methodology",
      "type": "feature-section-premium",
      "props": {
        "title": "The Growth Velocity Framework",
        "content": "Most agencies guess. We validate. Our proprietary methodology ensures every dollar spent is an investment in learning and scaling what works.",
        "items": [
          {"title": "Phase 1: Deep Audit", "description": "Uncovering the friction points in your current funnel and market positioning."},
          {"title": "Phase 2: Agile Sprints", "description": "Rapid testing of creative and channel hypotheses to find your growth levers."},
          {"title": "Phase 3: Scale & Defend", "description": "Aggressively scaling winning strategies while building long-term brand defensibility."}
        ]
      },
      "styleOptions": {
        "background": "transparent",
        "padding": "large"
      }
    }
  ]',
  '{"title":"Home - Agency","description":"Strategic Marketing Solutions for Modern Brands"}',
  'published',
  0,
  strftime('%s','now'),
  strftime('%s','now')
);


-- About Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-about',
  'about',
  'Who We Are',
  '1.0',
  '[{"id":"about-hero","type":"hero","props":{"title":"We Are Growth Architects","subtitle":"A team of data scientists, creatives, and strategists obsessed with ROI.","alignment":"left"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"story","type":"richtext","props":{"content":"<div class=''max-w-3xl mx-auto''><p class=''text-xl font-medium''>Marketing isn''t magic. It''s math and psychology.</p></div>"}},{"id":"values","type":"feature-grid","props":{"title":"Core Values","items":[{"title":"Radical Transparency","description":"You see every dollar spent and every click generated."},{"title":"Agile Testing","description":"We fail fast and scale what works."},{"title":"Client Obsession","description":"Your revenue goals are our KPIs."}]},"styleOptions":{"background":"secondary","padding":"medium"}}]',
  '{"title":"Who We Are - Agency","description":"The team behind your growth."}',
  'published',
  40
);

-- Contact Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-contact',
  'contact',
  'Contact Us',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Get in Touch","subtitle":"Let''s discuss your next growth phase.","ctaText":""},"styleOptions":{"background":"primary","padding":"large"}},{"id":"form","type":"contact-form","props":{},"styleOptions":{"background":"transparent","padding":"medium"}}]',
  '{"title":"Contact Us - Agency","description":"We''d love to hear from you."}',
  'published',
  50
);



-- Support Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-support',
  'support',
  'Support',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Support","subtitle":"How can we help?","ctaText":"","alignment":"center"},"styleOptions":{"background":"primary","padding":"medium"}},{"id":"content","type":"richtext","props":{"content":"<p>Need assistance?</p>"},"styleOptions":{"background":"transparent","padding":"medium","maxWidth":"4xl"}}]',
  '{"title":"Support - Agency","description":"How can we help?"}',
  'published',
  80
);

-- Privacy & Terms
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES 
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy","subtitle":"How we handle data."}}]', '{"title":"Privacy Policy","description":"How we handle data."}', 'published', 85),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service","subtitle":"Guidelines for use."}}]', '{"title":"Terms of Service","description":"Guidelines for use."}', 'published', 90);
('terms', 'Terms of Service', '', 'Official terms of service for {{siteName}} marketing services.', 'published', 'blocks', json('[
  {
    "id": "hero",
    "type": "hero",
    "props": {
      "title": "Terms of Service",
      "subtitle": "Guidelines for our marketing partnerships and services.",
      "alignment": "center"
    },
    "styleOptions": {"background": "primary", "padding": "medium"}
  },
  {
    "id": "use",
    "type": "richtext",
    "props": {
      "content": "<h2>Service Agreement</h2><p>By engaging with {{siteName}}, you agree to these terms governing our digital marketing and brand strategy services. We strive for excellence in every campaign.</p>"
    },
    "styleOptions": {"background": "transparent", "padding": "medium", "maxWidth": "4xl"}
  },
  {
    "id": "scope",
    "type": "richtext",
    "props": {
      "content": "<h2>Service Scope</h2><p>Our agency provide a comprehensive suite of marketing solutions, including:</p><ul><li>Digital marketing campaigns and strategy.</li><li>Social media management and engagement.</li><li>Content creation and brand development.</li><li>SEO/PPC advertising and management.</li><li>Analytics, reporting, and ROI tracking.</li></ul><p>Results vary based on market conditions, and we make no guarantees regarding specific performance metrics.</p>"
    },
    "styleOptions": {"background": "secondary", "padding": "medium", "maxWidth": "4xl"}
  },
  {
    "id": "rights",
    "type": "richtext",
    "props": {
      "content": "<h2>Content Ownership</h2><p>Clients own all approved campaign content and creative assets generated during our partnership. {{siteName}} retains the right to use non-confidential case studies for promotional purposes unless otherwise agreed.</p><h2>Liability</h2><p>Our liability is limited to the fees paid for the specific service in question. We are not liable for external market fluctuations or third-party platform changes.</p>"
    },
    "styleOptions": {"background": "transparent", "padding": "medium", "maxWidth": "4xl"}
  },
  {
    "id": "final",
    "type": "richtext",
    "props": {
      "content": "<h2>Changes to Terms</h2><p>We may update these terms as the digital marketing landscape evolves. Continued partnership constitutes acceptance of updated terms.</p><p>Contact: <a href=\\"mailto:marketing@example.com\\">marketing@example.com</a></p>"
    },
    "styleOptions": {"background": "alternate", "padding": "medium", "maxWidth": "4xl"}
  }
]'), 0, NULL, NULL);



-- 8. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-marketing-trends', 'placeholder', 'https://placehold.co/1200x630/ec4899/ffffff/png?text=Marketing+Trends+2026', 'Bright neon signs and data visualizations', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-marketing-roi', 'placeholder', 'https://placehold.co/1200x630/22c55e/ffffff/png?text=ROI+Success+Story', 'Green graph pointing upwards', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-marketing-content', 'placeholder', 'https://placehold.co/1200x630/6366f1/ffffff/png?text=Content+Strategy+101', 'Person writing on a whiteboard', '1200x630', 60000, strftime('%s','now'), strftime('%s','now')),
('seed-marketing-template', 'placeholder', 'https://placehold.co/1200x630/94a3b8/ffffff/png?text=Marketing+Blog+Template', 'Modern sleek office space', '1200x630', 40000, strftime('%s','now'), strftime('%s','now'));

-- 9. Blog Posts (Marketing Agency Content)
INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-trends',
  '5-digital-marketing-trends-2026',
  '5 Digital Marketing Trends to Watch in 2026',
  '{"blocks":[{"type":"header","content":"The Future of Digital Marketing"},{"type":"paragraph","content":"Advanced AI is enabling hyper-personalized content at scale, tailoring messages to individual user behavior and preferences."}]}',
  'Stay ahead with these emerging digital marketing trends for 2026.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-roi',
  'case-study-roi-increase',
  'Case Study: How We Increased Client ROI by 300%',
  '{"blocks":[{"type":"header","content":"Turning Around a Struggling Campaign"},{"type":"paragraph","content":"When a mid-sized e-commerce client came to us, their paid advertising was generating minimal returns. Here''s how we transformed their results."}]}',
  'Real results: A 300% ROI increase in 90 days.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-strategy-basics',
  'content-strategy-basics',
  'Content Strategy Basics for Small Businesses',
  '{"blocks":[{"type":"header","content":"Building a Content Strategy That Works"},{"type":"paragraph","content":"You don''t need a massive budget to create effective content marketing. Here''s how small businesses can compete."}]}',
  'A practical guide to content marketing for small businesses.',
  'published',
  strftime('%s','now', '-14 days'),
  strftime('%s','now'),
  strftime('%s','now')
);





-- 11. Navigation Items (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","type":"link","order_index":10},
    {"id":"blog","label":"News","href":"/blog","type":"module","order_index":30,"feature_flag":"blog"},
    {"id":"about","label":"About","href":"/about","type":"page","order_index":40},
    {"id":"contact","label":"Contact","href":"/contact","type":"page","order_index":50},
    {"id":"admin","label":"Admin Login","href":"/admin","type":"link","order_index":99}
  ]'
);

-- 12. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"Agency","title_template":"%s | Agency","default_description":"Strategic marketing agency focused on data-driven growth."}');
`,restaurant:`-- Strategy: Placeholders for Menu, Reservations, and About

-- 1. Categories (REMOVED - V2 uses tags)

-- 1. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('manager', 'Restaurant', 'Manager', 'https://placehold.co/200x200/3b82f6/ffffff/png?text=RM', '{"bio":"Ensuring the best hospitality for our guests."}', strftime('%s','now'), strftime('%s','now')),
  ('chef', 'Head', 'Chef', 'https://placehold.co/200x200/ef4444/ffffff/png?text=HC', '{"bio":"Master of the kitchen and seasonal flavors."}', strftime('%s','now'), strftime('%s','now'));

-- 2. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-restaurant-menu', 'placeholder', 'https://placehold.co/1200x630/ef4444/ffffff/png?text=Seasonal+Menu', 'Beautifully plated seafood dish', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-restaurant-team', 'placeholder', 'https://placehold.co/1200x630/3b82f6/ffffff/png?text=Culinary+Team', 'Professional chefs in a commercial kitchen', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-restaurant-history', 'placeholder', 'https://placehold.co/1200x630/8b5cf6/ffffff/png?text=Restaurant+History', 'Old black and white photo of the building', '1200x630', 60000, strftime('%s','now'), strftime('%s','now')),
('seed-restaurant-valentines', 'placeholder', 'https://placehold.co/1200x630/f43f5e/ffffff/png?text=Valentines+Day', 'Candlelit table with wine and roses', '1200x630', 55000, strftime('%s','now'), strftime('%s','now')),
('seed-restaurant-template', 'placeholder', 'https://placehold.co/1200x630/64748b/ffffff/png?text=Hospitality+Template', 'Clean menu layout on a tablet', '1200x630', 40000, strftime('%s','now'), strftime('%s','now'));

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-seasonal-menu',
  'seasonal-menu-update',
  'New Seasonal Menu Arrives',
  '{"blocks":[{"type":"header","content":"Taste the Season"},{"type":"paragraph","content":"We are excited to announce our new seasonal menu featuring fresh, locally-sourced ingredients."}]}',
  'Announcing our new seasonal menu highlights.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-meet-team',
  'meet-the-team',
  'Meet Our Culinary Team',
  '{"blocks":[{"type":"header","content":"Passion in Every Dish"},{"type":"paragraph","content":"Our kitchen is driven by a diverse team of culinary experts dedicated to crafting unforgettable meals."}]}',
  'A look behind the scenes at our talented kitchen staff.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);





-- 4. Main Site Pages
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-home', 'home', 'Welcome', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Experience Excellence","subtitle":"Welcome to our restaurant.","primaryButtonText":"Reserve Your Table","primaryButtonHref":"/reservations"}}]', '{"title":"Welcome","description":"Fine dining experience."}', 'published', 0),
('page-menu', 'menu', 'Our Menu', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Our Offerings","subtitle":"Explore our curated dishes."}},{"id":"starters","type":"feature-grid","props":{"title":"Starters","items":[{"title":"Soup of the Day","description":"Seasonal ($12)"}]}}]', '{"title":"Our Menu","description":"Starters, mains, and desserts."}', 'published', 10),
('page-reservations', 'reservations', 'Reservations', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Book a Table","subtitle":"Join us for a meal."}}]', '{"title":"Reservations","description":"Book your table."}', 'published', 20),
('page-about', 'about', 'Our Story', '1.0', '[{"id":"hero","type":"hero","props":{"title":"From Farm to Table","subtitle":"Our journey."}}]', '{"title":"Our Story","description":"The history behind our restaurant."}', 'published', 30);

-- Support Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-support',
  'support',
  'Support',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Support","subtitle":"How can we help?"}}]',
  '{"title":"Support","description":"How can we assist?"}',
  'published',
  80
);

-- Privacy & Terms
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES 
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy"}}]', '{"title":"Privacy Policy"}', 'published', 85),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service"}}]', '{"title":"Terms of Service"}', 'published', 90);

-- 5. Navigation Items (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","order_index":10},
    {"id":"menu","label":"Menu","href":"/menu","order_index":20},
    {"id":"reservations","label":"Reservations","href":"/reservations","order_index":30},
    {"id":"about","label":"Story","href":"/about","order_index":40},
    {"id":"blog","label":"News & Events","href":"/blog","order_index":50,"feature_flag":"blog"}
  ]'
);

-- 6. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"Restaurant","title_template":"%s | Restaurant","default_description":"Experience exceptional dining."}');
`,saas:`-- SaaS Product Seed Data
-- Focus: Selling a software product, high-conversion landing pages, and subscriptions.

-- 1. Categories (REMOVED - V2 uses tags)

-- 2. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('product-team', 'Product', 'Team', 'https://placehold.co/200x200/3b82f6/ffffff/png?text=PT', '{"bio":"The dreamers and builders behind the next generation of collaboration tools."}', strftime('%s','now'), strftime('%s','now')),
  ('founder', 'SaaS', 'Founder', 'https://placehold.co/200x200/ef4444/ffffff/png?text=SF', '{"bio":"Serial entrepreneur with a passion for designing software that helps teams work better, together."}', strftime('%s','now'), strftime('%s','now'));

-- 3. Media Metadata (Placeholders)
-- 3. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-saas-launch', 'placeholder', 'https://placehold.co/1200x630/ef4444/ffffff/png?text=Product+Launch', 'Rocket launching into the sky', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-saas-feature', 'placeholder', 'https://placehold.co/1200x630/3b82f6/ffffff/png?text=New+Feature+Release', 'Abstract UI element showing a new feature', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-saas-success', 'placeholder', 'https://placehold.co/1200x630/10b981/ffffff/png?text=Customer+Success', 'Happy customer using the software', '1200x630', 60000, strftime('%s','now'), strftime('%s','now'));

-- 4. Blog Posts
INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-saas-launch',
  'welcoming-the-next-generation',
  'A New Era for Team Collaboration',
  '{"blocks":[{"type":"header","content":"The Future is Collaborative"},{"type":"paragraph","content":"Today marks a major milestone as we officially launch {{siteName}}."}]}',
  'Announcing the official launch of our unified collaboration platform.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-saas-multitplayer',
  'introducing-real-time-collaboration',
  'Introducing Multi-Player Collaboration',
  '{"blocks":[{"type":"header","content":"Work Together, Anywhere"},{"type":"paragraph","content":"We are excited to release our most requested feature: Real-time Multi-player Editing."}]}',
  'Deep dive into our new real-time collaboration engine.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-home', 'home', 'Home', '1.0', '[{"id":"hero","type":"hero","props":{"title":"The Unified Workspace.","subtitle":"Manage projects and automate your workflow."}}]', '{"title":"Home - SaaS","description":"The most intuitive platform."}', 'published', 0),
('page-about', 'about', 'Our Story', '1.0', '[{"id":"hero","type":"hero","props":{"title":"The Pursuit of Focus"}}]', '{"title":"About Us","description":"Why we built this tool."}', 'published', 10),
('page-pricing', 'pricing', 'Pricing', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Transparent Pricing"}}]', '{"title":"Pricing","description":"Flexible plans."}', 'published', 20),
('page-contact', 'contact', 'Contact Sales', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Get in Touch"}}]', '{"title":"Contact","description":"We are here to help."}', 'published', 40);

-- Mission Page
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order)
VALUES (
  'page-mission',
  'mission',
  'Our Mission',
  '1.0',
  '[{"id":"hero","type":"hero","props":{"title":"Software for the Future of Work"}}]',
  '{"title":"Our Mission","description":"Building the future of work."}',
  'published',
  60
);

-- 9. Forum Categories
INSERT OR IGNORE INTO forum_categories (id, name, description, sort_order) VALUES
('fcat-support', 'Product Support', 'Get help with your subscription or technical issues', 1),
('fcat-requests', 'Feature Requests', 'Suggestions for new features and improvements', 2),
('fcat-general', 'General Discussion', 'Connect with other users and share your success', 3);


-- 9.5 Legal Pages (Standardized)
-- Privacy & Terms
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES 
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy"}}]', '{"title":"Privacy Policy"}', 'published', 85),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service"}}]', '{"title":"Terms of Service"}', 'published', 90);

-- 10. Navigation (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","order_index":10},
    {"id":"pricing","label":"Pricing","href":"/pricing","order_index":30},
    {"id":"blog","label":"Product Blog","href":"/blog","order_index":40,"feature_flag":"blog"},
    {"id":"forum","label":"User Community","href":"/forum","order_index":50,"feature_flag":"forum"},
    {"id":"about","label":"About","href":"/about","order_index":60},
    {"id":"contact","label":"Contact Sales","href":"/contact","order_index":70},
    {"id":"admin","label":"Admin Login","href":"/admin","order_index":99}
  ]'
);

-- 11. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"SaaS","title_template":"%s | SaaS","default_description":"Next-generation platform for modern businesses."}');
`,service:`-- Strategy: Professional services structure

-- 1. Categories (REMOVED - V2 uses tags)

-- 1. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('lead', 'Project', 'Lead', 'https://placehold.co/200x200/6366f1/ffffff/png?text=PL', '{"bio":"Expert in infrastructure modernization and enterprise transformation projects."}', strftime('%s','now'), strftime('%s','now')),
  ('ceo', 'Service', 'CEO', 'https://placehold.co/200x200/10b981/ffffff/png?text=CEO', '{"bio":"Driving strategic value for global enterprises."}', strftime('%s','now'), strftime('%s','now'));

-- 2. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-service-consulting', 'placeholder', 'https://placehold.co/1200x630/6366f1/ffffff/png?text=Future+of+Consulting', 'Two people discussing over a laptop in a modern office', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-service-logistics', 'placeholder', 'https://placehold.co/1200x630/10b981/ffffff/png?text=Logistics+Optimization', 'Busy shipping port at sunset', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-service-retail', 'placeholder', 'https://placehold.co/1200x630/f59e0b/ffffff/png?text=Retail+Transformation', 'Modern retail store interior', '1200x630', 60000, strftime('%s','now'), strftime('%s','now')),
('seed-service-summit', 'placeholder', 'https://placehold.co/1200x630/8b5cf6/ffffff/png?text=Growth+Summit+2026', 'Audience at a business conference', '1200x630', 55000, strftime('%s','now'), strftime('%s','now')),
('seed-service-template', 'placeholder', 'https://placehold.co/1200x630/64748b/ffffff/png?text=Consulting+Template', 'Professional business report and glasses', '1200x630', 40000, strftime('%s','now'), strftime('%s','now'));

-- 3. Blog Posts (Industry Insights)
INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-future-consulting',
  'future-of-consulting',
  'The Future of Strategic Consulting',
  '{"blocks":[{"type":"header","content":"Adapting to Change"},{"type":"paragraph","content":"The consulting landscape is shifting. Clients no longer want just advice; they want implementation partners."}]}',
  'Trends shaping the professional services industry.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-logistics-case-study',
  'case-study-logistics',
  'Case Study: Optimizing Global Logistics',
  '{"blocks":[{"type":"header","content":"The Challenge"},{"type":"paragraph","content":"A global shipping firm was struggling with legacy systems."}]}',
  'How we helped a global logistics firm modernize their tracking.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);





-- 4. Global Navigation & Config
-- 4. Global Navigation & Config (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","order_index":10},
    {"id":"blog","label":"Insights","href":"/blog","order_index":30,"feature_flag":"blog"},
    {"id":"contact","label":"Contact","href":"/contact","order_index":40},
    {"id":"support","label":"Support","href":"/support","order_index":50}
  ]'
);

-- 5. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"Service","title_template":"%s | Service","default_description":"Strategic consulting and professional services."}');

INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-home', 'home', 'Strategic Solutions Partner', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Define Your Future."}}]', '{"title":"Home - Service","description":"Strategic solutions provider."}', 'published', 0);



INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-contact', 'contact', 'Contact Us', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Get in Touch"}}]', '{"title":"Contact Us"}', 'published', 20),
('page-about', 'about', 'About Us', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Architects of Transformation"}}]', '{"title":"About Us"}', 'published', 10);

-- Support, Privacy & Terms
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-support', 'support', 'Support', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Support"}}]', '{"title":"Support"}', 'published', 80),
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy"}}]', '{"title":"Privacy Policy"}', 'published', 85),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service"}}]', '{"title":"Terms of Service"}', 'published', 90);
`,"software-dev":`-- Replicating a modern software engineer's active toolset.

-- 1. Categories (REMOVED - V2 uses tags)

-- 1. Authors
INSERT OR REPLACE INTO authors (id, first_name, last_name, avatar_url, metadata_json, created_at, updated_at) VALUES
  ('dev-team', 'Engineering', 'Team', 'https://placehold.co/200x200/4f46e5/ffffff/png?text=ET', '{"bio":"Specialists in building distributed systems and cloud infrastructure."}', strftime('%s','now'), strftime('%s','now')),
  ('admin', 'Lead', 'Architect', 'https://placehold.co/200x200/059669/ffffff/png?text=LA', '{"bio":"Focused on system design and DevOps strategy."}', strftime('%s','now'), strftime('%s','now'));

-- 2. Media
INSERT OR REPLACE INTO media (id, provider, url, alt_text, dimensions, filesize, created_at, updated_at) VALUES
('seed-dev-software', 'placeholder', 'https://placehold.co/1200x630/4f46e5/ffffff/png?text=Software+Velocity', 'Abstract code on a dark background', '1200x630', 50000, strftime('%s','now'), strftime('%s','now')),
('seed-dev-architecture', 'placeholder', 'https://placehold.co/1200x630/059669/ffffff/png?text=Modern+Architecture', 'Architectural blueprint or diagram', '1200x630', 45000, strftime('%s','now'), strftime('%s','now')),
('seed-dev-distributed', 'placeholder', 'https://placehold.co/1200x630/d97706/ffffff/png?text=Distributed+Systems', 'Server rack in a modern data center', '1200x630', 60000, strftime('%s','now'), strftime('%s','now')),
('seed-dev-micro-frontends', 'placeholder', 'https://placehold.co/1200x630/db2777/ffffff/png?text=Micro-frontends', 'Puzzle pieces coming together', '1200x630', 55000, strftime('%s','now'), strftime('%s','now')),
('seed-dev-template', 'placeholder', 'https://placehold.co/1200x630/4b5563/ffffff/png?text=Dev+Blog+Template', 'Clean code editor layout', '1200x630', 40000, strftime('%s','now'), strftime('%s','now'));

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-better-software',
  'building-better-software',
  'Building Better Software Faster',
  '{"blocks":[{"type":"header","content":"Speed and Quality"},{"type":"paragraph","content":"In the fast-paced world of software development, speed and quality are often seen as competing priorities."}]}',
  'How modern engineering teams achieve both speed and quality through automation.',
  'published',
  strftime('%s','now', '-1 days'),
  strftime('%s','now'),
  strftime('%s','now')
);

INSERT OR REPLACE INTO posts (id, slug, title, content_json, excerpt, status, published_at, created_at, updated_at)
VALUES (
  'post-modern-web',
  'modern-full-stack-architecture',
  'Building for the Modern Web',
  '{"blocks":[{"type":"header","content":"Architecture That Scales"},{"type":"paragraph","content":"In the age of global audiences, traditional monolithic architectures are no longer sufficient."}]}',
  'A deep dive into our architectural philosophy for high-performance web applications.',
  'published',
  strftime('%s','now', '-7 days'),
  strftime('%s','now'),
  strftime('%s','now')
);


-- 4. Navigation & Local Setup

-- 4. Playground & Templates


INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-home', 'home', 'Systems Architecture Lab', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Engineering the Distributed Future."}}]', '{"title":"Home - Dev Lab","description":"Software engineering firm."}', 'published', 0),
('page-about', 'about', 'About the Lab', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Architectural Excellence"}}]', '{"title":"About Us"}', 'published', 10),
('page-pricing', 'pricing', 'Consulting & Support', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Expertise for Hire"}}]', '{"title":"Consulting"}', 'published', 20),
('page-contact', 'contact', 'Technical Support & Sales', '1.0', '[{"id":"hero","type":"hero","props":{"title":"How can we help?"}}]', '{"title":"Contact"}', 'published', 40);
-- Technical Support & Sales
INSERT OR REPLACE INTO pages (id, slug, title, schema_version, layout_json, seo_json, status, sort_order) VALUES
('page-support', 'support', 'Support', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Support"}}]', '{"title":"Support"}', 'published', 80),
('page-privacy', 'privacy', 'Privacy Policy', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Privacy Policy"}}]', '{"title":"Privacy Policy"}', 'published', 85),
('page-terms', 'terms', 'Terms of Service', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Terms of Service"}}]', '{"title":"Terms of Service"}', 'published', 90),
('page-forum', 'forum', 'Community Forum', '1.0', '[{"id":"hero","type":"hero","props":{"title":"Community Forum"}}]', '{"title":"Forum"}', 'published', 100);

-- 6. Forum & Community Settings
-- Note: Forum threads and posts require authenticated users, which don't exist during initial setup.
INSERT OR IGNORE INTO forum_categories (id, name, description, sort_order) VALUES
('fcat-general', 'General Dev Discussion', 'Talk about code, architecture, and tech stacks', 1),
('fcat-showcase', 'Showcase', 'Show off what you''ve built', 2),
('fcat-help', 'Help & Support', 'Get help with integration and bugs', 3);
-- 7. Authors (Legacy) - REMOVED (Moved to top)
-- 8. Final Navigation & Config (V2 Format)
INSERT OR REPLACE INTO navigation (id, name, items_json) VALUES (
  'main-nav',
  'Main Navigation',
  '[
    {"id":"home","label":"Home","href":"/","order_index":10},
    {"id":"blog","label":"Engineering Blog","href":"/blog","order_index":30,"feature_flag":"blog"},
    {"id":"forum","label":"Community","href":"/forum","order_index":40,"feature_flag":"forum"},
    {"id":"about","label":"Our Mission","href":"/about","order_index":50},
    {"id":"contact","label":"Contact","href":"/contact","order_index":70}
  ]'
);

-- 9. Global Settings & SEO (V2 Format)
INSERT OR REPLACE INTO site_settings (key, value_json) VALUES
  ('site_seo', '{"default_title":"Dev Lab","title_template":"%s | Dev Lab","default_description":"Professional software engineering firm."}');
`},y=[{id:"classic",name:"Lizardware Classic",description:"The signature Lizardware look with deep forest tones and vibrant lizard green accents.",preview:"bg-emerald-950",accent:"#22c55e",borderRadius:"0.5rem",colors:{light:{bodyBackground:"#d1fae5",headerBackground:"#a7f3d0",footerBackground:"#6ee7b7",contentBackground:"#e6fffa",borders:"#34d399",accordionBackground:"#a7f3d0",buttonBackground:"#10b981",cardBackground:"#ecfdf5",inputBackground:"#d1fae5",pageBackgroundPrimary:"#ecfdf5",pageBackgroundSecondary:"#d1fae5",pageBackgroundAlternate:"#059669",heroBackground:"#6ee7b7",heroGradientStart:"#a7f3d0",heroGradientEnd:"#34d399",heroGradientEnabled:!0,headerText:"#14532d",footerText:"#166534",pageTitle:"#064e3b",pageSubtitle:"#16a34a",pageText:"#064e3b",infoBoxBg:"#ffffff",infoBoxText:"#064e3b",infoBoxLinkBg:"#ecfdf5",infoBoxLinkText:"#065f46",infoBoxLinkHover:"#22c55e",sectionHeader:"#dcfce7",heroText:"#064e3b"},dark:{bodyBackground:"#010f05",headerBackground:"#021a08",footerBackground:"#010f05",contentBackground:"#04210d",borders:"#0c381c",accordionBackground:"#0a1a0d",buttonBackground:"#0a1a0d",cardBackground:"#0a1a0d",inputBackground:"#05120a",pageBackgroundPrimary:"#030a05",pageBackgroundSecondary:"#05120a",pageBackgroundAlternate:"#14532d",heroBackground:"#064e3b",heroGradientStart:"#061009",heroGradientEnd:"#064e3b",heroGradientEnabled:!0,headerText:"#ecfdf5",footerText:"#34d399",pageTitle:"#ecfdf5",pageSubtitle:"#22c55e",pageText:"#a7f3d0",infoBoxBg:"#0a1a0d",infoBoxText:"#ecfdf5",infoBoxLinkBg:"#14532d",infoBoxLinkText:"#ecfdf5",infoBoxLinkHover:"#4ade80",sectionHeader:"#0a2a14",heroText:"#ecfdf5"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"msp_orange",name:"MSP Classic",description:"Trustworthy enterprise slate with the high-energy signature orange.",preview:"bg-slate-900",accent:"#f97316",borderRadius:"0.5rem",colors:{light:{bodyBackground:"#eff6ff",headerBackground:"#1e3a8a",footerBackground:"#172554",contentBackground:"#dbeafe",borders:"#3b82f6",accordionBackground:"#dbeafe",buttonBackground:"#f97316",cardBackground:"#dbeafe",inputBackground:"#eff6ff",pageBackgroundPrimary:"#dbeafe",pageBackgroundSecondary:"#eff6ff",pageBackgroundAlternate:"#1e40af",heroBackground:"#dbeafe",heroGradientStart:"#eff6ff",heroGradientEnd:"#dbeafe",heroGradientEnabled:!0,headerText:"#f8fafc",footerText:"#bfdbfe",pageTitle:"#1e3a8a",pageSubtitle:"#ea580c",pageText:"#1e3a8a",infoBoxBg:"#dbeafe",infoBoxText:"#1e3a8a",infoBoxLinkBg:"#eff6ff",infoBoxLinkText:"#1e3a8a",infoBoxLinkHover:"#f97316",sectionHeader:"#bfdbfe",heroText:"#1e3a8a"},dark:{bodyBackground:"#0a0602",headerBackground:"#140c05",footerBackground:"#0a0602",contentBackground:"#1a0f05",borders:"#2e1101",accordionBackground:"#2e1b01",buttonBackground:"#2e1b01",cardBackground:"#2e1b01",inputBackground:"#140c05",pageBackgroundPrimary:"#1a0f05",pageBackgroundSecondary:"#0a0602",pageBackgroundAlternate:"#ea580c",heroBackground:"#140c05",heroGradientStart:"#140c05",heroGradientEnd:"#2e1101",heroGradientEnabled:!0,headerText:"#f8fafc",footerText:"#64748b",pageTitle:"#f8fafc",pageSubtitle:"#f97316",pageText:"#bfdbfe",infoBoxBg:"#1e293b",infoBoxText:"#f8fafc",infoBoxLinkBg:"#0f172a",infoBoxLinkText:"#f8fafc",infoBoxLinkHover:"#fb923c",sectionHeader:"#1e293b",heroText:"#ffffff"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"traffic_cone",name:"Traffic Cone Orange",description:"High-energy vibrant orange with construction-grade visibility and modern flair.",preview:"bg-gradient-to-br from-orange-400 to-orange-600",accent:"#f97316",borderRadius:"0.5rem",colors:{light:{bodyBackground:"#fed7aa",headerBackground:"#fdba74",footerBackground:"#fb923c",contentBackground:"#ffedd5",borders:"#f97316",accordionBackground:"#fed7aa",buttonBackground:"#ea580c",cardBackground:"#ffedd5",inputBackground:"#fef3c7",pageBackgroundPrimary:"#ffedd5",pageBackgroundSecondary:"#fed7aa",pageBackgroundAlternate:"#fb923c",heroBackground:"#fdba74",heroGradientStart:"#fed7aa",heroGradientEnd:"#fb923c",heroGradientEnabled:!0,headerText:"#0f172a",footerText:"#1e293b",pageTitle:"#0f172a",pageSubtitle:"#ea580c",pageText:"#7c2d12",infoBoxBg:"#ffedd5",infoBoxText:"#0f172a",infoBoxLinkBg:"#fed7aa",infoBoxLinkText:"#0f172a",infoBoxLinkHover:"#ea580c",sectionHeader:"#fb923c",heroText:"#0f172a"},dark:{bodyBackground:"#0a0602",headerBackground:"#140c05",footerBackground:"#0a0602",contentBackground:"#1a0f05",borders:"#f97316",accordionBackground:"#2e1b01",buttonBackground:"#f97316",cardBackground:"#2e1b01",inputBackground:"#140c05",pageBackgroundPrimary:"#1a0f05",pageBackgroundSecondary:"#0a0602",pageBackgroundAlternate:"#ea580c",heroBackground:"#1f1108",heroGradientStart:"#140c05",heroGradientEnd:"#7c2d12",heroGradientEnabled:!0,headerText:"#fed7aa",footerText:"#fdba74",pageTitle:"#fed7aa",pageSubtitle:"#fb923c",pageText:"#fdba74",infoBoxBg:"#140c05",infoBoxText:"#fed7aa",infoBoxLinkBg:"#1f1108",infoBoxLinkText:"#fed7aa",infoBoxLinkHover:"#fb923c",sectionHeader:"#1f1108",heroText:"#fed7aa"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"tropical",name:"Tropical Teal",description:"A refreshing, vibrant theme featuring cooling mints and deep tropical waters.",preview:"bg-[#080c14]",accent:"#5eead4",borderRadius:"0.25rem",colors:{light:{bodyBackground:"#ccfbf1",headerBackground:"#080c14",footerBackground:"#080c14",contentBackground:"#f0fdfa",borders:"#94a3b8",accordionBackground:"#f0fdfa",buttonBackground:"#080c14",cardBackground:"#f0fdfa",inputBackground:"#f0fdfa",pageBackgroundPrimary:"#f0fdfa",pageBackgroundSecondary:"#ccfbf1",pageBackgroundAlternate:"#5eead4",heroBackground:"#ccfbf1",heroGradientStart:"#ccfbf1",heroGradientEnd:"#f0fdfa",heroGradientEnabled:!0,headerText:"#5eead4",footerText:"#0d9488",pageTitle:"#080c14",pageSubtitle:"#0d9488",pageText:"#115e59",infoBoxBg:"#f0fdfa",infoBoxText:"#080c14",infoBoxLinkBg:"#ccfbf1",infoBoxLinkText:"#080c14",infoBoxLinkHover:"#0d9488",sectionHeader:"#94a3b8",heroText:"#080c14"},dark:{bodyBackground:"#080c14",headerBackground:"#0a111a",footerBackground:"#080c14",contentBackground:"#0c141e",borders:"#1e293b",accordionBackground:"#0a111a",buttonBackground:"#5eead4",cardBackground:"#0a111a",inputBackground:"#080c14",pageBackgroundPrimary:"#080c14",pageBackgroundSecondary:"#0a111a",pageBackgroundAlternate:"#134e4a",heroBackground:"#010409",heroGradientStart:"#080c14",heroGradientEnd:"#134e4a",heroGradientEnabled:!0,headerText:"#5eead4",footerText:"#2dd4bf",pageTitle:"#5eead4",pageSubtitle:"#2dd4bf",pageText:"#ccfbf1",infoBoxBg:"#0a111a",infoBoxText:"#5eead4",infoBoxLinkBg:"#1e293b",infoBoxLinkText:"#5eead4",infoBoxLinkHover:"#2dd4bf",sectionHeader:"#1e293b",heroText:"#5eead4"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"saas",name:"Cloud Venture",description:"Modern, tech-forward palette with futuristic gradients for SaaS and tech.",preview:"bg-indigo-950",accent:"#818cf8",borderRadius:"1.25rem",colors:{light:{bodyBackground:"#e0e7ff",headerBackground:"#c7d2fe",footerBackground:"#1e1b4b",contentBackground:"#c7d2fe",borders:"#a5b4fc",accordionBackground:"#c7d2fe",buttonBackground:"#e0e7ff",cardBackground:"#c7d2fe",inputBackground:"#e0e7ff",pageBackgroundPrimary:"#c7d2fe",pageBackgroundSecondary:"#e0e7ff",pageBackgroundAlternate:"#818cf8",heroBackground:"#a5b4fc",heroGradientStart:"#c7d2fe",heroGradientEnd:"#a5b4fc",heroGradientEnabled:!0,headerText:"#1e1b4b",footerText:"#a5b4fc",pageTitle:"#1e1b4b",pageSubtitle:"#6366f1",pageText:"#312e81",infoBoxBg:"#ffffff",infoBoxText:"#1e1b4b",infoBoxLinkBg:"#eef2ff",infoBoxLinkText:"#1e1b4b",infoBoxLinkHover:"#818cf8",sectionHeader:"#eef2ff",heroText:"#1e1b4b"},dark:{bodyBackground:"#03020d",headerBackground:"#0b081a",footerBackground:"#03020d",contentBackground:"#0e0e2e",borders:"#2e2b81",accordionBackground:"#1e1b4b",buttonBackground:"#1e1b4b",cardBackground:"#1e1b4b",inputBackground:"#0b081a",pageBackgroundPrimary:"#060411",pageBackgroundSecondary:"#0a081a",pageBackgroundAlternate:"#4338ca",heroBackground:"#03020a",heroGradientStart:"#03020a",heroGradientEnd:"#12112e",heroGradientEnabled:!0,headerText:"#e0e7ff",footerText:"#818cf8",pageTitle:"#e0e7ff",pageSubtitle:"#818cf8",pageText:"#a5b4fc",infoBoxBg:"#1e1b4b",infoBoxText:"#e0e7ff",infoBoxLinkBg:"#0b081a",infoBoxLinkText:"#e0e7ff",infoBoxLinkHover:"#c7d2fe",sectionHeader:"#1a163d",heroText:"#e0e7ff"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"cyber",name:"Neon Purple",description:"Futuristic high-contrast dark theme with electric purple and deep indigo depths.",preview:"bg-black",accent:"#9333ea",borderRadius:"0.25rem",colors:{light:{bodyBackground:"#f3e8ff",headerBackground:"#e9d5ff",footerBackground:"#d8b4fe",contentBackground:"#faf5ff",borders:"#c084fc",accordionBackground:"#e9d5ff",buttonBackground:"#9333ea",cardBackground:"#faf5ff",inputBackground:"#f3e8ff",pageBackgroundPrimary:"#faf5ff",pageBackgroundSecondary:"#f3e8ff",pageBackgroundAlternate:"#7e22ce",heroBackground:"#d8b4fe",heroGradientStart:"#e9d5ff",heroGradientEnd:"#c084fc",heroGradientEnabled:!0,headerText:"#0c0a09",footerText:"#d8b4fe",pageTitle:"#0c0a09",pageSubtitle:"#9333ea",pageText:"#581c87",infoBoxBg:"#ffffff",infoBoxText:"#0c0a09",infoBoxLinkBg:"#f3e8ff",infoBoxLinkText:"#6b21a8",infoBoxLinkHover:"#9333ea",sectionHeader:"#f5f5f4",heroText:"#0c0a09"},dark:{bodyBackground:"#0a011a",headerBackground:"#1a052d",footerBackground:"#0a011a",contentBackground:"#2d1065",borders:"#4c1d95",accordionBackground:"#4c1d95",buttonBackground:"#9333ea",cardBackground:"#2e1065",inputBackground:"#1e052d",pageBackgroundPrimary:"#07001a",pageBackgroundSecondary:"#0a0025",pageBackgroundAlternate:"#701a75",heroBackground:"#020014",heroGradientStart:"#020014",heroGradientEnd:"#4a044e",heroGradientEnabled:!0,headerText:"#fafafa",footerText:"#f0abfc",pageTitle:"#ffffff",pageSubtitle:"#f0abfc",pageText:"#e9d5ff",infoBoxBg:"#1e1b4b",infoBoxText:"#fafafa",infoBoxLinkBg:"#0a0025",infoBoxLinkText:"#f0abfc",infoBoxLinkHover:"#22d3ee",sectionHeader:"#25103a",heroText:"#ffffff"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"blogger",name:"Reading Room",description:"Warm, stone-based palette optimized for long-form content reading.",preview:"bg-stone-100",accent:"#d6d3d1",borderRadius:"1rem",colors:{light:{bodyBackground:"#e7e5e4",headerBackground:"#d6d3d1",footerBackground:"#292524",contentBackground:"#d6d3d1",borders:"#a8a29e",accordionBackground:"#d6d3d1",buttonBackground:"#e7e5e4",cardBackground:"#d6d3d1",inputBackground:"#e7e5e4",pageBackgroundPrimary:"#d6d3d1",pageBackgroundSecondary:"#e7e5e4",pageBackgroundAlternate:"#a8a29e",heroBackground:"#a8a29e",heroGradientStart:"#d6d3d1",heroGradientEnd:"#a8a29e",heroGradientEnabled:!0,headerText:"#1c1917",footerText:"#d6d3d1",pageTitle:"#1c1917",pageSubtitle:"#78716c",pageText:"#44403c",infoBoxBg:"#ffffff",infoBoxText:"#1c1917",infoBoxLinkBg:"#e7e5e4",infoBoxLinkText:"#1c1917",infoBoxLinkHover:"#44403c",sectionHeader:"#e7e5e4",heroText:"#1c1917"},dark:{bodyBackground:"#0a0908",headerBackground:"#1c1917",footerBackground:"#0a0908",contentBackground:"#292524",borders:"#44403c",accordionBackground:"#292524",buttonBackground:"#292524",cardBackground:"#292524",inputBackground:"#1c1917",pageBackgroundPrimary:"#141210",pageBackgroundSecondary:"#1c1917",pageBackgroundAlternate:"#57534e",heroBackground:"#0c0a09",heroGradientStart:"#0c0a09",heroGradientEnd:"#141210",heroGradientEnabled:!0,headerText:"#f5f5f4",footerText:"#d6d3d1",pageTitle:"#f5f5f4",pageSubtitle:"#d6d3d1",pageText:"#a8a29e",infoBoxBg:"#292524",infoBoxText:"#f5f5f4",infoBoxLinkBg:"#1c1917",infoBoxLinkText:"#f5f5f4",infoBoxLinkHover:"#e7e5e4",sectionHeader:"#2d2a28",heroText:"#f5f5f4"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}},{id:"studio",name:"Monolith Rose",description:"Minimalist high-fashion look with deep blacks and radical rose highlights.",preview:"bg-black",accent:"#fb7185",borderRadius:"0rem",colors:{light:{bodyBackground:"#e4e4e7",headerBackground:"#d4d4d8",footerBackground:"#09090b",contentBackground:"#d4d4d8",borders:"#a1a1aa",accordionBackground:"#d4d4d8",buttonBackground:"#e4e4e7",cardBackground:"#d4d4d8",inputBackground:"#e4e4e7",pageBackgroundPrimary:"#d4d4d8",pageBackgroundSecondary:"#e4e4e7",pageBackgroundAlternate:"#fb7185",heroBackground:"#a1a1aa",heroGradientStart:"#d4d4d8",heroGradientEnd:"#a1a1aa",heroGradientEnabled:!0,headerText:"#09090b",footerText:"#d4d4d8",pageTitle:"#09090b",pageSubtitle:"#e11d48",pageText:"#881337",infoBoxBg:"#ffffff",infoBoxText:"#09090b",infoBoxLinkBg:"#e4e4e7",infoBoxLinkText:"#09090b",infoBoxLinkHover:"#f43f5e",sectionHeader:"#e4e4e7",heroText:"#000000"},dark:{bodyBackground:"#000000",headerBackground:"#09090b",footerBackground:"#000000",contentBackground:"#18181b",borders:"#27272a",accordionBackground:"#18181b",buttonBackground:"#18181b",cardBackground:"#18181b",inputBackground:"#000000",pageBackgroundPrimary:"#000000",pageBackgroundSecondary:"#09090b",pageBackgroundAlternate:"#e11d48",heroBackground:"#000000",heroGradientStart:"#000000",heroGradientEnd:"#2e010a",heroGradientEnabled:!0,headerText:"#ffffff",footerText:"#71717a",pageTitle:"#ffffff",pageSubtitle:"#f43f5e",pageText:"#fda4af",infoBoxBg:"#18181b",infoBoxText:"#ffffff",infoBoxLinkBg:"#000000",infoBoxLinkText:"#ffffff",infoBoxLinkHover:"#fb7185",sectionHeader:"#1a1a1a",heroText:"#ffffff"}},typography:{fontSizeTitle:"60px",fontSizeSubtitle:"30px",fontSizeDescription:"20px",fontSizeBase:"16px"}}];var z=c(47912);async function A(a){try{let b=await a.json().catch(()=>({seedType:"production",keepExisting:!0})),c=b.seedType||"production",d=!1!==b.keepExisting,e=b.themePresetId,f=b.phase,g=await (0,v.getD1Database)();if(!g)return u.NextResponse.json({error:"Database not available"},{status:500});if(!d)for(let a of(console.log("\uD83D\uDDD1️ Factory reset: Dropping all tables..."),["pages","posts","navigation","site_settings","media","internal_docs","authors","users","changelogs","newsletter_subscribers","media_blobs","roadmap_items","roadmap_changelog_links","forum_categories","forum_threads","forum_posts","forum_reactions","forum_reports","forum_profiles","redirects","seo_checkups","site_config","feature_flags","categories","navigation_items","internal_pages","forum_users"]))try{await g.prepare(`DROP TABLE IF EXISTS ${a}`).run()}catch(b){console.warn(`⚠️ Failed to drop ${a}`)}if(f&&"structure"!==f||(console.log(`🏗️  Running database structure SQL...`),await B(g,w)),f&&"seed"!==f||(c&&x[c]?(console.log(`📝 Applying ${c} seed data...`),await B(g,x[c])):console.log("⚠️  No seed type specified or invalid seed type")),e){console.log(`🎨 Applying theme preset: ${e}`);let a=y.find(a=>a.id===e),b=await (0,v.$3)();a&&b?(await (0,z.bS)(b,{colors:a.colors,borderRadius:"0.5rem",fontFamily:"Inter",typography:a.typography,spacing:{section:"4rem",container:"1.5rem",gap:"1.25rem",header:"3rem"},shadows:{strength:"0.1"}}),console.log("✅ Theme applied successfully")):console.warn("⚠️  Could not apply theme: Preset or KV namespace missing")}return u.NextResponse.json({success:!0})}catch(a){if(a instanceof Response)return a;return console.error("Database init error:",a),u.NextResponse.json({error:"Failed to initialize database",details:a.message},{status:500})}}async function B(a,b){let c=[],d="",e=!1;for(let a=0;a<b.length;a++){let f=b[a];if("'"===f){if(e&&"'"===b[a+1]){d+="''",a++;continue}e=!e}if(";"===f&&!e){c.push(d),d="";continue}d+=f}for(let b of(d.trim()&&c.push(d),c)){let c=b.trim();if(!c)continue;let d=c.split("\n").map(a=>a.trim()).filter(a=>a.length>0&&!a.startsWith("--")).join("\n");if(d)try{await a.prepare(d).run()}catch(c){let a=c.message||"",b=a.toLowerCase();if(b.includes("duplicate column")||b.includes("duplicate column name")||b.includes("already exists")||b.includes("table")&&b.includes("already exists")||b.includes("index")&&b.includes("already exists")||b.includes("unique constraint failed")||b.includes("foreign key constraint failed")){console.log(`⏭️  Skipped (already applied): ${d.substring(0,60).replace(/\n/g," ")}...`);continue}console.error(`❌ [DB Init] Statement failed: ${a}`,"\n\n  "+d.substring(0,50)+"...\n")}}}let C=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/admin/init-database/route",pathname:"/api/admin/init-database",filename:"route",bundlePath:"app/api/admin/init-database/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Dev\\Lizardware-Dev\\.tmp\\launcher-build\\src\\app\\api\\admin\\init-database\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:D,workUnitAsyncStorage:E,serverHooks:F}=C;function G(){return(0,g.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:E})}async function H(a,b,c){var d;let e="/api/admin/init-database/route";"/index"===e&&(e="/");let g=await C.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||C.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===C.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>C.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>C.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await C.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await C.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await C.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47912:(a,b,c)=>{"use strict";c.d(b,{VV:()=>h,bS:()=>l,getSiteConfig:()=>k,iV:()=>j,os:()=>i});var d=c(71327),e=c(58017),f=c(67817),g=c(90222);async function h(a,b){let c=`settings:${a}`,d=await g.Z.get(c);if(d)return d;let e=await (0,f.getD1Database)();if(!e)return b;try{let d=await e.prepare("SELECT value_json FROM site_settings WHERE key = ? LIMIT 1").bind(a).first();if(!d||!d.value_json)return b;let f=JSON.parse(d.value_json);return await g.Z.set(c,f),f}catch(c){return console.error(`[Settings Storage] Failed to fetch setting from D1: ${a}`,c),b}}async function i(a,b){let c=await (0,f.getD1Database)();if(c)try{await c.prepare(`
            INSERT INTO site_settings (key, value_json)
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET
                value_json = excluded.value_json
        `).bind(a,JSON.stringify(b)).run(),await g.Z.delete(`settings:${a}`),await g.Z.delete(a)}catch(b){console.error(`[Settings Storage] Failed to save setting to D1: ${a}`,b)}}async function j(){let a=await h("theme",d);return{...d,...a}}async function k(){let a=await h("site",e.C);return{...e.C,...a,seo:{...e.C.seo,...a?.seo},links:{...e.C.links,...a?.links}}}async function l(a,b){await i("theme",b)}},58017:(a,b,c)=>{"use strict";c.d(b,{C:()=>d});let d=JSON.parse('{"name":"Lizardware CMS","description":"Build for the Edge.","url":"https://lizardware.net","ogImage":"https://lizardware.net/og.jpg","links":{"github":"https://github.com/Lizardministrator/Lizardware-Dev"},"seo":{"title":"Lizardware CMS | Modern Edge-First Content Management","description":"Fast, developer-friendly CMS built on Cloudflare\'s edge network. Visual theme editor, WYSIWYG blog publishing, and sub-100ms performance.","keywords":["headless CMS","edge computing","content management","blog platform","Cloudflare Workers","Next.js CMS"],"author":"Lizardware Team","twitterHandle":"@lizardware"},"openGraph":{"type":"website","locale":"en_US","siteName":"Lizardware CMS"},"logoUrl":"\uD83E\uDD8E","favicon":"\uD83E\uDD8E","whiteLabel":false,"business_type":"lizardware-official","navItems":[],"template_id":"blogger","setup_completed":true,"homePageSlug":""}')},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},67817:(a,b,c)=>{"use strict";c.d(b,{$3:()=>g,GY:()=>i,fN:()=>h,getD1Database:()=>f,getSafeCloudflareContext:()=>e});var d=c(10641);async function e(){let a=null;try{let{getCloudflareContext:b}=await Promise.resolve().then(c.bind(c,28402)),d=await b({async:!0});d&&d.env&&(a={env:d.env,cf:d.cf,ctx:d.ctx})}catch(a){console.warn("[Cloudflare Lib] Official getCloudflareContext failed, trying manual fallback",a)}if(!a||!a.env){let b=globalThis.__NEXT_CLOUDFLARE_CONTEXT__;b&&b.env?a={env:b.env,cf:b.cf,ctx:b.ctx}:"undefined"!=typeof process&&process.env&&(a={env:process.env})}return a}async function f(){let a=await e();return a?.env?.DB||null}async function g(){let a=await e();return a?.env?.CONFIG_KV||null}async function h(){let a=await e();return a?.env?.MEDIA_BUCKET||null}function i(){return d.NextResponse.json({error:"Database or Cloudflare context not available",hint:"Check D1 bindings in wrangler.json or project configuration."},{status:503})}},71327:a=>{"use strict";a.exports=JSON.parse('{"colors":{"light":{"bodyBackground":"#d1fae5","headerBackground":"#a7f3d0","footerBackground":"#6ee7b7","contentBackground":"#e6fffa","borders":"#34d399","pageBackgroundPrimary":"#ecfdf5","pageBackgroundSecondary":"#d1fae5","pageBackgroundAlternate":"#059669","heroBackground":"#6ee7b7","heroGradientStart":"#a7f3d0","heroGradientEnd":"#34d399","heroGradientEnabled":true,"headerText":"#14532d","footerText":"#166534","pageTitle":"#064e3b","pageSubtitle":"#16a34a","pageText":"#374151","infoBoxBg":"#ffffff","infoBoxText":"#064e3b","infoBoxLinkBg":"#ecfdf5","infoBoxLinkText":"#065f46","infoBoxLinkHover":"#22c55e","sectionHeader":"#dcfce7","heroText":"#064e3b","accordionBackground":"#a7f3d0","buttonBackground":"#10b981","cardBackground":"#ecfdf5","inputBackground":"#d1fae5"},"dark":{"bodyBackground":"#020617","headerBackground":"#030a05","footerBackground":"#020617","contentBackground":"#0a1a0d","borders":"#0d2d18","pageBackgroundPrimary":"#030a05","pageBackgroundSecondary":"#05120a","pageBackgroundAlternate":"#14532d","heroBackground":"#064e3b","heroGradientStart":"#061009","heroGradientEnd":"#064e3b","heroGradientEnabled":true,"headerText":"#ecfdf5","footerText":"#34d399","pageTitle":"#ecfdf5","pageSubtitle":"#22c55e","pageText":"#a7f3d0","infoBoxBg":"#0a1a0d","infoBoxText":"#ecfdf5","infoBoxLinkBg":"#14532d","infoBoxLinkText":"#ecfdf5","infoBoxLinkHover":"#4ade80","sectionHeader":"#0a2a14","heroText":"#ecfdf5","accordionBackground":"#0a1a0d","buttonBackground":"#0a1a0d","cardBackground":"#0a1a0d","inputBackground":"#05120a"}},"borderRadius":"0.5rem","fontFamily":"Inter","spacing":{"section":"4rem","container":"1.5rem","gap":"1.25rem","header":"3rem"},"shadows":{"strength":"0.1"},"typography":{"fontSizeTitle":"60px","fontSizeSubtitle":"30px","fontSizeDescription":"24px","fontSizeBase":"16px"}}')},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},90222:(a,b,c)=>{"use strict";c.d(b,{Z:()=>e});var d=c(67817);let e={async get(a){let b=await (0,d.$3)();if(!b)return null;try{return await b.get(a,"json")}catch(b){return console.warn(`[KV Cache] GET error for key "${a}":`,b),null}},async set(a,b,c){let e=await (0,d.$3)();if(e)try{await e.put(a,JSON.stringify(b),{expirationTtl:c})}catch(b){console.error(`[KV Cache] SET error for key "${a}":`,b)}},async delete(a){let b=await (0,d.$3)();if(b)try{await b.delete(a)}catch(b){console.error(`[KV Cache] DELETE error for key "${a}":`,b)}},async list(a){let b=await (0,d.$3)();if(!b)return[];try{return(await b.list({prefix:a})).keys.map(a=>a.name)}catch(b){return console.error(`[KV Cache] LIST error for prefix "${a}":`,b),[]}}}},95736:(a,b,c)=>{"use strict";a.exports=c(44870)},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[5745],()=>b(b.s=41499));module.exports=c})();