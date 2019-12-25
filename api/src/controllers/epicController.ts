import epicService from '../services/epicService';
import crudRouter from '../utils/crudRouter';

export default crudRouter(epicService, ['roadmap', 'categories'], {
  post: async (req, res) => {
    const result = await epicService(req.user!).saveWithCategories(req.body, req.body.categoryIds);
    return res.json(result);
  }
});
