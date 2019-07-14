var CACHE_NAME = 'hujinliang-site-cache-v1'
var urls = [
    '/',
    '/js/log.js'
]

// install hook 初始化需要缓存的内容，也可以什么都不干，等fetch时手动添加缓存
self.addEventListener('install', function (e) {
    self.skipWaiting()
    self.clients.claim()
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened')
                return cache.addAll(urls)
            })
    )
})

// activate hook  根据版本清除旧的缓存
self.addEventListener('activate', function (e) {
    var white = ['hujinliang-site-cache-v1']

    e.waitUntil(
        caches.keys()
            .then(function (names) {
                console.log(`cache names ${JSON.stringify(names)}`)
                names.map(function (cacheName) {
                    if (white.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            })
    )
})

// fetch hook 拦截请求，添加缓存等等，可以做networkFirst cacheFirst networkOnly等等自定义的形式
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request)
            .then(function (respond) {
                console.log('match', JSON.stringify(e.request))
                if (respond) {
                    return respond
                }
                var fetchReq = e.request.clone()
                return fetch(fetchReq)
                // .then(respond => {
                //     console.log(respond)
                //     return respond
                // })
                    .then(function (res) {
                        if (!res || res.status !== 200 || res.type !== 'basic') {
                            return res
                        }
                        var resClone = res.clone()
                        caches.open(CACHE_NAME)
                            .then(function (ca) {
                                ca.put(e.request, resClone)
                            })
                        return res
                    })
            })
    )
})