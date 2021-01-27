import { CONFIG } from './config.mjs';

export class Analytics {
    constructor() {
        ga('create', CONFIG.gaTrackingId, 'auto');
    }

    setPage(location) {
        return ga('set', 'page', location);
    }

    sendPageview() {
        return ga('send', 'pageview');
    }

    sendEvent (eventCategory, eventAction) {
        return ga('send', 'event', eventCategory, eventAction);
    }
}
