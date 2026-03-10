import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']
const supabaseAnonKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']

// The tables that need RLS policies
const tables = ['skills', 'projects', 'experiences', 'certificates', 'messages', 'site_settings', 'profile']

async function applyPolicies() {
    console.log('--- Applying RLS Policies ---\n')

    if (!supabaseServiceKey) {
        console.log('⚠️  No SUPABASE_SERVICE_ROLE_KEY found in .env.local')
        console.log('   To apply policies automatically, add your service role key.')
        console.log('   Find it at: Supabase Dashboard → Settings → API → service_role key\n')
        console.log('   Then run this script again.\n')
        
        // Still test with anon key
        await testAnonAccess()
        return
    }

    // Use service role key to apply policies (bypasses RLS)
    const adminClient = createClient(supabaseUrl!, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })

    const sqlStatements = [
        // Skills
        `ALTER TABLE skills ENABLE ROW LEVEL SECURITY`,
        `DROP POLICY IF EXISTS "skills_select_public" ON skills`,
        `DROP POLICY IF EXISTS "skills_insert_authenticated" ON skills`,
        `DROP POLICY IF EXISTS "skills_update_authenticated" ON skills`,
        `DROP POLICY IF EXISTS "skills_delete_authenticated" ON skills`,
        `CREATE POLICY "skills_select_public" ON skills FOR SELECT USING (true)`,
        `CREATE POLICY "skills_insert_authenticated" ON skills FOR INSERT TO authenticated WITH CHECK (true)`,
        `CREATE POLICY "skills_update_authenticated" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
        `CREATE POLICY "skills_delete_authenticated" ON skills FOR DELETE TO authenticated USING (true)`,
        // Projects
        `ALTER TABLE projects ENABLE ROW LEVEL SECURITY`,
        `DROP POLICY IF EXISTS "projects_select_public" ON projects`,
        `DROP POLICY IF EXISTS "projects_insert_authenticated" ON projects`,
        `DROP POLICY IF EXISTS "projects_update_authenticated" ON projects`,
        `DROP POLICY IF EXISTS "projects_delete_authenticated" ON projects`,
        `CREATE POLICY "projects_select_public" ON projects FOR SELECT USING (true)`,
        `CREATE POLICY "projects_insert_authenticated" ON projects FOR INSERT TO authenticated WITH CHECK (true)`,
        `CREATE POLICY "projects_update_authenticated" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
        `CREATE POLICY "projects_delete_authenticated" ON projects FOR DELETE TO authenticated USING (true)`,
        // Certificates
        `ALTER TABLE certificates ENABLE ROW LEVEL SECURITY`,
        `DROP POLICY IF EXISTS "certificates_select_public" ON certificates`,
        `DROP POLICY IF EXISTS "certificates_insert_authenticated" ON certificates`,
        `DROP POLICY IF EXISTS "certificates_update_authenticated" ON certificates`,
        `DROP POLICY IF EXISTS "certificates_delete_authenticated" ON certificates`,
        `CREATE POLICY "certificates_select_public" ON certificates FOR SELECT USING (true)`,
        `CREATE POLICY "certificates_insert_authenticated" ON certificates FOR INSERT TO authenticated WITH CHECK (true)`,
        `CREATE POLICY "certificates_update_authenticated" ON certificates FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
        `CREATE POLICY "certificates_delete_authenticated" ON certificates FOR DELETE TO authenticated USING (true)`,
        // Experiences
        `ALTER TABLE experiences ENABLE ROW LEVEL SECURITY`,
        `DROP POLICY IF EXISTS "experiences_select_public" ON experiences`,
        `DROP POLICY IF EXISTS "experiences_insert_authenticated" ON experiences`,
        `DROP POLICY IF EXISTS "experiences_update_authenticated" ON experiences`,
        `DROP POLICY IF EXISTS "experiences_delete_authenticated" ON experiences`,
        `CREATE POLICY "experiences_select_public" ON experiences FOR SELECT USING (true)`,
        `CREATE POLICY "experiences_insert_authenticated" ON experiences FOR INSERT TO authenticated WITH CHECK (true)`,
        `CREATE POLICY "experiences_update_authenticated" ON experiences FOR UPDATE TO authenticated USING (true) WITH CHECK (true)`,
        `CREATE POLICY "experiences_delete_authenticated" ON experiences FOR DELETE TO authenticated USING (true)`,
    ]

    let successCount = 0
    for (const sql of sqlStatements) {
        const { error } = await adminClient.rpc('exec_sql', { query: sql }).single() as any
        if (error && !sql.startsWith('DROP')) {
            // Some DBs don't support exec_sql RPC — need to use raw SQL editor
            console.log(`⚠️  Could not run via RPC: ${sql.substring(0, 60)}...`)
        } else {
            successCount++
        }
    }

    console.log(`\n✅ Run the SQL file manually in Supabase Dashboard instead:`)
    await testAnonAccess()
}

async function testAnonAccess() {
    const anonClient = createClient(supabaseUrl!, supabaseAnonKey!)
    
    console.log('\n--- Testing anon access (what browser sees) ---')
    const { data, error } = await anonClient.from('skills').select('id').limit(1)
    if (error) {
        console.error('❌ Anon SELECT on skills:', error.message)
        console.log('\n🔴 Your browser sees 401 because RLS is blocking public reads.')
        console.log('   You MUST run the SQL file in Supabase Dashboard to fix this.\n')
        console.log('Steps:')
        console.log('1. Open https://supabase.com/dashboard')
        console.log('2. Select your project')
        console.log('3. Click "SQL Editor" in the left sidebar')
        console.log('4. Paste the contents of scripts/fix-rls-policies.sql')
        console.log('5. Click Run ▶️\n')
    } else {
        console.log('✅ Anon SELECT works — public reads are allowed')
        const { error: insertErr } = await anonClient.from('skills')
            .insert({ name: '__test__', icon_url: 'test' })
        if (insertErr?.code === '42501') {
            console.log('✅ Anon INSERT correctly blocked (good!)')
            console.log('   Authenticated admin writes should work after login.')
        }
    }
}

applyPolicies()
