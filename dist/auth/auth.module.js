"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const RefreshToken_entity_1 = require("../entity/RefreshToken.entity");
const users_module_1 = require("../users/users.module");
const auth_service_1 = require("./auth.service");
const google_strategy_1 = require("./strategies/google.strategy");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const local_strategy_1 = require("./strategies/local.strategy");
const token_service_1 = require("./token.service");
let AuthModule = AuthModule_1 = class AuthModule {
};
AuthModule = AuthModule_1 = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot(),
            common_1.forwardRef(() => users_module_1.UsersModule),
            passport_1.PassportModule,
            typeorm_1.TypeOrmModule.forFeature([RefreshToken_entity_1.RefreshToken]),
            jwt_1.JwtModule.register({}),
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            token_service_1.TokenService,
            google_strategy_1.GoogleStrategy,
        ],
        exports: [auth_service_1.AuthService, token_service_1.TokenService, jwt_1.JwtModule, AuthModule_1],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map