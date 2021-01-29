import {CONFIG} from './config.mjs';

export class Analytics {
    constructor() {
        try {
            ga('create', CONFIG.gaTrackingId, 'auto');
        } catch (error) {
            console.error(error)
        }
    }

    setPage(location) {
        try {
            return ga('set', 'page', location);
        } catch (error) {
            console.error(error)
        }
    }

    sendPageview() {
        try {
            return ga('send', 'pageview');
        } catch (error) {
            console.error(error)
        }
    }

    sendEvent(eventCategory, eventAction) {
        try {
            return ga('send', 'event', eventCategory, eventAction);
        } catch (error) {
            console.error(error)
        }
    }
}
