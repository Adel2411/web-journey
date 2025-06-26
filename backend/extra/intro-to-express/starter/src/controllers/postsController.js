import postdata from '../data.js'; 

export const getPosts = (req, res) => {
  const { author } = req.query;
  if (!author) return res.send(postdata);

  const findposts = postdata.filter((post) =>
    post.author.toLowerCase() === author.toLowerCase()
  );
  res.send(findposts);
};

export const postPosts = (req, res) => {
  const { body } = req;
  const newPost = {
    id: postdata[postdata.length - 1].id + 1,
    ...body,
  };
  postdata.push(newPost);
  res.send(postdata);
};

export const getPostById = (req, res) => {
  const goodId = parseInt(req.params.id);
  const found = postdata.find((post) => post.id === goodId);
  if (!found) return res.status(404).send("post not found");
  res.send(found);
};

export const updatePost = (req, res) => {
  const { body, params: { id } } = req;
  const goodId = parseInt(id);
  if (isNaN(goodId)) return res.sendStatus(400);

  const index = postdata.findIndex((post) => post.id === goodId);
  if (index === -1) return res.sendStatus(404);

  postdata[index] = { id: goodId, ...body };
  res.sendStatus(200);
};

export const deletePost = (req, res) => {
  const goodId = parseInt(req.params.id);
  if (isNaN(goodId)) return res.sendStatus(400);

  const index = postdata.findIndex((post) => post.id === goodId);
  if (index === -1) return res.sendStatus(404);

  postdata.splice(index, 1); 
  res.sendStatus(200);
};
