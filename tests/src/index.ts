import { Config, InstallAgentsHapps, Orchestrator } from "@holochain/tryorama";
import { ReactionDetails } from "../../ui/src/types";
import Base64 from "js-base64";
import path from "path";

const conductorConfig = Config.gen();

// Construct proper paths for your DNAs
const reactionsDna = path.join(__dirname, "../../workdir/dna/reactions-test.dna");

// create an InstallAgentsHapps array with your DNAs to tell tryorama what
// to install into the conductor.
const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [reactionsDna],
  ]
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

function serializeHash(hash) {
  return `u${Base64.fromUint8Array(hash, true)}`;
}

const zomeName = 'reactions';

let orchestrator = new Orchestrator();

orchestrator.registerScenario("Create the dummy entry", async(s, t) => {
  // add players
  const [alice] = await s.players([conductorConfig]);
  // install happ to the conductor
  const [[alice_reactions]] = await alice.installAgentsHapps(installation);

  let alicePubkeyB64 = serializeHash(alice_reactions.agent);

  let entryHash = await alice_reactions.cells[0].call(
    zomeName,
    "create_dummy_entry",
    "Test entry content",
  );
  console.info("Created entry with hash", entryHash);
  t.ok(entryHash);
});

orchestrator.run();
orchestrator = new Orchestrator();

// orchestrator.registerScenario("Create the dummy entry 2", async(s, t) => {
//   // add players
//   const [alice] = await s.players([conductorConfig]);
//   // install happ to the conductor
//   const [[alice_reactions]] = await alice.installAgentsHapps(installation);

//   let alicePubkeyB64 = serializeHash(alice_reactions.agent);

//   let entryHash = await alice_reactions.cells[0].call(
//     zomeName,
//     "create_dummy_entry",
//     "Test entry content",
//   );
//   console.info("Created entry with hash", entryHash);
//   t.ok(entryHash);
// });

// orchestrator.run();

orchestrator.registerScenario("Create a dummy entry, react on it and get reactions of the entry", async (s, t) => {
  const [alice, bob] = await s.players([conductorConfig, conductorConfig]);
  // const [alice] = await s.players([conductorConfig]);

  // install your happs into the coductors and destructuring the returned happ data using the same
  // array structure as you created in your installation array.
  const [[alice_reactions]] = await alice.installAgentsHapps(installation);
  const [[bob_reactions]] = await bob.installAgentsHapps(installation);

  let alicePubkeyB64 = serializeHash(alice_reactions.agent);
  // let bobPubKeyB64 = serializeHash(bob_reactions.agent);

  let entryHash = await alice_reactions.cells[0].call(
    zomeName,
    "create_dummy_entry",
    "Test entry content",
  );

  console.info("Created entry with hash", entryHash);
  t.ok(entryHash);

  await sleep(500);

  let reactionDetails = await alice_reactions.cells[0].call(
    zomeName,
    "react",
    {
      reaction: "😍",
      reactOn: entryHash,
    }
  );

  console.info("reacted and got back ReactionDetails: ", reactionDetails);
  t.ok(reactionDetails);
  t.equal(reactionDetails.author, alicePubkeyB64);
  t.equal(reactionDetails.reaction, "😍");



  await sleep(2000);

  let linksForEntry = await bob_reactions.cells[0].call(
    zomeName,
    "get_links_for_entry",
    entryHash,
  );

  console.info("LINKS FOR ENTRY:", linksForEntry);
  t.ok(linksForEntry);


  // let reactionsForEntry = await bob_reactions.cells[0].call(
  //   zomeName,
  //   "get_reactions_for_entry",
  //   {
  //     entryHash: entryHash,
  //   }
  // );

  // console.info("Reactions for entry:", reactionsForEntry);
  // t.ok(reactionsForEntry);
  // t.equal(typeof reactionsForEntry[entryHash].author, typeof alicePubkeyB64);
  // t.equal(reactionsForEntry[entryHash].author, alicePubkeyB64);
  // t.equal(reactionsForEntry[entryHash].reaction, "😍");


});

orchestrator.run();

// const report = orchestrator.run();

// console.log(report);