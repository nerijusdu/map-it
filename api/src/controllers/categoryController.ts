import { Router } from 'express';
import categoryService from '../services/categoryService';

const router = Router();

router.get('/', (req, res, next) => {
  categoryService(req.user)
    .getAll()
    .then((response) => res.send(response))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  categoryService(req.user)
    .getById(req.params.id)
    .then((result) => res.send(result))
    .catch(next);
});

router.post('/', (req, res, next) => {
  categoryService(req.user)
    .save(req.body)
    .then((result) => res.send(result))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  categoryService(req.user)
    .delete(req.params.id)
    .then((result) => res.send(result))
    .catch(next);
});

export const CategoryController = router;
