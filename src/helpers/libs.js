const helpers = {};

helpers.randomName = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';
    for (let i = 0; i < 6; i++){
        name += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return name;
}

module.exports = helpers;