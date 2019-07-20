var sm = require('sitemap')
    , fs = require('fs');

var sitemap = sm.createSitemap({
    hostname: 'http://souke.xyz',
    cacheTime: 600000,  //600 sec (10 min) cache purge period
    urls: [
        { url: '/' , changefreq: 'weekly', priority: 0.8, lastmodrealtime: true },
        { url: '/result', changefreq: 'weekly', priority: 0.8, lastmodrealtime: true},
    ]
});

fs.writeFileSync("dist/sitemap.xml", sitemap.toString());