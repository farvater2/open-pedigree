import { Timer } from 'pedigree/model/helpers';
import { ChildlessBehavior } from 'pedigree/view/abstractNode';
import AbstractPerson from 'pedigree/view/abstractPerson';
import PersonVisuals from 'pedigree/view/personVisuals';
import HPOTerm from 'pedigree/hpoTerm';
import PatientRegistry from 'pedigree/patientRegistry';
import Disorder from 'pedigree/disorder';
import { translate } from 'pedigree/translation';

/**
 * Person is a class representing any AbstractPerson that has sufficient information to be
 * displayed on the final pedigree graph (printed or exported). Person objects
 * contain information about disorders, age and other relevant properties, as well
 * as graphical data to visualize this information.
 *
 * @class Person
 * @constructor
 * @extends AbstractPerson
 * @param {Number} x X coordinate on the Raphael canvas at which the node drawing will be centered
 * @param {Number} y Y coordinate on the Raphael canvas at which the node drawing will be centered
 * @param {String} gender 'M', 'F' or 'U' depending on the gender
 * @param {Number} id Unique ID number
 * @param {Boolean} isProband True if this person is the proband
 */

var Person = Class.create(AbstractPerson, {

  initialize: function($super, x, y, id, properties) {
    //var timer = new Timer();
    this._isProband = (id == 0);
    !this._type && (this._type = 'Person');
    this._setDefault();
    var gender = properties.hasOwnProperty('gender') ? properties['gender'] : 'U';
    $super(x, y, gender, id);

    // need to assign after super() and explicitly pass gender to super()
    // because changing properties requires a redraw, which relies on gender
    // shapes being there already
    this.assignProperties(properties);
    //timer.printSinceLast("=== new person runtime: ");
  },

  _setDefault: function() {
    this._firstName = '';
    this._lastName = '';
    this._patronymic = '';
    this._lastNameAtBirth = '';
    this._birthDate = '';
    this._deathDate = '';
    this._deathAge = '';
    this._conceptionDate = '';
    this._gestationAge = '';
    this._isAdopted = false;
    this._externalID = '';
    this._patientRegistry = [];
    this._lifeStatus = 'alive';
    this._childlessStatus = null;
    this._carrierStatus = '';
    this._disorders = [];
    this._hpo = [];
    this._candidateGenes = [];
    this._twinGroup = null;
    this._monozygotic = false;
    this._evaluated = false;
    this._lostContact = false;
  },

  /**
     * Initializes the object responsible for creating graphics for this Person
     *
     * @method _generateGraphics
     * @param {Number} x X coordinate on the Raphael canvas at which the node drawing will be centered
     * @param {Number} y Y coordinate on the Raphael canvas at which the node drawing will be centered
     * @return {PersonVisuals}
     * @private
     */
  _generateGraphics: function(x, y) {
    return new PersonVisuals(this, x, y);
  },

  /**
     * Returns True if this node is the proband (i.e. the main patient)
     *
     * @method isProband
     * @return {Boolean}
     */
  isProband: function() {
    return this._isProband;
  },

  /**
     * Returns the first name of this Person
     *
     * @method getFirstName
     * @return {String}
     */
  getFirstName: function() {
    return this._firstName;
  },

  /**
     * Replaces the first name of this Person with firstName, and displays the label
     *
     * @method setFirstName
     * @param firstName
     */
  setFirstName: function(firstName) {
    firstName && (firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1));
    this._firstName = firstName;
    this.getGraphics().updateNameLabel();
  },

  /**
     * Returns the last name of this Person
     *
     * @method getLastName
     * @return {String}
     */
  getLastName: function() {
    return this._lastName;
  },

  /**
     * Replaces the last name of this Person with lastName, and displays the label
     *
     * @method setLastName
     * @param lastName
     */
  setLastName: function(lastName) {
    lastName && (lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1));
    this._lastName = lastName;
    this.getGraphics().updateNameLabel();
    return lastName;
  },

  /**
     * Returns the patronymic of this Person
     *
     * @method getPatronymic
     * @return {String}
     */
   getPatronymic: function() {
    return this._patronymic;
  },

  /**
     * Replaces the patronymic of this Person with patronymic, and displays the label
     *
     * @method setPatronymic
     * @param patronymic
     */
   setPatronymic: function(patronymic) {
    patronymic && (patronymic = patronymic.charAt(0).toUpperCase() + patronymic.slice(1));
    this._patronymic = patronymic;
    this.getGraphics().updateNameLabel();
    return patronymic;
  },

  /**
     * Returns the externalID of this Person
     *
     * @method getExternalID
     * @return {String}
     */
  getExternalID: function() {
    return this._externalID;
  },

  /**
     * Replaces the external ID of this Person with the given ID, and displays the label
     *
     * @method setExternalID
     * @param externalID
     */
  setExternalID: function(externalID) {
    this._externalID = externalID;
    this.getGraphics().updateExternalIDLabel();
  },

  /**
     * Replaces free-form comments associated with the node and redraws the label
     *
     * @method setComments
     * @param comment
     */
  setComments: function($super, comment) {
    if (comment != this.getComments()) {
      $super(comment);
      this.getGraphics().updateCommentsLabel();
    }
  },

  /**
     * Sets the type of twin
     *
     * @method setMonozygotic
     */
  setMonozygotic: function(monozygotic) {
    if (monozygotic == this._monozygotic) {
      return;
    }
    this._monozygotic = monozygotic;
  },

  /**
     * Returns the documented evaluation status
     *
     * @method getEvaluated
     * @return {Boolean}
     */
  getEvaluated: function() {
    return this._evaluated;
  },

  /**
     * Sets the documented evaluation status
     *
     * @method setEvaluated
     */
  setEvaluated: function(evaluationStatus) {
    if (evaluationStatus == this._evaluated) {
      return;
    }
    this._evaluated = evaluationStatus;
    this.getGraphics().updateEvaluationLabel();
  },

  /**
     * Returns the "in contact" status of this node.
     * "False" means proband has lost contaxt with this individual
     *
     * @method getLostContact
     * @return {Boolean}
     */
  getLostContact: function() {
    return this._lostContact;
  },

  /**
     * Sets the "in contact" status of this node
     *
     * @method setLostContact
     */
  setLostContact: function(lostContact) {
    if (lostContact == this._lostContact) {
      return;
    }
    this._lostContact = lostContact;
  },

  /**
     * Returns the type of twin: monozygotic or not
     * (always false for non-twins)
     *
     * @method getMonozygotic
     * @return {Boolean}
     */
  getMonozygotic: function() {
    return this._monozygotic;
  },

  /**
     * Assigns this node to the given twin group
     * (a twin group is all the twins from a given pregnancy)
     *
     * @method setTwinGroup
     */
  setTwinGroup: function(groupId) {
    this._twinGroup = groupId;
  },

  /**
     * Returns the status of this Person
     *
     * @method getLifeStatus
     * @return {String} "alive", "deceased", "stillborn", "unborn", "aborted" or "miscarriage"
     */
  getLifeStatus: function() {
    return this._lifeStatus;
  },

  /**
     * Returns True if this node's status is not 'alive' or 'deceased'.
     *
     * @method isFetus
     * @return {Boolean}
     */
  isFetus: function() {
    return (this.getLifeStatus() != 'alive' && this.getLifeStatus() != 'deceased');
  },

  /**
     * Returns True if this node's status is 'deceased'.
     *
     * @method isDeceased
     * @return {Boolean}
     */
  isDeceased: function() {
    return (this.getLifeStatus() == 'deceased');
  },

  /**
     * Returns True is status is 'unborn', 'stillborn', 'aborted', 'miscarriage', 'alive' or 'deceased'
     *
     * @method _isValidLifeStatus
     * @param {String} status
     * @returns {boolean}
     * @private
     */
  _isValidLifeStatus: function(status) {
    return (status == 'unborn' || status == 'stillborn'
            || status == 'aborted' || status == 'miscarriage'
            || status == 'alive' || status == 'deceased');
  },

  /**
     * Returns True if exist registry petient id.
     *
     * @method isPatientRegistryID
     * @return {Boolean}
     */
  isPatientRegistryID: function() {
    return !!this.getPatientRegistry().length;
  },

  /**
     * Changes the life status of this Person to newStatus
     *
     * @method setLifeStatus
     * @param {String} newStatus "alive", "deceased", "stillborn", "unborn", "aborted" or "miscarriage"
     */
  setLifeStatus: function(newStatus) {
    if(this._isValidLifeStatus(newStatus)) {
      var oldStatus = this._lifeStatus;

      this._lifeStatus = newStatus;

      // для setDeathAge
      this.setDeathDate('');
      //this.setDeathAge('');

      (newStatus != 'deceased') && this.setDeathDate('');
      (newStatus == 'alive') && this.setGestationAge();
      this.getGraphics().updateSBLabel();

      if(this.isFetus()) {
        this.setBirthDate('');
        this.setAdopted(false);
        this.setChildlessStatus(null);
      }
      this.getGraphics().updateLifeStatusShapes(oldStatus);
      this.getGraphics().getHoverBox().regenerateHandles();
      this.getGraphics().getHoverBox().regenerateButtons();
    }
  },

  /**
     * Returns the date of the conception date of this Person
     *
     * @method getConceptionDate
     * @return {Date}
     */
  getConceptionDate: function() {
    return this._conceptionDate;
  },

  /**
     * Replaces the conception date with newDate
     *
     * @method setConceptionDate
     * @param {Date} newDate Date of conception
     */
  setConceptionDate: function(newDate) {
    this._conceptionDate = newDate ? (new Date(newDate)) : '';
    this.getGraphics().updateAgeLabel();
  },

  /**
     * Returns the number of weeks since conception
     *
     * @method getGestationAge
     * @return {Number}
     */
  getGestationAge: function() {
    if(this.getLifeStatus() == 'unborn' && this.getConceptionDate()) {
      var oneWeek = 1000 * 60 * 60 * 24 * 7,
        lastDay = new Date();
      return Math.round((lastDay.getTime() - this.getConceptionDate().getTime()) / oneWeek);
    } else if(this.isFetus()){
      return this._gestationAge;
    } else {
      return null;
    }
  },

  /**
     * Updates the conception age of the Person given the number of weeks passed since conception
     *
     * @method setGestationAge
     * @param {Number} numWeeks Greater than or equal to 0
     */
  setGestationAge: function(numWeeks) {
    try {
      numWeeks = parseInt(numWeeks);
    } catch (err) {
      numWeeks = '';
    }
    if(numWeeks){
      this._gestationAge = numWeeks;
      var daysAgo = numWeeks * 7,
        d = new Date();
      d.setDate(d.getDate() - daysAgo);
      this.setConceptionDate(d);
    } else {
      this._gestationAge = '';
      this.setConceptionDate(null);
    }
    this.getGraphics().updateAgeLabel();
  },

  /**
     * Returns the the birth date of this Person
     *
     * @method getBirthDate
     * @return {Date}
     */
  getBirthDate: function() {
    return this._birthDate;
  },

  /**
     * Replaces the birth date with newDate
     *
     * @method setBirthDate
     * @param {Date} newDate Must be earlier date than deathDate and a later than conception date
     */
  setBirthDate: function(newDate) {
    newDate = newDate ? (new Date(newDate)) : '';
    this.setDeathAge('');
    document.querySelector("[name='age_of_death']").disabled = true;
    if (!newDate || !this.getDeathDate() || newDate.getTime() < this.getDeathDate().getTime()) {
      this._birthDate = newDate;
      this.getGraphics().updateAgeLabel();
    }
    if (!this.getBirthDate() && !this.getDeathDate()) {
      document.querySelector("[name='age_of_death']").disabled = false;
      //$(document.body).down("input[name='age_of_death']").removeAttr('disabled','disabled');
    }
  },

  /**
     * Returns the death date of this Person
     *
     * @method getDeathDate
     * @return {Date}
     */
  getDeathDate: function() {
    return this._deathDate;
  },

  /**
     * Returns the death age of this Person
     *
     * @method getDeathAge
     * @return {Date}
     */
  getDeathAge: function() {
    return this._deathAge;
  },

  /**
     * Replaces the death date with deathDate
     *
     *
     * @method setDeathDate
     * @param {Date} deathDate Must be a later date than birthDate
     */
  setDeathDate: function(deathDate) {
    deathDate = deathDate ? (new Date(deathDate)) : '';
    this.setDeathAge('');
    //document.querySelector("input[name='age_of_death']").disabled = true;
    //$(document.body).down("input[name='age_of_death']").attr('disabled','disabled');
    document.querySelector("[name='age_of_death']").disabled = true;
    // only set death date if it happens ot be after the birth date, or there is no birth or death date
    if(!deathDate || !this.getBirthDate() || deathDate.getTime() > this.getBirthDate().getTime()) {
      this._deathDate =  deathDate;
      this._deathDate && (this.getLifeStatus() == 'alive') && this.setLifeStatus('deceased');
    }
    if (!this.getBirthDate() & !this.getDeathDate()) {
      document.querySelector("[name='age_of_death']").disabled = false;
      //document.querySelector("input[name='age_of_death']").disabled = false;
      //$(document.body).down("input[name='age_of_death']").removeAttr('disabled','disabled');
    }
    this.getGraphics().updateAgeLabel();
    return this.getDeathDate();
  },

  /**
     * Replaces the death age with deathAge
     *
     *
     * @method setDeathAge
     * @param {Age} deathAge
     */
  setDeathAge: function(deathAge) {
    // only set death age if no birth or death date
   if(!this.getBirthDate() && !this.getDeathDate() ) {
      this._deathAge =  deathAge;
      /*console.log('deathAge', deathAge);
      console.log('this.getDeathDate()', this.getDeathDate());*/
      //this._deathDate && this.setLifeStatus('deceased');
      this.getGraphics().updateAgeLabel();
    }
    return this.getDeathAge();
  },

  _isValidCarrierStatus: function(status) {
    return (status == '' || status == 'carrier'
            || status == 'affected' || status == 'presymptomatic');
  },

  /**
     * Sets the global disorder carrier status for this Person
     *
     * @method setCarrier
     * @param status One of {'', 'carrier', 'affected', 'presymptomatic'}
     */
  setCarrierStatus: function(status) {
    var numDisorders = this.getDisorders().length;

    if (status === undefined || status === null) {
      if (numDisorders == 0) {
        status = '';
      } else {
        status = this.getCarrierStatus();
        if (status == '') {
          status = 'affected';
        }
      }
    }

    if (!this._isValidCarrierStatus(status)) {
      return;
    }

    if (numDisorders > 0 && status == '') {
      if (numDisorders == 1 && this.getDisorders()[0] == 'affected') {
        this.removeDisorder('affected');
        this.getGraphics().updateDisorderShapes();
      } else {
        status = 'affected';
      }
    } else if (numDisorders == 0 && status == 'affected') {
      this.addDisorder('affected');
      this.getGraphics().updateDisorderShapes();
    }

    if (status != this._carrierStatus) {
      this._carrierStatus = status;
      this.getGraphics().updateCarrierGraphic();
    }
  },

  /**
     * Returns the global disorder carrier status for this person.
     *
     * @method getCarrier
     * @return {String} Dissorder carrier status
     */
  getCarrierStatus: function() {
    return this._carrierStatus;
  },

  /**
     * Returns the list of all colors associated with the node
     * (e.g. all colors of all disorders and all colors of all the genes)
     * @method getAllNodeColors
     * @return {Array of Strings}
     */
  getAllNodeColors: function() {
    var result = [];
    for (var i = 0; i < this.getDisorders().length; i++) {
      result.push(editor.getDisorderLegend().getObjectColor(this.getDisorders()[i]));
    }
    for (var i = 0; i < this.getGenes().length; i++) {
      result.push(editor.getGeneLegend().getObjectColor(this.getGenes()[i]));
    }
    return result;
  },

  /**
     * Returns a list of disorders of this person.
     *
     * @method getDisorders
     * @return {Array} List of disorder IDs.
     */
  getDisorders: function() {
    return this._disorders;
  },

  /**
     * Returns a list of disorders of this person, with non-scrambled IDs
     *
     * @method getDisordersForExport
     * @return {Array} List of human-readable versions of disorder IDs
     */
  getDisordersForExport: function() {
    var exportDisorders = this._disorders.slice(0);
    for (var i = 0; i < exportDisorders.length; i++) {
      exportDisorders[i] = Disorder.desanitizeID(exportDisorders[i]);
    }
    return exportDisorders;
  },

  /**
     * Adds disorder to the list of this node's disorders and updates the Legend.
     *
     * @method addDisorder
     * @param {Disorder} disorder Disorder object or a free-text name string
     */
  addDisorder: function(disorder) {
    if (typeof disorder != 'object') {
      disorder = editor.getDisorderLegend().getDisorder(disorder);
    }
    if(!this.hasDisorder(disorder.getDisorderID())) {
      editor.getDisorderLegend().addCase(disorder.getDisorderID(), disorder.getName(), this.getID());
      this.getDisorders().push(disorder.getDisorderID());
    } else {
      alert(translate('This person already has the specified disorder'));
    }

    // if any "real" disorder has been added
    // the virtual "affected" disorder should be automatically removed
    if (this.getDisorders().length > 1) {
      this.removeDisorder('affected');
    }
  },

  /**
     * Removes disorder from the list of this node's disorders and updates the Legend.
     *
     * @method removeDisorder
     * @param {Number} disorderID id of the disorder to be removed
     */
  removeDisorder: function(disorderID) {
    if(this.hasDisorder(disorderID)) {
      editor.getDisorderLegend().removeCase(disorderID, this.getID());
      this._disorders = this.getDisorders().without(disorderID);
    } else {
      if (disorderID != 'affected') {
        alert(translate('This person doesn\'t have the specified disorder'));
      }
    }
  },

  /**
     * Sets the list of disorders of this person to the given list
     *
     * @method setDisorders
     * @param {Array} disorders List of Disorder objects
     */
  setDisorders: function(disorders) {
    for(var i = this.getDisorders().length-1; i >= 0; i--) {
      this.removeDisorder( this.getDisorders()[i] );
    }
    for(var i = 0; i < disorders.length; i++) {
      this.addDisorder( disorders[i] );
    }
    this.getGraphics().updateDisorderShapes();
    this.setCarrierStatus(); // update carrier status
  },

  /**
     * Returns a list of all HPO terms associated with the patient
     *
     * @method getHPO
     * @return {Array} List of HPO IDs.
     */
  getHPO: function() {
    return this._hpo;
  },

  /**
     * Returns a list of phenotypes of this person, with non-scrambled IDs
     *
     * @method getHPOForExport
     * @return {Array} List of human-readable versions of HPO IDs
     */
  getHPOForExport: function() {
    var exportHPOs = this._hpo.slice(0);
    for (var i = 0; i < exportHPOs.length; i++) {
      exportHPOs[i] = HPOTerm.desanitizeID(exportHPOs[i]);
    }
    return exportHPOs;
  },

  /**
     * Adds HPO term to the list of this node's phenotypes and updates the Legend.
     *
     * @method addHPO
     * @param {HPOTerm} hpo HPOTerm object or a free-text name string
     */
  addHPO: function(hpo) {
    if (typeof hpo != 'object') {
      hpo = editor.getHPOLegend().getTerm(hpo);
    }
    if(!this.hasHPO(hpo.getID())) {
      editor.getHPOLegend().addCase(hpo.getID(), hpo.getName(), this.getID());
      this.getHPO().push(hpo.getID());
    } else {
      alert(translate('This person already has the specified phenotype'));
    }
  },

  /**
     * Removes HPO term from the list of this node's terms and updates the Legend.
     *
     * @method removeHPO
     * @param {Number} hpoID id of the term to be removed
     */
  removeHPO: function(hpoID) {
    if(this.hasHPO(hpoID)) {
      editor.getHPOLegend().removeCase(hpoID, this.getID());
      this._hpo = this.getHPO().without(hpoID);
    } else {
      alert(translate('This person doesn\'t have the specified HPO term'));
    }
  },

  /**
     * Sets the list of HPO temrs of this person to the given list
     *
     * @method setHPO
     * @param {Array} hpos List of HPOTerm objects
     */
  setHPO: function(hpos) {
    for(var i = this.getHPO().length-1; i >= 0; i--) {
      this.removeHPO( this.getHPO()[i] );
    }
    for(var i = 0; i < hpos.length; i++) {
      this.addHPO( hpos[i] );
    }
  },

  /**
     * @method hasHPO
     * @param {Number} id Term ID, taken from the HPO database
     */
  hasHPO: function(id) {
    return (this.getHPO().indexOf(id) != -1);
  },

  /**
     * Adds gene to the list of this node's candidate genes
     *
     * @method addGenes
     */
  addGene: function(gene) {
    if (this.getGenes().indexOf(gene) == -1) {
      editor.getGeneLegend().addCase(gene, gene, this.getID());
      this.getGenes().push(gene);
    }
  },

  /**
     * Removes gene from the list of this node's candidate genes
     *
     * @method removeGene
     */
  removeGene: function(gene) {
    if (this.getGenes().indexOf(gene) !== -1) {
      editor.getGeneLegend().removeCase(gene, this.getID());
      this._candidateGenes = this.getGenes().without(gene);
    }
  },

  /**
     * Sets the list of candidate genes of this person to the given list
     *
     * @method setGenes
     * @param {Array} genes List of gene names (as strings)
     */
  setGenes: function(genes) {
    for(var i = this.getGenes().length-1; i >= 0; i--) {
      this.removeGene(this.getGenes()[i]);
    }
    for(var i = 0; i < genes.length; i++) {
      this.addGene( genes[i] );
    }
    this.getGraphics().updateDisorderShapes();
  },

  /**
     * Returns a list of candidate genes for this person.
     *
     * @method getGenes
     * @return {Array} List of gene names.
     */
  getGenes: function() {
    return this._candidateGenes;
  },
  


  /**************************************** */

  /**
     * Returns a list of all Registry Patients associated with the patient
     *
     * @method getPatientRegistry
     * @return {Array} List of Registry Patient IDs.
     */
    
  getPatientRegistry: function() {
    return this._patientRegistry;
  },
  

  /**
     * Returns a list of Registry Patient  
     *
     * @method getPatientRegistryForExport
     * @return {Array} List of human-readable versions of Registry Patient IDs
     */
    
  getPatientRegistryForExport: function() {
    return PatientRegistry.desanitizeID(this._patientRegistry[0]);
  },
  

  /**
     * Adds Registry Patient to the list of this node's and updates the Legend.
     *
     * @method addPatientRegistry
     * @param {PatientRegistry} patientRegistry PatientRegistry object or a free-text name string
     */
    
  addPatientRegistry: function(patientRegistry) {
    if (typeof patientRegistry != 'object') {
      patientRegistry = editor.getPatientRegistryLegend().getTerm(patientRegistry);
    }
    if(!this.hasPatientRegistry(patientRegistry.getID())) {
      editor.getPatientRegistryLegend().addCase(patientRegistry.getID(), patientRegistry.getName(), this.getID());
      this.getPatientRegistry().push(patientRegistry.getID());
    } else {
      alert(translate('This person already PatientRegistry'));
    }
  },

  /**
     * Removes PatientRegistry from the list of this node's terms and updates the Legend.
     *
     * @method removePatientRegistry
     * @param {Number} patientRegistryID id of the term to be removed
     */
    
  removePatientRegistry: function(patientRegistryID) {
    if(this.hasPatientRegistry(patientRegistryID)) {
      editor.getPatientRegistryLegend().removeCase(patientRegistryID, this.getID());
      this._patientRegistry = this.getPatientRegistry().without(patientRegistryID);
    } else {
      alert(translate('This person doesn\'t have the specified PatientRegistry'));
    }
  },

  /**
     * Sets the list of patientRegistry_arr of this person to the given list
     *
     * @method setPatientRegistry
     * @param {Array} patientRegistry_arr List of PatientRegistry objects
     */
    
  setPatientRegistry: function(patientRegistry_arr) {
    for(var i = this.getPatientRegistry().length-1; i >= 0; i--) {
      this.removePatientRegistry( this.getPatientRegistry()[i] );
    }
    if (patientRegistry_arr.length) {
      this.addPatientRegistry( patientRegistry_arr[patientRegistry_arr.length - 1] );
    }
  },

  /**
     * @method hasPatientRegistry
     * @param {Number} id Registry Patient ID, taken from the Registry database
     */

  hasPatientRegistry: function(id) {
    return (this.getPatientRegistry().indexOf(id) != -1);
  },

  /***************************************************************** */
  
  /**
     * Removes the node and its visuals.
     *
     * @method remove
     * @param [skipConfirmation=false] {Boolean} if true, no confirmation box will pop up
     */
  remove: function($super) {
    this.setDisorders([]);  // remove disorders form the legend
    this.setHPO([]);
    this.setGenes([]);
    this.setPatientRegistry([]);
    $super();
  },

  /**
     * Returns disorder with given id if this person has it. Returns null otherwise.
     *
     * @method getDisorderByID
     * @param {Number} id Disorder ID, taken from the OMIM database
     * @return {Disorder}
     */
  hasDisorder: function(id) {
    return (this.getDisorders().indexOf(id) != -1);
  },

  /**
     * Changes the childless status of this Person. Nullifies the status if the given status is not
     * "childless" or "infertile". Modifies the status of the partnerships as well.
     *
     * @method setChildlessStatus
     * @param {String} status Can be "childless", "infertile" or null
     * @param {Boolean} ignoreOthers If True, changing the status will not modify partnerships's statuses or
     * detach any children
     */
  setChildlessStatus: function(status) {
    if(!this.isValidChildlessStatus(status)) {
      status = null;
    }
    if(status != this.getChildlessStatus()) {
      this._childlessStatus = status;
      this.getGraphics().updateChildlessShapes();
      this.getGraphics().getHoverBox().regenerateHandles();
    }
    return this.getChildlessStatus();
  },

  /**
     * Returns an object (to be accepted by the menu) with information about this Person
     *
     * @method getSummary
     * @return {Object} Summary object for the menu
     */
  getSummary: function() {
    var onceAlive = editor.getGraph().hasRelationships(this.getID());
    var inactiveStates = onceAlive ? ['unborn','aborted','miscarriage','stillborn'] : false;

    var inactiveGenders = false;
    var genderSet = editor.getGraph().getPossibleGenders(this.getID());
    for (var gender in genderSet) {
      if (genderSet.hasOwnProperty(gender)) {
        if (!genderSet[gender]) {
          inactiveGenders = [ gender ];
        }
      }
    }

    var childlessInactive = this.isFetus();  // TODO: can a person which already has children become childless?
    // maybe: use editor.getGraph().hasNonPlaceholderNonAdoptedChildren() ?
    var disorders = [];
    this.getDisorders().forEach(function(disorder) {
      var disorderName = editor.getDisorderLegend().getDisorder(disorder).getName();
      disorders.push({id: disorder, value: disorderName});
    });
    var hpoTerms = [];
    this.getHPO().forEach(function(hpo) {
      var termName = editor.getHPOLegend().getTerm(hpo).getName();
      hpoTerms.push({id: hpo, value: termName});
    });
    var patientRegistry_arr = [];
    this.getPatientRegistry().forEach(function(patientRegistry) {
      var termName = editor.getPatientRegistryLegend().getTerm(patientRegistry).getName();
      patientRegistry_arr.push({id: patientRegistry, value: termName});
    });

    var cantChangeAdopted = this.isFetus() || editor.getGraph().hasToBeAdopted(this.getID());

    var inactiveMonozygothic = true;
    var disableMonozygothic  = true;
    var twins = editor.getGraph().getAllTwinsSortedByOrder(this.getID());
    if (twins.length > 1) {
      // check that there are twins and that all twins
      // have the same gender, otherwise can't be monozygothic
      inactiveMonozygothic = false;
      disableMonozygothic  = false;
      for (var i = 0; i < twins.length; i++) {
        if (editor.getGraph().getGender(twins[i]) != this.getGender()) {
          disableMonozygothic = true;
          break;
        }
      }
    }

    var inactiveCarriers = [];
    if (disorders.length > 0) {
      if (disorders.length != 1 || disorders[0].id != 'affected') {
        inactiveCarriers = [''];
      }
    }
    if (this.getLifeStatus() == 'aborted' || this.getLifeStatus() == 'miscarriage') {
      inactiveCarriers.push('presymptomatic');
    }

    var inactiveLostContact = this.isProband() || !editor.getGraph().isRelatedToProband(this.getID());

    return {
      identifier:    {value : this.getID()},
      last_name:     {value : this.getLastName(), disabled: this.isPatientRegistryID()},
      first_name:    {value : this.getFirstName(), disabled: this.isPatientRegistryID()},
      patronymic:    {value : this.getPatronymic(), disabled: this.isPatientRegistryID()},
      registry_patient:     {value : patientRegistry_arr},
      external_id:   {value : this.getExternalID(), disabled: this.isPatientRegistryID()},
      gender:        {value : this.getGender(), inactive: inactiveGenders, disabled: this.isPatientRegistryID()},
      date_of_birth: {value : this.getBirthDate(), inactive: this.isFetus(), disabled: this.isPatientRegistryID()},
      carrier:       {value : this.getCarrierStatus(), disabled: inactiveCarriers},
      disorders:     {value : disorders, disabled: this.isPatientRegistryID()},
      candidate_genes: {value : this.getGenes(), disabled: this.isPatientRegistryID()},
      adopted:       {value : this.isAdopted(), inactive: cantChangeAdopted},
      state:         {value : this.getLifeStatus(), inactive: inactiveStates},
      date_of_death: {value : this.getDeathDate(), inactive: this.isFetus()},
      age_of_death: {value : this.getDeathAge(), inactive: !this.isDeceased()},
      comments:      {value : this.getComments(), inactive: false},
      gestation_age: {value : this.getGestationAge(), inactive : !this.isFetus()},
      childlessSelect: {value : this.getChildlessStatus() ? this.getChildlessStatus() : 'none', inactive : childlessInactive},
      placeholder:   {value : false, inactive: true },
      monozygotic:   {value : this.getMonozygotic(), inactive: inactiveMonozygothic, disabled: disableMonozygothic },
      evaluated:     {value : this.getEvaluated() },
      hpo_positive:  {value : hpoTerms, disabled: this.isPatientRegistryID()},
      nocontact:     {value : this.getLostContact(), inactive: inactiveLostContact}
    };
  },

  /**
     * Returns an object containing all the properties of this node
     * except id, x, y & type
     *
     * @method getProperties
     * @return {Object} in the form
     *
     {
       property: value
     }
     */
  getProperties: function($super) {
    // note: properties equivalent to default are not set
    var info = $super();
    if (this.getFirstName() != '') {
      info['fName'] = this.getFirstName();
    }
    if (this.getLastName() != '') {
      info['lName'] = this.getLastName();
    }
    if (this.getPatronymic() != '') {
      info['patronymic'] = this.getPatronymic();
    }
    if (this.getExternalID() != '') {
      info['externalID'] = this.getExternalID();
    }
    if (this.getBirthDate() != '') {
      info['dob'] = this.getBirthDate().toDateString();
    }
    if (this.isAdopted()) {
      info['isAdopted'] = this.isAdopted();
    }
    if (this.getLifeStatus() != 'alive') {
      info['lifeStatus'] = this.getLifeStatus();
    }
    if (this.getDeathDate() != '') {
      info['dod'] = this.getDeathDate().toDateString();
    }
    if (this.getDeathAge() != '') {
      info['doa'] = this.getDeathAge();
    }
    if (this.getGestationAge() != null) {
      info['gestationAge'] = this.getGestationAge();
    }
    if (this.getChildlessStatus() != null) {
      info['childlessStatus'] = this.getChildlessStatus();
    }
    if (this.getDisorders().length > 0) {
      info['disorders'] = this.getDisordersForExport();
    }
    if (this.getHPO().length > 0) {
      info['hpoTerms'] = this.getHPOForExport();
    }
    if (this.getPatientRegistry().length > 0) {
      info['patientRegistryID'] = this.getPatientRegistryForExport();
    }
    if (this.getGenes().length > 0) {
      info['candidateGenes'] = this.getGenes();
    }
    if (this._twinGroup !== null) {
      info['twinGroup'] = this._twinGroup;
    }
    if (this._monozygotic) {
      info['monozygotic'] = this._monozygotic;
    }
    if (this._evaluated) {
      info['evaluated'] = this._evaluated;
    }
    if (this._carrierStatus) {
      info['carrierStatus'] = this._carrierStatus;
    }
    if (this.getLostContact()) {
      info['lostContact'] = this.getLostContact();
    }
    return info;
  },

  /**
      * Applies the properties found in info to this node.
      *
      * @method assignProperties
      * @param properties Object
      * @return {Boolean} True if info was successfully assigned
      */
  assignProperties: function($super, info) {
    this._setDefault();

    if($super(info)) {
      if(info.lName && this.getLastName() != info.lName) {
        this.setLastName(info.lName);
      }
      if(info.fName && this.getFirstName() != info.fName) {
        this.setFirstName(info.fName);
      }
      if(info.patronymic && this.getPatronymic() != info.patronymic) {
        this.setPatronymic(info.patronymic);
      }
      if (info.externalID && this.getExternalID() != info.externalID) {
        this.setExternalID(info.externalID);
      }
      if(info.dob && this.getBirthDate() != info.dob) {
        this.setBirthDate(info.dob);
      }
      if(info.disorders) {
        this.setDisorders(info.disorders);
      }
      if(info.hpoTerms) {
        this.setHPO(info.hpoTerms);
      }
      if(info.patientRegistryID) {
        this.setPatientRegistry([info.patientRegistryID]);
      }
      if(info.candidateGenes) {
        this.setGenes(info.candidateGenes);
      }
      if(info.hasOwnProperty('isAdopted') && this.isAdopted() != info.isAdopted) {
        this.setAdopted(info.isAdopted);
      }
      if(info.hasOwnProperty('lifeStatus') && this.getLifeStatus() != info.lifeStatus) {
        this.setLifeStatus(info.lifeStatus);
      }
      if(info.dod && this.getDeathDate() != info.dod) {
        this.setDeathDate(info.dod);
      }
      if(info.doa && this.getDeathAge() != info.doa) {
        this.setDeathAge(info.doa);
      }
      if(info.gestationAge && this.getGestationAge() != info.gestationAge) {
        this.setGestationAge(info.gestationAge);
      }
      if(info.childlessStatus && this.getChildlessStatus() != info.childlessStatus) {
        this.setChildlessStatus(info.childlessStatus);
      }
      if(info.hasOwnProperty('twinGroup') && this._twinGroup != info.twinGroup) {
        this.setTwinGroup(info.twinGroup);
      }
      if(info.hasOwnProperty('monozygotic') && this._monozygotic != info.monozygotic) {
        this.setMonozygotic(info.monozygotic);
      }
      if(info.hasOwnProperty('evaluated') && this._evaluated != info.evaluated) {
        this.setEvaluated(info.evaluated);
      }
      if(info.hasOwnProperty('carrierStatus') && this._carrierStatus != info.carrierStatus) {
        this.setCarrierStatus(info.carrierStatus);
      }
      if (info.hasOwnProperty('lostContact') && this.getLostContact() != info.lostContact) {
        this.setLostContact(info.lostContact);
      }
      return true;
    }
    return false;
  }
});

//ATTACHES CHILDLESS BEHAVIOR METHODS TO THIS CLASS
Person.addMethods(ChildlessBehavior);

export default Person;
