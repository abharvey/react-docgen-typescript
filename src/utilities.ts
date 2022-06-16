import * as ts from 'typescript';

import { ComponentDoc } from './parser';

export function removeDuplicateDocs(componentDocs: ComponentDoc[]) {
  return componentDocs.reduce<ComponentDoc[]>(
    (acc, comp) => (isComponentInList(acc, comp) ? acc : [...acc, comp]),
    []
  );
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

export function iterateSymbolTable<T>(
  symTable: ts.SymbolTable,
  iterator: (sym: ts.Symbol) => T | null
): T[] {
  const result: (T | null)[] = [];
  symTable.forEach(sym => result.push(iterator(sym)));
  return result.filter(nonNull);
}

export function nonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}
