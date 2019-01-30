module.exports = {

    port: process.env.PORT || 6780,
    force_ssl: process.env.FORCE_SSL || true,
    https: process.env.HTTPS || true,
    compress: process.env.COMPRESS || true,
    flexsearch:{
        async: process.env.ASYNC || true,
        cache: process.env.CACHE || 1000
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || "6379",
        password: process.env.REDIS_PASS || void 0
    },
    secret: process.env.SECRET || "RNvwdEETVcgcyLFjFG69m73T6KQCrac7dThRRQfhMrLS4QYwLCkByUjMnFbxtqKEFV5DEwnACFzmarEwmCjfRu63er8VHcvngmneZC6ZdWFNe4sDnpjQex8HLm4YkXkbcfTev7FbHc4tAgBtdC8eGDZ7JxmpbcRSFGHVJPLdNETJBsgqNAXqAcZnk8CJUBGr9M3WyHX8SvXrhqTb4Aka4GFYueRHWRyHkjDVH2thMxxV7XATm9ULZyatbZPXuEMq"
};