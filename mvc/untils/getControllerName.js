module.exports = function (name) {
    name = name.toLowerCase();
    let nameArr = [];
    let newName = '';
    nameArr = name.split('-');
    nameArr.forEach(item => {
        newName += item[0].toUpperCase() + item.slice(1);
    });
    return newName;
}