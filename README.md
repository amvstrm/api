# amvstrm's API

amvstrm's API that powered [amvstrm](https://amvstr.me)

_Our official API is ``api.amvstr.me``_

## Usage

Our public API are hosted on the same free cloud provider and don't blame us why the API is unusable. 

The public API will only be used for TESTING & APP MODULE (miru-project for example). Self-host your own API if you do high volume requests. 

All API will be rate limited from 80 to 60 per min. We will blocked the API that attempted to use our Prod instance and logged as much as possible. We have right to do it.

## Deploy

- Vercel, Railway, Docker, and other provider  
  [Deploy guide](https://docs.amvstr.me/guide/backend)

## Features

- V2
  - Anilist + Gogoanime data
  - More routes and Information
  - Faster than V1 (fetch from official Anilist API / [Consumet](https://github.com/consumet/consumet.ts) for fetching video/info backup source)
  - Documentation Available [DOCS](https://docsapi-amvstrm.pages.dev/)

- V1
  - Gogoanime data
  - Low information
  - Fast

## Documentation

You can check out our new [API Docs](https://docs.amvstr.me/api/introduction#routes) with all available routes with information.  

## Credit

We are using these to power our API...

- [@consumet/extensions](https://github.com/consumet/consumet.ts)
- [riimuru/gogoanime-api](https://github.com/riimuru/gogoanime-api)
- [Gogoanime & Video source provider](https://anitaku.pe) 
- [MAL-Sync-Backup](https://github.com/MALSync/MAL-Sync-Backup)
- [Anime Mappings by codeblitz97](https://api-mappings.madara.live/)
- [Anilist](https://anilist.com)
- [Ani-skip](http://api.aniskip.com/)

## License

Our API source code is distributed under the terms of the GPL v3.0 license. See [LICENSE](https://docs.amvstr.me/license) for details.
