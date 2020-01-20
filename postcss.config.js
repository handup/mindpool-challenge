module.exports = {
    plugins: [
        require('postcss-import')({
            path: ['src/styles']
        }),
        require('postcss-each')({
            plugins: {
                afterEach: [
                    require('postcss-at-rules-variables')
                ],
                beforeEach: [
                    require('postcss-custom-properties')
                ]
            }
        }),
        require('postcss-mixins'),
        require('postcss-custom-properties'),
        require('postcss-for'),
        require('postcss-nested'),
        require('postcss-custom-media'),
        require('postcss-calc'),
        require('postcss-color-function'),
        require('postcss-discard-comments'),
        require('autoprefixer'),
        require('postcss-remove-root'),
        require('postcss-reporter')
    ]
};
