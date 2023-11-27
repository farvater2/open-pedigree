
import PedigreeEditorParameters from 'pedigree/pedigreeEditorParameters';
import { translate } from 'pedigree/translation';

/**
 * Returns the age of a person with the given birth and death dates
 * @param {Date} birthDate
 * @param {Date} [deathDate]
 * @return {String} Age formatted with years, months, days
 */
var getAge = function (birthDate, deathDate) {
  var now;

  document.getElementById('ageCalculationDateLabel').innerHTML = '';
  if (deathDate == null) {
    now = new Date();

    let ageCalculationDate = PedigreeEditorParameters.getSetting('ageCalculationDate');
    if (ageCalculationDate && new Date(ageCalculationDate) instanceof Date && !isNaN(new Date(ageCalculationDate))) {
      let date = new Date(ageCalculationDate);
      now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds());
      document.getElementById('ageCalculationDateLabel').innerHTML = translate('Age is calculated on ') + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }
    //ageCalculationDate
    // let date = new Date(2020, 1, 28);
    // now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds())


  } else {
    now = deathDate;
  }

  var aSecond = 1000;
  var aMinute = aSecond * 60;
  var aHour = aMinute * 60;
  var aDay = aHour * 24;
  var aWeek = aDay * 7;
  var aMonth = aDay * 30;

  var age = now.getTime() - birthDate.getTime();

  if (age < 0) {
    return translate('not born yet');
  }

  var years = (new Date(now.getTime() - aMonth * (birthDate.getMonth()))).getFullYear()
    - (new Date(birthDate.getTime() - aMonth * (birthDate.getMonth()))).getFullYear();

  var offsetNow = (new Date(now.getTime() - aDay * (birthDate.getDate() - 1)));
  var offsetBirth = (new Date(birthDate.getTime() - aDay * (birthDate.getDate() - 1)));
  if (years > 1) {
    var months = years * 12 + (offsetNow.getMonth() - offsetBirth.getMonth());
  } else {
    var months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (offsetNow.getMonth() - offsetBirth.getMonth());
  }

  var agestr = '';

  if (months < 12) {
    var days = Math.floor(age / aDay);

    if (days < 21) {
      if (days == 1) {
        agestr = days + translate(' day');
      } else {
        agestr = days + translate(' days');
      }
    } else if (days < 60) {
      var weeks = Math.floor(age / aWeek);
      agestr = weeks + translate(' wk');
    } else {
      agestr = months + translate(' mo');
    }
  } else {
    //agestr = years + translate(' y');
    agestr = years + translate(' y', years);
  }
  return agestr;
};

export default getAge;
