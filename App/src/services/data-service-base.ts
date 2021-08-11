import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

export class DataServiceBase {
    /**
     * Gets the default JSON request arguments that should be included with each GET request.
     */
    private jsonGetArgs: RequestOptionsArgs;
    /**
     * Gets the default JSON request arguments that should be included with each POST request.
     */
    private jsonPostArgs: RequestOptionsArgs;
     /**
     * Gets the default JSON request arguments that should be included with each PUT request.
     */
    private jsonPutArgs: RequestOptionsArgs;

    constructor(private http: Http) {
        const jsonGetHeaders = new Headers();
        jsonGetHeaders.append('Data-Type', 'json'); // dataType is what you're expecting back from the server
        jsonGetHeaders.append('X-Requested-With', 'XMLHttpRequest'); // this will make HttpRequest.IsAjaxRequest() work in .NET
        jsonGetHeaders.append('Cache-Control', 'no-cache'); // For IE in particular
        jsonGetHeaders.append('Pragma', 'no-cache'); // For IE in particular
        this.jsonGetArgs = { headers: jsonGetHeaders };

        const jsonPostHeaders = new Headers();
        jsonPostHeaders.append('Content-Type', 'application/json');
        this.jsonPostArgs = {headers: jsonPostHeaders};
        this.jsonPutArgs = {headers: jsonPostHeaders}; // no difference
    }

    protected getJson<TResource>(url): Promise<TResource> {
        return this.http.get(url, this.jsonGetArgs)
            .toPromise()
            .then(response => response.json())
            .catch((error: any) => this.handleError(error)
        );
    }

    protected postJson<TResource>(url, body: TResource): Promise<void> {
        return this.http.post(url, JSON.stringify(body), this.jsonPostArgs)
            .toPromise()
            .catch((error: any) => this.handleError(error)
        );
    }

    protected putJson<TResource>(url, body: TResource): Promise<void> {
        return this.http.put(url, JSON.stringify(body), this.jsonPutArgs)
            .toPromise()
            .catch((error: any) => this.handleError(error)
        );
    }

    protected deleteResource(url): Promise<void> {
        return this.http.delete(url)
            .toPromise()
            .catch((error: any) => this.handleError(error)
            );
    }

    protected handleError(error: any): Promise<any> {
        if (error.status === 401) {            
            window.location.href = '/login';
        } else {            
            console.error('An error occurred', error);
        }
        return Promise.reject(error.message || error);
    }
}