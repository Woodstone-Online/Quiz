import { CONFIG } from './config.mjs';

export class FacebookPixel {
    constructor() {
        fbq('init', CONFIG.facebookPixelId);
    }

    sendPageview() {
        return fbq('track', 'PageView');
    }
}
