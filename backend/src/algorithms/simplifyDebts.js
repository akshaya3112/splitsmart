/**
 * Debt Simplification (a.k.a. min-cash-flow settlement).
 *
 * Given a set of members and their net balance (positive = owed money,
 * negative = owes money), this produces the MINIMUM number of transactions
 * required to settle every debt in the group.
 *
 * Approach: greedy max-heap style matching. At every step, match the member
 * who owes the most money with the member who is owed the most money, settle
 * the smaller of the two amounts between them, and repeat. This is the
 * standard greedy approximation used for this problem (optimal minimum
 * transaction count is NP-hard in general via subset-sum partitioning, but
 * this greedy approach is what's used in production apps like Splitwise and
 * gives a result that's optimal or near-optimal in practice).
 *
 * @param {Record<string, number>} netBalances - memberId -> net balance (in the smallest currency unit, e.g. paise/cents, to avoid float issues)
 * @returns {Array<{from: string, to: string, amount: number}>}
 */
export function simplifyDebts(netBalances) {
  const EPSILON = 1; // smallest currency unit; ignore dust below this

  const creditors = []; // people owed money (positive balance)
  const debtors = []; // people who owe money (negative balance)

  for (const [memberId, balance] of Object.entries(netBalances)) {
    if (balance > EPSILON) creditors.push({ memberId, amount: balance });
    else if (balance < -EPSILON) debtors.push({ memberId, amount: -balance });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settled = Math.min(debtor.amount, creditor.amount);

    if (settled > EPSILON) {
      transactions.push({
        from: debtor.memberId,
        to: creditor.memberId,
        amount: Math.round(settled),
      });
    }

    debtor.amount -= settled;
    creditor.amount -= settled;

    if (debtor.amount <= EPSILON) i++;
    if (creditor.amount <= EPSILON) j++;
  }

  return transactions;
}

/**
 * Computes each member's net balance from a list of expenses.
 * Each expense has: paidBy (memberId), amount (integer, smallest unit),
 * and splitAmong: [{ memberId, share }] where share is that member's
 * portion of the expense (amounts already resolved, not percentages).
 */
export function computeNetBalances(members, expenses) {
  const net = {};
  for (const m of members) net[m.id] = 0;

  for (const exp of expenses) {
    net[exp.paidBy] = (net[exp.paidBy] || 0) + exp.amount;
    for (const split of exp.splitAmong) {
      net[split.memberId] = (net[split.memberId] || 0) - split.share;
    }
  }
  return net;
}
