import { readFileSync, writeFileSync } from 'fs-extra'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import { v4 as uuid } from 'uuid'
import { transformFromAstSync } from '@babel/core'
import { resolve, dirname } from 'path'

interface ModuleResult {
  id: string
  code: string
  filePath: string
  deps: string[]
  map?: {
    [key: string]: string
  }
}

const entryId = uuid()
const entry = resolve(__dirname, '../example/app.js')

const createModuleInfo = (filePath: string): ModuleResult | undefined => {
  const content = readFileSync(filePath, { encoding: 'utf-8' }).toString()

  const ast = parse(content, {
    sourceType: 'module',
  })
  const deps: string[] = []
  const id = filePath === entry ? entryId : uuid()
  traverse(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    },
  })
  const babelResult = transformFromAstSync(ast, undefined, {
    presets: ['@babel/preset-env'],
  })
  if (!babelResult || !babelResult.code) {
    return
  }
  const { code } = babelResult
  return {
    id,
    code,
    filePath,
    deps,
  }
}

const createDependencyGraph = (entry: string) => {
  const enteryInfo = createModuleInfo(entry)
  if (!enteryInfo) {
    return []
  }
  const graphArr: ModuleResult[] = []
  graphArr.push(enteryInfo)
  for (const module of graphArr) {
    module.map = {}
    module.deps.forEach((depPath) => {
      const baseDir = dirname(module.filePath)
      const moduleDepPath = resolve(baseDir, depPath)
      const moduleInfo = createModuleInfo(moduleDepPath)
      if (moduleInfo) {
        graphArr.push(moduleInfo)
        module.map![depPath] = moduleInfo.id
      }
    })
  }
  return graphArr
}
const pack = (graph: ModuleResult[]) => {
  const moduleArgArr = graph.map((module) => {
    return `'${module.id}': {
      factory: (exports, require) => {
        ${module.code}
      },
      map: ${JSON.stringify(module.map)}
    }`
  })
  const iifeBundler = `(function(modules) {
    const require = id => {
      const { factory, map } = modules[id];
      const localeRequire = requireDeclartionName => require(map[requireDeclartionName]);
      const module = { exports: {} };
      factory(module.exports, localeRequire);
      return module.exports;
    }
    require('${entryId}');
  })({${moduleArgArr.join()}})`
  return iifeBundler
}

const result = pack(createDependencyGraph(entry))

writeFileSync(resolve(__dirname, '../example/output.js'), result)
