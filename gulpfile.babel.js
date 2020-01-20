import fs from 'fs-extra';
import gulp from 'gulp';
import log from 'fancy-log';
import path from 'path';
import rename from 'gulp-rename';
import fileNames from 'gulp-filenames';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import findUnusedFiles from './tools/unusedFiles';
import merge from 'merge-stream';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import shell from 'gulp-shell';
import cssnano from 'gulp-cssnano';
import clean from 'gulp-clean';
import livereload from 'gulp-livereload';

const args = require('yargs').argv;
const ENV = args.env || process.env['ENV'] || 'develop';

const environmentFilePath = path.join(__dirname, '/deployment/envs/' + ENV + '.env');
if (fs.existsSync(environmentFilePath)) {
    require('dotenv').config({
        path: path.join(__dirname, '/deployment/envs/' + ENV + '.env')
    });
}

log(`Gulp running on ENV: ${ENV}`);

let DID_WEBPACK_BUILD = false;

const _dist = path.join(__dirname, '/dist');

const PATHS = {
    root: path.join(__dirname, '/'),
    dist: _dist,
    distServer: path.join(__dirname, '/dist-server/'),
    app: {
        src: 'src/client.js'
    },
    copy: [
        {
            src: [
                'src/public/**/*',
                '!src/public/svgs/icons/**',
                '!src/public/**/.DS_Store',
                '!src/public/**/robots.*.txt'
            ],
            dist: _dist
        },
        {
            src: ['src/public/apple-app-site-association'],
            dist: path.join(_dist, '/.well-known/')
        }
    ],
    svgstore: {
        src: 'src/public/static/svgs/icons/**/*.svg',
        dist: path.join(_dist, '/static/svgs/')
    },
    environment: {
        srcPath: 'deployment/envs/',
        srcFiles: 'deployment/envs/*.json',
        dist: 'deployment/envs/'
    },
    manifest: {
        src: 'webapp/manifest.json',
        dist: 'dist'
    },
    robotsTxt: {
        src: `src/public/robots.${ENV}.txt`,
        dist: 'dist'
    }
};

gulp.task('clean', () => {
    return merge(
        [
            path.join(PATHS.dist, '/*'),
            path.join(PATHS.distServer, '/*')
        ].map(task =>
            gulp.src(task, {read: false})
                .pipe(clean())
        )
    );
});

gulp.task('copy', () => {
    const tasks = PATHS.copy.map(task =>
        gulp.src(task.src)
            .pipe(gulp.dest(task.dist))
    );

    return merge(tasks);
});

gulp.task('svgstore-legacy', shell.task('grunt svg'));

gulp.task('svgstore', () => {
    return gulp.src(PATHS.svgstore.src)
        .pipe(svgmin({
            plugins: [
                {
                    cleanupIDs: false
                },
                {
                    removeAttrs: {
                        attrs: [
                            'style',
                            'class'
                        ]
                    }
                },
                {
                    removeUselessDefs: true
                },
                {
                    removeUnknownsAndDefaults: true
                }
            ]
        }))
        .pipe(rename({prefix: 'svg-'}))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(rename('svgs.svg'))
        .pipe(gulp.dest(PATHS.svgstore.dist));
});

gulp.task('environment:files', () => {
    fileNames.forget('environment:files');

    return gulp.src(PATHS.environment.srcFiles)
        .pipe(fileNames('environment:files'));
});

gulp.task('environment', ['environment:files'], () => {
    let files = fileNames.get('environment:files');

    let promises = files.map(file => {
        return new Promise((resolve, reject) => {
            let readPath = path.join(PATHS.environment.srcPath, file);
            let writeFile = file.replace('.json', '.env');
            let writePath = path.join(PATHS.environment.dist, writeFile);

            // read the json source
            fs.readJson(readPath)
                // format it as a string with KEY=VALUE
                .then(outputJson => Object.keys(outputJson)
                    .map(key => `${key}=${outputJson[key]}\n`)
                    .join(''))
                // write string as env
                .then(outputEnv => fs.writeFile(writePath, outputEnv, resolve))
                .catch(reject);
        });
    });

    return Promise.all(promises)
        .catch(log);
});

gulp.task('robotsTxt', () => {
    return gulp.src(PATHS.robotsTxt.src)
        .pipe(rename('robots.txt'))
        .pipe(gulp.dest(PATHS.robotsTxt.dist));
});

gulp.task('webpack:client', (done) => {
    const webpackConfig = require('./webpack.client.config').default;

    return webpack(webpackConfig, (error, stats) => {
        if (error || stats.hasErrors()) {
            if (DID_WEBPACK_BUILD) {
                log.error(error);
            } else {
                const info = stats.toJson({
                    all: false,
                    errors: true
                });

                return log.error(info.errors);
            }
        }

        if (ENV === 'develop') {
            livereload.changed('/');
        }

        if (DID_WEBPACK_BUILD) {
            return;
        }

        if (ENV === 'develop') {
            livereload.listen();
        }

        DID_WEBPACK_BUILD = true;

        const jsonStats = stats.toJson({
            all: false,
            chunkGroups: true
        });

        return fs.writeJson(path.join(PATHS.dist, 'chunks.json'), jsonStats.namedChunkGroups)
            .then(done);
    });
});

gulp.task('webpack:server', (done) => {
    const webpackConfig = require('./webpack.server.config').default;

    return webpack(webpackConfig, (error, stats) => {
        if (error || stats.hasErrors()) {
            const info = stats.toJson();

            return log.error(info.errors);
        }

        return done();
    });
});

gulp.task('webpack:watch', () => {
    gulp.watch(path.join(PATHS.root, '/src'), ['webpack:client']);
});

gulp.task('cssnano', () => {
    return gulp.src(path.join(PATHS.dist, '/**/*.css'))
        .pipe(cssnano({
            reduceIdents: false,
            discardComments: {removeAll: true},
            zindex: false
        }))
        .pipe(gulp.dest(PATHS.dist));
});

gulp.task('manifest', () => {
    return gulp.src(PATHS.manifest.src)
        .pipe(gulp.dest(PATHS.manifest.dist));
});

gulp.task('unused-files', () => findUnusedFiles('./src'));

/**
 * Generate CSS property order config for stylelint,
 * based on config from scss-lint.
 */

gulp.task('deploy-assets', shell.task(`node -r dotenv/config ./deployment/deploy dotenv_config_path=${PATHS.root}deployment/envs/${ENV}.env`));

gulp.task('server', shell.task('node ./src/server.js'));

gulp.task('build', done => {
    runSequence(
        'copy',
        'robotsTxt',
        'manifest',
        'webpack:client',
        'svgstore-legacy',
        done
    );
});

gulp.task('dist', done => {
    runSequence(
        [
            'dist-client',
            'dist-server'
        ],
        done
    );
});

gulp.task('dist-client', done => {
    runSequence(
        [
            'copy'
        ],
        [
            'webpack:client',
            'robotsTxt',
            'manifest',
            'svgstore-legacy',
        ],
        [
            'cssnano'
        ],
        done
    );
});

gulp.task('dist-server', done => {
    runSequence(
        [
            'webpack:server',
        ],
        done
    );
});

gulp.task('server-dist', ['dist'], done => {
    done();
    process.exit(0);
});

gulp.task('dev', done => {
    runSequence(
        'clean',
        'dist',
        'webpack:watch',
        'server',
        done
    );
});

gulp.task('default', done => {
    runSequence(
        'dist',
        done
    );
});
