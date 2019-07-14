## service worker笔记

### 一、生命周期
1、install (安装，设置缓存内容，并不会立即生效--waiting：安装后可以在Cache Storage中看到，但是此时可能还是旧的sw在激活中)

2、activate （激活，当前sw生效，可以在此清除旧的sw cache storage）

3、fetch (拦截请求，注意：从chrome的network中看到的都是From ServiceWorker，但是这个意思只是经过了sw这层代理，可能是命中了cache storage,也可能是走了fetch)

一个页面可能同时存在多个sw，但是只有一个处于激活状态，其他的可能处于过期状态或者Waiting状态
### 二、简单使用
1、在install中设置需要缓存的内容，并设置CACHE_NAME，如更新版本v1、v2等等

2、在activate中清除旧的cache，以免容量太大

3、在fetch中判断是否命中缓存，命中则使用缓存，没有则使用fetch，然后可以继续缓存返回的请求内容(只缓存持久性的，第三方或者变化多变的数据不要缓存)

### 三、chrome调试

Application --> Cache Storage(查看缓存)/Service Worker（查看sw；Offline(设置离线)，查看sw是否按照自己所想；Update on reload(reload时更新sw)）

### 四、实践---（self.clients.claim和self.skipWaiting）

clients.claim的作用是使当前SW接管已经打开的所有标签页，使用场景是用户首次打开注册sw的页面时，还存在其他同域页面的浏览器标签的情况。之前打开的页面没有被接管，所以通过clients.claim接管已经打开但没受到控制的浏览器标签页面。

skipWaiting的使用场景是在sw更新时，因为有上一个sw正在控制着所有该站点的页面，新的sw在active后进入waiting状态，直到用户将所有该站点页面关闭，新的sw才上位。这跟Chrome和VScode的更新机制一样，在使用过程中有更新的时候，并不影响你继续使用老版本，而是在重启程序后，直接才变成新版。通过skipWaiting方法，可以直接让waiting状态的新sw替换掉老的sw，注意 还会自动接管上一个sw管辖的页面。