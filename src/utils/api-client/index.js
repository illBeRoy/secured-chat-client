import axios from 'axios';


/**
 * The ApiClient serves as a gateway class to the server api.
 */
class ApiClient {

    /**
     * @param url {string} base url of the server
     */
    constructor(url='http://localhost:3000') {

        this._baseUrl = url;
    }

    /**
     * Make a request to the server.
     * @param method {string} request method
     * @param url {string} endpoint url (without base)
     * @param body {object} payload to be sent on body (optional)
     * @param headers {object} headers to be passed on request (optional)
     * @param params {object} querystring params to be sent (optional)
     * @param credentials {{username: string, password: string}} credentials to be used
     */
    async request(method, url, {body, headers, params, credentials}) {

        // if credentials were passed, create the corresponding headers
        if (credentials) {

            headers = headers || {};
            headers['x-user-name'] = credentials.username;
            headers['x-user-token'] = credentials.password;
        }

        // build request description
        let request = {};
        request['baseURL'] = this._baseUrl;
        request['url'] = url;
        request['method'] = method.toLowerCase();
        request['validateStatus'] = null;
        request['headers'] = headers;
        request['params'] = params;

        // if not get, add data to payload
        if (method.toLowerCase() != 'get') {

            request['data'] = body;
        }

        // send request
        let result;
        try {

            result = await axios(request);
        } catch (err) {

            throw new ApiException(err.message || err);
        }

        // check response
        if (!(200 <= result.status && result.status < 300)) {

            throw new ApiException(
                result.data.message || result.data || '',
                result.status
            );
        }

        // return
        return result.data;
    }

}


/**
 * The ApiException class represents an interface to describe errors which happened during the request flow.
 */
class ApiException extends Error {

    /**
     * @param message {string} message describing the error
     * @param statusCode {number} describes the error code: the HTTP status or (-1) if the error occurred locally
     */
    constructor(message, statusCode=-1) {

        super(message);
        this.statusCode = statusCode
    }

}


export {ApiClient};
