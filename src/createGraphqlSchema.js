import path from "path";
import fs from "fs";
import mkdirp from "mkdirp";

import { MongoIdType } from "./dataTypes";
import createTypeResolver from "./codeGen/createTypeResolver";
import createGraphqlTypeSchema from "./codeGen/createTypeSchema";
import createOutputTypeMetadata from "./codeGen/createTypeMetadata";
import createMasterSchema from "./codeGen/createMasterSchema";
import createMasterResolver from "./codeGen/createMasterResolver";

function createFile(path, contents, onlyIfAbsent, ...directoriesToCreate) {
  directoriesToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  if (!onlyIfAbsent || !fs.existsSync(path)) {
    fs.writeFileSync(path, contents);
  }
}

export default function(source, destPath) {
  return Promise.resolve(source).then(module => {
    let rootDir = path.join(destPath, "graphQL");
    if (!fs.existsSync(rootDir)) {
      mkdirp.sync(rootDir);
    }
    Object.keys(module).forEach(k => {
      module[k].__name = k;
      if (!module[k].fields) module[k].fields = {};
      if (!module[k].fields._id && module[k].table) {
        //add _id, and as a bonus, make it show up first in the list since the spec iterates object keys in order of insertion
        module[k].fields = { _id: MongoIdType, ...module[k].fields };
      }
    });
    let modules = Object.keys(module).map(k => module[k]);

    let names = [];
    let namesWithTables = [];
    let namesWithoutTables = [];
    modules.forEach(objectToCreate => {
      let objName = objectToCreate.__name;
      let modulePath = path.join(rootDir, objName);
      let objPath = path.join(modulePath, objName + ".ts");
      let schemaPath = path.join(modulePath, "schema.ts");
      let resolverPath = path.join(modulePath, "resolver.ts");

      names.push(objName);
      if (objectToCreate.table) {
        namesWithTables.push(objName);
      } else {
        namesWithoutTables.push(objName);
      }

      createFile(objPath, createOutputTypeMetadata(objectToCreate), true, modulePath);

      createFile(schemaPath, createGraphqlTypeSchema(objectToCreate), true);
      if (objectToCreate.table) {
        createFile(resolverPath, createTypeResolver(objectToCreate), true);
      }
    });

    fs.writeFileSync(path.join(rootDir, "schema.ts"), createMasterSchema(names, namesWithTables, namesWithoutTables));

    fs.writeFileSync(path.join(rootDir, "resolver.ts"), createMasterResolver(namesWithTables));
    if (!fs.existsSync(path.join(rootDir, "hooks.ts"))) {
      fs.writeFileSync(
        path.join(rootDir, "hooks.ts"),
        fs.readFileSync(path.resolve(__dirname, "./codeGen/processingHooksTemplate.js"), { encoding: "utf8" })
      );
    }
  });
}
