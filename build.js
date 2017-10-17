const rollup = require("rollup"),
    chalk = require("chalk"),
    babel = require("rollup-plugin-babel"),
    uglify = require("rollup-plugin-uglify"),
    pkg = require("./package.json");

const destination = "dist/";

const warnHandler = (info) => {
    console.info(chalk.yellow(`encountered rollup warning for: ${info.loc}`), info);
};

const doRollup = (config) =>
    rollup.rollup(config)
        .then((bundle) => bundle.write(config));

const baseOptions = {
    onwarn: warnHandler,
    input: "lib/index.js",
    format: "umd",
    name: "htmlDirContent",
    banner: `/* html-dir-content v${pkg.version} (c) ${new Date().getFullYear()}, Yoav Niran, https://github.com/yoavniran/html-dir-content.git/blob/master/LICENSE */`,
    plugins: [
        babel({exclude: "node_modules/**"})
    ]
};

Promise.all([
    doRollup({ //----------- DEV
        ...baseOptions,
        sourcemap: "inline",
        file: (destination + "html-dir-content.js")
    }),
    doRollup({ //------------ PROD
        ...baseOptions,
        file: (destination + "html-dir-content.min.js"),
        sourcemap: true,
        plugins: [
            babel({exclude: "node_modules/**"}),
            uglify({
                output: {
                    comments: (node, comment) => {
                        return comment.type === "comment2" && /html-dir-content v/i.test(comment.value);
                    }
                }
            }),
        ]
    }),
])
    .then(() => {
        console.info(chalk.green(`✓✓✓ BUILD SUCCESS!`));
    })
    .catch((error) => {
        console.error(chalk.magenta(`!!! BUILD - ERROR!!!!!`), error);
        process.exit(1); //exit with error
    });
