import PatientRegistry from 'pedigree/PatientRegistry';
import Legend from 'pedigree/view/legend';
import { translate } from 'pedigree/translation';

/**
 * Class responsible for keeping track of PatientRegistry and their properties, and for
 * caching disorders data as loaded from the Registry database.
 * This information is graphically displayed in a 'Legend' box
 *
 * @class PatientRegistryLegend
 * @constructor
 */
var PatientRegistryLegend = Class.create( Legend, {

  initialize: function($super) {
    $super(translate('Patients'));

    this._termCache = {};
  },

  _getPrefix: function(id) {
    return 'patientregistry';
  },

  /**
     * Returns the PatientRegistry object with the given ID. If object is not in cache yet
     * returns a newly created one which may have the term name & other attributes not loaded yet
     *
     * @method getTerm
     * @return {Object}
     */
  getTerm: function(patientRegistryID) {
    patientRegistryID = PatientRegistry.sanitizeID(patientRegistryID);
    if (!this._termCache.hasOwnProperty(patientRegistryID)) {
      var whenNameIsLoaded = function() {
        this._updateTermName(patientRegistryID);
      };
      this._termCache[patientRegistryID] = new PatientRegistry(patientRegistryID, null, whenNameIsLoaded.bind(this));
    }
    return this._termCache[patientRegistryID];
  },

  /**
     * Retrieve the color associated with the given object
     *
     * @method getObjectColor
     * @param {String|Number} id ID of the object
     * @return {String} CSS color value for that disorder
     */
  getObjectColor: function(id) {
    return '#CCCCCC';
  },

  /**
     * Registers an occurrence of a PatientRegistry.
     *
     * @method addCase
     * @param {Number|String} id ID for this term taken from the Registry database
     * @param {String} name The description of the PatientRegistry
     * @param {Number} nodeID ID of the Person who has this PatientRegistry
     */
  addCase: function($super, id, name, nodeID) {
    if (!this._termCache.hasOwnProperty(id)) {
      this._termCache[id] = new PatientRegistry(id, name);
    }

    $super(id, name, nodeID);
  },

  /**
     * Updates the displayed PatientRegistry name for the given PatientRegistry
     *
     * @method _updateTermName
     * @param {Number} id The identifier of the PatientRegistry to update
     * @private
     */
  _updateTermName: function(id) {
    //console.log("updating phenotype display for " + id + ", name = " + this.getTerm(id).getName());
    var name = this._legendBox.down('li#' + this._getPrefix() + '-' + id + ' .disorder-name');
    name.update(this.getTerm(id).getName());
  }
});

export default PatientRegistryLegend;
