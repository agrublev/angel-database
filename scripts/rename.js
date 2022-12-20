#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const promptQuestion = require("./prompt");
const toKebabCase = (str) =>
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join("-");

let toTitle = (str) => {
    let s =
        str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join(" ");
    return s.slice(0, 1).toUpperCase() + s.slice(1);
};

const prettify = (comp, parser = "json") => {
    let soPretty = comp;
    try {
        soPretty = prettier.format(comp, {
            tabWidth: 4,
            parser,
            useTabs: true,
            semi: true,
            singleQuote: false,
            trailingComma: "none",
            bracketSpacing: true,
            arrowParens: "always",
        });
    } catch (e) {}
    return soPretty;
};

const bump = async (name, file) => {
    file.name = name;
    file.version = "1.0.0";
    file.scripts.deploy = file.scripts.deploy.replace("fc-react-boilerplate", `${name}`);
    file.scripts.open = file.scripts.open.replace("fc-react-boilerplate", `${name}`);
    await fs.writeFileSync("./package.json", prettify(JSON.stringify(file)), "utf-8");

    let indexHtml = await fs.readFileSync("./public/index.html", "utf-8");
    indexHtml = indexHtml.replace(
        "<title>FC Boilerplate</title>",
        `<title>${toTitle(name)}</title>`
    );
    await fs.writeFileSync("./public/index.html", prettify(indexHtml, "html"), "utf-8");
};

(async () => {
    let file = await fs.readFileSync("./package.json", "utf-8");
    file = JSON.parse(file);
    if (file.version !== "0.0.152") {
        return;
    }
    const name = await promptQuestion({}, "Name of project:");
    await bump(toKebabCase(name), file);
})();
