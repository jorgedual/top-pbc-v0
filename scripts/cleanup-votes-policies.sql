-- Limpiar políticas de votes
DROP POLICY IF EXISTS "Allow public read access on votes" ON votes;
DROP POLICY IF EXISTS "Allow public insert on votes" ON votes;
DROP POLICY IF EXISTS "Public read votes" ON votes;

-- Políticas limpias
CREATE POLICY "Public read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can delete own vote" ON votes FOR DELETE USING (auth.uid() = user_id);

-- Verificar trigger
SELECT tgname, tgtype, tgenabled, tgsqlfrom
FROM pg_trigger
WHERE tgrelid = 'votes'::regclass;
