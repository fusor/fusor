// Humanize -- helper module for humanizing data values
// Delegates raw -> human to filesize vendor lib
// Also offers limited human -> raw
//
// NOTE: Unfortuantely, filesize comes in from the global namespace via
// app.import(bower_componets/...
// TODO: Shim filesize so we don't pollute the global space.

export default {
  rawToHuman: filesize,
  humanToRaw
};

const labelMultiplier = { 'B': 0, 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4 };
const labelRegex = /^(\d+|\d+\.\d+)\ (TB|GB|MB|KB|B)$/;

function humanToRaw(inStr) {
  const trimmedStr = inStr.trim();
  const match = labelRegex.exec(trimmedStr);

  if(!match) {
    throw `Invalid data string passed to Humanize.humanToRaw: ${inStr}`;
  }

  let fval = parseFloat(match[1]);
  const multiplier = labelMultiplier[match[2]];

  for(let i = multiplier; i > 0; i--) {
    fval *= 1024;
  }

  return parseInt(fval, 10); // Explicit 10 radix
}
