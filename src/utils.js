import _ from 'underscore';
const globby = require("globby");
const objectql = require('@steedos/objectql');
import path from 'path';

const loadFile = objectql.loadFile;

const getObject = (object_name)=> {
    return objectql.getSteedosSchema().getObject(object_name);
}

const getObjectConfig = (object_name)=> {
    let object = getObject(object_name);
    return object ? object.toConfig() : null;
}

const loadReports = (filePath) => {
    let results = [];
    const filePatten = [
        path.join(filePath, "*.report.yml"),
        path.join(filePath, "*.report.json"),
        path.join(filePath, "*.report.js")
    ];
    const matchedPaths = globby.sync(filePatten);
    _.each(matchedPaths, (matchedPath) => {
        let json = loadFile(matchedPath);
        if (json.report_type === "jsreport") {
            json.html_file = matchedPath.replace(/\.report\.yml$/,'.report.html');
            json.script_file = matchedPath.replace(/\.report\.yml$/, '.report.script.js');
            json.helper_file = matchedPath.replace(/\.report\.yml$/, '.report.helper.js');
        }
        results.push(json);
    });
    return results;
}

const getGraphQLSchema = () => {
    return objectql.getSteedosSchema().getDataSource().getGraphQLSchema();
}

export { getObject, getObjectConfig, getGraphQLSchema, loadReports };
