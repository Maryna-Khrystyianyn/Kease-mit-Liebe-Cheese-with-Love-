INSERT INTO ingredients (name, type, description, unit) VALUES
-- Milchsorten
('Kuhmilch', 'Milk', 'Frische Kuhmilch', 'L'),
('Ziegenmilch', 'Milk', 'Frische Ziegenmilch', 'L'),
('Schafmilch', 'Milk', 'Frische Schafmilch', 'L'),

-- Starterkulturen
('Mesophile Starterkultur', 'Starter culture', 'Bakterien für die Fermentation bei niedrigen Temperaturen', 'g'),
('Thermophile Starterkultur', 'Starter culture', 'Bakterien für die Fermentation bei hohen Temperaturen', 'g'),
('Propionsäurebakterien', 'Starter culture', 'Bakterien zur Bildung von Löchern und Geschmack', 'g'),


-- Salz
('Salz', 'Salt', 'Speisesalz zum Pökeln des Käses', 'g'),

-- Gewürze
('Pfeffer', 'Spice', 'Zum Würzen von Käse', 'g'),
('Paprika', 'Spice', 'Für Geschmack und Farbe', 'g'),
('Muskatnuss', 'Spice', 'Für Aroma und Geschmack', 'g'),
('Kümmel', 'Spice', 'Traditionelles Gewürz für Käse', 'g'),

-- Farbstoffe
('Annatto', 'Colorant', 'Natürliches Farbpigment für Käse', 'g'),

-- Enzyme / Fermente
('Lab', 'Enzyme', 'Enzym zur Gerinnung der Milch', 'g'),
('Pflanzliches Lab', 'Enzyme', 'Pflanzlicher Ferment zur Milchgerinnung', 'g'),
('Meito', 'Enzyme', 'Ferment zur Milchgerinnung', 'g'),

-- Zusätzliche Zutaten / Additive
('Probiotika', 'Additive', 'Nützliche Bakterien für fermentierte Käse', 'g'),
('Molke', 'Other', 'Zur Regulierung der Säure', 'L'),

-- Schimmel / Plesniva
('Penicillium camemberti', 'Coating', 'Schimmel für Käse mit weißer Rinde', 'g'),
('Penicillium roqueforti', 'Coating', 'Blau-Schimmel für Roquefort oder Blauschimmelkäse', 'g'),

-- Überzüge / Coatings
('Latexbeschichtung', 'Coating', 'Latexüberzug für Käse', 'g'),
('Wachsbeschichtung', 'Coating', 'Wachsbeschichtung für Käse', 'g');