# amvstrm API

amvstrm's API V1/V2 is still in developements.  

:warning: **Since V2 use Anilist API, there will be a rate limit (90 per min). Please do not requests too much on route v2 (_except : /stream, /download and /episode_)**

## Usage

Please read the usage of our API on the documentation page. [Usages](https://docs.amvstr.ml/docs/info#api-information)

## List of features

This is the comparison list of V1 and V2...

- V2 (In Development)
  - Using ModuleJS
  - Anilist Info Based
  - 2 Fast Server and better cache system to save loading times (Redis/Memory)
    - api.amvstr.ml
    - s2-api.amvstr.ml (api-server-2 wont be updated)
  - More Route and Feature
  - Faster than V1 (fetch from official Anilist API / [Consumet](https://github.com/consumet/consumet.ts) for fetching video/info backup source)
  - Compatible with amvstrm V2 (SOON)
  - Swagger Documentation
  
- V1 (✔)
  - Using CommonJS
  - Gogoanime Info Based (Low Info)
  - 2 Normal Server (Vercel)
    - api.amvstr.ml
    - api-server-2.amvstr.ml
  - Slower (Web Scraping)
  - Compatible with amvstrm V1

# Deployment

## Vercel

For normal API with memory caching, please click here...

<a href="https://vercel.com/new/clone?project-name=amvstrm-api&repository-name=amvstrm/api&s=https://github.com/amvstrm/api">
  <img src="https://vercel.com/button" alt="">
</a>  

If you want to cache the API with Redis : 

1. Create your own free account on upstash to create your own redis : [UPSTASH](https://upstash.com/)

2. After you done click here :
- <a href="https://vercel.com/new/clone?project-name=amvstrm/api&repository-name=amvstrm/api&s=https://github.com/amvstrm/api&env=RATE_LIMIT,REDIS_URL,REDIS_PORT,REDIS_PASSWORD&envDescription=If%20you%20dont%20have%20your%20own%20redis%20cloud,%20you%20can%20create%20the%20account%20on%20upstash.&envLink=https://upstash.com">
  <img src="https://vercel.com/button" alt="">
</a>

3. When you done creating your own account on Upstash :  
 - Create a database   
 ![image](https://user-images.githubusercontent.com/53612429/199044617-b7424e80-2cd4-48f1-90e3-7bbfc57290e5.png)
 *Choose any server location near you but for this ill go with global.*

 - After you done copy your redis URL, PORT and PASSWORD credential.   
 ![image](https://user-images.githubusercontent.com/53612429/199044367-7475b2c3-e8cb-4a6b-8e2c-2d519ddc0569.png)

 - Come back and paste all of the credential in the box
 ![image](https://user-images.githubusercontent.com/53612429/199045305-c1345833-ac28-4205-86eb-1e4e1470dcca.png)

4. When you done deploying, go to your github repo and modify the routes/api.js and routes/apiv2.js code and uncomment the redisClient const

````
const cache = apicache.middleware;

// IF YOU HAVE REDIS DB YOU CAN USE IT TO CACHE THE DATA
// const redisClient = createClient({
//   host: process.env.REDIS_URL,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
//   legacyMode: true
// });
// const cache = apicache.options({
//   redisClient,
// }).middleware;

````

**Comment back the const cache and it should look like this**

````
// const cache = apicache.middleware;

// IF YOU HAVE REDIS DB YOU CAN USE IT TO CACHE THE DATA
const redisClient = createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  legacyMode: true
});
const cache = apicache.options({
  redisClient,
}).middleware;

````

And Then you are done...

## License

Our API source code is distributed under the terms of the GPL v3.0 license. See [LICENSE](https://github.com/amvstrm/api/blob/master/LICENSE) for details.
You are free to use our API source code in any way you want.
