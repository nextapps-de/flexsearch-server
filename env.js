module.exports = (

    process.env.NODE_ENV = ([

        "production",
        "development",
        "test"

    ].includes(process.argv[2]) ?

        process.argv[2]
    :
        process.env.NODE_ENV || "development"
    )
);