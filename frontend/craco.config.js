module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Disable source-map-loader for chart.js
            webpackConfig.module.rules.forEach(rule => {
                if (rule.use && Array.isArray(rule.use)) {
                    const sourceMapLoader = rule.use.find(
                        useRule => useRule.loader && useRule.loader.includes('source-map-loader')
                    );
                    if (sourceMapLoader) {
                        sourceMapLoader.exclude = /node_modules\/chart\.js/;
                    }
                }
            });
            return webpackConfig;
        },
    },
};
