import * as ts from 'typescript';
import { ComponentDoc, Parser, ParserOptions } from './parser';
import { iterateSymbolTable } from './utilities';

export function documentSubComponents(
  mod: ts.Symbol,
  parser: Parser,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  parserOpts: ParserOptions
) {
  const result: ComponentDoc[] = [];
  if (mod.exports) {
    return iterateSymbolTable<ComponentDoc>(
      mod.exports,
      documentSubComponent(parser, checker, sourceFile, parserOpts, mod)
    );
  }
  return result;
}

function documentSubComponent(
  parser: Parser,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  parserOpts: ParserOptions,
  exp: ts.Symbol
) {
  return (symbol: ts.Symbol) => {
    const isPrototype = symbol.flags & ts.SymbolFlags.Prototype;
    const isReactFC =
      symbol.flags & ts.SymbolFlags.Method &&
      checker.typeToString(parser.getCallSignature(symbol).getReturnType()) !==
        'Element';

    if (!isPrototype && !isReactFC) {
      const doc = parser.getComponentInfo(
        symbol,
        sourceFile,
        parserOpts.componentNameResolver,
        parserOpts.customComponentTypes
      );

      if (doc) {
        const prefix =
          exp.escapedName === 'default' ? '' : `${exp.escapedName}.`;

        return {
          ...doc,
          displayName: `${prefix}${symbol.escapedName}`
        };
      }
    }

    return null;
  };
}
