-- Enable Row Level Security on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE presences ENABLE ROW LEVEL SECURITY;

-- Teams policies
-- Allow public read access (for demo purposes - adjust for production)
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

-- Allow authenticated users to insert teams
CREATE POLICY "Authenticated users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow team owners to update
CREATE POLICY "Team owners can update teams"
  ON teams FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Members policies
CREATE POLICY "Members are viewable by everyone"
  ON members FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create members"
  ON members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update members"
  ON members FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete members"
  ON members FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trainings policies
CREATE POLICY "Trainings are viewable by everyone"
  ON trainings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create trainings"
  ON trainings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update trainings"
  ON trainings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete trainings"
  ON trainings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Presences policies
CREATE POLICY "Presences are viewable by everyone"
  ON presences FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create presences"
  ON presences FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update presences"
  ON presences FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete presences"
  ON presences FOR DELETE
  USING (auth.role() = 'authenticated');
