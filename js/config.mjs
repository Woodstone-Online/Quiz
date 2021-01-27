const PRODUCTION_HOST = 'app.woodstone.online';

function getGaTrackingId() {
    if (location.host === PRODUCTION_HOST) {
        return 'UA-185924370-1';
    }
    return 'UA-185924370-2';
}

function getApiUrl() {
    if (location.host === PRODUCTION_HOST) {
        return 'https://core.woodstone.online/api/';
    }
    return 'https://coredev.woodstone.online/api/'
}


export const CONFIG = {
    gaTrackingId: getGaTrackingId(),
    apiUrl: getApiUrl(),
};
