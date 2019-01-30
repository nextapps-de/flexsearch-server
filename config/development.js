module.exports = {

    port: process.env.PORT || 80,
    force_ssl: process.env.FORCE_SSL || false,
    https: process.env.HTTPS || false,
    compress: process.env.COMPRESS || true,
    flexsearch:{
        async: process.env.ASYNC || true,
        cache: process.env.CACHE || 0
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || "6379",
        password: process.env.REDIS_PASS || void 0
    },
    secret: process.env.SECRET || "fRu63er8VHcvngmneZC6ZdWFNe4sDnpjQex8HLm4YkXkbcfTev7FbHc4tAgBtLS4QYwLCkByUjMnFbxtqKEFV5DEwnACFzmarEwmCjHVJPLdNETJBsgqNAXqAcZnk8CJUBGr9M3WyHX8SvXrhqTb4Aka4GFYueRHWRyHkjDVH2thMxxV7XATm9ULZyatbZPXuEMqdC8eGDZ7JxmpbcRSFGRNvwdEETVcgcyLFjFG69m73T6KQCrac7dThRRQfhMr"
};