"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const options = {
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PATCH,POST,DELETE,OPTIONS',
    };
    app.enableCors(options);
    app.use(cookieParser());
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map