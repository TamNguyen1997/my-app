export async function deleteOrphanedSecondarySaleDetails(tx, productId) {
  const saleDetails = await tx.sale_detail.findMany({
    where: { productId },
    select: { id: true, saleDetailId: true }
  });

  if (!saleDetails.length) return [];

  const knownIds = new Set(saleDetails.map((item) => item.id));
  const childMap = new Map();
  const orphanRoots = [];

  for (const item of saleDetails) {
    if (!item.saleDetailId) continue;

    if (!childMap.has(item.saleDetailId)) {
      childMap.set(item.saleDetailId, []);
    }
    childMap.get(item.saleDetailId).push(item.id);

    if (!knownIds.has(item.saleDetailId)) {
      orphanRoots.push(item.id);
    }
  }

  const idsToDelete = new Set();
  const stack = [...new Set(orphanRoots)];

  while (stack.length) {
    const currentId = stack.pop();
    if (idsToDelete.has(currentId)) continue;

    idsToDelete.add(currentId);

    const children = childMap.get(currentId) || [];
    for (const childId of children) {
      stack.push(childId);
    }
  }

  const ids = [...idsToDelete];
  if (!ids.length) return [];

  await tx.sale_detail.updateMany({
    where: { saleDetailId: { in: ids } },
    data: { saleDetailId: null }
  });

  await tx.product_on_order.updateMany({
    where: { saleDetailId: { in: ids } },
    data: { saleDetailId: null }
  });

  await tx.filter_value_on_sale_detail.deleteMany({
    where: { saleDetailId: { in: ids } }
  });

  await tx.sale_detail.deleteMany({
    where: { id: { in: ids } }
  });

  return ids;
}