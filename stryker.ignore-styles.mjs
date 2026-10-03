import { declareValuePlugin, PluginKind } from '@stryker-mutator/api/plugin'

const STYLE_ATTRIBUTES = new Set(['className', 'style'])

const isStyleAttribute = (path) =>
  path.isJSXAttribute() && STYLE_ATTRIBUTES.has(path.node.name.name)

export const strykerPlugins = [
  declareValuePlugin(PluginKind.Ignore, 'style-attributes', {
    shouldIgnore: (path) =>
      isStyleAttribute(path) ? 'Las clases y estilos visuales no son comportamiento' : undefined,
  }),
]
