export const countState = $state({
    count: 0,
    comments: [],
  });
  
  export const addComment = (newComment) => {
    countState.count = countState.comments.length + 1;
    countState.comments = [...countState.comments, newComment];
  };