import axios from 'axios';
import S from 'string';
import * as itertools from '../itertools';


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

            // transform body keys from thisNotation to this_notation
            request['data'] = transformJsonKeyNames(body, (x) => S(x).underscore().s);
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

        // now transform back from this_notation to thisNotation
        let data = transformJsonKeyNames(result.data, (x) => S(x).camelize().s);

        // return
        return data;
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


/**
 * Transforms an object key names from one notation to another.
 *
 * Useful for changing the notation of json keys, in our case when making requests to the server.
 *
 * @param obj {*} the object to transform
 * @param transformation {function(string):string} the transformation to apply on to the names
 */
const transformJsonKeyNames = (obj, transformation) => {

    // if is array, transform each object in it
    if (obj instanceof Array) {

        return obj.map((x) => transformJsonKeyNames(x, transformation));
    } else if (typeof obj == 'object') {

        let transformedObj = {};
        for (let [key, value] of itertools.object(obj)) {

            transformedObj[transformation(key)] = transformJsonKeyNames(value, transformation);
        }

        return transformedObj;
    } else {

        return obj;
    }
};


export {ApiClient};
