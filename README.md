# CMC Oracle

To make a CMC exchange listing, they require endpoints for supply and burned supply. This product should be run in its own instance on its own droplet, apart from all other products. It pulls from an infura node to calculate the latest price and the cache is set to an hour so the api key is not abused, but is updated regularly.

Special Requirements:
 - redis
 - infura api key

Edit the .env file with the following config:

```
SITE_URL=https://cocooracle.com
PORT=8000
NODE_URL=https://mainnet.infura.io/v3/<your infura key>
```

todo:

- health check
- improve logs
