export function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertFails(runnable, message = 'Assertion failed') {
    assert(typeof runnable === 'function', 'Runnable is not function');
    try {
        runnable();
    } catch (error) {
        // Intended path
        return;
    }
    assert(false, message);
}

export async function test(name, runnable) {
    const list = document.getElementsByTagName('ul')[0];
    const result = document.createElement('li');
    result.appendChild(document.createTextNode(`${name}. Passed`));
    result.style.fontSize = '24px';
    result.style.color = 'green';
    result.style.listStyleImage = 'url("../images/tick.png")';
    try {
        await runnable();
    } catch (error) {
        result.replaceChild(document.createTextNode(`${name}. ${error}`), result.firstChild);
        result.style.color = 'red';
        result.style.listStyleImage = 'url("../images/cross.png")';
    }
    list.appendChild(result);
}

export async function assertThrows(message, runnable) {
    try {
        await runnable()
    } catch (_) {
        return
    }
    throw new Error(message);
}

export async function assertNotThrows(message, runnable) {
    try {
        await runnable()
    } catch (_) {
        throw new Error(message)
    }
}
