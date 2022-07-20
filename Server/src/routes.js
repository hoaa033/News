import { Router } from 'express';
import PostsController from '@/controllers/PostsController';

const router = Router({ caseSensitive: true });

router.use(PostsController);

router.all('*', (req, res) => {
  res.status(400).json({
    url: req.url,
    message: 'Unauthorized Request',
  });
});

export default router;
