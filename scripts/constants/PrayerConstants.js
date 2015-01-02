var keyMirror = require('keymirror');

module.exports = keyMirror({
  PRAYER_CREATE: null, //create a prayer
  PRAYER_UPDATE: null, //update a prayer
  PRAYER_DESTROY: null, //destroy a prayer
  PRAYER_COMPLETE: null, //complete a prayer
  PRAYER_UNDO_COMPLETE: null, //undo setting a prayer completed
});
