Date.prototype.getWeek = function() {
    const date = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - firstDayOfYear) / 86400000 + 1) / 7);
  };
  
  module.exports = { isNewWeek };
  