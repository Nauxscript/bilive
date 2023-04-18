import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  hooks: {
    'rollup:options': (ctx, options) => {
      if (Array.isArray(options.output)) {
        options.output = options.output.map(i => Object.assign(i, {
          intro: 'const ENVIRONMENT = "production";',
        }))
      } else {
        options.output = Object.assign(options.output || {}, {
          intro: 'const ENVIRONMENT = "production";',
        })
      }
      console.log(options.output);
    },
  },
})
