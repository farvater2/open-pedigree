import TemplateSelector from 'pedigree/view/templateSelector';

/**
 * SaveLoadEngine is responsible for automatic and manual save and load operations.
 *
 * @class SaveLoadEngine
 * @constructor
 */

function unescapeRestData(data) {
  // http://stackoverflow.com/questions/4480757/how-do-i-unescape-html-entities-in-js-change-lt-to
  var tempNode = document.createElement('div');
  tempNode.innerHTML = data.replace(/&amp;/, '&');
  return tempNode.innerText || tempNode.text || tempNode.textContent;
}

function getSelectorFromXML(responseXML, selectorName, attributeName, attributeValue) {
  if (responseXML.querySelector) {
    // modern browsers
    return responseXML.querySelector(selectorName + '[' + attributeName + '=\'' + attributeValue + '\']');
  } else {
    // IE7 && IE8 && some other older browsers
    // http://www.w3schools.com/XPath/xpath_syntax.asp
    // http://msdn.microsoft.com/en-us/library/ms757846%28v=vs.85%29.aspx
    var query = '//' + selectorName + '[@' + attributeName + '=\'' + attributeValue + '\']';
    try {
      return responseXML.selectSingleNode(query);
    } catch (e) {
      // Firefox v3.0-
      alert('your browser is unsupported');
      window.stop && window.stop();
      throw 'Unsupported browser';
    }
  }
}

function getSubSelectorTextFromXML(responseXML, selectorName, attributeName, attributeValue, subselectorName) {
  var selector = getSelectorFromXML(responseXML, selectorName, attributeName, attributeValue);

  var value = selector.innerText || selector.text || selector.textContent;

  if (!value)     // fix IE behavior where (undefined || "" || undefined) == undefined
  {
    value = '';
  }

  return value;
}

/**
 * Escapes a string for use in a regular expression.  Taken from MDN:
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 * 
 * @param {String} string 
 * @returns 
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Uses native browser functionalty to encode HTML entities within a string.
 * 
 * @param {String} string 
 * @returns 
 */
function encodeHTMLEntities(string) {
  let el = document.createElement('div');
  el.textContent = string;
  return el.innerHTML;
}

/**
 * Converts a URI into a value which can be used in a regular expression
 * 
 * @param {String} uri 
 * @returns 
 */
function uriAsRegex(uri) {
  return escapeRegExp(
    encodeHTMLEntities(uri)
  );
}

/**
 * Process the Canvas element to return SVG data.
 * 
 * @param {DOMElement} element 
 */
function canvasToSvg(element) {
  var bbox = element.down().getBBox();

  return element.innerHTML
    .replace(/xmlns:xlink=".*?"/, '')
    .replace(/width=".*?"/, '')
    .replace(/height=".*?"/, '')
    .replace(/viewBox=".*?"/, 'viewBox="' + bbox.x + ' ' + bbox.y + ' ' + bbox.width + ' ' + bbox.height + '" width="' + bbox.width + '" height="' + bbox.height + '" xmlns:xlink="http://www.w3.org/1999/xlink"')
    .replaceAll(new RegExp(uriAsRegex(window.location.href), 'g'), '');
}


