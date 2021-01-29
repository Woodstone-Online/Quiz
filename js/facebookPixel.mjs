import {CONFIG} from './config.mjs';

export class FacebookPixel {
    constructor() {
        try {
            fbq('init', CONFIG.facebookPixelId);
        } catch (error) {
            console.error(error)
        }
    }

    sendPageview() {
        try {
            return fbq('track', 'PageView');
        } catch (error) {
            console.error(error)
        }
    }
}
