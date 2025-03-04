let comments = $state([]);

const useCommentState = () => {

    if (!import.meta.env.SSR) {
        const storedComments = localStorage.getItem("comments");
        comments = storedComments ? JSON.parse(storedComments) : [];
    }
    
    return {
        get count() {
            return comments.length;
        },
        get comments() {
            return comments;
        },
        add: (comment) => {
            comments.push(comment);
            localStorage.setItem("comments", JSON.stringify(comments));
        },
    };
};

export { useCommentState };