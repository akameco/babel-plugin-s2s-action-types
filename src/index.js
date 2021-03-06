// @flow
import { relative, join, dirname } from 'path'
import flowSyntax from 'babel-plugin-syntax-flow'
import * as t from 'babel-types'
import template from 'babel-template'
import snakeCase from 'lodash.snakecase'
import { removeFlowComment, addFlowComment } from 'babel-add-flow-comments'
// import blog from 'babel-log'

type Node = {
  type: string,
  [key: string]: any,
}

type Path = {
  type: string,
  node: Node,
  [key: string]: any,
  get(key: string): Node,
}

type File = Object

type State = {
  opts: Object,
  file: File,
}

const constantCase = (str: string) => snakeCase(str).toUpperCase()

const babylonOpts = { sourceType: 'module', plugins: ['flow'] }

const wrapTemp = (tmpl: string) => template(tmpl, babylonOpts)

const builders = {
  constants: wrapTemp(`export const NAME: VALUE = VALUE`),
  actions: wrapTemp(`export const Actions = VALUE`),
  actionType: wrapTemp(`export type NAME = { type: typeof VALUE }`),
  action: wrapTemp(`export type Action = UNION`),
}

function getPrefix({ opts: { filename } }: File, removePrefix: string = '') {
  const file = relative(join(process.cwd(), removePrefix), filename)
  return dirname(file) + '/'
}

export default () => {
  return {
    inherits: flowSyntax,
    name: 's2s-action-types',
    visitor: {
      Program: {
        exit(programPath: Path, state: State) {
          const { file, opts: { usePrefix = true, removePrefix = '' } } = state
          removeFlowComment(file.ast.comments)

          const imports = []
          const typeNames = []
          const actionMap: Map<string, Node> = new Map()

          programPath.traverse({
            ImportDeclaration(path: Path) {
              imports.push(path.node)
            },
            TypeAlias(path: Path) {
              if (path.get('id').node.name === 'Action') {
                const right = path.get('right')
                if (right.isUnionTypeAnnotation()) {
                  for (const t of right.get('types')) {
                    typeNames.push(t.get('id').node.name)
                  }
                } else if (right.isGenericTypeAnnotation()) {
                  typeNames.push(right.get('id').node.name)
                }
                // remove `type Action = ...`
                path.remove()
              } else {
                const node = path.get('id').node
                actionMap.set(node.name, path.parentPath.node)
              }
            },
          })

          const prefix = usePrefix ? getPrefix(file, removePrefix) : ''

          // const CONS: 'CONS' = 'prefix/CONS'
          const constantAST = typeNames.map(x => {
            const name = constantCase(x)
            const value = t.stringLiteral(prefix + name)

            const actionName = t.identifier(name)
            actionName.typeAnnotation = t.typeAnnotation(
              t.genericTypeAnnotation(value)
            )

            return builders.constants({ NAME: actionName, VALUE: value })
          })

          const propsAST = typeNames.map(name => {
            const x = t.identifier(constantCase(name))
            return t.objectProperty(x, x, false, true)
          })

          const actionsAST = builders.actions({
            VALUE: t.objectExpression(propsAST),
          })

          // type ActionA = { typeof ACTION_A }
          const typesAst = typeNames.map(name => {
            if (actionMap.has(name)) {
              return actionMap.get(name)
            }

            return builders.actionType({
              NAME: t.identifier(name),
              VALUE: t.identifier(constantCase(name)),
            })
          })

          const union = typeNames.map(name =>
            t.genericTypeAnnotation(t.identifier(name))
          )

          const action = builders.action({
            UNION: t.unionTypeAnnotation(union),
          })

          if (imports.length > 0) {
            imports.push(t.noop())
          }

          programPath.node.body = [
            ...imports,
            ...constantAST,
            t.noop(),
            actionsAST,
            t.noop(),
            ...typesAst,
            t.noop(),
            action,
          ]

          addFlowComment(programPath)
        },
      },
    },
  }
}
