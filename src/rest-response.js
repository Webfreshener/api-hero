import {BehaviorSubject} from "rxjs";

const isFetchPolyfill = () => {
    const _env = (global || window);
    return _env.fetch.hasOwnProperty("polyfill");
};

export class RestResponse {
    constructor(requestObj) {
        const _subj = new BehaviorSubject().skip(1);
        Object.defineProperty(this, "subscribe", {
            value: (handlers) => {
                return _subj.subscribe(handlers);
            },
            enumerable: true,
            configurable: false,
        });

        requestObj.request().then((res) => {
            // nodejs uses a fetch polyfill which requires manual handling of location header
            if (isFetchPolyfill) {
                const _location = res.headers.get("location");
                // detects if we have a url to follow
                if (_location !== null) {
                    // creates and invokes a request object for the location request
                    requestObj.follow(_location).exec().subscribe({
                        next: (res) => {
                            // sends response data to subscribers from redirect
                            _subj.next(res);
                        },
                        error: (e) => {
                            // sends error to subscriber from redirect
                            _subj.error(e);
                        }
                    });
                } else {
                    // sends response data to subscribers from request origin
                    _subj.next(res);
                }
            } else {
                // sends response data to subscribers from request origin
                _subj.next(res);
            }
        }).catch((e) => {
            // catch all handler on bad implementation
            _subj.error(e);
        });
    }
}
