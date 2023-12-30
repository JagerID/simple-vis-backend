"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorController = void 0;
const common_1 = require("@nestjs/common");
const vector_service_1 = require("./vector.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs_1 = require("fs");
const path_1 = require("path");
const defaultConfig = (0, multer_1.diskStorage)({
    destination: './upload/files/',
    filename: (_, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
let VectorController = class VectorController {
    constructor(vectorService) {
        this.vectorService = vectorService;
    }
    create(dto) {
        return this.vectorService.create(dto);
    }
    findAll() {
        return this.vectorService.findAll();
    }
    getJsonFromFile(file) {
        console.log(file);
        const f = (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), `upload/files/${file.originalname}`));
        return new common_1.StreamableFile(f);
    }
};
exports.VectorController = VectorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VectorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VectorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('get-json'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: defaultConfig })),
    (0, common_1.Header)('Content-Type', 'application/json'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="package.json"'),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VectorController.prototype, "getJsonFromFile", null);
exports.VectorController = VectorController = __decorate([
    (0, common_1.Controller)('vector'),
    __metadata("design:paramtypes", [vector_service_1.VectorService])
], VectorController);
//# sourceMappingURL=vector.controller.js.map