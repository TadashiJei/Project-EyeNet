const basicAuth = require('express-basic-auth');

const swaggerAuth = (req, res, next) => {
    // Skip authentication if SWAGGER_AUTH is set to false
    if (process.env.SWAGGER_AUTH === 'false') {
        return next();
    }

    // Apply basic authentication if SWAGGER_AUTH is true
    return basicAuth({
        users: { [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD },
        challenge: true,
        realm: 'EyeNet API Documentation'
    })(req, res, next);
};

module.exports = swaggerAuth;
