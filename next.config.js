const with_mdx = require('@next/mdx')({
  extension: /\.mdx?$/
});


module.exports = with_mdx({
  webpack: (config, options)=> {
    config.module.rules.push({
      test: /\.fnk/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'fink-loader',
          options: {
            source_maps: 'both'
          },
        },
      ],
    })

    return config
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'fnk']
});
