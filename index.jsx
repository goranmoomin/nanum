process.env = {};
require("babel-polyfill");

const { run } = require("uebersicht");
const jss = require("jss").default;
const preset = require("jss-preset-default").default;
const { format } = require("date-fns");

jss.setup(preset());

const styles = {
    background: {
        backgroundColor: "#3c3c3c",
        alignItems: "center",
        position: "relative",
        height: 38,
        width: "calc(100vw - 20%)",
        top: 0,
        right: 0,
        bottom: "auto",
        left: 0,
        margin: [16, "10%", 16, "10%"],
        boxShadow: [0, 4, 10, 4, "rgba(0, 0, 0, 0.15)"],
        borderRadius: 100,
        font: [["11px", ["IBM Plex Mono", "Iosevka"]]]
    },
    flex: {
        display: "flex",
        height: "100%"
    },
    workspaceBackground: {
        display: "flex",
        color: "#f1f2f3",
        height: "100%",
        backgroundColor: "#77569c",
        borderRadius: [6, 0, 0, 6]
    },
    workspaceText: {
        margin: ["auto", 16]
    },
    networkBackground: {
        display:"flex",
        color: "#c3a8cb",
        height: "100%",
        backgroundColor: "#3c3c3c"
    },
    networkText: {
        margin: ["auto", 16]
    },
    middle: {
        flexGrow: 1
    },
    batteryBackground: {
        display: "flex",
        color: "#f1f2f3",
        backgroundColor: "#c074a9",
        height: "100%"
    },
    batteryText: {
        margin: ["auto", 16]
    },
    clockBackground: {
        display: "flex",
        color: "#f1f2f3",
        backgroundColor: "#d99fc2",
        height: "100%",
        borderRadius: [0, 6, 6, 0]
    },
    clockText: {
        margin: ["auto", 16]
    },
    dateBackground: {
        display: "flex",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: "auto"
    },
    dateText: {
        color: "#f1f2f3",
        margin: "auto"
    }
};

const { classes } = jss.createStyleSheet(styles).attach();

const render = ({ workspace, network, battery, date, time }) => {
    return (
        <div className={classes.background}>
            <div className={classes.flex}>
                <div className={classes.workspaceBackground}>
                    <span className={classes.workspaceText}>{workspace}</span>
                    </div>
                <div className={classes.networkBackground}>
                    <span className={classes.networkText}>{network}</span>
                </div>
                <div className={classes.middle}/>
                <div className={classes.batteryBackground}>
                    <span className={classes.batteryText}>{battery}</span>
                </div>
                <div className={classes.clockBackground}>
                    <span className={classes.clockText}>{time}</span>
                    </div>
            </div>
            <div className={classes.dateBackground}>
                <span className={classes.dateText}>{date}</span>
                </div>
        </div>
    );
};

const command = async dispatch => {
    const workspacePromise = run("nanum/scripts/workspace");
    const networkPromise = run("nanum/scripts/network");
    const batteryPromise = run("nanum/scripts/battery");
    const [workspace, network, battery] = await Promise.all([workspacePromise, networkPromise, batteryPromise]);
    const date = format(new Date(), "EEE, MMM d");
    const time = format(new Date(), "hh:mmaa");

    dispatch({
        type: "OUTPUT_UPDATE",
        output: { workspace, network, battery, date, time }
    });
};

const updateState = ({ type, output }, prevState) => {
    switch(type) {
    case "OUTPUT_UPDATE": { return output; }
    default: { return prevState; }
    }
};

const refreshFrequency = 5000;

module.exports = { render, command, updateState, refreshFrequency };
