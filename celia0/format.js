export default class Note {
  static noSpaces(text) {
    return text.replace(/\s/g, '');
  }  

  static isBlank(text) {
    return !text || text.trim().length === 0;
  }
}
