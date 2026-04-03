(()=>{var a={};a.id=8727,a.ids=[8727],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3421:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(71237),e=c(55088),f=c(17679);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29021:a=>{"use strict";a.exports=require("fs")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:a=>{"use strict";a.exports=require("path")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53260:(a,b,c)=>{"use strict";async function d(a,b){let c=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/storage/kv/namespaces`,{method:"POST",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"},body:JSON.stringify({title:b})}),d=await c.json();if(c.ok)return d.result;let e=d.errors?.[0]?.message||"";if(e.includes("already exists")){console.log(`[KV] Namespace '${b}' exists. Fetching ID with pagination...`);let c=1,d=null,e=!0;for(;e&&!d;){let f=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/storage/kv/namespaces?page=${c}&per_page=100`,{method:"GET",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"}}),g=await f.json();if(g.success&&g.result.length>0){if(!(d=g.result.find(a=>a.title===b))){let a=g.result_info;a&&c*a.per_page>=a.total_count?e=!1:c++}}else e=!1}if(d)return console.log(`[KV] Found existing namespace ID: ${d.id}`),d}throw Error(e||"Failed to create KV namespace")}async function e(a,b){let c=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/d1/database`,{method:"POST",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"},body:JSON.stringify({name:b})}),d=await c.json();if(c.ok)return d.result;let e=d.errors?.[0]?.message||"";if(e.includes("already exists")||e.includes("Duplicate")){console.log(`[D1] Database '${b}' exists. Fetching ID using search...`);let c=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/d1/database?name=${encodeURIComponent(b)}`,{method:"GET",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"}}),d=await c.json();if(d.success){let a=d.result.find(a=>a.name===b);if(a)return console.log(`[D1] Found existing database UUID: ${a.uuid}`),a}}throw Error(e||"Failed to create D1 database")}async function f(a,b,c){let d=c.split(";").map(a=>a.split("\n").map(a=>{let b=a.indexOf("--");return -1!==b&&(a=a.substring(0,b)),a.trim()}).filter(a=>a.length>0).join(" ")).filter(a=>a.length>0),e=[];for(let c of d){let d=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/d1/database/${b}/query`,{method:"POST",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"},body:JSON.stringify({sql:c})}),f=await d.json();if(!d.ok||!1===f.success){let a=f.errors?.map(a=>a.message).join(", ")||"Unknown Cloudflare error",b=c.length>200?c.substring(0,200)+"...":c;throw Error(`D1 Error: ${a} 
SQL: "${b}"`)}e.push(f.result)}return e}async function g(a,b){let c=await fetch(`https://api.cloudflare.com/client/v4/accounts/${a.accountId}/r2/buckets/${b}`,{method:"PUT",headers:{Authorization:`Bearer ${a.apiToken}`,"Content-Type":"application/json"}}),d=await c.json();if(!c.ok)throw Error(d.errors?.[0]?.message||"Failed to create R2 bucket");return{name:b}}async function h(a,b,d){try{let e=(await Promise.resolve().then(c.t.bind(c,29021,23))).default,f=(await Promise.resolve().then(c.t.bind(c,33873,23))).default.join(process.cwd(),"wrangler.json");if(!e.existsSync(f))return console.warn("[Cloudflare API] wrangler.json not found (likely production environment). Skipping file update."),!1;let g=e.readFileSync(f,"utf8");if(g.includes('"binding": "CONFIG_KV"')?g=g.replace(/("binding":\s*"CONFIG_KV",\s*"id":\s*")[^"]*(")/,`$1${a}$2`):console.warn("[Cloudflare API] CONFIG_KV binding not found in wrangler.json"),g.includes('"binding": "DB"')?g=g.replace(/("binding":\s*"DB",[\s\S]*?"database_id":\s*")[^"]*(")/,`$1${b}$2`):console.warn("[Cloudflare API] DB binding not found in wrangler.json"),d)if(g.includes('"binding": "MEDIA_BUCKET"'))g=g.replace(/("binding":\s*"MEDIA_BUCKET",\s*"bucket_name":\s*")[^"]*(")/,`$1${d}$2`);else{console.log("[Cloudflare API] Adding R2_BUCKETS section to wrangler.json");let a=`
    "r2_buckets": [
        {
            "binding": "MEDIA_BUCKET",
            "bucket_name": "${d}"
        }
    ],`;if(g.includes('"vars":'))g=g.replace(/"vars":/,`${a}
    "vars":`);else if(g.includes('"d1_databases":')){let b=g.lastIndexOf("}");g=g.substring(0,b)+a+"\n"+g.substring(b)}}return e.writeFileSync(f,g,"utf8"),!0}catch(a){return console.warn("[Cloudflare API] Failed to update wrangler.json:",a),!1}}c.d(b,{Bu:()=>f,FT:()=>g,Pq:()=>e,SO:()=>h,nc:()=>d})},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},85783:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>D,patchFetch:()=>C,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var d={};c.r(d),c.d(d,{POST:()=>x});var e=c(95736),f=c(9117),g=c(4044),h=c(39326),i=c(32324),j=c(261),k=c(54290),l=c(85328),m=c(38928),n=c(46595),o=c(3421),p=c(17679),q=c(41681),r=c(63446),s=c(86439),t=c(51356),u=c(10641),v=c(53260);let w=`
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
    id TEXT PRIMARY KEY,
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
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'feature',
    content TEXT NOT NULL,
    published_at TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
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
    user_id TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    user_id TEXT,
    content TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_reactions (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    user_id TEXT,
    reaction_type TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS forum_reports (
    id TEXT PRIMARY KEY,
    reported_item_id TEXT NOT NULL,
    item_type TEXT NOT NULL,
    reporter_id TEXT,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE IF NOT EXISTS forum_profiles (
    id TEXT PRIMARY KEY,
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
INSERT OR IGNORE INTO site_settings (key, value_json) VALUES ('site.setup_completed', '"false"');
`;async function x(a){try{let b,c,{apiToken:d,accountId:e,projectName:f,clerkPublishableKey:g,clerkSecretKey:h}=await a.json();if(d||(d=""),e||(e=""),f||(f=process.env.CF_PAGES_PROJECT_NAME||process.env.CLOUDFLARE_PROJECT_NAME),!d||!e)return u.NextResponse.json({error:"Missing required configuration: API Token and Account ID are required.",missing:{apiToken:!d,accountId:!e}},{status:400});let i={apiToken:d,accountId:e},j=f?f.toLowerCase().replace(/[^a-z0-9]/g,"-"):"lizardware-cms";console.log(`[Auto-Provision] Starting for project: ${j}`),console.log("[Auto-Provision] Creating KV Namespace...");try{b=await (0,v.nc)(i,`${j}-config-kv`)}catch(a){throw Error(`KV Creation Failed: ${a.message}`)}console.log("[Auto-Provision] Creating D1 Database...");try{c=await (0,v.Pq)(i,`${j}-db`)}catch(a){throw Error(`D1 Creation Failed: ${a.message}`)}console.log("[Auto-Provision] Creating R2 Bucket...");let k=null;try{k=await (0,v.FT)(i,`${j}-media-bucket`)}catch(a){console.warn("[Auto-Provision] R2 Bucket creation failed (Optional Step):",a.message)}console.log("[Auto-Provision] Initializing D1 database schema...");try{await (0,v.Bu)(i,c.uuid,w)}catch(a){throw Error(`Database Migration Failed: ${a.message}`)}let l=!1;try{console.log("[Auto-Provision] Attempting to update wrangler.json..."),l=await (0,v.SO)(b.id,c.uuid,k?.name)}catch(a){console.warn("[Auto-Provision] Could not update wrangler.json (likely in production/ephemeral):",a),l=!1}let m=!1;if(g&&h)try{console.log("[Auto-Provision] Skipping .env.local update (Production Environment)")}catch(a){console.warn("[Auto-Provision] Could not update .env.local:",a),m=!1}return console.log("[Auto-Provision] Success!"),u.NextResponse.json({success:!0,message:l?"All resources provisioned and configured successfully!":"Resources created! Manual configuration required for final step.",fileUpdated:l,secretsUpdated:m,resources:{kv:{id:b.id,title:b.title},d1:{id:c.uuid,name:c.name},r2:k?{name:k.name}:null}})}catch(a){return console.error("[Auto-Provision] Error:",a),u.NextResponse.json({error:a.message||"An unexpected error occurred during auto-provisioning.",details:a.stack||null},{status:500})}}let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/admin/setup/auto-provision/route",pathname:"/api/admin/setup/auto-provision",filename:"route",bundlePath:"app/api/admin/setup/auto-provision/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"C:\\Dev\\Lizardware-Dev\\.tmp\\launcher-build\\src\\app\\api\\admin\\setup\\auto-provision\\route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function C(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function D(a,b,c){var d;let e="/api/admin/setup/auto-provision/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},95736:(a,b,c)=>{"use strict";a.exports=c(44870)},96487:()=>{}};var b=require("../../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[5745],()=>b(b.s=85783));module.exports=c})();