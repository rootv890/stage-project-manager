import {createClient} from "@supabase/supabase-js";

const options = {
    db: {
        schema: 'public',
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {'x-stage': 'stage-course-manager'},
    },
}


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY


if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(
    supabaseUrl, supabaseKey,
    options
)