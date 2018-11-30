export class Request {
    constructor() {

    }

    static getHeaders(result) {
        const _result = {
            status: result.status,
            statusText: result.statusText,
            ok: result.ok,
            headers: {},
            url: result.url,
        };
        result.headers.forEach((val, key) => _result.headers[key] = val);
        return _result;
    }
}