var SaveLoadEngine = Class.create({
  _defaultSaveFunction: function (args) {
    var me = this;

    new Ajax.Request(args.patientDataUrl, {
      method: 'POST',
      onCreate: function () {
        args.setSaveInProgress(true);
      },
      onComplete: function () {
        args.setSaveInProgress(false);
        me._saveInProgress = false;
      },
      onSuccess: function (response) { 
        const data = response.responseJSON;
        // перезагружаем для подгрузки данных из регистра
        window.location=window.location.href.split('?')[0] + `?id_family=${data.id_family}&id_patient=${data.id_patient}`
        //location.reload(`./pedigree/?id_family=${data.id_family}&id_patient=${data.id_patient}`);
        //location.reload();
        //location = window.location
       },
      /* id_patient для новых пациентов */
      parameters: { 'id_patient': args.id_patient, 'pedigree_data': args.jsonData, 'id_family': args.id_family, 'pedigree_svg': args.svgData }
    });
  },

  _defaultLoadFunction: function (args) {
    var _this = this;
    var didLoadData = false;

    new Ajax.Request(args.patientDataUrl, {
      method: 'GET',
      onCreate: function () {
        document.fire('pedigree:load:start');
      },
      onSuccess: function (response) {
        try {
          //console.log("Data from LOAD: " + JSON.stringify(response));
          //console.log("[Data from LOAD]");
          if (response && response.responseText) {
            var rawdata = JSON.parse(response.responseText)[0].pedigree_data;//getSubSelectorTextFromXML(response.responseXML, 'property', 'name', 'data', 'value');
            
            var jsonData = unescapeRestData(rawdata);
            if (jsonData.trim()) {
              //console.log('[LOAD] recived JSON: ' + JSON.stringify(jsonData));
              args.onSuccess(jsonData);
              //jsonData = editor.getVersionUpdater().updateToCurrentVersion(jsonData);
              //console.log('editor.getVersionUpdater().updateToCurrentVersion(jsonData)');
              let prop = JSON.parse(jsonData).GG[0].prop;
              //editor.id_patient = prop.id_patient;
              editor.id_patient = JSON.parse(response.responseText)[0].id_patient;
              let patient_name = JSON.parse(response.responseText)[0].patient_name;
              editor.id_family = JSON.parse(response.responseText)[0].id_family;
              //let patient_name = [prop.lName, prop.fName, prop.patronymic].join(' ');
              let title__patient_href = document.getElementsByClassName('title__patient_href')[0];
              title__patient_href.innerText = patient_name;
              title__patient_href.setAttribute('href', '../patients/' + editor.id_patient);

              didLoadData = true;
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      onComplete: function () {
        if (!didLoadData) {
          // If load failed, just open templates
          new TemplateSelector(true);
        }
      }
    });
  },

  initialize: function (options) {
    this._saveFunction = options.save || this._defaultSaveFunction;
    this._loadFunction = options.load || this._defaultLoadFunction;
    this._customBackend = (this._saveFunction.toString() !== this._defaultSaveFunction.toString())
      && (this._loadFunction.toString() !== this._defaultLoadFunction.toString());
    this._saveInProgress = false;

    let id_patient = this.getUrlParameter('id_patient');
    let id_family = this.getUrlParameter('id_family');
    if (id_patient) {
      if (id_family) {
        this.load('./' + id_patient + '?id_family=' + id_family);
      } else {
        this.load('./' + id_patient);
      }
    }   
  },

  /**
     * Saves the state of the graph
     *
     * @return Serialization data for the entire graph
     */
  serialize: function () {
    return editor.getGraph().toJSON();
  },

  createGraphFromSerializedData: function (JSONString, noUndo, centerAround0) {
    //console.log('---- load: parsing data ----', JSONString);
    document.fire('pedigree:load:start');

    try {
      var changeSet = editor.getGraph().fromJSON(JSONString);
    } catch (err) {
      console.log('ERROR loading the graph: ', err);
      alert('Error loading the graph');
      document.fire('pedigree:graph:clear');
      document.fire('pedigree:load:finish');
      return;
    }

    if (editor.getView().applyChanges(changeSet, false)) {
      editor.getWorkspace().adjustSizeToScreen();
    }

    if (centerAround0) {
      editor.getWorkspace().centerAroundNode(0);
    }

    if (!noUndo) {
      editor.getActionStack().addState(null, null, JSONString);
    }

    document.fire('pedigree:load:finish');
  },

  createGraphFromImportData: function (importString, importType, importOptions, noUndo, centerAround0) {
    console.log('---- import: parsing data ----');
    document.fire('pedigree:load:start');

    try {
      var changeSet = editor.getGraph().fromImport(importString, importType, importOptions);
      if (changeSet == null) {
        throw 'unable to create a pedigree from imported data';
      }
    } catch (err) {
      alert('Error importing pedigree: ' + err);
      document.fire('pedigree:load:finish');
      return;
    }

    if (!noUndo) {
      var JSONString = editor.getGraph().toJSON();
    }

    if (editor.getView().applyChanges(changeSet, false)) {
      editor.getWorkspace().adjustSizeToScreen();
    }

    if (centerAround0) {
      editor.getWorkspace().centerAroundNode(0);
    }

    if (!noUndo) {
      editor.getActionStack().addState(null, null, JSONString);
    }

    document.fire('pedigree:load:finish');
  },

  setSaveInProgress: function (status) {
    this._saveInProgress = status;
  },

  save: function (patientDataUrl) {
    if (this._saveInProgress) {
      return;
    }   // Don't send parallel save requests

    var jsonData = this.serialize();

    //console.log('[SAVE] data: ' + JSON.stringify(jsonData));

    var image = $('canvas');
    var background = image.getElementsByClassName('panning-background')[0];
    var backgroundPosition = background.nextSibling;
    var backgroundParent = background.parentNode;
    backgroundParent.removeChild(background);

    this._saveFunction({
      patientDataUrl: editor.id_family ? patientDataUrl + '/' + editor.id_family : patientDataUrl,
      //patientDataUrl: patientDataUrl,
      id_patient: editor.id_patient || new URLSearchParams(window.location.search).get('id_patient'),
      id_family: editor.id_family,
      jsonData: jsonData,
      setSaveInProgress: this.setSaveInProgress,
      svgData: canvasToSvg(image)
    });
    backgroundParent.insertBefore(background, backgroundPosition);
  },

  _displayData: function (jsonData) {
    // update the json to the current version, then load it in the current interface 
    //console.log('2editor.getVersionUpdater().updateToCurrentVersion(jsonData)');
    this.createGraphFromSerializedData(
      editor.getVersionUpdater().updateToCurrentVersion(jsonData)
    );
  },

  load: function (patientDataUrl) {
    console.log('initiating load process');
    if (patientDataUrl || this._customBackend) {
      this._loadFunction({
        patientDataUrl: patientDataUrl,
        onSuccess: this._displayData.bind(this),
        onFailure: () => { new TemplateSelector(true); }
      });
    } else {
      //   new TemplateSelector(true);
    }
  },

  getUrlParameter: function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
    return undefined;
  }
});

export default SaveLoadEngine;
