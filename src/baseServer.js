const path = require('path');

module.exports = class BaseServer {
    constructor(options) {
        const defaults = {
            useCors: false,
            config: require('config'),
            express: require('express')
        };

        this.options = Object.assign({}, defaults, options);

        if (this.options.config.has('cors.enabled')) {
            this.options.useCors = this.options.config.get('cors.enabled');
        }

        this.app = this.options.express();
        this.beforeMountRoutes();
        this.app.use('/', this.getRoutes());
        this.afterMountRoutes();
    }

    getRoutes() {
        return require(path.join(process.cwd(), 'src/api/routes/index'));
    }

    mountBodyParser() {
        this.app.use(this.options.express.json());
        this.app.use(this.options.express.urlencoded({ extended: true }));
    }

    mountCors() {
        if (this.options.useCors) {
            const cors = require('cors');
            this.app.use(
                cors({
                    origin: this.options.config.get('cors.origin')
                })
            );
        }
    }

    mount404NotFound() {
        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            const err = new Error();
            err.code = 'not_found';
            err.message =
                'Server did not find a current representation for the target resource';
            err.severity = 'HIGH';
            err.status = 404;

            throw err;
        });
    }

    beforeMountRoutes() {
        this.mountBodyParser();
    }

    afterMountRoutes() {
        this.mount404NotFound();
    }

    async start() {
        this.server = await this.startServer();
    }

    async stop() {
        await this.closeServer();
    }

    startServer() {
        const port = this.options.config.get('port') || 3000;
        const app = this.app;

        return new Promise((resolve, reject) => {
            const server = app.listen(port, () => {
                resolve(server);
            });
        });
    }

    stopServer() {
        const port = this.options.config.get('port') || 3000;
        const server = this.server;

        return new Promise(function (resolve, reject) {
            server.close(function () {
                resolve();
            });
        });
    }
};
