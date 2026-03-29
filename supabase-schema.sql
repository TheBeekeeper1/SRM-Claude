-- Create tables for SRM system

-- Suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  annual_volume DECIMAL(10, 2),
  contract_start_date DATE,
  contract_end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact history table
CREATE TABLE contact_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  contact_date TIMESTAMP NOT NULL DEFAULT NOW(),
  follow_up_date DATE,
  contact_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Supply opportunities table
CREATE TABLE supply_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  opportunity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  estimated_volume DECIMAL(10, 2),
  estimated_value DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  price DECIMAL(12, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_contact_history_supplier_id ON contact_history(supplier_id);
CREATE INDEX idx_contact_history_follow_up_date ON contact_history(follow_up_date);
CREATE INDEX idx_supply_opportunities_supplier_id ON supply_opportunities(supplier_id);
CREATE INDEX idx_deliveries_supplier_id ON deliveries(supplier_id);
CREATE INDEX idx_suppliers_status ON suppliers(status);

-- Create RLS policies
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to view suppliers" ON suppliers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage suppliers" ON suppliers
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view contact history" ON contact_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage contact history" ON contact_history
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view supply opportunities" ON supply_opportunities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage supply opportunities" ON supply_opportunities
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view deliveries" ON deliveries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage deliveries" ON deliveries
  FOR ALL
  TO authenticated
  USING (true);
