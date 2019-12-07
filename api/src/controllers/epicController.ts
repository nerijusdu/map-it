import crudRouter from '../helpers/crudRouter';
import epicService from '../services/epicService';

export const EpicController = crudRouter(epicService, ['roadmap', 'categories'], {
  post: async (req, res) => {
    const result = await epicService(req.user).saveWithCategories(req.body, req.body.categoryIds);
    return res.json(result);
  }
});
