import { Config, InstallAgentsHapps, Orchestrator } from "@holochain/tryorama";
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
  ],
  [
    // happ 0
    [reactionsDna],
  ],
];

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(null), ms));

function serializeHash(hash) {
  return `u${Base64.fromUint8Array(hash, true)}`;
}

const zomeName = 'reactions';

let orchestrator = new Orchestrator();

orchestrator.registerScenario("create a reaction and get it", async (s, t) => {
  const [alice, bob] = await s.players([conductorConfig]);

  // install your happs into the coductors and destructuring the returned happ data using the same
  // array structure as you created in your installation array.
  const [[alice_reactions], [bob_reactions]] = await alice.installAgentsHapps(
    installation
  );


  let alicePubkeyB64 = serializeHash(alice_reactions.agent);
  let bobPubKeyB64 = serializeHash(bob_reactions.agent);

  let myReaction = await alice_reactions.cells[0].call(
    zomeName,
    "get_my_reaction",
    null
  );
  t.notOk(myReaction);

  let reactionHash = await alice_reactions.cells[0].call(
    zomeName,
    "create_reaction",
    {
      nickname: "alice",
      fields: {
        avatar: "aliceavatar",
      },
    }
  );
  t.ok(reactionHash);

  await sleep(500);

  // set nickname as alice to make sure bob's is not getting deleted
  // with alice's update
  reactionHash = await bob_reactions.cells[0].call(zomeName, "create_reaction", {
    nickname: "alice_bob",
    fields: {
      avatar: "bobboavatar",
    },
  });
  t.ok(reactionHash);

  await sleep(5000);

  reactionHash = await alice_reactions.cells[0].call(
    zomeName,
    "update_reaction",
    {
      nickname: "alice2",
      fields: {
        avatar: "aliceavatar2",
        update: "somenewfield",
      },
    }
  );
  t.ok(reactionHash);

  myReaction = await alice_reactions.cells[0].call(
    zomeName,
    "get_my_reaction",
    null
  );
  t.ok(myReaction.agentPubKey);
  t.equal(myReaction.reaction.nickname, "alice2");

  let allreactions = await bob_reactions.cells[0].call(
    zomeName,
    "get_all_reactions",
    null
  );
  t.equal(allreactions.length, 2);

  let multipleReactions = await bob_reactions.cells[0].call(
    zomeName,
    "get_agents_reaction",
    [alicePubkeyB64, bobPubKeyB64]
  );
  t.equal(multipleReactions.length, 2);

  let reactions = await bob_reactions.cells[0].call(
    zomeName,
    "search_reactions",
    {
      nicknamePrefix: "sdf",
    }
  );
  t.equal(reactions.length, 0);

  reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
    nicknamePrefix: "alic",
  });
  t.equal(reactions.length, 2);
  t.ok(reactions[0].agentPubKey);
  t.equal(reactions[1].reaction.nickname, "alice2");

  reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
    nicknamePrefix: "ali",
  });
  t.equal(reactions.length, 2);
  t.ok(reactions[0].agentPubKey);
  t.equal(reactions[1].reaction.nickname, "alice2");
  t.equal(reactions[1].reaction.fields.avatar, "aliceavatar2");

  reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
    nicknamePrefix: "alice",
  });
  t.equal(reactions.length, 2);
  t.ok(reactions[1].agentPubKey);
  t.equal(reactions[1].reaction.nickname, "alice2");

  reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
    nicknamePrefix: "alice_",
  });
  t.equal(reactions.length, 2);
  t.ok(reactions[0].agentPubKey);
  t.equal(reactions[0].reaction.nickname, "alice_bob");
  t.equal(reactions[0].reaction.fields.avatar, "bobboavatar");
});

orchestrator.run();
orchestrator = new Orchestrator();

orchestrator.registerScenario(
  "create a reaction with upper case and search it with lower case",
  async (s, t) => {
    const [alice, bob] = await s.players([conductorConfig]);

    // install your happs into the coductors and destructuring the returned happ data using the same
    // array structure as you created in your installation array.
    const [[alice_reactions], [bob_reactions]] = await alice.installAgentsHapps(
      installation
    );

    let reactionHash = await alice_reactions.cells[0].call(
      zomeName,
      "create_reaction",
      {
        nickname: "ALIce",
        fields: {
          avatar: "aliceavatar",
        },
      }
    );
    t.ok(reactionHash);
    await sleep(5000);

    let reactions = await bob_reactions.cells[0].call(
      zomeName,
      "search_reactions",
      {
        nicknamePrefix: "ali",
      }
    );
    t.equal(reactions.length, 1);
    t.ok(reactions[0].agentPubKey);
    t.equal(reactions[0].reaction.nickname, "ALIce");

    reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
      nicknamePrefix: "aLI",
    });
    t.equal(reactions.length, 1);
    t.ok(reactions[0].agentPubKey);
    t.equal(reactions[0].reaction.nickname, "ALIce");

    reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
      nicknamePrefix: "AlI",
    });
    t.equal(reactions.length, 1);
    t.ok(reactions[0].agentPubKey);
    t.equal(reactions[0].reaction.nickname, "ALIce");

    reactions = await bob_reactions.cells[0].call(zomeName, "search_reactions", {
      nicknamePrefix: "ALI",
    });
    t.equal(reactions.length, 1);
    t.ok(reactions[0].agentPubKey);
    t.equal(reactions[0].reaction.nickname, "ALIce");
  }
);

orchestrator.run();
