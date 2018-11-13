const helmet = require('helmet');
const compression = require('compression')

module.exports = functyion (app) {
    app.use(helmet());
    app.use(compression());
}