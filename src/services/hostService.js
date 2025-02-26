import express from 'express';
const router = express.Router();
import hostService from '../services/hostService.js'; // Correcte import

// ✅ Haal alle hosts op
router.get('/', async (req, res) => {
  try {
    const hosts = await hostService.getAllHosts();
    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van hosts' });
  }
});

// ✅ Haal één host op via ID
router.get('/:id', async (req, res) => {
  try {
    const host = await hostService.getHostById(req.params.id);  
    if (!host) {
      return res.status(404).json({ message: 'Host niet gevonden' });
    }
    res.json(host);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van host' });
  }
});

// ✅ Maak een nieuwe host aan (geen authenticatie, voor testdoeleinden)
router.post('/', async (req, res) => {  // AuthMiddleware tijdelijk uitgecommentarieerd
  try {
    console.log("Router post");
    console.log("req.body:", req.body);

    // Aanroepen van de createHost functie in de service
    const newHost = await hostService.createHost(req.body);  // Doorgeven van de request body (host data)
    res.status(201).json(newHost);  // Respond met de aangemaakte host
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het aanmaken van host' });
  }
});

// ✅ Update een host (alleen de eigenaar)
router.put('/:id', async (req, res) => {
  try {
    console.log("req.params.id:", req.params.id);
    console.log("req.body:", req.body);

    const updatedHost = await hostService.updateHost(req.params.id, req.body);
    if (!updatedHost) {
      return res.status(404).json({ message: 'Host niet gevonden of geen rechten' });
    }
    res.json(updatedHost);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het bijwerken van host' });
  }
});

// ✅ Verwijder een host (alleen de eigenaar)
router.delete('/:id', async (req, res) => {
  try {
    const deletedHost = await hostService.deleteHost(req.params.id);
    if (!deletedHost) {
      return res.status(404).json({ message: 'Host niet gevonden of geen rechten' });
    }
    res.json({ message: 'Host verwijderd' });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij het verwijderen van host' });
  }
});

export default router;
