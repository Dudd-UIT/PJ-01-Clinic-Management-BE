let currentDate = new Date();
let STTKham = 1;
let STTCLS = 1;

const areDatesEqual = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const getSTTKham = (inputDate) => {
  if (areDatesEqual(inputDate, currentDate)) {
    return STTKham++;
  } else {
    STTKham = 1;
    currentDate = new Date();
    return STTKham++;
  }
};

const getSTTCLS = (inputDate) => {
  if (areDatesEqual(inputDate, currentDate)) {
    return STTCLS++;
  } else {
    STTCLS = 1;
    currentDate = new Date();
    return STTCLS++;
  }
};

module.exports = {getSTTKham, getSTTCLS};
