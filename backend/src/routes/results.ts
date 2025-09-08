import { Router } from 'express';
import { getQCResults } from '../utils/resultsStorage.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing file ID' });
    }

    const results = await getQCResults(id);
    
    if (!results) {
      return res.status(404).json({ error: 'Results not found' });
    }

    return res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;