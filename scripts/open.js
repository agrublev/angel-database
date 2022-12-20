const openBrowser = require("./openBrowser.js");

(async () => {
    openBrowser("http://fc-react-boilerplate.surge.sh");
    // let protocolReg = /'default_protocol(.*?)=(.*?)'(.*?)'/g;
    // let protocol = protocolReg.exec(fileContent);
    //
    // let domainReg = /'default_domain(.*?)=(.*?)'(.*?)'/g;
    // let domain = domainReg.exec(fileContent);
    // if (domain !== null && typeof domain[1] !== "undefined") {
    //     openBrowser(protocol[3] + domain[3] + (argv.params ? argv.params : ""));
    // }
})();
