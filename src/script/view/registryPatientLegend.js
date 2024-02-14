import RegistryPatient from 'pedigree/RegistryPatient';
import Legend from 'pedigree/view/legend';
import { translate } from 'pedigree/translation';

/**
 * Class responsible for keeping track of RegistryPatient and their properties, and for
 * caching disorders data as loaded from the Registry database.
 * This information is graphically displayed in a 'Legend' box
 *
 * @class RegistryPatientLegend
 * @constructor
 */
var RegistryPatientLegend = Class.create( Legend, {

  initialize: function($super) {
    $super(translate('RegistryPatients'));

    this._termCache = {};
  },

  _getPrefix: function(id) {
    return 'registrypatient';
  },

  /**
     * Returns the RegistryPatient object with the given ID. If object is not in cache yet
     * returns a newly created one which may have the term name & other attributes not loaded yet
     *
     * @method getTerm
     * @return {Object}
     */
  getTerm: function(registryPatientID) {
    registryPatientID = RegistryPatient.sanitizeID(registryPatientID);
    if (!this._termCache.hasOwnProperty(registryPatientID)) {
      var whenNameIsLoaded = function() {
        this._updateTermName(registryPatientID);
      };
      this._termCache[registryPatientID] = new RegistryPatient(registryPatientID, null, whenNameIsLoaded.bind(this));
    }
    return this._termCache[registryPatientID];
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
     * Registers an occurrence of a RegistryPatient.
     *
     * @method addCase
     * @param {Number|String} id ID for this term taken from the Registry database
     * @param {String} name The description of the RegistryPatient
     * @param {Number} nodeID ID of the Person who has this RegistryPatient
     */
  addCase: function($super, id, name, nodeID) {
    if (!this._termCache.hasOwnProperty(id)) {
      this._termCache[id] = new RegistryPatient(id, name);
    }

    $super(id, name, nodeID);
  },

  /**
     * Updates the displayed RegistryPatient name for the given RegistryPatient
     *
     * @method _updateTermName
     * @param {Number} id The identifier of the RegistryPatient to update
     * @private
     */
  _updateTermName: function(id) {
    //console.log("updating phenotype display for " + id + ", name = " + this.getTerm(id).getName());
    var name = this._legendBox.down('li#' + this._getPrefix() + '-' + id + ' .disorder-name');
    name.update(this.getTerm(id).getName());
  }
});

export default RegistryPatientLegend;
