require = require("@std/esm")(module, { esm: "js", cjs: true });

module.exports = require("./module.js").default;