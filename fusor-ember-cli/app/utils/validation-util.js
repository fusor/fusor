// validation-util.js
//============================================================
// Create new regex from multiple line string, zipped up w/join
// No regex flags: RegExp(string, flags)
// NOTE: Regex backslashes must be escaped since this is not a literal regex!
// No regex subgroupings js?
let ipRangeRegex = new RegExp([
  '\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
  '\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b'
].join(''), '');

let CIDRFormatRegex = /\/(3[0-2]|[1-2]?[0-9])$/;

let mgmtAppNameRegex = new RegExp(/^([a-zA-Z0-9\-\.\_]+)$/);

let ValidationUtil = {
  validateIpRange(testString) {
    return !!testString && ipRangeRegex.test(testString.trim());
  },
  validateCIDRFormat(testString) {
    return !!testString && CIDRFormatRegex.test(testString.trim());
  },
  validateIpRangeAndFormat(testString) {
    return this.validateIpRange(testString) &&
      this.validateCIDRFormat(testString);
  },
  validateMgmtAppName(testString) {
    return !!testString && mgmtAppNameRegex.test(testString);
  }
};

export default ValidationUtil;
