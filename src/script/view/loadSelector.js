import { translate } from 'pedigree/translation';

/**
 * The UI Element for loading pedigrees from DB
 *
 * @class LoadSelector
 */

var LoadSelector = Class.create({

  initialize: function () {
    if (editor.isReadOnlyMode()) {
      return;
    }

    var _this = this;

    //    var patientsUrl = '/ajax.jsp?action=getPatients';

    this.mainDiv = new Element('div', { 'class': 'load-selector' });

    var buttons = new Element('div', { 'class': 'buttons load-block-bottom' });
    buttons.insert(new Element('input', { type: 'button', name: 'load', 'value': translate('Load'), 'class': 'button', 'id': 'load_button' }).wrap('span', { 'class': 'buttonwrapper' }));
    buttons.insert(new Element('input', { type: 'button', name: 'cancel', 'value': translate('Cancel'), 'class': 'button secondary' }).wrap('span', { 'class': 'buttonwrapper' }));

    this.mainDiv.insert(buttons);

    var cancelButton = buttons.down('input[name="cancel"]');
    cancelButton.observe('click', function (event) {
      _this.hide();
    });
    var loadButton = buttons.down('input[name="load"]');
    loadButton.observe('click', function (event) {
      _this._onLoadStarted();
    });
  },

  /**
     * Loads the template once it has been selected
     *
     */
  _onLoadStarted: function () {
    // var importValue = this.importValue.value;
    // console.log('Importing:\n' + importValue);

    this.hide();
    //editor.getSaveLoadEngine().load('/pedigree/ajax.jsp?action=getGenogram&patient_id=' + editor.patient_id);
    editor.getSaveLoadEngine().load('./' + editor.id_patient);
    //editor.getSaveLoadEngine().load('/pedigree/' + editor.id_patient);
  },

  /**
     * Displays the template selector
     *
     * @method show
     */
  show: function () {

    var patientsUrl = './getPatients';
    //var patientsUrl = '/pedigree/getPatients';

    var _this = this;

    new Ajax.Request(patientsUrl, {
      method: 'GET',
      onCreate: function () {
        //   document.fire('pedigree:load:start');
      },
      onSuccess: function (_response) {
        try {
          if (_response && _response.responseText) {
            var response = JSON.parse(_response.responseText);

            function updateSelector() {
              _this.select.innerHTML = ""
              for (var i = 0; i < response.length; i++) {
                var item = response[i];
                _this.select.insert(new Element('option', { 'value': item.id }).update(item.fullname));
              }
              editor.id_patient = _this.select.value;
            }

            if (!_this.select) {
              
              var copyURL = new Element('div', { 'class': 'buttons copy-url-bottom' });
              copyURL.insert(new Element('input', { type: 'button', name: 'copyURL', 'value': translate('Copy URL'), 'class': 'button', 'id': 'copyURL_button' }).wrap('span', { 'class': 'buttonwrapper' }));
              _this.mainDiv.prepend(copyURL);

              var select = new Element('select', { 'class': '' });
              _this.mainDiv.prepend(select);

              _this.select = select;
              select.observe('change', function (event) {
                editor.id_patient = select.value;
                console.log('select change');
              });

              copyURL.observe('click', function (event) {
                //let URL = '/pedigree/' + editor.id_patient;
                let URL = './' + editor.id_patient;
                navigator.clipboard.writeText(URL);
              });
            }
            updateSelector();

            var closeShortcut = ['Esc'];

            _this.dialog = new PhenoTips.widgets.ModalPopup(_this.mainDiv, { close: { method: _this.hide.bind(_this), keys: closeShortcut } }, { extraClassName: 'pedigree-load-chooser', title: translate('Pedigree load'), displayCloseButton: true });

            _this.dialog.show();
          }
        } catch (e) {
          console.error(e);
        }

      },
      onComplete: function () {
      }
    });

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

export default LoadSelector;
