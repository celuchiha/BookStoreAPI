"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var app_component_1 = require("./app.component");
var side_nav_component_1 = require("./components/side-nav.component");
var generatedConfig = require("./app-components.config");
var home_component_1 = require("./components/home.component");
// Component declarations
var declarations = [app_component_1.AppComponent, side_nav_component_1.SideNavComponent, home_component_1.HomeComponent]; // add any manual components here
declarations.push.apply(// add any manual components here
declarations, generatedConfig.declarations);
// Routes
var routes = [];
routes.push({ path: '', component: home_component_1.HomeComponent }); // home
// routes.push({path: 'my-path', component: MyComponent}); // add any manual routes here
routes.push.apply(// home
routes, generatedConfig.routes);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                router_1.RouterModule.forRoot(routes)
            ],
            declarations: declarations,
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map