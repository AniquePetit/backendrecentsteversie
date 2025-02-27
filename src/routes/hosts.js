import express from 'express';
import hostService from '../services/hostService.js'; // Importeren van de host service

const router = express.Router();

// Route om alle hosts op te halen
router.get('/', async (req, res) => {
  try {
    const hosts = await hostService.getAllHosts();  // Gebruik de getAllHosts functie van hostService
    res.json(hosts);  // Response met alle hosts
  } catch (error) {
    console.log('Fout bij het ophalen van hosts:', error);
    res.status(500).json({ message: error.message });  // Stuur een foutmelding naar de client
  }
});

// Route om één host op te halen via ID
router.get('/:id', async (req, res) => {
  try {
    const host = await hostService.getHostById(req.params.id);  // Gebruik getHostById functie van hostService
    res.json(host);  // Response met de opgehaalde host
  } catch (error) {
    console.log('Fout bij ophalen van host:', error);
    res.status(500).json({ message: error.message });  // Stuur een foutmelding naar de client
  }
});

// Route om een nieuwe host aan te maken
router.post('/', async (req, res) => {
  try {
    const newHost = await hostService.createHost(req.body);  // Gebruik createHost functie van hostService
    res.status(201).json(newHost);  // Response met de aangemaakte host
  } catch (error) {
    console.log('Fout bij het aanmaken van host:', error);
    res.status(400).json({ message: error.message });  // Foutmelding met status 400 als data ontbreekt
  }
});

// Route om een host bij te werken
router.put('/:id', async (req, res) => {
  try {
    const updatedHost = await hostService.updateHost(req.params.id, req.body);  // Gebruik updateHost functie van hostService
    res.json(updatedHost);  // Response met de bijgewerkte host
  } catch (error) {
    console.log('Fout bij het bijwerken van host:', error);
    res.status(400).json({ message: error.message });  // Foutmelding met status 400 bij ongeldige gegevens
  }
});

// Route om een host te verwijderen
router.delete('/:id', async (req, res) => {
  try {
    const result = await hostService.deleteHost(req.params.id);  // Gebruik deleteHost functie van hostService
    res.json(result);  // Response met het resultaat van de verwijdering
  } catch (error) {
    console.log('Fout bij het verwijderen van host:', error);
    res.status(500).json({ message: error.message });  // Foutmelding bij mislukking
  }
});

export default router;  // Exporteer de router zodat deze in andere delen van de app gebruikt kan worden
