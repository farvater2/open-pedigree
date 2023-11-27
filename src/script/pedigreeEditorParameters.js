var PedigreeEditorParameters = {};

//attributes for graphical elements in the editor
PedigreeEditorParameters.attributes = {
  radius: 40,
  orbRadius: 6,
  touchOrbRadius: 8,
  personHoverBoxRadius: 90,
  personHandleLength: 75,
  personHandleBreakX: 55,
  personHandleBreakY: 53,
  personSiblingHandleLengthX: 65,
  personSiblingHandleLengthY: 30,
  handleStrokeWidth: 5,
  groupNodesScale: 0.85,
  childlessLength: 14,
  infertileMarkerHeight: 4,
  infertileMarkerWidth: 14,
  twinCommonVerticalLength: 6,
  twinMonozygothicLineShiftY: 24,
  curvedLinesCornerRadius: 25,
  unbornShape: { 'font-size': 50, 'font-family': 'Cambria' },
  carrierShape: { fill: '#333333' },
  carrierDotRadius: 8,
  presymptomaticShape: { fill: '#777777', 'stroke': '#777777' },
  presymptomaticShapeWidth: 8,
  evaluationShape: { 'font-size': 40, 'font-family': 'Arial' },
  nodeShape: { fill: '0-#ffffff:0-#B8B8B8:100', stroke: '#333333', 'stroke-width': 3.0 },
  nodeShapeMenuOn: { fill: '#000', stroke: 'none', 'fill-opacity': 0.1 },
  nodeShapeMenuOff: { fill: '#000', stroke: 'none', 'fill-opacity': 0 },
  nodeShapeMenuOnPartner: { fill: '#000', stroke: 'none', 'fill-opacity': 0.1 },
  nodeShapeMenuOffPartner: { fill: '#000', stroke: 'none', 'fill-opacity': 0 },
  nodeShapeDiag: { fill: '45-#ffffff:0-#B8B8B8:100', stroke: '#333333', 'stroke-width': 3.0 },
  boxOnHover: { fill: 'gray', stroke: 'none', opacity: 1, 'fill-opacity': .35 },
  menuBtnIcon: { fill: '#1F1F1F', stroke: 'none' },
  deleteBtnIcon: { fill: '#990000', stroke: 'none' },
  btnMaskHoverOn: { opacity: .6, stroke: 'none' },
  btnMaskHoverOff: { opacity: 0 },
  btnMaskClick: { opacity: 1 },
  orbHue: .53,
  phShape: { fill: 'white', 'fill-opacity': 0, 'stroke': 'black', 'stroke-dasharray': '- ' },
  dragMeLabel: { 'font-size': 14, 'font-family': 'Tahoma' },
  pedNumberLabel: { 'font-size': 19, 'font-family': 'Serif' },
  descendantGroupLabel: { 'font-size': 21, 'font-family': 'Tahoma' },
  label: { 'font-size': 20, 'font-family': 'Arial' },
  nameLabels: { 'font-size': 20, 'font-family': 'Arial' },
  commentLabel: { 'font-size': 19, 'font-family': 'Arial' },
  externalIDLabels: { 'font-size': 18, 'font-family': 'Arial' },
  disorderShapes: {},
  partnershipNode: { fill: '#dc7868', stroke: 'black', 'stroke-width': 2 },
  partnershipRadius: 6.5,
  partnershipHandleBreakY: 15,
  partnershipHandleLength: 36,
  partnershipLines: { 'stroke-width': 3.0, stroke: '#333333' },
  consangrPartnershipLines: { 'stroke-width': 3.0, stroke: '#333333' },
  noContactLines: { 'stroke-width': 3.0, stroke: '#333333', 'stroke-dasharray': '.' },
  notInContactLineSize: 20,
  graphToCanvasScale: 12,
  layoutRelativePersonWidth: 10,
  layoutRelativeOtherWidth: 2,
  layoutScale: { xscale: 12.0, yscale: 8 }
};

// Default settings
PedigreeEditorParameters.defaultSettings = {
  language: 'rus',
  showName: true,
  showGenerationNumber: true,
  showSequenceNumberInsideGeneration: true,
  ageCalculationDate: ''
};


PedigreeEditorParameters.settings = Object.assign(
  {},
  PedigreeEditorParameters.defaultSettings,
  JSON.parse(localStorage.getItem('Pedigree'))
);


PedigreeEditorParameters.saveSettings = function (settings) {
  Object.assign(PedigreeEditorParameters.settings, settings);
  localStorage.setItem("Pedigree", JSON.stringify(PedigreeEditorParameters.settings));
}

PedigreeEditorParameters.getSetting = function (key) {
  return PedigreeEditorParameters.settings[key];
}


export default PedigreeEditorParameters;
