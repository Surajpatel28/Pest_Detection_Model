from __future__ import annotations

import re

DEFAULT_TREATMENT = [
    "Inspect nearby leaves and stems for spread patterns.",
    "Isolate affected plants and remove heavily infested sections.",
    "Use integrated pest management with targeted eco-safe treatment.",
]

TREATMENTS_BY_PEST: dict[str, list[str]] = {
    "rice leaf roller": [
        "Scout folded and rolled leaves and remove heavily damaged tillers.",
        "Use pheromone/light traps to reduce adult moth population.",
        "Apply neem-based or label-approved larvicidal spray at early larval stage.",
    ],
    "rice leaf caterpillar": [
        "Collect and destroy early caterpillar clusters from affected leaves.",
        "Maintain field sanitation and remove grassy alternate hosts.",
        "Use targeted biological/label-approved insecticide during early infestation.",
    ],
    "asiatic rice borer": [
        "Monitor deadheart and whitehead symptoms and remove infested tillers.",
        "Use pheromone traps for stem borer monitoring and suppression.",
        "Apply stem-borer-specific treatment at egg hatch/early larval stage.",
    ],
    "yellow rice borer": [
        "Clip and destroy egg masses when observed in the field.",
        "Synchronize planting and avoid excessive nitrogen to reduce outbreaks.",
        "Apply recommended borer control during early vegetative stage.",
    ],
    "rice gall midge": [
        "Rogue out silver-shoot infested tillers early to limit spread.",
        "Maintain proper water and nutrient management to reduce crop stress.",
        "Use resistant varieties or approved systemic control when threshold is crossed.",
    ],
    "brown plant hopper": [
        "Avoid excessive nitrogen and maintain wider spacing for airflow.",
        "Drain field temporarily during severe hopper buildup when feasible.",
        "Use selective hopper management products; avoid broad-spectrum overuse.",
    ],
    "white backed plant hopper": [
        "Monitor hopper population on lower canopy and leaf sheaths.",
        "Reduce dense canopy conditions and avoid over-fertilization.",
        "Apply selective hopper-targeted treatment based on economic threshold.",
    ],
    "army worm": [
        "Scout in evening/morning for fresh feeding and larvae clusters.",
        "Use mechanical control in hotspots and conserve natural enemies.",
        "Apply early-stage caterpillar control products if threshold is exceeded.",
    ],
    "aphids": [
        "Use yellow sticky traps and monitor underside of leaves frequently.",
        "Promote beneficial insects such as lady beetles and lacewings.",
        "Use neem oil or insecticidal soap before heavy colony buildup.",
    ],
    "english grain aphid": [
        "Inspect wheat heads and flag leaves for early aphid colonies.",
        "Preserve natural predators and avoid unnecessary broad-spectrum sprays.",
        "Apply aphid-specific control when colony density exceeds threshold.",
    ],
    "green bug": [
        "Track yellowing and chlorosis patches caused by toxic green bug feeding.",
        "Control volunteer grasses and weeds that host green bug populations.",
        "Use selective aphid management chemistry at recommended threshold.",
    ],
    "bird cherry-oat aphid": [
        "Monitor tillering-stage wheat and check for aphid clustering on stems.",
        "Prioritize biological control and maintain balanced fertilization.",
        "Apply labeled aphid treatment only when population crosses threshold.",
    ],
    "longlegged spider mite": [
        "Inspect leaf surface bronzing and stippling in dry field conditions.",
        "Reduce dust stress around crop and maintain optimal irrigation.",
        "Use crop-safe miticide only after confirming mite pressure.",
    ],
    "wheat phloeothrips": [
        "Monitor leaf sheaths and spikes for thrips feeding scars.",
        "Improve field hygiene and remove alternate host weeds.",
        "Use targeted thrips control products during early infestation window.",
    ],
    "wheat sawfly": [
        "Track stem cutting symptoms and remove lodged stems promptly.",
        "Use resistant cultivars and adjust sowing practices for lower risk.",
        "Apply integrated management with crop rotation and field sanitation.",
    ],
}


def get_treatment_for_pest(pest_name: str) -> list[str]:
    if pest_name in TREATMENTS_BY_PEST:
        return TREATMENTS_BY_PEST[pest_name]

    normalized_name = re.sub(r"[^a-z0-9]+", "", pest_name.lower())
    normalized_map = {
        re.sub(r"[^a-z0-9]+", "", key.lower()): value for key, value in TREATMENTS_BY_PEST.items()
    }
    return normalized_map.get(normalized_name, DEFAULT_TREATMENT)
