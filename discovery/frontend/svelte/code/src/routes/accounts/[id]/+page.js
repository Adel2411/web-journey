import { error } from '@sveltejs/kit';

export function load({ params }) {
    // fetch the data...

    // SQL...

    let accounts = {
        ramyhadid: {
            name: 'ramy hadid',
            age: 18
        },

        microclub: {
            name: 'MicroClub USTHB',
            age: 10
        }
    };

    let user = accounts[params.id];

    if (user) {
        return user;
    } else {
        return error(404);
    }
}
