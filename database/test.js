const AD = ADB.default;
const adb = new AD();

(async () => {
    const DBS = await adb.getDatabases("FREEDCAMP");
    console.log("d", DBS);
})();
