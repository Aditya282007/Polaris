# Research

## Problem Statement

SIH 2026 Problem Statement 26062 is about an **Integrated Polar Expedition Logistics and Asset Management System** under the Smart Automation theme.

Managing cargo, inventory, personnel, expedition planning, and emergency response separately can make coordination difficult. The project material explains that this can delay decisions and emergency response at remote stations such as Maitri and Bharati.

## Proposed Approach

Polaris brings these activities together through six specialized agents:

- Inventory Agent
- Logistics Agent
- Emergency Agent
- Personnel Agent
- Expedition Agent
- Orchestrator

The idea is to connect scattered operational information so the team can understand the situation and decide what needs to happen next.

## Technical Research

The project proposes an on-premise system using Ollama so that it does not depend on continuous internet access or cloud APIs.

The project also identifies:

- scikit-learn for risk prediction
- Prophet for inventory forecasting

The current scope is a single-station deployment. Multi-station synchronization and cross-expedition load balancing are identified as future work.

## Expected Benefits

The project aims to:

- Reduce the need to check separate manual logs.
- Detect equipment conflicts earlier.
- Help identify missed personnel check-ins.
- Provide useful context during emergencies.
- Keep AI processing on-premise for remote environments.

This research is based on the submitted SIH 2026 project material.
