const isFirstLetterUpperCaseAndAfterSpace = (str) =>
    // https://regexr.com/7vocr
    str.match(/^[A-Z][a-z]*(?:[-\s][A-Z][a-z]*)*$/);

export default isFirstLetterUpperCaseAndAfterSpace;
