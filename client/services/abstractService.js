'use strict';
import Request from 'superagent';
import LegacyIESupport from './legacy';
import config from '../config';
import Store from 'reducers';
class AbstractService {

  constructor(baseUrl, acceptContentType, authService) {
    this.baseUrl = baseUrl;
    this.acceptContentType = acceptContentType;
    this.authService = authService;
  }

  json(url, params, options) {
    return this.httpRequest(url, 'get', params, null, options);
  }

  post(url, params, data, options) {
    return this.httpRequest(url, 'post', params, data, options);
  }

  postForm(url, params, data, options) {
    return this.httpRequest(url, 'postForm', params, data, options);
  }

  put(url, params, data) {
    return this.httpRequest(url, 'put', params, data);
  }

  putNoResponse(url, params, data) {
    return this.httpRequest(url, 'put', params, data, {parseRespAsJson: false});
  }

  delete(url, params) {
    return this.httpRequest(url, 'del', params, null, {parseRespAsJson: false});
  }

  httpRequest(url, httpMethod, params, data, options) {
    options = options || {};
    if (typeof options.parseRespAsJson === 'undefined') {
      options.parseRespAsJson = true;
    }
    const absoluteUrl = this.baseUrl + url;

    let req;

    if (httpMethod === "postForm") {
      req = Request.post(absoluteUrl)
        .timeout(config.runtime.apiTimeoutMs)
        .use(LegacyIESupport);

      if (data) {
        Object.keys(data).forEach((key) => {
          req.send(key + "=" + data[key]);
        });
      }

    } else {
      req = Request[httpMethod](absoluteUrl)
        .timeout(config.runtime.apiTimeoutMs)
        .set('Accept', this.acceptContentType)
        .use(LegacyIESupport);
    }
    if (data) {
      req.send(data);
    }
    if (params) {
      req.query(params)
    }

    if (req.buffer) req.buffer(); // Required to buffer responses in node contexts, for
    // example in tests

    const requestInfo = {
      url: absoluteUrl,
      method: httpMethod
    }

    const token = Store.getState().user.token;
    if (token) {
      req.set("Authorization", "Bearer " + token);
    } else {
      //redirect to login
    }

    return this.sendRequest(req, options, requestInfo);
  }

  sendRequest(req, options, requestInfo) {
    const respParser = options.parseRespAsJson ? e => JSON.parse(e) : e => e;
    const promise = new Promise(function (resolve, reject) {
      req.end(function (err, res) {
        if (err) {
          reject(AbstractService.resolveResponseError(err, options, requestInfo));
        } else if (res.error) {
          // err is documented to be set on 4xx and 5xx errors, but it is not
          // therefore we construct our own error object here and feed it to
          // resolveResponseError.
          reject(AbstractService.resolveResponseError(
            {status: res.status, response: res}, options, requestInfo));
        }
        else {
          try {
            resolve(respParser(res.text));
          } catch (e) {
            reject(AbstractService.resolveParseError(e, res, requestInfo));
          }
        }
      });
    });

    return promise;
  }

  isSuccess(statusCode) {
    return Math.floor(statusCode / 100) === 2;
  }

  isError(statusCode) {
    return !this.isSuccess(statusCode);
  }

  /**
   * Makes an Error instance to send further up the chain. The following classes of
   * error can occur:
   * - Network errors (timeouts, CORS problems, connection refused and so on)
   * - HTTP errors where we get a HTML, plain text or other non-JSON error response
   * - HTTP errors where we get a JSON error object from the server
   * - Cases where we get a HTTP 200 OK back, but parsing the response failed
   *
   * This error instance will be an instance of Error or a subclass, but will
   * in addition have a data attribute that will contain additional information
   * about the error.
   * For network errors, the data object will contain:
   * - message: Technical error message
   * - status: 0
   * - url: The URL we tried to load
   * - method: The HTTP method that we used
   * - serviceError: true
   * For generic HTTP errors, the data object will in addition contain
   * - status: HTTP status code (such as 401 or 403)
   * - text: HTTP request body
   * - type: HTTP content type
   * For HTTP errors where we get a JSON error object back, the data object will in
   * addition contain:
   * - serverError: The error details from the server. This can contain attributes such as
   *   - environment - The enviornment the error occurred in
   *   - error_code - The error code from the server
   *   - reference - The error reference (to find this occurrence in server logs)
   *   - stacktrace - A stacktrace from the server
   * For cases where we get HTTP 200 OK, but parsing the response failed,
   * the following attributes will be populated:
   *   - message, status, url, method, serviceError, text, type (see above)
   *   - parseError: true
   */
  static resolveResponseError(err, options, requestInfo) {
    let status = err.status || 0;
    let error = AbstractService.serviceError(
      requestInfo.method + " to " + requestInfo.url + " failed with status " + status,
      {
        status: status,
        url: requestInfo.url,
        method: requestInfo.method,
        serviceError: true
      });
    if (!err.status || !err.response) {
      // Timeout, network error or other general errors
      return error;
    }
    error.data.text = err.response.text;
    error.data.type = err.response.type;

    if(err.response.text.length === 0){
      return error;
    }

    const errorObj = JSON.parse(err.response.text);

    if (errorObj.error_description) {
      error.data.caption = errorObj.error_description;
      error.data.error = true;
    }

    if (errorObj.ModelState) {
      if (errorObj.ModelState[""]) {
        const errors = errorObj.ModelState[""];
        if (errors.length > 0) {
          error.data.caption = errors[0];
          error.data.error = true;
        }
      }
    }
    if (options.parseRespAsJson && err.response.type.endsWith("json")) {
      try {
        error.data.serverError = JSON.parse(error.data.text);
      } catch (e) {
        e.data = error.data;
        error = e;
        error.parseError = true;
      }
    }

    return error;
  }

  static resolveParseError(err, res, requestInfo) {
    err.data = {
      status: res.status,
      url: requestInfo.url,
      method: requestInfo.method,
      serviceError: true,
      text: res.text,
      type: res.type,
      parseError: true
    };
    return err;
  }

  static serviceError(message, data) {
    let error = new Error(message);
    error.data = data;
    return error;
  }

}

export default AbstractService;
