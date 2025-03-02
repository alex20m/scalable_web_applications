<script>
    import { addComment, countState } from "../states/commentState.svelte.js";
  
    let newComment = "";

    function submitComment() {
        if (newComment.trim() !== "") {
            addComment(newComment);
            newComment = "";
        }   
    }
  
</script>

<input
    type="text"
    bind:value={newComment}
    placeholder="Add a comment"
/>
<button onclick={submitComment}>Add Comment</button>

<ul>
    {#each countState.comments as comment}
        <li>{comment}</li>
    {/each}
</ul>

