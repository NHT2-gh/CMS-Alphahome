export function diffArray<T extends { id?: string }>({
  initial,
  current,
  dirtyFields,
}: {
  initial: T[];
  current: T[];
  dirtyFields: any[];
}) {
  const upsert: T[] = [];
  const deleted: T[] = [];

  const currentMap = new Map(current.filter((i) => i.id).map((i) => [i.id, i]));

  current.forEach((item, index) => {
    //UPSERT
    const isDirty = dirtyFields?.[index];
    const hasChanged = isDirty && Object.values(isDirty).some(Boolean);
    if (hasChanged) {
      upsert.push(item);
    }
  });

  // DELETE
  initial.forEach((item) => {
    if (!currentMap.has(item.id)) {
      deleted.push(item);
    }
  });

  return { upsert, deleted };
}
