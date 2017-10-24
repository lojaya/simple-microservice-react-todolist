global.using = function(name) {
  let usingPath = `${__dirname}/../${name}`;
  return require(usingPath);
};

global.collect = function(name, regex) {
  const fs = require("fs");
  const re = new RegExp(regex, "i");

  let modules = [];
  let usingPath = `${__dirname}/../${name}`;
  let files = fs.readdirSync(usingPath);

  for (var i = 0; i < files.length; i++) {
    let file = files[i];
    try {
      let isSuccess = re.test(file);
      if (isSuccess) modules.push(require(`${usingPath}/${file}`));
    } catch (error) {}
  }

  return modules;
};

global.pojo = function() {
  var members = arguments;
  return function() {
    var obj = {},
      i = 0,
      j = members.length;
    for (; i < j; ++i) {
      obj[members[i]] = arguments[i];
    }
    return obj;
  };
};
