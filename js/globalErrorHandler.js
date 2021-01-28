export function handleErrors(msg, url, lineNo) {
    console.log('Error occured:', msg, url, lineNo);
    return true;
}

window.onerror = handleErrors;
