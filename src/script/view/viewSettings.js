import { translate } from 'pedigree/translation';
import PedigreeEditorParameters from 'pedigree/pedigreeEditorParameters';

/**
 * Settings for pedigree view
 *
 * @class ViewSettings
 */

var ViewSettings = Class.create({

  initialize: function () {
    if (editor.isReadOnlyMode()) {
      return;
    }
    console.log('ViewSettings');

    var _this = this;

    _this.settings = {};

    this.mainDiv = new Element('div', { 'class': 'view-settings' });

    // show fullnames
    var showName = new Element('input', { 'type': 'checkbox', 'name': 'showName' });
    var showNameLabel = new Element('label', { 'class': 'cb-showName-label' }).insert(showName).insert(translate('Show LastName and FirstName'));
    showName.observe('change', function (event) {
      _this.settings.showName = !_this.settings.showName;
    });
    this.mainDiv.insert(showNameLabel);
    this.mainDiv.insert('<br>');

    // show generation number
    var showGenerationNumber = new Element('input', { 'type': 'checkbox', 'name': 'showGenerationNumber' });
    var showGenerationNumberLabel = new Element('label', { 'class': 'cb-showGenerationNumber-label' }).insert(showGenerationNumber).insert(translate('Show generation number'));
    showGenerationNumber.observe('change', function (event) {
      _this.settings.showGenerationNumber = !_this.settings.showGenerationNumber;
    });
    this.mainDiv.insert(showGenerationNumberLabel);
    this.mainDiv.insert('<br>');

    // Show sequence number inside the generation
    var showSequenceNumberInsideGeneration = new Element('input', { 'type': 'checkbox', 'name': 'showSequenceNumberInsideGeneration' });
    var showSequenceNumberInsideGenerationLabel = new Element('label', { 'class': 'cb-showSequenceNumberInsideGeneration-label' }).insert(showSequenceNumberInsideGeneration).insert(translate('Show sequence number inside the generation'));
    showSequenceNumberInsideGeneration.observe('change', function (event) {
      _this.settings.showSequenceNumberInsideGeneration = !_this.settings.showSequenceNumberInsideGeneration;
    });
    this.mainDiv.insert(showSequenceNumberInsideGenerationLabel);
    this.mainDiv.insert('<br><br>');

    var input_radio_current_date = new Element('input', { 'type': 'radio', 'value': 'current_date', 'id': 'current_date', 'name': 'select-dateType' });
    var label = new Element('label', { 'class': 'import-dateType-label' }).insert(input_radio_current_date).insert(translate('Calculate the age for the current date'));
    this.mainDiv.insert(label).insert('<br>');

    var input_radio_selected_date = new Element('input', { 'type': 'radio', 'value': 'selected_date', 'id': 'selected_date', 'name': 'select-dateType' });
    let input_age_calculation_date = new Element('input', { 'type': 'date', 'value': new Date(), 'name': 'age_calculation_date', 'disabled': 'disabled' });
    label = new Element('label', { 'class': 'import-dateType-label' }).insert(input_radio_selected_date).insert(translate('Calculate the age on a certain date:')).insert(input_age_calculation_date);
    this.mainDiv.insert(label).insert('<br>');

    input_radio_current_date.observe('change', function (event) {
      if (this.value) {
        input_age_calculation_date.value = '';
        input_age_calculation_date.setAttribute('disabled', 'disabled');
        _this.settings.ageCalculationDate = null;
      }
    });

    input_radio_selected_date.observe('change', function (event) {
      if (this.value) {
        input_age_calculation_date.removeAttribute('disabled');
      }
    });

    input_age_calculation_date.observe('change', function (event) {
      _this.settings.ageCalculationDate = this.value;
    });

    this.mainDiv.insert('<br><br><br>');
    var buttons = new Element('div', { 'class': 'buttons save-block-bottom' });
    buttons.insert(new Element('input', { type: 'button', name: 'save', 'value': translate('Save'), 'class': 'button', 'id': 'save_button' }).wrap('span', { 'class': 'buttonwrapper' }));
    buttons.insert(new Element('input', { type: 'button', name: 'cancel', 'value': translate('Cancel'), 'class': 'button secondary' }).wrap('span', { 'class': 'buttonwrapper' }));
    this.mainDiv.insert(buttons);
    var cancelButton = buttons.down('input[name="cancel"]');
    cancelButton.observe('click', function (event) {
      _this.hide();
    });
    var saveButton = buttons.down('input[name="save"]');
    saveButton.observe('click', function (event) {
      _this._onSaveStarted();
    });
    
    let language = PedigreeEditorParameters.getSetting('language');
    if (language === 'rus') {
      _translations.Today = 'Сегодня';
      _translations.Clear = 'Очистить';
    }
  },

  /**
     * Save view settings
     *
     */
  _onSaveStarted: function () {
    this.hide();
    console.log('_onSaveStarted');

    let showName = this.settings.showName;
    let showGenerationNumber = this.settings.showGenerationNumber;
    let showSequenceNumberInsideGeneration = this.settings.showSequenceNumberInsideGeneration;
    let ageCalculationDate = this.settings.ageCalculationDate;

    PedigreeEditorParameters.saveSettings({ showName, showGenerationNumber, showSequenceNumberInsideGeneration, ageCalculationDate });

    document.fire('pedigree:graph:clear');
    document.fire('pedigree:undo');
  },

  /**
     * Displays the view settings
     *
     * @method show
     */
  show: function () {
    var _this = this;
    console.log('Displays the view settings');

    let showName = PedigreeEditorParameters.getSetting('showName');
    _this.mainDiv.down('input[type=checkbox][name="showName"]').checked = showName;
    this.settings.showName = showName;

    let showGenerationNumber = PedigreeEditorParameters.getSetting('showGenerationNumber');
    _this.mainDiv.down('input[type=checkbox][name="showGenerationNumber"]').checked = showGenerationNumber;
    this.settings.showGenerationNumber = showGenerationNumber;

    let showSequenceNumberInsideGeneration = PedigreeEditorParameters.getSetting('showSequenceNumberInsideGeneration');
    _this.mainDiv.down('input[type=checkbox][name="showSequenceNumberInsideGeneration"]').checked = showSequenceNumberInsideGeneration;
    this.settings.c = showSequenceNumberInsideGeneration;

    let ageCalculationDate = PedigreeEditorParameters.getSetting('ageCalculationDate');
    if (ageCalculationDate) {
      _this.mainDiv.down('input[type=date][name="age_calculation_date"]').value = ageCalculationDate;
      this.mainDiv.down('input[type=date][name="age_calculation_date"]').removeAttribute('disabled');
      _this.mainDiv.down('#selected_date').checked = true;
    } else {
      _this.mainDiv.down('input[type=date][name="age_calculation_date"]').value = '';
      _this.mainDiv.down('#current_date').checked = true;
    }
    this.settings.ageCalculationDate = ageCalculationDate;

    var closeShortcut = ['Esc'];
    _this.dialog = new PhenoTips.widgets.ModalPopup(_this.mainDiv, { close: { method: _this.hide.bind(_this), keys: closeShortcut } }, { extraClassName: 'pedigree-settings-chooser', title: translate('Pedigree settings'), displayCloseButton: true });
    _this.dialog.show();
  },

  /**
     * Removes the the template selector
     *
     * @method hide
     */
  hide: function () {
    this.dialog.closeDialog();
  }

});

export default ViewSettings;
