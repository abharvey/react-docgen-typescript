import * as ts from 'typescript';

const moduleExports = (checker: ts.TypeChecker) => (
  moduleSymbols: ts.Symbol[]
): string[] => {
  const exportedNames: string[] = [];

  moduleSymbols.forEach(symbol => {
    symbol.members?.forEach((value, key) => {});

    exportedNames.push();
  });

  return exportedNames;
};

interface DocEntry {}

const serializeSymbol = (checker: ts.TypeChecker) => (
  symbol: ts.Symbol
): DocEntry => {
  return {
    name: symbol.getName(),
    documentation: ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    ),
    type: checker.typeToString(
      checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    )
  };
};

const serializeSignature = (checker: ts.TypeChecker) => (
  signature: ts.Signature
) => {
  return {
    parameters: signature.parameters.map(serializeSymbol(checker)),
    returnType: checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(
      signature.getDocumentationComment(checker)
    )
  };
};
