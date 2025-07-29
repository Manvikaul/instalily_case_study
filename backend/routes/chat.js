import express from 'express';
import { plannerAgent } from '../agents/plannerAgent.js';
import { installAgent } from '../agents/installAgent.js';
import { compatibilityAgent } from '../agents/compatibilityAgent.js';
import { troubleshootingAgent } from '../agents/troubleshootingAgent.js';
import { generalAgent } from '../agents/generalAgent.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const plan = await plannerAgent(message);
    console.log('Plan:', plan);

    let reply;

    switch (plan.intent) {
      case 'installation':
        reply = await installAgent(plan);
        break;
      case 'compatibility':
        reply = await compatibilityAgent(plan);
        break;
      case 'troubleshooting':
        reply = await troubleshootingAgent(plan);
        break;
      case 'general':
      default:
        reply = await generalAgent(message);
        break;
    }

    res.json({ reply });
  } catch (err) {
    console.error('Error in chat route:', err);
    res.status(500).send('Something went wrong');
  }
});

export default router;
