module.exports = function (name) {
    let newName = 'ac_' + name[0].toLowerCase();
    for (let i = 1; i < name.length; i++) {
        if (name[i] == '.') break;
        if (name[i].charCodeAt() >= 65 && name[i].charCodeAt() <= 90) {
            newName += '_' + name[i].toLowerCase();
        } else {
            newName += name[i];
        }
    }
    return newName;
}