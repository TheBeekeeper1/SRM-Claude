-- Create a new page for adding/editing suppliers (optional enhancement feature)

-- This file contains helpful reference information for the database schema

/*
USEFUL QUERIES FOR TESTING:
============================

-- Get all active suppliers
SELECT id, name, company_name, status FROM suppliers WHERE status = 'active';

-- Get suppliers that need follow-up within 14 days
SELECT DISTINCT
  s.id,
  s.name,
  ch.follow_up_date,
  ch.contact_date
FROM suppliers s
LEFT JOIN contact_history ch ON s.id = ch.supplier_id
WHERE ch.follow_up_date IS NOT NULL
  AND ch.follow_up_date > NOW()::date
  AND ch.follow_up_date <= (NOW() + INTERVAL '14 days')::date
ORDER BY ch.follow_up_date;

-- Get total pipeline value
SELECT SUM(estimated_value) as total_pipeline
FROM supply_opportunities
WHERE status = 'open';

-- Get total delivered volume (12 months)
SELECT SUM(price) as total_delivered
FROM deliveries
WHERE delivery_date > (NOW() - INTERVAL '1 year')::date;

-- Get supplier statistics
SELECT
  s.id,
  s.name,
  COUNT(DISTINCT ch.id) as contact_count,
  COUNT(DISTINCT opp.id) as opportunity_count,
  COUNT(DISTINCT d.id) as delivery_count,
  SUM(d.price) as total_volume
FROM suppliers s
LEFT JOIN contact_history ch ON s.id = ch.supplier_id
LEFT JOIN supply_opportunities opp ON s.id = opp.supplier_id
LEFT JOIN deliveries d ON s.id = d.supplier_id
GROUP BY s.id, s.name;

-- Get overdue follow-ups
SELECT
  s.name,
  ch.follow_up_date,
  CURRENT_DATE - ch.follow_up_date as days_overdue
FROM suppliers s
LEFT JOIN contact_history ch ON s.id = ch.supplier_id
WHERE ch.follow_up_date IS NOT NULL
  AND ch.follow_up_date < CURRENT_DATE
ORDER BY days_overdue DESC;
*/

-- RLS POLICY NOTES:
-- =================
-- All tables have RLS enabled with policies allowing authenticated users full access
-- To add multi-tenant support, add a user_id column and update policies:

/*
-- Example: Add user_id to suppliers and update RLS
ALTER TABLE suppliers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE POLICY "Users can only see their own suppliers" ON suppliers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own suppliers" ON suppliers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
*/

-- REAL-TIME SUBSCRIPTIONS:
-- =======================
-- To enable real-time updates in the frontend, uncomment in supabase.ts:
-- const subscription = supabase
--   .from('suppliers')
--   .on('*', payload => {
--     console.log('Change received!', payload)
--   })
--   .subscribe()

-- USEFUL INDEXES:
-- ===============
-- Already created:
-- - idx_contact_history_supplier_id
-- - idx_contact_history_follow_up_date
-- - idx_supply_opportunities_supplier_id
-- - idx_deliveries_supplier_id
-- - idx_suppliers_status

-- Consider adding if performance needs improvement:
-- CREATE INDEX idx_delivery_date ON deliveries(delivery_date);
-- CREATE INDEX idx_contact_date ON contact_history(contact_date);
