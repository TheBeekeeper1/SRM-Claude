-- Sample data for Honey SRM
-- Run this in Supabase SQL Editor to populate with demo data

-- Insert sample suppliers
INSERT INTO suppliers (name, company_name, email, phone, location, category, status, annual_volume, contract_start_date, notes)
VALUES
  ('Johan Andersson', 'Andersson Biodling AB', 'johan@andersson-bi.se', '+46702345678', 'Värmland', 'Biodling', 'active', 50000, '2023-01-15', 'Pålitlig leverantör'),
  ('Maria Lundgren', 'Lundgrens Honung', 'maria@lundgrens.se', '+46701234567', 'Dalarna', 'Biodling', 'active', 75000, '2022-06-01', 'Mycket bra kvalitet'),
  ('Lars Bergström', 'Bergströms Bi-Nektär', 'lars.bergstrom@bi-nektar.se', '+46703456789', 'Gävleborg', 'Biodling', 'active', 30000, '2023-09-10', null),
  ('Kerstin Sjöberg', 'Sjöberg Ekologisk Honung', 'kerstin@ekohoning.se', '+46704567890', 'Västmanland', 'Biodling', 'prospect', null, null, 'Potential ekologisk leverantör'),
  ('Per Eklund', 'Eklunds Honungsproduktion', 'per.eklund@eklunds.se', '+46705678901', 'Västra Götaland', 'Biodling', 'inactive', 25000, '2020-03-20', 'Inte kontakterad på 2 år');

-- Insert sample contact history
INSERT INTO contact_history (supplier_id, contact_date, follow_up_date, contact_type, notes)
SELECT id, NOW() - INTERVAL '5 days', NOW() + INTERVAL '7 days', 'meeting', 'Diskuterade priset för Q4 2024'
FROM suppliers WHERE name = 'Johan Andersson'
UNION ALL
SELECT id, NOW() - INTERVAL '2 days', NOW() + INTERVAL '14 days', 'call', 'Bekräftade volym för hösten'
FROM suppliers WHERE name = 'Maria Lundgren'
UNION ALL
SELECT id, NOW() - INTERVAL '30 days', NOW() + INTERVAL '3 days', 'email', 'Skickade nya produktsampling'
FROM suppliers WHERE name = 'Lars Bergström';

-- Insert sample supply opportunities
INSERT INTO supply_opportunities (supplier_id, opportunity_date, description, estimated_volume, estimated_value, status)
SELECT id, NOW(), 'Höst-leverans 2024', 50000, 500000, 'open'
FROM suppliers WHERE name = 'Johan Andersson'
UNION ALL
SELECT id, NOW() + INTERVAL '30 days', 'Vår-leverans 2025', 75000, 750000, 'open'
FROM suppliers WHERE name = 'Maria Lundgren'
UNION ALL
SELECT id, NOW() - INTERVAL '60 days', 'Problem med kvalitet - stängd', 10000, 100000, 'closed'
FROM suppliers WHERE name = 'Lars Bergström';

-- Insert sample deliveries
INSERT INTO deliveries (supplier_id, delivery_date, quantity, unit, price, notes)
SELECT id, NOW() - INTERVAL '10 days', 1000, 'kg', 150000, 'Levererad enligt avtal'
FROM suppliers WHERE name = 'Johan Andersson'
UNION ALL
SELECT id, NOW() - INTERVAL '20 days', 1500, 'kg', 225000, 'Levererad enligt avtal'
FROM suppliers WHERE name = 'Maria Lundgren'
UNION ALL
SELECT id, NOW() - INTERVAL '45 days', 500, 'kg', 75000, 'Levererad enligt avtal'
FROM suppliers WHERE name = 'Lars Bergström'
UNION ALL
SELECT id, NOW() - INTERVAL '90 days', 800, 'kg', 120000, 'Levererad enligt avtal'
FROM suppliers WHERE name = 'Johan Andersson';
