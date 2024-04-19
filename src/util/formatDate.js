const { format } = require('date-fns');

exports.formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return format(date, 'dd-MM-yyyy');
};
