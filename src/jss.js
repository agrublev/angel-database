const fixKeyStrings = str => {
    try {
        JSON.parse(str);
    } catch (error) {
        let errorMessage = error.toString();
        let pos = parseInt(errorMessage.split("position ")[1]);
        let errorText = str.slice(pos - 5, pos + 5);
        let lineNum = 0;
        let errorLine = str.split("\n").filter((line, index) => {
            let isBroken = line.trim().includes(errorText.trim());
            if (isBroken) {
                lineNum = index;
            }
            return isBroken;
        });
        if (errorLine.length) {
            errorLine = errorLine[0];
            let fixed = errorLine.split(":");
            fixed[0] = `"${fixed[0].trim()}"`;
            let ff = `${fixed[0]}: ${fixed[1].trim()}`;
            let newCode = str.split("\n").slice();
            newCode[lineNum] = ff;
            str = newCode.join("\n");
        }
    }
    return str;
};
const parseJsonText = str => {
    let canParse = false;
    try {
        JSON.parse(str);
        canParse = true;
    } catch (error) {
        str = fixKeyStrings(str);
        canParse = false;
    }
    if (!canParse) {
        str = parseJsonText(str);
    }
    return str;
};
let newww = parseJsonText(`{
    "key": "",
    zzz: false,
    "test":44,
    zz:666    
}`);
console.info("Console --- ", JSON.parse(newww));
