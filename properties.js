/* info about component properties */

/** @type {Object<string,PropertyInfo>} */
export const PropInfo = {
  stateName: {
    type: "state",
    name: "State",
    description: "Name of the state variable controlling this element.",
  },
  rows: {
    type: "number",
    name: "Rows",
    description: "Number of rows in a grid",
  },
  columns: {
    type: "number",
    name: "Columns",
    description: "Number of columns in a grid.",
  },
  tags: {
    type: "tags",
    name: "Tags",
    description: "A list of tags to match",
    addMessage: "Add a tag",
  },
  match: {
    type: "select",
    values: ["contains", "sequence"],
    name: "Match",
    description: "How to match the tags.",
  },
  direction: {
    type: "select",
    values: ["row", "column"],
    name: "Direction",
    description: "Which way to stack elements.",
  },
  name: {
    type: "string",
    name: "Name",
    description: "A name assigned to this element.",
  },
  label: {
    type: "string",
    name: "Label",
    description: "A human readable label for this element.",
  },
  value: {
    type: "string",
    name: "Value",
    description: "The value assigned to the state.",
  },
  scale: {
    type: "number",
    name: "Scale",
    description: "Comparative size of this element compared to its siblings.",
  },
  background: {
    type: "color",
    style: "backgroundColor",
    name: "Background color",
    description: "Color of the background.",
  },
  fontSize: {
    type: "number",
    name: "Font Size",
    description: "Font size for the text in this element."
  },
  selected: {
    type: "color",
    style: "color",
    name: "Selected color",
    description: "Color of buttons that are currently selected.",
  },
  unselected: {
    type: "color",
    style: "color",
    name: "Unselected color",
    description: "Color of buttons that are not currently selected.",
  },
  voiceURI: {
    type: "voiceURI",
    name: "Voice URI",
    description: "Unique name for the selected voice",
  },
  pitch: {
    type: "number",
    name: "Pitch",
    step: 0.1,
    description: "Pitch as which utterance will be spoken.",
  },
  rate: {
    type: "number",
    name: "Rate",
    step: 0.1,
    description: "Rate at which utterance will be spoken.",
  },
  volume: {
    type: "number",
    name: "Volume",
    step: 0.1,
    description: "Volume at which utterance will be spoken.",
  },
};
