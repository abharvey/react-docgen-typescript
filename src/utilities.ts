import { ComponentDoc } from './parser';

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
