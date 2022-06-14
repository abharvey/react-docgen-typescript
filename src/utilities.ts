import * as ts from 'typescript';

import { ComponentDoc, Parser, ParserOptions } from './parser';

const hasSameDisplayName = (comp: ComponentDoc) => (
  compDoc: ComponentDoc
): boolean => {
  return compDoc!.displayName === comp!.displayName;
};

function isComponentInList(
  componentDocs: ComponentDoc[],
  comp: ComponentDoc
): boolean {
  return !!componentDocs.find(hasSameDisplayName(comp));
}

export function removeDuplicateDocs(componentDocs: ComponentDoc[]) {
  return componentDocs.reduce(
    (acc, comp) => (isComponentInList(acc, comp) ? acc : [...acc, comp]),
    [] as ComponentDoc[]
  );
}

export const documentSubComponent = (
  parser: Parser,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  parserOpts: ParserOptions,
  exp: ts.Symbol
) => (symbol: ts.Symbol): ComponentDoc | null => {
  // TODO investigate further
  // checking memory addresses match????
  if (!(symbol.flags & ts.SymbolFlags.Prototype)) {
    if (symbol.flags & ts.SymbolFlags.Method) {
      const signature = parser.getCallSignature(symbol);
      const returnType = checker.typeToString(signature.getReturnType());

      if (returnType === 'Element') {
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
    }
  }

  return null;
};
