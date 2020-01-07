// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  'index.html',
  'scripts/app.js',
  'scripts/install.js',
  'styles/inline.css',
  'styles/all.min.css'
];

self.addEventListener('install', (evt) =>
{
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) =>
		{
			return cache.addAll(FILES_TO_CACHE);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (evt) =>
{
	console.log(evt);
	evt.waitUntil(
	    caches.keys().then((keyList) =>
	    {
	    	return Promise.all(keyList.map((key) =>
	    	{
		        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME)
		        {
		        	return caches.delete(key);
		        }
	      	}));
	    })
	);
  	self.clients.claim();
});

self.addEventListener('fetch', (evt) =>
{
	if (evt.request.url.includes('/forecast/'))
	{
	  	evt.respondWith(
	      	caches.open(DATA_CACHE_NAME).then((cache) =>
	      	{
	        	return fetch(evt.request)
	            .then((response) =>
	            {
	              	if (response.status === 200)
	              	{
	                	cache.put(evt.request.url, response.clone());
	              	}
	              	return response;
	            }).catch((err) =>
	            {
	              return cache.match(evt.request);
	            });
	      	})
	    );
	  	return;
	}
	evt.respondWith(
	    caches.open(CACHE_NAME).then((cache) =>
	    {
	      	return cache.match(evt.request)
          	.then((response) =>
          	{
            	return response || fetch(evt.request);
          	});
	    })
	);
});
