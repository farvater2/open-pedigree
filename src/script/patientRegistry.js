/*
 * PatientRegistry is a class for storing patient ID and NAME information and loading it from the
 * the Registry database.
 *
 * @param patientRegistryID the id number for the patient, taken from the Registry database
 * @param name a string representing the name of the patient e.g. "Иванов Иван Иванович"
 */

var PatientRegistry = Class.create( {

  initialize: function(patientRegistryID, name, callWhenReady) {

    this._patientRegistryID  = PatientRegistry.sanitizeID(patientRegistryID.trim());
    this._name   = name ? name : 'loading...';

    if (!name && callWhenReady) {
      this.load(callWhenReady);
    }
  },

  /*
     * Returns the ID of the patient
     */
  getID: function() {
    return this._patientRegistryID;
  },

  /*
     * Returns the name of the patient
     */
  getName: function() {
    return this._name;
  },

  load: function(callWhenReady) {
    var baseServiceURL = PatientRegistry.getServiceURL();
    var queryURL       = baseServiceURL + '&q=' + PatientRegistry.desanitizeID(this._patientRegistryID).replace(':','%5C%3A');
    //console.log("QueryURL: " + queryURL);
    new Ajax.Request(queryURL, {
      method: 'GET',
      onSuccess: this.onDataReady.bind(this),
      //onComplete: complete.bind(this)
      onComplete: callWhenReady ? callWhenReady : {}
    });
  },

  onDataReady : function(response) {
    try {
      var parsed = JSON.parse(response.responseText);
      console.log('LOADED REGISTRY PATIENT: id = ' + PatientRegistry.desanitizeID(this._patientRegistryID) + ', name = ' + parsed.rows[0].name);
      this._name = parsed.rows[0].name;
    } catch (err) {
      console.log('[LOAD REGISTRY PATIENT] Error: ' +  err);
    }
  }
});

PatientRegistry.transliterate = function(word, type = "toEng") {

  let rus_eng = {"Ё":"_YO_","Й":"_I_","Ц":"_TS_","У":"_U_","К":"_K_","Е":"_E_","Н":"_N_","Г":"_G_","Ш":"_SH_","Щ":"_SCH_","З":"_Z_","Х":"_H_","Ъ":"_TVZ_","ё":"_yo_","й":"_i_","ц":"_ts_","у":"_u_","к":"_k_","е":"_e_","н":"_n_","г":"_g_","ш":"_sh_","щ":"_sch_","з":"_z_","х":"_h_","ъ":"_tvz_","Ф":"_F_","Ы":"_I_","В":"_V_","А":"_A_","П":"_P_","Р":"_R_","О":"_O_","Л":"_L_","Д":"_D_","Ж":"_ZH_","Э":"_E_","ф":"_f_","ы":"_i_","в":"_v_","а":"_a_","п":"_p_","р":"_r_","о":"_o_","л":"_l_","д":"_d_","ж":"_zh_","э":"_e_","Я":"_Ya_","Ч":"_CH_","С":"_S_","М":"_M_","И":"_I_","Т":"_T_","Ь":"_MKZ_","Б":"_B_","Ю":"_YU_","я":"_ya_","ч":"_ch_","с":"_s_","м":"_m_","и":"_i_","т":"_t_","ь":"_mkz_","б":"_b_","ю":"_yu"};

  let res = word.split('').map(function (char) { 
    return rus_eng[char] || char; 
  }).join("");

  if (type === "toEng") {
    return word.split('').map(function (char) { 
      return rus_eng[char] || char; 
    }).join("");
  } else if (type === "toRus") {
    const eng_rus = rus_eng => Object.fromEntries(Object.entries(rus_eng).map(([k, v]) => [v, k]));
    return word.split('').map(function (char) { 
      return eng_rus[char] || char; 
    }).join("");
  } else {
    console.error('toUndefined');
  }
}


/*
 * IDs are used as part of HTML IDs in the Legend box, which breaks when IDs contain some non-alphanumeric symbols.
 * For that purpose these symbols in IDs are converted in memory (but not in the stored pedigree) to some underscores.
 */
PatientRegistry.sanitizeID = function(id) {
  let temp = PatientRegistry.transliterate(id, "toEng");
  temp = temp.replace(/[\(\[]/g, 'LEVAYASKOBKA');
  temp = temp.replace(/[\)\]]/g, 'PRAVAYASKOBKA');
  temp = temp.replace(/[:]/g, 'DVOETOCHIE');
  temp = temp.replace(/[,]/g, 'ZAPYATAYA');
  temp = temp.replace(/[/]/g, 'PRYAMOISLASH');
  temp = temp.replace(/[\-]/g, 'DEFIS');
  temp = temp.replace(/[^a-zA-Z0-9,;_\-*]/g, '__');
  return temp;
};

PatientRegistry.desanitizeID = function(id) {
  let temp = id;
  temp = temp.replace(/DVOETOCHIE/g, ':');
  temp = temp.replace(/ZAPYATAYA/g, ',');
  temp = temp.replace(/PRYAMOISLASH/g, '/');
  temp = temp.replace(/LEVAYASKOBKA/g, '(');
  temp = temp.replace(/PRAVAYASKOBKA/g, ')');
  temp = PatientRegistry.transliterate(temp, "toRus");
  temp = temp.replace(/__/g, ' ');
  return temp;
};

PatientRegistry.getServiceURL = function() {
  //return new XWiki.Document('SolrService', 'PhenoTips').getURL('get') + '?';
  return "./RPatientService?outputSyntax=plain";
};

export default PatientRegistry;