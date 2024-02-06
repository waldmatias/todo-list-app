import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoListApp } from "../target/types/todo_list_app";
import { assert } from "chai";

describe("todo-list-app", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TodoListApp as Program<TodoListApp>;

  const author = program.provider as anchor.AnchorProvider;
  
  it("can create a task", async() => {
    const task = anchor.web3.Keypair.generate(); 
    const tx = await program.methods
      .addingTask("You are great!")
      .accounts({
        task: task.publicKey, 
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([task])
      .rpc(); 

    console.log(`Tx Signature: ${tx}`);

    const taskAccount = await program.account.task.fetch(task.publicKey);
    console.log(`Your Task: ${JSON.stringify(taskAccount)}`);

    assert.equal(taskAccount.author.toBase58(), author.wallet.publicKey.toBase58());
    assert.equal(taskAccount.text, "You are great!");
    assert.equal(taskAccount.isDone, false);
    assert.ok(taskAccount.createdAt);
    assert.ok(taskAccount.updatedAt);
  });
  
});
