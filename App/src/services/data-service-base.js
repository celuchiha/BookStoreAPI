"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/http");
require("rxjs/add/operator/toPromise");
var DataServiceBase = /** @class */ (function () {
    function DataServiceBase(http) {
        this.http = http;
        var jsonGetHeaders = new http_1.Headers();
        jsonGetHeaders.append('Data-Type', 'json'); // dataType is what you're expecting back from the server
        jsonGetHeaders.append('X-Requested-With', 'XMLHttpRequest'); // this will make HttpRequest.IsAjaxRequest() work in .NET
        jsonGetHeaders.append('Cache-Control', 'no-cache'); // For IE in particular
        jsonGetHeaders.append('Pragma', 'no-cache'); // For IE in particular
        this.jsonGetArgs = { headers: jsonGetHeaders };
        var jsonPostHeaders = new http_1.Headers();
        jsonPostHeaders.append('Content-Type', 'application/json');
        this.jsonPostArgs = { headers: jsonPostHeaders };
        this.jsonPutArgs = { headers: jsonPostHeaders }; // no difference
    }
    DataServiceBase.prototype.getJson = function (url) {
        var _this = this;
        return this.http.get(url, this.jsonGetArgs)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    DataServiceBase.prototype.postJson = function (url, body) {
        var _this = this;
        return this.http.post(url, JSON.stringify(body), this.jsonPostArgs)
            .toPromise()
            .catch(function (error) { return _this.handleError(error); });
    };
    DataServiceBase.prototype.putJson = function (url, body) {
        var _this = this;
        return this.http.put(url, JSON.stringify(body), this.jsonPutArgs)
            .toPromise()
            .catch(function (error) { return _this.handleError(error); });
    };
    DataServiceBase.prototype.deleteResource = function (url) {
        var _this = this;
        return this.http.delete(url)
            .toPromise()
            .catch(function (error) { return _this.handleError(error); });
    };
    DataServiceBase.prototype.handleError = function (error) {
        if (error.status === 401) {
            window.location.href = '/login';
        }
        else {
            console.error('An error occurred', error);
        }
        return Promise.reject(error.message || error);
    };
    return DataServiceBase;
}());
exports.DataServiceBase = DataServiceBase;
//# sourceMappingURL=data-service-base.js.map