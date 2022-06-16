import * as ts from 'typescript';

import { ComponentDoc, Parser, ParserOptions } from './parser';

export function removeDuplicateDocs(componentDocs: ComponentDoc[]) {
  return componentDocs.reduce<ComponentDoc[]>(
    (acc, comp) => (isComponentInList(acc, comp) ? acc : [...acc, comp]),
    []
  );
}

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

function isComponentInList(
  componentDocs: ComponentDoc[],
  comp: ComponentDoc
): boolean {
  return !!componentDocs.find(hasSameDisplayName(comp));
}

function hasSameDisplayName(comp: ComponentDoc) {
  return (compDoc: ComponentDoc): boolean =>
    compDoc!.displayName === comp!.displayName;
}

function iterateSymbolTable<T>(
  symTable: ts.SymbolTable,
  iterator: (sym: ts.Symbol) => T | null
): T[] {
  const result: (T | null)[] = [];
  symTable.forEach(sym => result.push(iterator(sym)));
  return result.filter(nonNull);
}

function nonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}
