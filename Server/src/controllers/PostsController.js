import { Router } from 'express';
import db from '@/assets/db';

const router = Router();
const routeName = '/articles';

//search all articles
router.get(routeName, (req, res) => {

  const filter = { category: req.query.cat, tag: req.query.tag };

  //get all information of posts from db2.json
  //wrap it in lowDB instance
  let objChain = db.get('posts');

  // filter by category
  if (filter.category) {
    objChain = objChain.filter(s => s.category === filter.category);
  }

  // filter by tag
  if (filter.tag) {
    objChain = objChain.filter(s => s.tags.includes(filter.tag));
  }

  const pagination = {
    page: req.query.page || 1,
    limit: req.query.limit || 5,
  };

  const data = objChain.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  res.status(200).json({
    data,
    totalPages: Math.ceil(objChain.size().value() / pagination.limit) || 1,
    ...pagination,
  });
});

// get first article of each category
router.get(`${routeName}/each-of-categories`, (req, res) => {
  const data = db.get('posts').value().reduce((items, item) =>
        items.find(x => x.category === item.category) ? [...items] : [...items, item],
      []
    );

  res.status(200).json({ data });
});

// get article by id
router.get(`${routeName}/:id`, (req, res) => {
  const record = db.get('posts').find({ id: parseInt(req.params.id) }).value();

  if (!record) {
    res.status(404).json({ msg: 'resource not found' });
    return;
  }

  res.status(200).json(record);
});

// comment to post with :id
router.post(`${routeName}/:id/comments`, (req, res) => {
  const data = {
    email: req.body.email,
    body: req.body.message,
  };


  const validationErrors = [];

  if (!data.email) {
    validationErrors.push({
      key: 'email',
      value: null,
      description: 'email must not be empty',
    });
  }

  if (!data.body) {
    validationErrors.push({
      key: 'message',
      value: null,
      description: 'message must not be empty',
    });
  }

  if (validationErrors.length) {
    res.status(400).json(validationErrors);
  } else {
    // get post by id
    let record = db.get('posts').find({ id: parseInt(req.params.id) }).value();
    //get the last comment id and +1 to get the new comment id
    data.id = record.comments[record.comments.length - 1].id + 1;
    // push new comment 
    record.comments.push(data);
    // update that post
    record = db.get('posts').find({ id: parseInt(req.params.id) }).merge(record).write();

    res.status(201).json(data);
  }
});

export default router;
