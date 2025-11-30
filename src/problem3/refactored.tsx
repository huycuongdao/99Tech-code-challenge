/**
 * ============================================================================
 * REFACTORED WALLET PAGE COMPONENT
 * ============================================================================
 *
 * SUMMARY OF ISSUES FOUND AND FIXES APPLIED:
 *
 * 1. TYPE ERRORS:
 *    - WalletBalance missing `blockchain` property (used but not defined)
 *    - FormattedWalletBalance should extend WalletBalance to avoid duplication
 *    - getPriority used `any` type - replaced with proper Blockchain type
 *    - Empty interface extension `Props extends BoxProps {}` is redundant
 *
 * 2. BUGS:
 *    - `lhsPriority` undefined variable in filter (should be `balancePriority`)
 *    - Filter logic inverted: returned true for amount <= 0, should be > 0
 *    - Sort comparator missing return 0 for equal priorities (undefined behavior)
 *    - `formattedBalances` created but `rows` uses `sortedBalances` instead
 *    - `classes.row` used but `classes` never defined
 *
 * 3. PERFORMANCE INEFFICIENCIES:
 *    - `getPriority` recreated every render (moved outside component)
 *    - `getPriority` called multiple times per item (now cached with map)
 *    - `prices` in useMemo deps but not used in computation
 *    - `formattedBalances` not memoized, recalculated every render
 *
 * 4. ANTI-PATTERNS:
 *    - Using array index as React key (should use unique identifier)
 *    - `children` destructured but never used
 *    - Magic numbers for priorities (use const map instead)
 *
 * ============================================================================
 */

import React, { useMemo } from "react";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * FIX: Define Blockchain as union type instead of using `any`
 * This provides type safety and autocomplete support
 */
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

/**
 * FIX: Added `blockchain` property which was used but missing in original
 */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

/**
 * FIX: Extend WalletBalance to avoid property duplication (DRY principle)
 * Original had currency and amount duplicated
 */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

/**
 * FIX: Remove empty interface extension anti-pattern
 * Original: `interface Props extends BoxProps {}` - empty extension is useless
 * If no additional props needed, use BoxProps directly
 */
type Props = BoxProps;

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * FIX: Move priority mapping outside component to avoid recreation on every render
 * FIX: Use Record type for type safety instead of switch with `any`
 * FIX: Magic numbers are now documented in a single source of truth
 */
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * FIX: Moved outside component - no need to recreate function every render
 * FIX: Proper typing with Blockchain type instead of `any`
 */
const getPriority = (blockchain: Blockchain): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
};

// =============================================================================
// COMPONENT
// =============================================================================

const WalletPage: React.FC<Props> = (props: Props) => {
  /**
   * FIX: Removed unused `children` from destructuring
   * Original destructured children but never used it
   */
  const { ...rest } = props;

  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * FIX: Combined filtering, sorting, and formatting into single memoized computation
   * This avoids:
   * - Multiple iterations over the array
   * - Calling getPriority multiple times per item
   * - Creating intermediate arrays
   *
   * FIX: Removed `prices` from dependency array - it's not used in this computation
   * Original had `prices` as dependency but never used it in the useMemo callback
   */
  const formattedBalances = useMemo(() => {
    return (
      balances
        /**
         * FIX: Cache priority to avoid calling getPriority multiple times
         */
        .map((balance: WalletBalance) => ({
          ...balance,
          priority: getPriority(balance.blockchain),
        }))
        /**
         * FIX: Corrected filter logic
         * Original bugs:
         * 1. Used undefined `lhsPriority` instead of `balancePriority`
         * 2. Logic was inverted: returned true for amount <= 0
         *
         * Correct logic: Keep balances with valid blockchain (priority > -99)
         * AND positive amount (amount > 0)
         */
        .filter((balance) => balance.priority > DEFAULT_PRIORITY && balance.amount > 0)
        /**
         * FIX: Sort comparator now returns 0 for equal priorities
         * Original missing return statement for equal case caused undefined behavior
         * Using simple subtraction for cleaner code
         */
        .sort((a, b) => b.priority - a.priority)
        /**
         * FIX: Format in same chain instead of separate unmemoized map
         * Original created `formattedBalances` but then used `sortedBalances` in rows
         */
        .map(
          ({ priority, ...balance }): FormattedWalletBalance => ({
            ...balance,
            formatted: balance.amount.toFixed(2), // FIX: Added decimal places for currency
          })
        )
    );
  }, [balances]); // FIX: Removed unused `prices` from deps

  /**
   * FIX: Use formattedBalances (which has `formatted` prop) not sortedBalances
   * Original typed as FormattedWalletBalance but mapped over sortedBalances
   * which didn't have the `formatted` property
   *
   * FIX: Use unique key instead of array index
   * Using index as key is anti-pattern when list can be filtered/sorted
   * Currency should be unique per wallet
   */
  const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        /**
         * FIX: Removed `classes.row` - `classes` was never defined
         * Should either use CSS modules properly or inline styles
         */
        className="wallet-row"
        /**
         * FIX: Use currency as key instead of index
         * Index as key causes issues with React reconciliation when list changes
         */
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
