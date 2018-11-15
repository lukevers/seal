let events = {};

const getId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const send = async (func, data = {}, cb = null) => {
    // Callback or promise
    if (cb !== null) {
        const id = getId();
        events[id] = cb;

        window.addEventListener(`ResponseMessage-${id}`, (message) => {
            if (events[message.detail.id]) {
                events[message.detail.id](message.detail);
                delete events[message.detail.id];
            }
        });

        window.external.invoke(JSON.stringify({
            id: id,
            fn: func,
            data: data,
        }));
    } else {
        return await new Promise((resolve, reject) => {
            const id = getId();

            window.addEventListener(`ResponseMessage-${id}`, (message) => {
                if (id === message.detail.id) {
                    resolve(message.detail);
                }
            });

            window.external.invoke(JSON.stringify({
                id: id,
                fn: func,
                data: data,
            }));
        });
    }
};

export default {
    ping: async (cb) => { return await send('ping', {}, cb); },
    load: async (what, how, cb) => { return await send('load', {what, how}, cb); },
    sync: async (what, how, cb) => { return await send('sync', {what, how: JSON.stringify(how)}, cb); },
};
