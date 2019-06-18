const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const dataPath = path.join(__dirname, 'data');
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    items[id] = text; //side effect - modifies local variable items which is not saved to filesystem
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files)=>{
    if (err) {
      console.log(err);
    } else {
      console.log({items});
      var list = _.map(files, (name) => {
        let fileName = name.slice(0,-4);
        return { id: fileName, text: fileName };
      });
      callback(null, list);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      console.log(data);
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  //re-write the file

  //first check and see if file exsists
  //  if it does exist then we rewrite
  //else return no item with id

  //use some func to read file: readOne or fs.read

  //err: return no item with id
  //success: create a call back to utilize fs.write

  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, 'utf8', (err) => {
        if(err) {
          console.log('error');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
