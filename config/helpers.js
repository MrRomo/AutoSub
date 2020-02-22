const helpers = {}
const moment = require('moment')


helpers.timeAgo = date => {
    moment.locale('es');
    return moment(date).startOf('minute').fromNow()
}


module.exports = helpers
