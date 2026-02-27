const Counter = require("../models/Counter");

const pad3 = (n) => String(n).padStart(3, "0");
const yy2 = (d = new Date()) => String(d.getFullYear()).slice(-2);

async function allocateJvcNumber(band, now= new Date()) {
    const yy = yy2(now);

    const ranges = {
        MAIN: { key: "JVC${yy}_MAIN", start:1, end: 21},
        SUB: { key: "JVC${yy}_SUB", start:22, end: 64},
        MEMBER: {key: "JVC${yy}_MEMBER", start: 65, end: null},
    };
    const cfg = ranges[band];
    if (!cfg) throw new Error("Invalid Band");

    const exists = await Counter.findById(cfg.key);
    if (!exists) await Counter.create({ _id: cfg.key, seq: cfg.start -1});

    const updated = await Counter.findByIdAndUpdate(cfg.key, { $inc: { seq: 1} }, { new : true});
    const num = update.seq;

    if (cfg.end != null&&num>cfg.end){
        throw new Error('${band} quota full (${cfg.start}--${cfg.end}).');
    }

    return 'JVC${yy}${pad3(num)}';
}

module.exports = { allocateJvcNumber };