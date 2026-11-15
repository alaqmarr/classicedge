import assert from "node:assert/strict";
import { globalSearch } from "../src/app/actions/search";

async function main() {
  console.log("=== Phase C Regression Suite (classicedge): CE53 Global Search & Item-Type Filtering ===");

  // 1. Natural plural / multi-word machine query
  const polishRes = await globalSearch("diamond edge polishing machines");
  const polishMachines = polishRes.filter((r) => r.type === "MACHINE");
  assert.ok(
    polishMachines.length > 0,
    "Expected 'diamond edge polishing machines' to match CE53 diamond polishing machine(s)"
  );
  console.log(
    `  [PASS] 'diamond edge polishing machines' matched ${polishMachines.length} machine(s): ${polishMachines.map((m) => m.title).join(", ")}`
  );

  // 2. Negation: "Actually I am not looking for tools, just machines" -> 0 CONSUMABLE results
  const machinesOnly = await globalSearch(
    "Actually I am not looking for tools, just machines"
  );
  const consumablesInMachinesOnly = machinesOnly.filter(
    (r) => r.type === "CONSUMABLE"
  );
  assert.equal(
    consumablesInMachinesOnly.length,
    0,
    "Negation 'not looking for tools, just machines' must return 0 CONSUMABLE items"
  );
  assert.ok(
    machinesOnly.some((r) => r.type === "MACHINE"),
    "Should return MACHINE items when asking for 'just machines'"
  );
  console.log(
    `  [PASS] Negation ('not looking for tools, just machines') returned ${machinesOnly.filter((r) => r.type === "MACHINE").length} machines and 0 consumables`
  );

  // 3. Non-CE53 / greeting queries return []
  const greetRes = await globalSearch("Hello");
  assert.equal(greetRes.length, 0, "Greeting should return 0 results");

  const pulpitRes = await globalSearch("I am looking for pulpits");
  assert.equal(
    pulpitRes.length,
    0,
    "Classic Concepts pulpit query on CE53 should return 0 machine results"
  );
  console.log("  [PASS] Non-machine queries ('Hello', 'I am looking for pulpits') return 0 false matches on CE53");

  console.log("\nALL PHASE C SEARCH TESTS PASSED (classicedge)!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Phase C CE53 test failed:", err);
    process.exit(1);
  });
