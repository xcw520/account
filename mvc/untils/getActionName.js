module.exports = function (name, method, controller) {
    method = method.toLowerCase();
    let newActionName = method + '_' + name;
    if (controller[newActionName]) {
        return newActionName;
    }
    return 'all_' + name;
}